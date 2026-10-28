// 로그인한 사람만 다음으로 넘기고 아니면 로그인 페이지로
function requireLogin(req,res,next){
    if(!req.session.user){
        return res.redirect('/login');
    }
    next();
}

module.exports={requireLogin};