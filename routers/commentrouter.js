const express = require('express');
const Comments = require('../schemas/comments');
const commentRouter = express.Router();
const authMiddleware = require("../middlewares/auth_middleware");


commentRouter.get('/comments', async (req, res) => {
  const { id } = req.body;
  console.log(id)
  const comments = await Comments.find({ postId: Number(id)});
  const filteredcomments = comments.filter((inpost) => inpost.postId === Number(id))
  res.json({
    detail: filteredcomments,
  });
});

commentRouter.post('/comments', authMiddleware, async function (req, res) { //authMiddleware를 안 불러와서 undefined 오류 발생. 주의
  const { userId, nickname } = res.locals.user;
  const { commentbody, commentId, postId } = req.body;

  await Comments.create({ commentbody, nickname, userId, postId, commentId })

  res.json({'msg': '댓글 등록 완료'})
})

commentRouter.delete('/comments/:commentId', authMiddleware, async function (req, res) {
  const { userId } = res.locals.user;
  const { commentId } = req.params;
  const existComments = await Comments.find({ commentId: Number(commentId)});;
 
  if (existComments.length && (String(existComments[0].userId) === String(userId))) {
     await Comments.deleteOne({ commentId: Number(commentId)});
     res.json({'msg': '댓글 삭제 완료'})
  } else {
  res.json({'msg': '댓글 삭제 권한이 없습니다'})}
})

commentRouter.put('/comments/:commentId', authMiddleware, async function (req, res) {
  const { userId } = res.locals.user;
  const { commentId } = req.params;
  const { changeval } = req.body;
  
  const existComments = await Comments.find({ commentId: Number(commentId)});
 
  if (existComments.length && (String(existComments[0].userId) === String(userId))) {
     await Comments.updateOne({ commentId: Number(commentId) }, { $set: { commentbody : changeval } });
     res.json({'msg': '댓글 수정 완료'})
  } else {
  res.json({'msg': '댓글 수정 권한이 없습니다'})}
})


module.exports = commentRouter;