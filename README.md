## 로컬에서 실행 (공격에 성공해도 플래그 출력 X)

```bash
docker build -t ppboard .
docker run -p 3000:3000 ppboard
```

## 서버 URL
https://webhackingboard.onrender.com/posts

## ⚠️ 주의사항
- 무료 호스팅 특성상 15분간 접속이 없으면 서버가 잠듭니다. 
- 이 경우 첫 요청에서 깨어나는 데 30초~1분 정도 걸립니다.
- **서버가 재시작되면 상태가 초기화됩니다.** (작성한 글이나 가입한 계정은 사라집니다.)
