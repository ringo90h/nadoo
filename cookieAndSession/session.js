app.use('/favicon.ico', function () {
});

app.use(function (req, res) {
    // 세션 ID
    const sessionID = req.sessionID;
    console.log('session id :', sessionID);

    // 방문 횟수
    console.log('sessionVisit : ', req.session.sessionVisit);
    if (req.session.sessionVisit)
        req.session.sessionVisit = parseInt(req.session.sessionVisit) + 1;
    else
        req.session.sessionVisit = 1;

    // 마지막 방문 날짜
    var now = new Date();
    var last = now.getFullYear() + '.' + (now.getMonth() + 1) + '.' + now.getDate();
    req.session.sessionLast = last;

    // 첫 방문 날짜
    if (!req.session.sessionSince) {
        req.session.sessionSince = last;
    }


    // 쿠키 접근하기
    const cookies = req.session.cookie;
    console.log('cookies : ', cookies);

    res.send({
        sessionVisit: req.session.sessionVisit,
        sessionSince: req.session.sessionSince,
        sessionLast: req.session.sessionLast
    });
});