# Continue Architecture

Continue는 AI 기반 코딩 어시스턴트로, 다양한 IDE에서 작동하는 확장가능한 플랫폼입니다. 본 문서는 Continue의 전체적인 아키텍처와 설계 원칙을 설명합니다.

## 개요

Continue는 개발자가 사용자 정의 AI 코드 어시스턴트를 생성, 공유, 사용할 수 있도록 하는 오픈소스 플랫폼입니다. 주요 기능으로는 채팅, AI 자동완성, 편집, 에이전트 기능 등이 있습니다.

## 시스템 아키텍처

### 전체 구조

```mermaid
graph TD
    subgraph "IDE Layer"
        VSCode["VS Code Extension<br/>(TypeScript)"]
        IntelliJ["IntelliJ Plugin<br/>(Kotlin)"]
        Other["Other IDEs<br/>(Future)"]
    end
    
    subgraph "Binary Layer"
        Binary["Binary Core<br/>(Node.js/TypeScript)"]
        IPC["IPC Messenger"]
        TCP["TCP Messenger<br/>(Dev Mode)"]
    end
    
    subgraph "Core System"
        Core["Core Class<br/>(core.ts)"]
        Config["Config Handler"]
        LLM["LLM Integration"]
        Context["Context System"]
        Indexing["Indexing System"]
        Autocomplete["Autocomplete System"]
        Protocol["Protocol System"]
    end
    
    subgraph "GUI Layer"
        GUI["React GUI<br/>(Webview)"]
        Redux["Redux Store"]
        Components["UI Components"]
    end
    
    subgraph "External Services"
        OpenAI["OpenAI"]
        Anthropic["Anthropic"]
        Ollama["Ollama"]
        Local["Local Models"]
    end
    
    subgraph "Data Layer"
        VectorDB["Vector Database<br/>(Local SQLite)"]
        FileSystem["File System"]
        Git["Git Repository"]
        Cache["Cache Layer"]
    end
    
    VSCode --> Binary
    IntelliJ --> Binary
    Other --> Binary
    
    Binary --> IPC
    Binary --> TCP
    IPC --> Core
    TCP --> Core
    
    Core --> Config
    Core --> LLM
    Core --> Context
    Core --> Indexing
    Core --> Autocomplete
    Core --> Protocol
    
    GUI --> Redux
    GUI --> Components
    Binary --> GUI
    
    LLM --> OpenAI
    LLM --> Anthropic
    LLM --> Ollama
    LLM --> Local
    
    Indexing --> VectorDB
    Context --> FileSystem
    Context --> Git
    Core --> Cache
```

### 주요 컴포넌트

## 1. Core System (`/core`)

핵심 비즈니스 로직과 AI 기능을 담당하는 중앙 집중식 시스템입니다.

### 주요 모듈

#### 1.1 Core Class (`core/core.ts`)
- 시스템의 중앙 조정자 역할
- 메신저 기반 통신 처리
- 설정 관리 및 컨텍스트 제공자 관리
- 자동완성, 채팅, 인덱싱 서비스 조정

```typescript
export class Core {
  configHandler: ConfigHandler;
  codeBaseIndexer: CodebaseIndexer;
  completionProvider: CompletionProvider;
  private docsService: DocsService;
}
```

#### 1.2 Configuration System (`core/config/`)
- **ConfigHandler**: 동적 설정 로딩 및 관리
- **Profile System**: 다중 프로필 지원
- **YAML/JSON Configuration**: 유연한 설정 형식 지원

#### 1.3 LLM Integration (`core/llm/`)
- 다양한 LLM 제공자 지원 (OpenAI, Anthropic, Ollama 등)
- 통합된 LLM 인터페이스
- 스트리밍 응답 처리
- 토큰 카운팅 및 최적화

#### 1.4 Context System (`core/context/`)
- **Context Providers**: 다양한 컨텍스트 소스 지원
  - `@codebase`: 코드베이스 검색
  - `@file`: 파일 참조
  - `@docs`: 문서 검색
  - `@search`: 코드 검색
  - `@url`: 웹 콘텐츠
  - 기타 30+ 제공자
- **Retrieval System**: 임베딩 기반 검색
- **Context Ranking**: 관련성 기반 컨텍스트 순위 매김

#### 1.5 Indexing System (`core/indexing/`)
- **CodebaseIndexer**: 코드베이스 인덱싱
- **DocsService**: 문서 인덱싱 및 검색
- **Chunk Strategy**: 효율적인 청킹 전략
- **Vector Storage**: 로컬 벡터 데이터베이스

#### 1.6 Autocomplete System (`core/autocomplete/`)
- **CompletionProvider**: 인라인 자동완성
- **Context Retrieval**: 관련 코드 컨텍스트 수집
- **Filtering**: 불필요한 완성 제거
- **Multi-line Support**: 다중 라인 완성 지원

### 1.7 Protocol System (`core/protocol/`)
- **Messenger Interface**: 타입 안전한 메시징
- **IPC Communication**: 프로세스 간 통신
- **Event System**: 비동기 이벤트 처리

## 2. IDE Extensions

### 2.1 VS Code Extension (`/extensions/vscode`)

