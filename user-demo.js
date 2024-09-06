// express 모듈 세팅
const express = require('express')
const app = express()
app.listen(7777)

//json 모듈 설정
app.use(express.json())

//회원 데이터 저장 
let users = new Map()

//POST - 로그인
app.post('/login', (req, res) => {
    const user = req.body
})

//POST - 회원가입
app.post('/join', (req, res) => {
    const user = req.body

    if (user && user.userId && user.userPw && user.userName) { // 값이 제대로 입력됬는지 확인
        if (!users.has(user.userId)) {  // id 중복 확인
            users.set(user.userId.toString(), user)

            res.status(201).json({
                message: `${user.userName}님 환영합니다.`
            })
        } else{
            res.status(409).json({
                message: "이미 존재하는 ID 입니다."
            })
        }
    } else {
        res.status(400).json({
            message: "회원 정보를 제대로 입력해주세요."
        })
    }
})

//GET - 회원 개별 조회
app.get('/users/:id', function (req, res) {
    let { id } = req.params
    const user = users.get(id.toString())

    if (user) {
        res.json(user)
    } else {
        res.status(404).json({
            message: "회원 정보를 찾을 수 없습니다."
        })
    }
})

//GET - 회원 개별 탈퇴
app.delete('/users/:id', function (req, res) {
    let { id } = req.params
    const user = users.get(id.toString())

    if (user) {
        users.delete(id)

        res.json({
            message: `${user.userId}님 다음에 또 뵙겠습니다.`
        })
    } else {
        res.status(404).json({
            message: "회원 정보를 찾을 수 없습니다."
        })
    }
})