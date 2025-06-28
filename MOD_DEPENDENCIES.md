# Continue Project Module Dependencies Analysis

## 🏗️ Architecture Overview

Continue는 AI 코드 어시스턴트로서 다중 IDE 지원을 위한 모듈러 아키텍처를 채택하고 있습니다. 

```
continue-brildev7/
├── core/                 # 핵심 비즈니스 로직 (TypeScript)
├── extensions/           # IDE 확장 모듈들
│   ├── vscode/          # VSCode 확장
│   └── intellij/        # IntelliJ 확장
├── gui/                 # React 기반 웹 UI
├── packages/            # 공유 라이브러리들
├── binary/              # 독립 실행형 바이너리
├── sync/                # Rust 동기화 모듈
├── docs/                # 문서
└── scripts/             # 빌드/배포 스크립트
```

---

## 📦 Core Module Dependencies

### **core/** (핵심 비즈니스 로직)
- **메인 엔트리포인트**: `core.ts` - Core 클래스로 모든 기능 통합
- **타입 정의**: `index.d.ts` - 1593줄의 포괄적인 타입 시스템

#### 주요 서브모듈:

##### **autocomplete/** - 자동완성 시스템
- `CompletionProvider.ts` - 메인 완성 제공자
- `util/openedFilesLruCache.ts` - 파일 캐시 관리
- `snippets/gitDiffCache.ts` - Git diff 기반 스니펫

##### **config/** - 설정 관리
- `ConfigHandler.ts` - 설정 로드/관리 핵심
- `loadConfig.ts` - 설정 파일 로딩
- `yaml/` - YAML 기반 설정 처리

##### **context/** - 컨텍스트 제공자 시스템
- `providers/` - 35개+ 컨텍스트 제공자
  - `CodebaseContextProvider.ts`
  - `CurrentFileContextProvider.ts`
  - `FileContextProvider.ts` 등
- `mcp/` - Model Context Protocol 구현

##### **llm/** - LLM 인터페이스
- `llms/` - 59개 LLM 제공자 구현
- `streamChat.ts` - 채팅 스트리밍
- `countTokens.ts` - 토큰 계산

##### **indexing/** - 코드베이스 인덱싱
- `CodebaseIndexer.ts` - 메인 인덱서
- `chunk/` - 청킹 로직 (9개 파일)
- `docs/` - 문서 인덱싱

##### **protocol/** - IDE 통신 프로토콜
- `core.ts` - 핵심 프로토콜 정의
- `messenger/` - 메시징 시스템

#### 외부 의존성:
```json
{
  "@continuedev/config-yaml": "file:../packages/config-yaml",
  "@continuedev/fetch": "^1.0.14",
  "@continuedev/openai-adapters": "file:../packages/openai-adapters",
  "openai": "^4.76.0",
  "ollama": "^0.4.6",
  "axios": "^1.6.7"
}
```

---

## 🔌 Extension Modules

### **extensions/vscode/** (VSCode 확장)

#### 주요 구성:
- **메인 엔트리**: `src/extension.ts` → `activation/activate.ts`
- **Webview 제공자**: 
  - `ContinueGUIWebviewViewProvider.ts` - 메인 GUI
  - `ContinueConsoleWebviewViewProvider.ts` - 콘솔
  - `DelegatingWebviewProtocol.ts` - 사이드바 위치 동적 처리 (신규 추가)
- **IDE 인터페이스**: `VsCodeIde.ts` - VSCode API 래핑
- **명령어 시스템**: `commands.ts` - 910줄의 명령어 정의

#### 의존성:
```json
{
  "core": "file:../../core",
  "@continuedev/config-types": "^1.0.14",
  "@continuedev/fetch": "^1.0.10",
  "vscode": "^1.70.0"
}
```

#### 새로운 기능 (사이드바 위치 설정):
- `package.json` - 새로운 설정 `continue.sidebarPosition` 추가
- 좌측/우측 사이드바 뷰 컨테이너 지원
- 동적 라우팅을 위한 `DelegatingWebviewProtocol` 구현

### **extensions/intellij/** (IntelliJ 확장)
- **Kotlin 구현** - `src/main/kotlin/`
- **Gradle 빌드** - `build.gradle.kts`
- VSCode와 유사한 기능을 JetBrains IDE용으로 구현

---

## 🎨 GUI Module (React Frontend)

### **gui/src/** 구조:
- **메인 앱**: `App.tsx` → React Router 기반
- **컴포넌트**: `components/` (21개 디렉토리)
  - `mainInput/` - TipTap 에디터 기반 입력
  - `modelSelection/` - 모델 선택 UI
  - `Chat/` - 채팅 인터페이스
- **상태 관리**: `redux/` - RTK 기반
- **훅스**: `hooks/` - 14개 커스텀 훅

#### 의존성:
```json
{
  "core": "file:../core",
  "@continuedev/config-yaml": "file:../packages/config-yaml",
  "react": "^18.2.0",
  "@reduxjs/toolkit": "^2.3.0",
  "@tiptap/react": "^2.1.13"
}
```

---

## 📚 Shared Packages

