## 프로젝트 링크
https://forhyundaisofteer.github.io/fe-news/

## 진행한 작업
### 2025/12/30
- 뉴스 스탠드/스텝1 개발완료
- 프로젝트 구조
  - Component 폴더 구조는 기능 기반으로 나누고, store은 중앙 집중 방식으로 구현
- 그리드 뷰 
  - 언론사 asset은 Figma에서 다운 받지 않고, Naver CDN URL 배열로 만들어서 매핑. 추후 다크모드 들어가더라도 CDN URL만 /light -> /dark로 바꾸면 됨
  - 첫 페이지와 끝 페이지 Disable 화살표는 접근성 고려해서 display: none이 아닌 visibility: hidden 기반으로 개발

### 2025/12/29
- NPM 환경 구성
  - npm init
- Module System 변경 (CommonJS -> ESM)
  - package.json에서 `"type": "commonjs"` -> `"type": "module"`
- .gitignore 세팅
  - node_modules
- Live Server 세팅
  - npm install -D live-server
  - package.json에서 `"scripts" : {"start": "live-server"}`로 설정
- HTML 뼈대 잡기
  - Semantic Elements 사용
    - section
    - header
    - time
  - WAI-ARIA 적용
    - aria-hidden
    - aria-label
    - role
  
## 진행해야 할 작업

- #press-content 아래에 동적 HTML 삽입
  - 유지보수성 고려해서 어떻게 나눌지 고민
- 공통된 부분들 컴포넌트화
- CSS 다크 모드 적용
  - [data-theme="dark"]
- Mock Data 세팅
- Dialog 구현 (구독)