#### 구조
```
extensions/vscode/
├── src/
│   ├── extension.ts          # 확장프로그램 진입점
│   ├── activation/           # 활성화 로직
│   ├── commands/            # VS Code 명령어
│   ├── diff/                # 코드 차이 표시
│   └── util/                # 유틸리티
```

#### 주요 기능
- 웹뷰 기반 UI 통합
- 자동완성 제공자 등록
- 컨텍스트 메뉴 통합
- 파일 시스템 모니터링

### 2.2 IntelliJ Plugin (`/extensions/intellij`)

#### 구조 (Kotlin)
```
src/main/kotlin/
├── continue/
│   ├── CoreMessenger.kt      # 코어와의 통신
│   ├── IdeProtocolClient.kt  # IDE 프로토콜 구현
│   └── IntelliJIDE.kt       # IDE 인터페이스 구현
├── services/                 # 플러그인 서비스
└── toolWindow/              # UI 툴윈도우
```

#### 특징
- JetBrains 플랫폼 API 활용
- 코루틴 기반 비동기 처리
- JCEF 웹뷰 통합
- Gradle 빌드 시스템

## 3. Binary System (`/binary`)

IDE 확장프로그램과 Core 시스템 간의 브릿지 역할을 하는 독립 실행 파일입니다.

### 주요 구성요소
- **IpcMessenger**: 프로세스 간 통신
- **TcpMessenger**: 네트워크 통신 (개발 모드)
- **IpcIde**: IDE 추상화 레이어

### 통신 방식
```typescript
// 메시지 기반 통신
interface Message<T = any> {
  messageType: string;
  messageId: string;
  data: T;
}
```

## 4. GUI System (`/gui`)

React 기반의 현대적인 웹 인터페이스입니다.

### 기술 스택
- **React 18**: UI 프레임워크
- **Redux Toolkit**: 상태 관리
- **TipTap**: 리치 텍스트 에디터
- **Tailwind CSS**: 스타일링

### 주요 컴포넌트
```
gui/src/
├── components/
│   ├── mainInput/           # 메인 입력 인터페이스
│   ├── Layout.tsx          # 레이아웃 컴포넌트
│   └── modelSelection/     # 모델 선택 UI
├── pages/
│   ├── gui.tsx            # 메인 채팅 페이지
│   ├── config.tsx         # 설정 페이지
│   └── history.tsx        # 채팅 기록
└── redux/                 # 상태 관리
```

### 상태 관리
- **Session State**: 현재 채팅 세션
- **Config State**: 설정 정보
- **UI State**: 인터페이스 상태

## 5. Shared Packages (`/packages`)

### 5.1 Config Types (`/packages/config-types`)
TypeScript 타입 정의 및 인터페이스

### 5.2 Config YAML (`/packages/config-yaml`)
YAML 설정 파싱 및 검증

### 5.3 Continue SDK (`/packages/continue-sdk`)
외부 개발자를 위한 SDK

### 5.4 LLM Info (`/packages/llm-info`)
LLM 제공자 정보 및 메타데이터

### 5.5 OpenAI Adapters (`/packages/openai-adapters`)
OpenAI 호환 API 어댑터

## 6. Sync System (`/sync`)

Rust로 작성된 고성능 동기화 시스템입니다.

### 주요 기능
- Git 통합
- 파일 시스템 모니터링
- 효율적인 diff 계산

## 설계 원칙

### 1. 모듈형 아키텍처
- 각 컴포넌트는 독립적으로 개발 및 테스트 가능
- 명확한 인터페이스를 통한 컴포넌트 간 통신
- 플러그인 기반 확장 시스템

### 2. Protocol-Driven Communication
- 타입 안전한 메시징 시스템
- 비동기 통신 패턴
- 에러 핸들링 및 재시도 로직

### 3. Context-Aware System
- 다양한 컨텍스트 소스 지원
- 지능적인 컨텍스트 선택
- 실시간 컨텍스트 업데이트

### 4. Performance Optimization
- 지연 로딩 (Lazy Loading)
- 캐싱 전략
- 효율적인 인덱싱
- 스트리밍 응답 처리

### 5. Extensibility
- 플러그인 시스템
- 커스텀 컨텍스트 제공자
- 커스텀 LLM 통합
- 커스텀 명령어 지원

## 데이터 플로우

### 1. 채팅 플로우

사용자의 채팅 입력부터 AI 응답까지의 전체 데이터 플로우를 나타냅니다.

```mermaid
sequenceDiagram
    participant User
    participant IDE as "IDE Extension"
    participant Binary as "Binary Core"
    participant Core as "Core System"
    participant Context as "Context Providers"
    participant LLM as "LLM Service"
    participant GUI as "React GUI"
    
    User->>IDE: 채팅 메시지 입력
    IDE->>Binary: 메시지 전송 (IPC)
    Binary->>Core: 채팅 요청 (MessageType.CHAT)
    Core->>Context: 컨텍스트 수집 요청
    
    par 병렬 컨텍스트 수집
        Context->>Context: @codebase 검색
        Context->>Context: @file 읽기
        Context->>Context: @docs 검색
    end
    
    Context-->>Core: 컨텍스트 반환
    Core->>LLM: 프롬프트 + 컨텍스트 전송
    LLM-->>Core: 스트리밍 응답
    Core->>Binary: 응답 스트림 (onMessage)
    Binary->>GUI: WebView 메시지
    GUI->>User: 실시간 응답 표시
    
    Note over Core, LLM: 스트리밍 처리로<br/>실시간 응답 제공
```