### **packages/** 공유 라이브러리들:

#### **config-yaml/**
```json
{
  "name": "@continuedev/config-yaml",
  "dependencies": {
    "@continuedev/config-types": "^1.0.14",
    "yaml": "^2.6.1",
    "zod": "^3.24.2"
  }
}
```

#### **fetch/**
```json
{
  "name": "@continuedev/fetch",
  "dependencies": {
    "@continuedev/config-types": "^1.0.5",
    "follow-redirects": "^1.15.6",
    "node-fetch": "^3.3.2"
  }
}
```

#### **config-types/** - TypeScript 타입 정의
#### **openai-adapters/** - OpenAI API 어댑터
#### **llm-info/** - LLM 정보 라이브러리
#### **hub/** - Continue Hub 통합
#### **continue-sdk/** - SDK

---

## 🔧 Binary Module (독립 실행형)

### **binary/** 구조:
- **메인**: `src/index.ts`
- **빌드**: `build.js` - esbuild 기반
- **패키징**: pkg를 사용한 바이너리 생성

#### 의존성:
```json
{
  "core": "file:../core",
  "commander": "^12.0.0",
  "pkg": "^5.8.1"
}
```

---

## ⚡ Sync Module (Rust)

### **sync/** Rust 동기화 모듈:
- **Cargo.toml** - Rust 패키지 정의
- **lib.rs** - 메인 라이브러리
- **neon** - Node.js 바인딩
- **SQLite** 기반 데이터 동기화

```toml
[dependencies]
neon = { version = "0.10", features = ["napi-6"] }
rusqlite = { version = "0.30.0", features = ["bundled"] }
serde = { version = "1.0.192", features = ["derive"] }
```

---

## 🔄 Module Interaction Flow

### 1. **Extension → Core → GUI**
```
VSCode Extension → Core.ts → WebviewProtocol → GUI React App
```

### 2. **Configuration System**
```
config.yaml/json → ConfigHandler → Core → All Modules
```

### 3. **LLM Communication**
```
User Input → Core → LLM Provider → Response → GUI
```

### 4. **Context Retrieval**
```
IDE Files → Context Providers → Embeddings → Vector DB → Relevant Context
```

---

## 📊 Dependency Graph Summary

### **High-Level Dependencies:**
1. **extensions/vscode** ← `core`
2. **gui** ← `core`
3. **binary** ← `core`
4. **core** ← `packages/*`
5. **packages** ← external npm packages

### **Core Internal Dependencies:**
- `core.ts` → all subsystems
- `ConfigHandler` → all modules
- `CodebaseIndexer` → context providers
- `protocol/` → IDE communication
- `llm/` → all AI interactions

### **Cross-Module Communication:**
- **IPC**: VSCode Extension ↔ Core
- **WebSocket**: GUI ↔ Core  
- **Protocol Messages**: All modules use structured messaging
- **File System**: Shared configuration files

---

## 🔧 Build & Development Dependencies

### **Root Package.json:**
```json
{
  "scripts": {
    "tsc:watch": "concurrently -n gui,vscode,core,binary",
    "format": "prettier --write **/*.{js,jsx,ts,tsx,json,css,md}"
  },
  "devDependencies": {
    "typescript": "^5.6.3",
    "prettier": "^3.3.3",
    "concurrently": "^9.1.2"
  }
}
```

### **Development Workflow:**
1. **Monorepo Structure** - 각 모듈 독립 개발
2. **TypeScript Compilation** - 모든 모듈 동시 컴파일
3. **Hot Reload** - GUI/Extension 개발시 실시간 업데이트
4. **Testing** - Jest/Vitest 기반 테스트

---

## 🎯 Critical Dependencies & Architecture Decisions

### **1. Core as Central Hub**
- 모든 비즈니스 로직이 `core/`에 집중
- IDE별 확장은 thin client 역할
- Protocol-based communication

### **2. Modular LLM System**
- 59개 LLM 제공자 지원
- 플러그인 아키텍처
- 런타임 모델 선택

### **3. Context Provider Ecosystem**
- 35개+ 컨텍스트 제공자
- MCP (Model Context Protocol) 지원
- 확장 가능한 아키텍처

### **4. Configuration Management**
- YAML/JSON 기반 설정
- 프로필별 관리
- 실시간 설정 변경

### **5. Cross-Language Integration**
- TypeScript (main)
- Rust (performance-critical)
- Kotlin (JetBrains)
- React (UI)

---

## 🚀 Recent Enhancements

### **VSCode Sidebar Position Feature**
새롭게 추가된 사이드바 위치 설정 기능:

1. **설정 추가**: `continue.sidebarPosition` (left/right)
2. **새로운 컴포넌트**: `DelegatingWebviewProtocol.ts`
3. **동적 라우팅**: 설정에 따른 자동 사이드바 전환
4. **명령어 업데이트**: `commands.ts`의 포커스 로직 개선

이 기능은 기존 아키텍처를 유지하면서 사용자 경험을 향상시키는 좋은 예시입니다.

---

*마지막 업데이트: 2024년 12월* 