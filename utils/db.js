// db.json 파일을 db처럼 사용
const fs=require('fs'); // 파일 읽고 쓰는 모듈
const path=require('path'); // 파일 경로 모듈

const DB_PATH=path.join(__dirname,'..','data','db_json'); // 저장할 파일 경로

// 파일 읽기 -> 파일 내용을 js 객체로 돌려줌
function load(){
    // db.json이 없는 경우
    if(!fs.existsSync(DB_PATH)){
        return {users:[], posts:[],nextPostId:1};
    }
    // 파일을 문자열로 읽음 -> JSON.parse로 문자열을 JS 객체로 변환
    return JSON.parse(fs.readFileSync(DB_PATH,'utf-8'));
}

// 파일 쓰기 -> JS 객체를 db.json에 저장
function save(data){
    fs.mkdirSync(path.dirname(DB_PATH),{recursive:true});
    fs.writeFileSync(DB_PATH,JSON.stringify(data,null,2));
}

module.exports={load,save};