**주요 통신 방식:**
- IDE ↔ Binary: IPC (stdin/stdout) 또는 TCP (개발 모드)
- Binary ↔ Core: 메시지 기반 이벤트 시스템
- Core ↔ Context: 동기/비동기 함수 호출
- Core ↔ LLM: HTTP/WebSocket 스트리밍
- Binary ↔ GUI: WebView postMessage API

### 2. 자동완성 플로우

실시간 자동완성 기능의 데이터 플로우입니다.

```mermaid
sequenceDiagram
    participant IDE as "IDE Editor"
    participant Binary as "Binary Core"
    participant Core as "Core System"
    participant Completion as "Completion Provider"
    participant Context as "Context Retrieval"
    participant Filter as "Filtering System"
    participant LLM as "LLM Service"
    
    IDE->>Binary: 커서 위치 변경 감지
    Binary->>Core: 자동완성 요청
    Core->>Completion: provideInlineCompletion()
    
    Completion->>Context: 컨텍스트 수집
    par 컨텍스트 수집
        Context->>Context: 현재 파일 분석
        Context->>Context: 관련 파일 검색
        Context->>Context: 임포트 정의 수집
        Context->>Context: Git diff 분석
    end
    
    Context-->>Completion: 관련 컨텍스트
    Completion->>LLM: 완성 요청 (prefix + suffix + context)
    LLM-->>Completion: 완성 후보들
    
    Completion->>Filter: 후처리 필터링
    Filter->>Filter: 중괄호 매칭 검사
    Filter->>Filter: 중복 제거
    Filter->>Filter: 언어별 검증
    Filter-->>Completion: 필터링된 완성
    
    Completion-->>Core: 최종 완성 결과
    Core->>Binary: 완성 응답
    Binary->>IDE: InlineCompletion 표시
    
    Note over Completion, Filter: 실시간 처리로<br/>타이핑 지연 최소화
```

**성능 최적화:**
- 디바운싱을 통한 요청 제한 (300ms)
- 캐싱을 통한 중복 요청 방지
- 컨텍스트 크기 제한 (8K 토큰)
- 병렬 처리를 통한 지연 시간 단축

### 3. 인덱싱 플로우

코드베이스 인덱싱 및 벡터 데이터베이스 구축 플로우입니다.

```mermaid
flowchart TD
    Start([파일 시스템 변경 감지]) --> Watch[File Watcher]
    Watch --> Change{변경 타입}
    
    Change -->|파일 추가| AddFile[파일 추가 처리]
    Change -->|파일 수정| UpdateFile[파일 업데이트 처리]
    Change -->|파일 삭제| DeleteFile[파일 삭제 처리]
    
    AddFile --> Parse[파일 파싱]
    UpdateFile --> Parse
    
    Parse --> Chunk[청킹 처리]
    Chunk --> ChunkType{청킹 전략}
    
    ChunkType -->|코드 파일| CodeChunk[AST 기반 청킹]
    ChunkType -->|문서 파일| DocChunk[텍스트 기반 청킹]
    ChunkType -->|데이터 파일| DataChunk[구조화된 청킹]
    
    CodeChunk --> Embed[임베딩 생성]
    DocChunk --> Embed
    DataChunk --> Embed
    
    Embed --> EmbedType{임베딩 타입}
    EmbedType -->|로컬| LocalEmbed[로컬 임베딩 모델]
    EmbedType -->|원격| RemoteEmbed[원격 임베딩 API]
    
    LocalEmbed --> Store[벡터 저장소]
    RemoteEmbed --> Store
    
    Store --> SQLite[(SQLite 벡터 DB)]
    
    DeleteFile --> Remove[인덱스에서 제거]
    Remove --> SQLite
    
    SQLite --> Search[검색 가능 상태]
    
    subgraph "병렬 처리"
        BatchProcess[배치 처리]
        QueueManager[큐 매니저]
        WorkerPool[워커 풀]
    end
    
    Embed --> BatchProcess
    BatchProcess --> QueueManager
    QueueManager --> WorkerPool
    WorkerPool --> Store
    
    style Start fill:#e1f5fe
    style SQLite fill:#f3e5f5
    style Search fill:#e8f5e8
```

**인덱싱 전략:**
- **증분 인덱싱**: 변경된 파일만 처리
- **청킹 최적화**: 파일 타입별 적절한 청킹 크기
- **병렬 처리**: 멀티스레드 임베딩 생성
- **메모리 관리**: 배치 처리를 통한 메모리 효율성

### 4. 컴포넌트간 통신 아키텍처

각 컴포넌트 간의 통신 방식과 프로토콜을 보여줍니다.

