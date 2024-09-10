// express 모듈 세팅
const express = require('express')
const router = express()

//json 모듈 설정
router.use(express.json())

//채널 데이터 저장 
let channels = new Map()
let id = 1

// 채널 관련 라우팅
router.route('/')
    // POST - 채널 생성
    .post((req, res) => {
        let channel = req.body

        if (channel.channelTitle) {
            channels.set(id++, channel)

            res.status(201).json({
                message: `${channel.channelTitle} 님, 유튜브 채널 개설을 축하드립니다!`
            })
        } else {
            res.status(400).json({
                message: "요청 값을 제대로 보내주세요."
            })
        }
    })
    // GET - 회원 채널 전체 조회
    .get((req, res) => {
        var { userId } = req.body; // req.body로 userId를 가져옴
        var channelList = [] 

        if (channels.size && userId) {
            channels.forEach((value, key) => {
                if (value.userId == userId) {
                    channelList.push(value);
                }
            })
        
            if (channelList.length) {
                res.status(200).json(channelList); // 채널이 존재하면 200 OK 응답
            } else {
                NotFoundChannel()
            }

        } else {
            NotFoundChannel()
        }
    });


// 개별 채널 수정, 삭제, 조회 라우팅
router.route('/:id')
    // PUT - 개별 수정
    .put((req, res) => {
        let { id } = req.params
        id = parseInt(id)
        var channel = channels.get(id)
        if (channel) {
            var oldTitle = channel.channelTitle
            var newTitle = req.body.channelTitle
            channel.channelTitle = newTitle
            channels.set(id, channel)
            res.status(200).json({
                message: `${oldTitle}님, 채널명이 ${newTitle}로 변경되었습니다.`
            })
        } else {
            NotFoundChannel()
        }
    })
    // DELETE - 채널 삭제
    .delete((req, res) => {
        let { id } = req.params
        id = parseInt(id)
        var channel = channels.get(id)
        if (channel) {
            const channelTitle = channel.channelTitle
            channels.delete(id)
            res.status(200).json({
                message: `${channelTitle}님 다음에 또 뵙겠습니다.`
            })
        } else {
            NotFoundChannel()
        }
    })
    // GET - 개별 조회
    .get((req, res) => {
        let { id } = req.params
        id = parseInt(id)
        const channel = channels.get(id)
        if (channel) {
            res.status(200).json(channel)
        } else {
            NotFoundChannel()
        }
    })

function NotFoundChannel(){
    res.status(404).json({
        message: "채널 정보를 찾을 수 없습니다."
    })
}

module.exports = router
