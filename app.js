const express = require('express');
const cors = require("cors");
const app = express();
const port = 3000;
app.use(cors());

const connect = require('./schemas');
connect();

app.get("/", (req, res) => {
    res.sendFile(__dirname + '/index.html');
  });

const boardRouter = require('./routers/boardrouter');
const commentRouter = require('./routers/commentrouter');
const authRouter = require('./routers/authrouter');
const Posts = require('./schemas/posts');

app.listen(port, () => {
    console.log(port, '포트로 서버가 열렸어요!');
  });

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use('/', boardRouter);
app.use('/', commentRouter);
app.use('/board', boardRouter);
app.use('/', authRouter);
app.use(express.static('public')); //페이지 전환하려면 static 파일들 public 폴더 안에 넣어야 됨!