```mermaid
graph TB
    subgraph "VS Code Process"
        VSExt[VS Code Extension]
        VSWebview[Webview Panel]
    end
    
    subgraph "IntelliJ Process"
        IJPlugin[IntelliJ Plugin]
        IJWebview[JCEF Webview]
    end
    
    subgraph "Binary Process"
        BinaryMain[Binary Main]
        IpcMessenger[IPC Messenger]
        TcpMessenger[TCP Messenger]
        IdeInterface[IDE Interface]
    end
    
    subgraph "Core Process"
        CoreSystem[Core System]
        ConfigHandler[Config Handler]
        MessageRouter[Message Router]
    end
    
    subgraph "Communication Protocols"
        IPC[IPC Protocol<br/>stdout/stdin]
        TCP[TCP Protocol<br/>Local Socket]
        HTTP[HTTP Protocol<br/>REST API]
        WS[WebSocket<br/>Real-time]
    end
    
    VSExt <-->|JSON-RPC| IPC
    IJPlugin <-->|JSON-RPC| IPC
    
    IPC <--> IpcMessenger
    TCP <--> TcpMessenger
    
    IpcMessenger --> MessageRouter
    TcpMessenger --> MessageRouter
    
    MessageRouter --> CoreSystem
    
    VSWebview <-->|postMessage| VSExt
    IJWebview <-->|postMessage| IJPlugin
    
    BinaryMain <-->|HTTP/WS| HTTP
    HTTP <--> WS
    
    CoreSystem <-->|Event Bus| ConfigHandler
    
    classDef process fill:#e3f2fd
    classDef protocol fill:#fff3e0
    classDef webview fill:#f1f8e9
    
    class VSExt,IJPlugin,BinaryMain,CoreSystem process
    class IPC,TCP,HTTP,WS protocol
    class VSWebview,IJWebview webview
```

**통신 프로토콜 상세:**

1. **IPC 통신 (프로덕션)**
   - JSON-RPC 2.0 프로토콜
   - stdin/stdout 기반 양방향 통신
   - 메시지 ID를 통한 요청-응답 매칭
   - 에러 핸들링 및 재시도 로직

2. **TCP 통신 (개발 모드)**
   - 로컬 소켓 (127.0.0.1:65432)
   - 핫 리로드 지원
   - 디버깅 편의성 제공

3. **WebView 통신**
   - postMessage API 활용
   - 직렬화된 JSON 메시지
   - 이벤트 기반 비동기 처리

### 5. 빌드 및 배포 플로우

프로젝트의 빌드부터 배포까지의 전체 과정을 나타냅니다.

```mermaid
flowchart TD
    Start([개발자 커밋]) --> CI{CI/CD 트리거}
    
    CI -->|Push to main| MainBuild[메인 빌드]
    CI -->|Pull Request| PRBuild[PR 빌드]
    CI -->|Tag Push| ReleaseBuild[릴리스 빌드]
    
    subgraph "병렬 빌드 파이프라인"
        MainBuild --> ParallelBuild
        PRBuild --> ParallelBuild
        
        ParallelBuild --> CoreBuild[Core 빌드]
        ParallelBuild --> GUIBuild[GUI 빌드]
        ParallelBuild --> VSCodeBuild[VS Code 확장 빌드]
        ParallelBuild --> IntelliJBuild[IntelliJ 플러그인 빌드]
        ParallelBuild --> BinaryBuild[Binary 빌드]
    end
    
    CoreBuild --> CoreSteps[TypeScript 컴파일<br/>테스트 실행<br/>타입 체크]
    GUIBuild --> GUISteps[React 빌드<br/>Webpack 번들링<br/>CSS 최적화]
    VSCodeBuild --> VSSteps[VSIX 패키징<br/>마켓플레이스 검증]
    IntelliJBuild --> IJSteps[Gradle 빌드<br/>Plugin 검증<br/>JAR 생성]
    BinaryBuild --> BinarySteps[크로스 플랫폼 빌드<br/>macOS/Linux/Windows<br/>패키지 서명]
    
    CoreSteps --> Test[통합 테스트]
    GUISteps --> Test
    VSSteps --> Test
    IJSteps --> Test
    BinarySteps --> Test
    
    Test --> TestType{테스트 타입}
    TestType -->|단위 테스트| UnitTest[Jest/Vitest 실행]
    TestType -->|통합 테스트| IntegrationTest[End-to-End 테스트]
    TestType -->|성능 테스트| PerfTest[성능 벤치마크]
    
    UnitTest --> Package[패키징]
    IntegrationTest --> Package
    PerfTest --> Package
    
    Package --> PackageType{배포 타입}
    
    ReleaseBuild --> PackageType
    
    PackageType -->|VS Code| VSMarketplace[VS Code Marketplace]
    PackageType -->|IntelliJ| JBMarketplace[JetBrains Marketplace]
    PackageType -->|GitHub| GHRelease[GitHub Releases]
    PackageType -->|NPM| NPMPublish[NPM 패키지]
    
    VSMarketplace --> Deploy[배포 완료]
    JBMarketplace --> Deploy
    GHRelease --> Deploy
    NPMPublish --> Deploy
    
    Deploy --> Notify[배포 알림]
    Notify --> End([배포 완료])
    
    style Start fill:#e8f5e8
    style End fill:#e8f5e8
    style Test fill:#fff3e0
    style Deploy fill:#e3f2fd
```

**빌드 시스템 상세:**

1. **Core 빌드**
   - TypeScript → JavaScript 컴파일
   - 타입 검사 및 린팅
   - 단위 테스트 실행 (Jest)

2. **GUI 빌드**
   - React 컴포넌트 빌드
   - Webpack 번들링 및 최적화
   - CSS 후처리 (PostCSS, Tailwind)

3. **VS Code 확장 빌드**
   - TypeScript 컴파일
   - VSIX 패키징
   - 확장프로그램 매니페스트 검증

