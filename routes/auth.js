const express=require('express');
const {load,save}=require('../utils/db');
const layout=require('../utils/layout');

const router=express.Router(); // 라우터 객체 -> app.js에서 app.use로 연결

// GET /register -> 회원가입
router.get('/register',(req,res)=>{
    res.send(layout(req.session.user,
        `<h2>회원가입</h2>
        <form action="/register" method="POST">
            <input name="username" placeholder="아이디" required>
            <input name="password" type="password" placeholder="비밀번호" required>
            <button>가입</button>
        </form>
        `
    ));
});

// POST /register -> 회원가입 처리
router.post('/register',(req,res)=>{
    const {username,password}=req.body;
    const data=load();

    // 같은 아이디가 이미 있는 경우 가입 X
    if(data.users.find(u=>u.username === username)){
        return res.status(400).send(layout(null,'이미 있는 아이디입니다. <a href="/register">다시</a>'));
    }

    data.users.push({username,password}); // 유저 추가
    save(data); // 파일에 저장
    res.redirect('/login'); // 가입 끝나면 로그인 페이지로
});

//GET /login -> 로그인 폼
router.get('/login',(req,res)=>{
    res.send(layout(req.session.user,
        `<h2>로그인</h2>
        <form action="/login" method="POST">
            <input name="username" placeholder="아이디" required>
            <input name="password" type="password" placeholder="비밀번호" required>
            <button>로그인</button>
        </form>    
        `
    ));
});

//POST /login -> 로그인 처리
router.post('/login',(req,res)=>{
    const {username,password}=req.body;

    // 아이디, 비밀번호 2개 다 일치하는 유저 찾기
    const user=load().users.find(u=>u.username===username&&u.password===password);
    if(!user){
        return res.status(401).send(layout(null,'아이디 또는 비밀번호가 일치하지 않습니다. <a href="/login">다시</a>'));
    }
    req.session.user=username; // 세션에 아이디 저장 -> 이후 요청에서 로그인 상태 유지
    res.redirect('/posts');
});

//GET /logout -> 세션 삭제
router.get('/logout',(req,res)=>{
    req.session.destroy(()=>{
        res.redirect('/login');
    });
});

module.exports=router;