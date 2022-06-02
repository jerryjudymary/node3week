const express = require('express');
const Posts = require('../schemas/posts');
const Comments = require('../schemas/comments');
const boardRouter = express.Router();
const authMiddleware = require("../middlewares/auth_middleware");


boardRouter.get('/posts', async (req, res) => {
  const posts = await Posts.find();
  res.json({
    posts
  });
});

boardRouter.get('/posts/:postId', async (req, res) => {
  const postId = req.params.postId;
  const posts = await Posts.find({ postId: Number(postId)});
  const comments = await Comments.find({ postId: Number(postId)});
  const filteredposts = posts.filter((inpost) => inpost.postId === Number(postId))
  const filteredcomments = comments.filter((inpost) => inpost.postId === Number(postId))
  res.json({
    detail: filteredposts,
    detailcomment: filteredcomments,
  });
});

boardRouter.post('/posts', authMiddleware, async function (req, res) {
  const { userId, nickname } = res.locals.user;
  const { postbody, posttitle, postId } = req.body;

  await Posts.create({ postbody, posttitle, nickname, userId, postId })

  res.json({'msg': '등록 완료'})
})

boardRouter.delete('/posts/:postId', authMiddleware, async function (req, res) {
  const { userId } = res.locals.user;
  const { postId } = req.params;
  const existPosts = await Posts.find({ postId: Number(postId)});;
 
  if (existPosts.length && (String(existPosts[0].userId) === String(userId))) {
     await Posts.deleteOne({ postId: Number(postId)});
     res.json({'msg': '삭제 완료'})
  } else {
  res.json({'msg': '삭제 권한이 없습니다'})}
})

boardRouter.put('/posts/:postId', authMiddleware, async function (req, res) {
  const { userId } = res.locals.user;
  const { postId } = req.params;
  const { changeval, changevaltitle } = req.body;
  
  const existPosts = await Posts.find({ postId: Number(postId)});
 
  if (existPosts.length && (String(existPosts[0].userId) === String(userId))) {
     await Posts.updateOne({ postId: Number(postId) }, { $set: { postbody : changeval, posttitle : changevaltitle } });
     res.json({'msg': '수정 완료'})
  } else {
  res.json({'msg': '수정 권한이 없습니다'})}
})

module.exports = boardRouter;