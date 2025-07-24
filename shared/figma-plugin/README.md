## Quickstart

This plugin was created with [Plugma](https://github.com/gavinmcfarland/plugma) using the [React](https://react.dev/) framework.

### Requirements

- [Node.js](https://nodejs.org/en)
- [Figma desktop app](https://www.figma.com/downloads/)

### 실행 방법

1. **개발 서버 실행**

   ```bash
   cd shared/figma-plugin
   yarn start
   ```

2. **Figma에서 플러그인 실행**
   - Figma 데스크톱 앱에서 `Plugins` → `Development` → `Import plugin from manifest...` 클릭
   - `shared/figma-plugin/dist/manifest.json` 파일 선택
   - 플러그인이 설치되면 `Plugins` → `Development`에서 실행 가능
   - 플러그인이 실행되면 `connect` 버튼을 클릭하여 mcp서버 사용 가능
   - HMR이 적용되고 있음
