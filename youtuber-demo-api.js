// express 모듈 세팅
const express = require('express')
const app = express()
app.listen(1234)

// 데이터 세팅
let youtuber1 = {
    channelTitle: "한화이글스",
    sub: "33.7만명",
    videoNum: "3.4천개"
}

let youtuber2 = {
    channelTitle: "침튜브",
    sub: "258만명",
    videoNum: "7.2천"
}

let youtuber3 = {
    channelTitle: "teo",
    sub: "109만명",
    videoNum: "천개"
}

let db = new Map()
let id = 1

db.set(id++, youtuber1)
db.set(id++, youtuber2)
db.set(id++, youtuber3)

// REST API 설계

//GET - 전체 조회
app.get("/youtubers", function (req, res) {
    var youtubers = {}
    if(db.size !== 0){
        db.forEach(function (value, key) {
            youtubers[key] = value
        })
    
        res.json(youtubers) 
    } else{
        res.status(404).json({
            message : "등록된 유튜버가 없습니다."
        })
    }
})

//GET - 개별 조회
app.get('/youtubers/:id', function (req, res) {
    let { id } = req.params
    id = parseInt(id)

    const youtuber = db.get(id)
    if (youtuber) {
        res.json(youtuber)
    } else {
        res.status(404).json({
            message: "유튜버 정보를 찾을 수 없습니다."
        })
    }
})

//POST - 유튜버 등록
app.use(express.json()) // http 외 모듈인 '미들웨어' : json 설정
app.post('/youtubers', (req, res) => {
    // 채널명이 존재하는지 확인
    const channelTitle = req.body.channelTitle
    if(channelTitle) {
        db.set(id++, req.body)

        res.status(201).json({
            message: `${youtuber.channelTitle} 님, 유튜브 채널 개설을 축하드립니다!`
        })
    } else {
        res.status(400).json({
            message: "요청 값을 제대로 보내주세요."
        })
    }

})

//DELETE - 전체 삭제
app.delete("/youtubers", function (req, res) {

    if (db.size >= 1) {
        db.clear()

        res.json({
            message: "모든 채널이 삭제되었습니다."
        })
    } else {
        res.status(404).json({
            message: "삭제할 채널이 없습니다."
        })
    }

    res.json(msg)
})


//DELETE - 개별 삭제
app.delete('/youtubers/:id', function (req, res) {
    let { id } = req.params
    id = parseInt(id)

    var youtuber = db.get(id)
    if (youtuber == undefined) {
        res.status(404).json({
            message: `요청하신 ${id}번은 없는 유튜버입니다.`
        })
    } else {
        const channelTitle = youtuber.channelTitle
        db.delete(id)

        res.json({
            message: `${channelTitle}님 다음에 또 뵙겠습니다.`
        })
    }
})

//PUT - 개별 수정
app.put('/youtubers/:id', function (req, res) {
    let { id } = req.params
    id = parseInt(id)

    var youtuber = db.get(id)
    var oldTitle = youtuber.channelTitle
    if (youtuber == undefined) {
        res.status(404).json({
            message: `요청하신 ${id}번은 없는 유튜버입니다.`
        })
    } else {
        var newTitle = req.body.channelTitle

        youtuber.channelTitle = newTitle
        db.set(id, youtuber)

        res.json({
            message: `${oldTitle}님, 채널명이 ${youtuber.channelTitle}로 변경 되었습니다.`
        })
    }
})