4. **IntelliJ 플러그인 빌드**
   - Kotlin 컴파일
   - Gradle 빌드 스크립트
   - Plugin.xml 검증
   - JAR 패키징 및 서명

5. **Binary 빌드**
   - pkg를 통한 실행 파일 생성
   - 크로스 플랫폼 타겟 (macOS, Linux, Windows)
   - 코드 서명 및 공증 (macOS)

**배포 전략:**
- **Canary 배포**: 소수 사용자 대상 사전 배포
- **점진적 배포**: 단계별 배포로 위험 최소화
- **롤백 준비**: 문제 발생 시 즉시 이전 버전 복구
- **모니터링**: 배포 후 오류율 및 성능 모니터링

## Continue 모드별 아키텍처

Continue는 세 가지 주요 모드로 동작하며, 각각 다른 사용 사례와 워크플로우를 지원합니다.

### 모드 간 전환과 상호작용

```mermaid
stateDiagram-v2
    [*] --> Chat : 기본 모드
    
    state "Chat Mode" as Chat {
        [*] --> Conversation
        Conversation --> ContextGathering : @ 컨텍스트 추가
        ContextGathering --> Conversation : 컨텍스트 수집 완료
        Conversation --> CodeGeneration : AI 응답 생성
        CodeGeneration --> Conversation : 응답 완료
        Conversation --> ApplyCode : Apply 버튼 클릭
        ApplyCode --> Conversation : 적용 완료
    }
    
    state "Agent Mode" as Agent {
        [*] --> Planning
        Planning --> ToolSelection : 도구 선택
        ToolSelection --> PermissionCheck : 권한 확인
        PermissionCheck --> ToolExecution : 승인됨
        PermissionCheck --> Planning : 거부됨
        ToolExecution --> ResultProcessing : 도구 실행 완료
        ResultProcessing --> Planning : 추가 도구 필요
        ResultProcessing --> Completion : 작업 완료
        Completion --> [*]
    }
    
    state "Edit Mode" as Edit {
        [*] --> CodeSelection
        CodeSelection --> EditInput : 편집 요청
        EditInput --> DiffGeneration : LLM 처리
        DiffGeneration --> DiffReview : 변경사항 표시
        DiffReview --> Accept : 사용자 승인
        DiffReview --> Reject : 사용자 거부
        Accept --> Applied : 변경사항 적용
        Reject --> EditInput : 다시 시도
        Applied --> [*]
    }
    
    Chat --> Agent : 모드 전환<br/>(도구 필요)
    Agent --> Chat : 모드 전환<br/>(수동 작업)
    
    Chat --> Edit : 코드 선택<br/>편집 모드
    Edit --> Chat : 편집 완료<br/>복귀
    
    Agent --> Edit : 코드 편집<br/>도구 호출
    Edit --> Agent : 편집 완료<br/>도구 계속
    
    note right of Chat
        - 기본 대화형 AI
        - 컨텍스트 제공자 활용
        - Apply 버튼으로 코드 적용
        - Agent 모드 제안
    end note
    
    note right of Agent
        - 도구 기반 자동화
        - 권한 관리 시스템
        - 연쇄 도구 호출
        - IDE 기능 활용
    end note
    
    note right of Edit
        - 코드 편집 특화
        - 실시간 diff 표시
        - 승인/거부 시스템
        - AST 기반 파싱
    end note
```

### 1. Chat 모드

기본적인 대화형 AI 어시스턴트 모드로, 자유로운 질의응답과 코드 설명, 문제 해결을 지원합니다.

#### Chat 모드 데이터 플로우

```mermaid
sequenceDiagram
    participant User
    participant GUI as "React GUI"
    participant Context as "Context System"
    participant ContextProviders as "Context Providers"
    participant Core as "Core System"
    participant LLM as "LLM Service"
    
    User->>GUI: Chat 모드에서 메시지 입력
    Note over GUI: @ 기호로 컨텍스트 제공자 호출<br/>이미지 업로드 지원
    
    GUI->>Context: 컨텍스트 수집 요청
    
    par 컨텍스트 수집
        Context->>ContextProviders: @codebase 컨텍스트
        ContextProviders-->>Context: 코드베이스 검색 결과
        Context->>ContextProviders: @file 컨텍스트
        ContextProviders-->>Context: 파일 내용
        Context->>ContextProviders: @docs 컨텍스트
        ContextProviders-->>Context: 문서 검색 결과
        Context->>ContextProviders: @url 컨텍스트
        ContextProviders-->>Context: 웹 콘텐츠
        Context->>ContextProviders: 기타 30+ 제공자
        ContextProviders-->>Context: 다양한 컨텍스트 데이터
    end
    
    Context-->>GUI: 수집된 컨텍스트
    GUI->>Core: 메시지 + 컨텍스트 전송
    
    Core->>Core: 시스템 메시지 구성<br/>규칙 적용
    Core->>LLM: 프롬프트 전송 (도구 없이)
    
    LLM-->>Core: 스트리밍 응답
    Core->>GUI: 실시간 응답 스트림
    GUI->>User: 응답 표시
    
    Note over GUI,User: Apply 버튼으로<br/>코드 블록 적용 가능
    
    User->>GUI: Apply 버튼 클릭 (선택사항)
    GUI->>Core: 코드 적용 요청
    Core->>GUI: 코드 적용 결과
    
    Note over GUI: Agent 모드 전환 제안<br/>자동 작업 수행용
```

