// express 모듈 세팅
const express = require('express')
const app = express()
app.listen(7777)

//json 모듈 설정
app.use(express.json())

//채널 데이터 저장 
let channels = new Map()
let id = 1

// 채널 관련 라우팅
app.route('/channels')
    // POST - 채널 생성
    .post((req, res) => {
        const channel = req.body
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
    // GET - 전체 조회
    .get((req, res) => {
        var channelList = {}
        if (channels.size !== 0) {
            channels.forEach(function (value, key) {
                channelList[key] = value
            })
            res.status(200).json(channelList)
        } else {
            res.status(404).json({
                message: "등록된 채널이 없습니다."
            })
        }
    })

// 개별 채널 수정, 삭제, 조회 라우팅
app.route('/channels/:id')
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
            res.status(404).json({
                message: `요청하신 ${id}번은 존재하지 않는 채널입니다.`
            })
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
            res.status(404).json({
                message: `요청하신 ${id}번은 존재하지 않는 채널입니다.`
            })
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
            res.status(404).json({
                message: "채널 정보를 찾을 수 없습니다."
            })
        }
    })
