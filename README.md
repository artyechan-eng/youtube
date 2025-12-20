# 🎬 TubeAlchemy

유튜브 인기 영상의 성공 공식을 분석하고, 그것을 기반으로 새로운 떡상 콘텐츠를 기획하는 AI 도구입니다.

## ✨ 주요 기능

- 📊 **영상 분석**: 인기 영상의 대본을 분석하여 성공 요인 추출
- 💡 **아이디어 생성**: 비슷한 주제 2개 + 새로운 주제 2개의 콘텐츠 아이디어 제안
- 📝 **대본 작성**: 선택한 아이디어로 실제 촬영용 대본 자동 생성
- 🔐 **API 키 관리**: 로컬 스토리지 활용 - 한 번 입력하면 자동 저장
- 💰 **무료 사용**: Google Gemini 1.5 Flash 무료 모델 사용

## 🚀 로컬 실행

**요구사항:** Node.js 18+

1. 의존성 설치:
   ```bash
   npm install
   ```

2. 개발 서버 실행:
   ```bash
   npm run dev
   ```

3. 브라우저에서 http://localhost:5173 접속

4. API 키 설정:
   - 우측 상단의 "API 키" 버튼 클릭
   - [Google AI Studio](https://aistudio.google.com/app/apikey)에서 발급받은 API 키 입력
   - "저장하기" 클릭 (브라우저에 안전하게 저장됩니다)

## 📦 Vercel 배포

### 1. GitHub에 푸시

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/your-username/your-repo.git
git push -u origin main
```

### 2. Vercel에 배포

1. [Vercel](https://vercel.com)에 로그인
2. "New Project" 클릭
3. GitHub 리포지토리 연결
4. 프로젝트 설정:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. "Deploy" 클릭

배포 완료 후 자동으로 생성된 URL로 접속할 수 있습니다.

## 🛠️ 기술 스택

- **Frontend**: React 19 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **AI**: Google Gemini 1.5 Flash (무료)
- **Deployment**: Vercel

## 📄 라이선스

MIT License

---

Powered by Google Gemini 1.5 Flash
