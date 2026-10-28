const express=require('express'); // express 패키지 불러옴
const helmet=require('helmet');
const session=require('express-session'); // 세션 -> 로그인 상태 유지
const path=require('path'); // 경로 처리

const authRouter=require('./routes/auth'); // 로그인 관련 라우터
const postsRouter=require('./routes/posts'); // 게시판 라우터

const app=express(); // express 앱 서버 객체
const PORT=3000; // 서버 열 포트

// 미들웨어 등록
app.use(helmet()); // helmet 미들웨어 -> 보안 http 응답 헤더 적용
app.use(express.json()); // json 형식 body를 객체로 req.body에 넣어줌
app.use(express.urlencoded({extended:true})); // form 형식의 body를 객체러 -> req.body에 넣어줌

// 세션 미들웨어 -> 로그인한 유저 정보를 서버에 저장, 브라우저에는 세션 ID
app.use(session({
    secret:'secretKey',
    resave:false, // 바뀐게 없으면 세션 다시 저장 X
    saveUninitialized:false, // 로그인 전 빈 세션은 저장 X
}));

// 커스텀 로그 미들웨어
app.use((req,res,next)=>{
    console.log(`${req.method} ${req.url}`);
    next(); // 다음 미들웨어, 라우터로
});

// 라우터
//GET / -> 게시판으로 이동
app.get('/',(req,res)=>{
    res.redirect('/posts');
});

app.use('/',authRouter); // /register, /login, /logout
app.use('/posts',postsRouter); // /posts로 시작하는 요청은 게시판 라우터

// 에러 처리 -> 위의 라우트에 해당하지 않는 요청이 들어온 경우 (잘못된 경로)
app.use((req,res)=>{
    res.status(404).send('not found');
});

// 에러 처리 미들웨어 
app.use((err,req,res,next)=>{
    console.log(err.message); // 에러 로그 출력
    res.status(500).send('server error');
});

// 서버 실행 -> 3000번 포트에서 요청 대기
app.listen(PORT,()=>{
    console.log(`http://localhost:${PORT}`);
});
