import { FromWebviewProtocol, ToWebviewProtocol } from "core/protocol";
import { Message } from "core/protocol/messenger";
import * as vscode from "vscode";
import { HomiGUIWebviewViewProvider } from "./ContinueGUIWebviewViewProvider";
import { VsCodeWebviewProtocol } from "./webviewProtocol";

export class DelegatingWebviewProtocol extends VsCodeWebviewProtocol {
  private leftSidebar: HomiGUIWebviewViewProvider;
  private rightSidebar: HomiGUIWebviewViewProvider;

  constructor(
    leftSidebar: HomiGUIWebviewViewProvider,
    rightSidebar: HomiGUIWebviewViewProvider,
    reloadConfig: () => Promise<any> | void,
  ) {
    super(() => {
      const result = reloadConfig();
      // Handle both sync and async return types
      if (result instanceof Promise) {
        result.catch(console.error);
      }
    });
    this.leftSidebar = leftSidebar;
    this.rightSidebar = rightSidebar;
  }

  private getActiveProtocol(): VsCodeWebviewProtocol {
    const config = vscode.workspace.getConfiguration("homi");
    const sidebarPosition = config.get<string>("sidebarPosition", "right");
    
    if (sidebarPosition === "right") {
      return this.rightSidebar.webviewProtocol;
    }
    return this.leftSidebar.webviewProtocol;
  }

  override get webview(): vscode.Webview | undefined {
    return this.getActiveProtocol().webview;
  }

  override set webview(webview: vscode.Webview) {
    this.getActiveProtocol().webview = webview;
  }

  override async request<T extends keyof ToWebviewProtocol>(
    messageType: T,
    data: ToWebviewProtocol[T][0],
    retry?: boolean
  ): Promise<ToWebviewProtocol[T][1]> {
    return this.getActiveProtocol().request(messageType, data, retry);
  }

  override send(messageType: string, data: any, messageId?: string): string {
    return this.getActiveProtocol().send(messageType, data, messageId);
  }

  override on<T extends keyof FromWebviewProtocol>(
    messageType: T,
    handler: (
      message: Message<FromWebviewProtocol[T][0]>,
    ) => Promise<FromWebviewProtocol[T][1]> | FromWebviewProtocol[T][1],
  ): void {
    // Register the handler on both protocols so it works regardless of active sidebar
    this.leftSidebar.webviewProtocol.on(messageType, handler);
    this.rightSidebar.webviewProtocol.on(messageType, handler);
  }

  override invoke<T extends keyof FromWebviewProtocol>(
    messageType: T,
    data: FromWebviewProtocol[T][0],
    messageId?: string,
  ): FromWebviewProtocol[T][1] {
    return this.getActiveProtocol().invoke(messageType, data, messageId);
  }

  override onError(handler: (message: Message, error: Error) => void): void {
    this.leftSidebar.webviewProtocol.onError(handler);
    this.rightSidebar.webviewProtocol.onError(handler);
  }
} 