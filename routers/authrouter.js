const express = require('express');
const Users = require("../schemas/users");
const Joi = require("joi");
const authMiddleware = require("../middlewares/auth_middleware");
const authRouter = express.Router();
const jwt = require("jsonwebtoken");

const postUsersSchema = Joi.object({
    nickname: Joi.string().alphanum().min(3).max(15).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(4).max(25).required(),
    confirmPassword: Joi.string().required(),
  });

authRouter.post("/users", async (req, res) => {
    try {
      const {
        nickname,
        email,
        password,
        confirmPassword,
      } = await postUsersSchema.validateAsync(req.body); //스키마 검증. 콜백으로도 할 수 있다.
      if (password !== confirmPassword) {
        res.status(400).send({
          errorMessage: "패스워드가 패스워드 확인란과 동일하지 않습니다.",
        });
        return;
      } else if (String(password) === String(nickname)) {
        res.status(400).send({
          errorMessage: "닉네임과 패스워드를 다르게 설정하세요.",
        }); return;
      }
      const existUsers = await Users.find({
        $or: [{ email }, { nickname }],
      });
      if (existUsers.length) {
        res.status(400).send({
          errorMessage: "이미 가입된 이메일 또는 닉네임이 있습니다.",
        });
        return;
      }
  
      const user = new Users({ email, nickname, password });
      await user.save();
  
      res.status(201).send({});
    } catch (err) {
      console.log(err);
      res.status(400).send({
        errorMessage: "요청한 데이터 형식이 올바르지 않습니다.",
      });
    }
  });

  const postAuthSchema = Joi.object({
    nickname: Joi.string().required(),
    password: Joi.string().required(),
  });
  
  authRouter.post("/auth", async (req, res) => {
    try {
      const { nickname, password } = await postAuthSchema.validateAsync(req.body);
  
      const user = await Users.findOne({ nickname, password }).exec();
  
      if (!user) {
        res.status(400).send({
          errorMessage: "닉네임 또는 패스워드를 확인해 주세요.",
        });
        return;
      }
  
      const token = jwt.sign({ userId: user.userId }, 'miraclenightdiving');
      res.send({
        token,
      });
    } catch (err) {
        console.log(err);
      res.status(400).send({
        errorMessage: "요청한 데이터 형식이 올바르지 않습니다.",
      });
    }
  });

  module.exports = authRouter;