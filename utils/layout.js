// 모든 페이지 공통 HTML 틀 -> 위쪽 메뉴 + 본문(body)
function layout(user, body) {
    // 로그인 상태면 로그아웃 메뉴, 아니면 로그인/회원가입 메뉴
    const menu = user
        ? `${user}님 | <a href="/logout">로그아웃</a>`
        : `<a href="/login">로그인</a> | <a href="/register">회원가입</a>`;

    return `
<!DOCTYPE html>
<html lang="ko">
<head><meta charset="UTF-8"><title>게시판</title></head>
<body>
    <a href="/posts">게시판</a> | ${menu}
    <hr>
    ${body}
</body>
</html>`;
}

module.exports = layout;