#### Chat 모드 구조

```mermaid
graph TD
    subgraph "Chat Mode Architecture"
        User[사용자 입력]
        ChatInput[채팅 입력창]
        ContextSelector[컨텍스트 선택]
        
        subgraph "컨텍스트 제공자"
            Manual[수동 컨텍스트<br/>@file, @codebase, @docs]
            Auto[자동 컨텍스트<br/>하이라이트된 코드<br/>현재 파일]
            Image[이미지 업로드]
            Rules[적용된 규칙]
        end
        
        subgraph "메시지 처리"
            MessageConstruct[메시지 구성]
            SystemMessage[시스템 메시지]
            ContextAttach[컨텍스트 첨부]
        end
        
        subgraph "응답 처리"
            StreamResponse[스트리밍 응답]
            CodeBlock[코드 블록 생성]
            ApplyButton[Apply 버튼]
        end
        
        subgraph "후처리"
            SessionSave[세션 저장]
            HistoryUpdate[히스토리 업데이트]
        end
        
        subgraph "확장 기능"
            ModeSwitch[Agent 모드 전환]
            EditMode[Edit 모드 진입]
            Suggestions[작업 제안]
        end
    end
    
    User --> ChatInput
    ChatInput --> ContextSelector
    
    ContextSelector --> Manual
    ContextSelector --> Auto
    ContextSelector --> Image
    ContextSelector --> Rules
    
    Manual --> MessageConstruct
    Auto --> MessageConstruct
    Image --> MessageConstruct
    Rules --> MessageConstruct
    
    MessageConstruct --> SystemMessage
    MessageConstruct --> ContextAttach
    
    SystemMessage --> StreamResponse
    ContextAttach --> StreamResponse
    
    StreamResponse --> CodeBlock
    CodeBlock --> ApplyButton
    
    StreamResponse --> SessionSave
    SessionSave --> HistoryUpdate
    
    ApplyButton --> EditMode
    ChatInput --> ModeSwitch
    HistoryUpdate --> Suggestions
    
    style User fill:#e8f5e8
    style ContextSelector fill:#fff3e0
    style StreamResponse fill:#e3f2fd
    style ApplyButton fill:#ffebee
```

**Chat 모드 특징:**
- **컨텍스트 풍부성**: 30+ 개의 컨텍스트 제공자 지원
- **멀티미디어**: 이미지 업로드 및 분석 지원
- **코드 적용**: Apply 버튼을 통한 선택적 코드 적용
- **모드 전환**: Agent 모드로의 원활한 전환 제안

### 2. Agent 모드

도구를 활용하여 자동화된 작업을 수행하는 모드로, LLM이 직접 IDE 기능과 외부 서비스를 활용할 수 있습니다.

#### Agent 모드 데이터 플로우

```mermaid
sequenceDiagram
    participant User
    participant GUI as "React GUI"
    participant Core as "Core System"
    participant Tools as "Built-in Tools"
    participant MCP as "MCP Servers"
    participant LLM as "LLM Service"
    participant IDE as "IDE Interface"
    
    User->>GUI: Agent 모드에서 요청 입력
    GUI->>Core: 도구와 함께 메시지 전송
    Core->>LLM: 요청 + 사용 가능한 도구 목록
    
    LLM-->>Core: 도구 호출 결정
    Core->>GUI: 권한 요청 (도구 정책에 따라)
    
    alt 자동 승인 도구
        Note over Core,GUI: 자동으로 도구 실행
    else 사용자 승인 필요
        GUI->>User: 도구 사용 권한 요청
        User->>GUI: 승인/거부
    end
    
    alt 도구 승인됨
        Core->>Tools: 내장 도구 호출
        Tools->>IDE: IDE 기능 실행<br/>(파일 읽기, 검색, 터미널 등)
        IDE-->>Tools: 실행 결과
        Tools-->>Core: 도구 응답
        
        par MCP 도구 호출
            Core->>MCP: 외부 도구 호출
            MCP-->>Core: MCP 도구 응답
        end
        
        Core->>LLM: 도구 결과와 함께 후속 요청
        LLM-->>Core: 최종 응답 또는 추가 도구 호출
        
        alt 추가 도구 호출 필요
            Note over Core,LLM: 도구 핸드셰이크 반복
        else 작업 완료
            Core->>GUI: 최종 응답
            GUI->>User: 결과 표시
        end
    else 도구 거부됨
        Core->>LLM: 도구 거부 알림
        LLM-->>Core: 대안 응답
        Core->>GUI: 응답 전송
        GUI->>User: 결과 표시
    end
```

#### Agent 모드 구조

