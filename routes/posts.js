// 게시판 전체 기능
const express=require('express');
const {load,save}=require('../utils/db');
const layout=require('../utils/layout'); // 공통 html 틀
const {requireLogin}=require('../middlewares/loginCheck'); // 로그인 체크하는 미들우에ㅓ

const router=express.Router();

// 글쓰기/수정 폼 -> action(보낼 주소)과 기존 값만 바꿔서 재사용
 // html 만드는 함수
function postForm(action,post={title:'',content:''}){
    return `
    <form action="${action}" method="POST">
        <p><input name="title" placeholder="제목" value="${post.title}" required></p>
        <p><textarea name="content" rows="10" cols="50" required>${post.content}</textarea></p>
        <button>저장</button>       
    </form>
    `;
}

// 글 목록에서 id가 같은 게시글 찾기 -> 없으면 undefined
function findPost(data,id){ //id는 문자열 => Number로 변환)
    return data.posts.find(p=>p.id===Number(id));
}

//GET /posts -> 글 목록(read)
router.get('/',(req,res)=>{
    const posts=load().posts;
    // 글을 li 태그 문자열로 바꾸고 map으로 배열 각 요소를 변환한 새 배열 생성
    // join('')로 배열을 하나의 문자열로 이어붙임
    const list=posts.map(p=>`<li><a href="/posts/${p.id}">${p.title}</a> - ${p.author}</li>`).join(''); // 배열을 하나의 문자열로

    res.send(layout(req.session.user,`
        <h2>게시판</h2>
        <a href="/posts/new">글쓰기</a>
        <ul>${list||'<li>글이 존재하지 않습니다.</li>'}</ul>
    `));
    // 글이 없으면 list가 빈 문자열 => || 뒤의 문자열이 들어가게 됨
});

// GET /posts/new -> 글쓰기 폼
// requireLogin을 먼저 통과해야 실행됨 (로그인 안했으면 /login 으로)
router.get('/new',requireLogin,(req,res)=>{
    res.send(layout(req.session.user,`<h2>글쓰기</h2>`+postForm('/posts')));
});

//POST /posts -> 글 작성
router.post('/',requireLogin,(req,res)=>{
    const {title,content}=req.body;
    const data=load();

    const post={
        id: data.nextPostId++,
        title,
        content,
        author:req.session.user, // 작성자 = 로그인한 유저
    };
    data.posts.push(post);
    save(data);

    res.redirect(`/posts/${post.id}`); // 작성한 글로 이동
});

//GET /posts/:id -> 글 상세보기
router.get('/:id',(req,res)=>{
    const post=findPost(load(),req.params.id);
    if(!post){
        return res.status(404).send(layout(req.session.user, '글이 존재하지 않습니다.'));
    }

    // 글 작성자 본인일 때만 수정 및 삭제 버튼 표시
    const buttons=req.session.user===post.author ? `
        <a href="/posts/${post.id}/edit">수정</a>
        <form action="/posts/${post.id}/delete" method="POST" style="display:inline">
            <button>삭제</button>
        </form>
    `:'';

    res.send(layout(req.session.user,`
        <h2>${post.title}</h2>
        <p>작성자 : ${post.author}</p>
        <pre>${post.content}</pre>
        <a href="/posts">목록</a> ${buttons}
        `));
});

// GET /posts/:id/edit -> 수정
router.get('/:id/edit',requireLogin,(req,res)=>{
    const post=findPost(load(),req.params.id);
    if(!post||post.author !== req.session.user){
        return res.redirect('/posts');
    }
    res.send(layout(req.session.user,`<h2>글 수정</h2>`+postForm(`/posts/${post.id}/edit`,post)));
});

// POST /posts/:id/edit -> 글 수정
router.post('/:id/edit',requireLogin, (req,res)=>{
    const data=load();
    const post=findPost(data,req.params.id); // data 안에 있는 글 객체

    if(!post ||post.author !== req.session.user){
        return res.redirect('/posts');
    }

    post.title=req.body.title;
    post.content=req.body.content;
    save(data); // 바뀐 데이터를 파일에 저장

    res.redirect(`/posts/${post.id}`); // 수정한 글로 이동
    
});

//POST /posts/:id/delete -> 글 삭제
router.post('/:id/delete', requireLogin,(req,res)=>{
    const data=load();
    const post=findPost(data,req.params.id);

    if(!psot||post.author !== req.session.user){
        return res.redirect('/posts');
    }

    data.posts=data.posts.filter(p=>p.id !== post.id);
    save(data);

    res.redirect('/posts'); // 목록으로 이동
});

module.exports=router;