// express 모듈 세팅
const express = require('express')
const router = express.Router()

// json 모듈 설정
router.use(express.json())

// 회원 데이터 저장
let users = new Map()

// 회원 관련 라우팅
router.route('/join')
    // POST - 회원가입
    .post((req, res) => {
        const user = req.body
        if (user && user.userId && user.userPw && user.userName) { // 값이 제대로 입력되었는지 확인
            if (!users.has(user.userId)) {  // ID 중복 확인
                users.set(user.userId.toString(), user)
                res.status(201).json({
                    message: `${user.userName}님 환영합니다.`
                })
            } else {
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

router.route('/users')
    // GET - 회원 개별 조회
    .get((req, res) => {
        let { userId } = req.body
        const user = users.get(userId)
        if (user) {
            const userInfo = {
                userId: user.userId,
                userName: user.userName
            }
            res.status(200).json(userInfo)
        } else {
            res.status(404).json({
                message: "회원 정보를 찾을 수 없습니다."
            })
        }
    })
    // DELETE - 회원 개별 탈퇴
    .delete((req, res) => {
        let { userId } = req.body
        const user = users.get(userId)
        if (user) {
            users.delete(userId)
            res.status(200).json({
                message: `${user.userId}님 다음에 또 뵙겠습니다.`
            })
        } else {
            res.status(404).json({
                message: "회원 정보를 찾을 수 없습니다."
            })
        }
    })

// POST - 로그인
router.post('/login', (req, res) => {
    const { userId, userPw } = req.body

    if (users.has(userId)) {  // users에 ID가 존재하는지 확인
        const user = users.get(userId)  // 존재하면 해당 회원 정보 찾아서 user에 저장
        if (user.userPw === userPw) {  // 비밀번호 확인
            res.status(200).json({
                message: `${user.userName}님 환영합니다!`,
            })
        } else {
            res.status(401).json({
                message: "비밀번호가 올바르지 않습니다.",
            })
        }
    } else {  // 존재하지 않으면 없는 ID
        res.status(404).json({
            message: "존재하지 않는 ID입니다.",
        })
    }
})

module.exports = router