```mermaid
graph TD
    subgraph "Agent Mode Architecture"
        User[사용자 입력]
        ModeSelect[모드 선택기]
        ToolPolicy[도구 정책 관리]
        
        subgraph "도구 시스템"
            BuiltinTools[내장 도구]
            MCPTools[MCP 도구]
            ToolCallHandler[도구 호출 핸들러]
        end
        
        subgraph "권한 관리"
            Permission[권한 요청]
            AutoApprove[자동 승인]
            UserApprove[사용자 승인]
        end
        
        subgraph "도구 카테고리"
            FileOps[파일 작업<br/>read_file<br/>create_new_file<br/>edit_file]
            Search[검색 도구<br/>grep_search<br/>glob_search<br/>search_web]
            Terminal[터미널 도구<br/>run_terminal_command]
            Analysis[분석 도구<br/>view_diff<br/>view_repo_map]
            Rules[규칙 도구<br/>create_rule_block<br/>request_rule]
        end
        
        subgraph "외부 통합"
            MCPServers[MCP 서버들]
            ExternalAPIs[외부 API들]
            IDEIntegration[IDE 통합]
        end
    end
    
    User --> ModeSelect
    ModeSelect --> ToolPolicy
    ToolPolicy --> ToolCallHandler
    
    ToolCallHandler --> BuiltinTools
    ToolCallHandler --> MCPTools
    
    BuiltinTools --> FileOps
    BuiltinTools --> Search
    BuiltinTools --> Terminal
    BuiltinTools --> Analysis
    BuiltinTools --> Rules
    
    MCPTools --> MCPServers
    MCPTools --> ExternalAPIs
    
    ToolCallHandler --> Permission
    Permission --> AutoApprove
    Permission --> UserApprove
    
    FileOps --> IDEIntegration
    Search --> IDEIntegration
    Terminal --> IDEIntegration
    Analysis --> IDEIntegration
    
    style User fill:#e8f5e8
    style ToolPolicy fill:#fff3e0
    style Permission fill:#ffebee
    style IDEIntegration fill:#e3f2fd
```

**Agent 모드 특징:**

1. **내장 도구 (Built-in Tools)**
   - `read_file`: 파일 내용 읽기
   - `create_new_file`: 새 파일 생성
   - `edit_file`: 파일 편집
   - `grep_search`: 텍스트 검색
   - `glob_search`: 파일 패턴 검색
   - `run_terminal_command`: 터미널 명령 실행
   - `search_web`: 웹 검색
   - `view_diff`: Git diff 보기
   - `view_repo_map`: 리포지토리 구조 보기

2. **권한 관리 시스템**
   - **Ask First (기본)**: 사용자 승인 필요
   - **Automatic**: 자동 실행
   - **Excluded**: 도구 비활성화

3. **MCP (Model Context Protocol) 통합**
   - 외부 MCP 서버와의 연동
   - 확장 가능한 도구 생태계
   - 서드파티 서비스 통합

### 3. Edit 모드

코드 편집에 특화된 모드로, 선택된 코드 영역에 대한 정밀한 편집을 수행합니다.

#### Edit 모드 데이터 플로우

```mermaid
sequenceDiagram
    participant User
    participant IDE as "IDE Editor"
    participant GUI as "React GUI"
    participant Core as "Core System"
    participant ApplyManager as "Apply Manager"
    participant DiffManager as "Diff Manager"
    participant LLM as "LLM Service"
    
    User->>IDE: 코드 영역 선택
    IDE->>GUI: Edit 모드 진입
    GUI->>GUI: 모드 전환 (chat→edit)
    
    User->>GUI: 편집 요청 입력
    Note over GUI: 제한된 컨텍스트 제공자<br/>주로 선택된 코드에 집중
    
    GUI->>Core: 편집 요청 + 선택된 코드
    Core->>Core: 편집 프롬프트 구성<br/>prefix + highlighted + suffix
    
    Core->>LLM: 편집 지시사항 전송
    
    alt 빠른 적용 모델
        LLM-->>Core: 전체 편집 결과
        Core->>ApplyManager: 즉시 적용
        ApplyManager->>IDE: 파일에 변경사항 적용
    else 스트리밍 편집
        LLM-->>Core: 스트리밍 diff 라인
        Core->>DiffManager: diff 스트리밍 시작
        
        loop 스트리밍 diff 처리
            DiffManager->>IDE: 실시간 diff 표시
            DiffManager->>GUI: 적용 상태 업데이트
        end
        
        DiffManager->>GUI: 스트리밍 완료
        GUI->>User: Accept/Reject 버튼 표시
        
        alt 사용자 승인
            User->>GUI: Accept 클릭
            GUI->>DiffManager: 변경사항 승인
            DiffManager->>IDE: 최종 적용
        else 사용자 거부
            User->>GUI: Reject 클릭
            GUI->>DiffManager: 변경사항 거부
            DiffManager->>IDE: 원래 상태 복원
        end
    end
    
    GUI->>GUI: Edit 모드 종료
    GUI->>GUI: 이전 모드로 복귀
    
    Note over GUI,User: 자동 승인 설정 시<br/>수동 리뷰 없이 적용
```

#### Edit 모드 구조

```mermaid
graph TD
    subgraph "Edit Mode Architecture"
        Selection[코드 선택]
        EditEntry[Edit 모드 진입]
        
        subgraph "입력 처리"
            EditInput[편집 요청 입력]
            ContextFilter[컨텍스트 필터링]
            PromptConstruct[편집 프롬프트 구성]
        end
        
        subgraph "편집 전략"
            FastApply[빠른 적용<br/>지원 모델]
            StreamDiff[스트리밍 Diff<br/>일반 모델]
            UnifiedDiff[통합 Diff 형식]
            LazyApply[지연 적용]
        end
        
        subgraph "Diff 관리"
            DiffStream[Diff 스트리밍]
            VerticalDiff[세로 Diff 표시]
            DiffBlocks[Diff 블록 관리]
            Highlighting[문법 강조]
        end
        
        subgraph "적용 시스템"
            ApplyState[적용 상태 관리]
            AutoAccept[자동 승인]
            UserReview[사용자 리뷰]
            AcceptReject[승인/거부]
        end
        
        subgraph "IDE 통합"
            VSCode[VS Code<br/>Apply Manager]
            IntelliJ[IntelliJ<br/>Diff Stream Handler]
            EditorUpdate[편집기 업데이트]
            UndoRedo[실행 취소/다시 실행]
        end
        
        subgraph "파일 처리"
            EmptyFile[빈 파일 처리]
            ExistingFile[기존 파일 편집]
            MultiFile[다중 파일 지원]
            TreeSitter[AST 기반 파싱]
        end
    end
    
    Selection --> EditEntry
    EditEntry --> EditInput
    EditInput --> ContextFilter
    ContextFilter --> PromptConstruct
    
    PromptConstruct --> FastApply
    PromptConstruct --> StreamDiff
    PromptConstruct --> UnifiedDiff
    PromptConstruct --> LazyApply
    
    StreamDiff --> DiffStream
    DiffStream --> VerticalDiff
    VerticalDiff --> DiffBlocks
    DiffBlocks --> Highlighting
    
    DiffStream --> ApplyState
    ApplyState --> AutoAccept
    ApplyState --> UserReview
    UserReview --> AcceptReject
    
    AcceptReject --> VSCode
    AcceptReject --> IntelliJ
    VSCode --> EditorUpdate
    IntelliJ --> EditorUpdate
    EditorUpdate --> UndoRedo
    
    FastApply --> EmptyFile
    FastApply --> ExistingFile
    StreamDiff --> MultiFile
    PromptConstruct --> TreeSitter
    
    style Selection fill:#e8f5e8
    style ApplyState fill:#fff3e0
    style UserReview fill:#ffebee
    style EditorUpdate fill:#e3f2fd
```

**Edit 모드 특징:**

1. **편집 전략**
   - **빠른 적용**: 지원 모델에서 즉시 적용
   - **스트리밍 Diff**: 실시간 변경사항 표시
   - **통합 Diff**: 표준 diff 형식 지원
   - **지연 적용**: 사용자 확인 후 적용

2. **Diff 관리**
   - **실시간 미리보기**: 변경사항 즉시 표시
   - **문법 강조**: 언어별 구문 하이라이팅
   - **블록 단위 관리**: 개별 변경사항 제어

3. **IDE별 구현**
   - **VS Code**: ApplyManager를 통한 편집 관리
   - **IntelliJ**: DiffStreamHandler를 통한 Kotlin 구현
   - **공통**: 실행 취소/다시 실행 지원

4. **컨텍스트 제한**
   - 선택된 코드에 집중
   - 필요한 컨텍스트 제공자만 활성화
   - 편집 범위 최적화

## 보안 고려사항

### 1. API Key 관리
- 로컬 저장소에 암호화된 키 저장
- 환경 변수를 통한 키 주입
- 런타임 키 검증

### 2. 데이터 프라이버시
- 로컬 데이터 처리 우선
- 선택적 클라우드 기능
- 사용자 동의 기반 데이터 수집

### 3. 코드 보안
- 민감한 정보 필터링
- 안전한 코드 실행 환경
- 정기적인 보안 업데이트

## 성능 최적화

### 1. 인덱싱 최적화
- 증분 인덱싱
- 파일 타입별 최적화
- 메모리 효율적인 처리

### 2. 응답 시간 최적화
- 컨텍스트 캐싱
- 병렬 처리
- 스트리밍 응답

### 3. 메모리 관리
- 가비지 컬렉션 최적화
- 메모리 리크 방지
- 효율적인 데이터 구조

## 테스팅 전략

### 1. 단위 테스트
- Jest/Vitest 기반 테스트
- 모킹을 통한 격리된 테스트
- 높은 코드 커버리지 유지

### 2. 통합 테스트
- IDE 확장프로그램 테스트
- 전체 플로우 테스트
- 다중 플랫폼 테스트

### 3. E2E 테스트
- Playwright 기반 자동화
- 실제 사용자 시나리오 테스트
- 성능 회귀 테스트

## 배포 및 릴리스

### 1. 빌드 시스템
- TypeScript 컴파일
- 번들링 및 최적화
- 크로스 플랫폼 바이너리 생성

### 2. 배포 채널
- VS Code Marketplace
- JetBrains Plugin Repository
- GitHub Releases

### 3. 버전 관리
- Semantic Versioning
- 호환성 보장
- 자동화된 릴리스 프로세스

## 향후 계획

### 1. 아키텍처 개선
- 마이크로서비스 아키텍처로의 진화
- WebAssembly 통합
- 클라우드 네이티브 기능

### 2. 기능 확장
- 더 많은 IDE 지원
- 고급 AI 기능
- 팀 협업 기능

### 3. 성능 향상
- 실시간 인덱싱
- 더 빠른 자동완성
- 효율적인 메모리 사용

---

이 아키텍처 문서는 Continue 프로젝트의 현재 설계를 반영하며, 프로젝트의 발전에 따라 지속적으로 업데이트됩니다. 