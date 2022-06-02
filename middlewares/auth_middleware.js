const jwt = require('jsonwebtoken')
const Users = require('../schemas/users')

module.exports = (req, res, next) => {
    
    const { authorization } = req.headers; // 어차피 소문자로 변환됨
    const [tokenType, tokenValue] = authorization.split(' '); // 공백값 기준으로 타입, 밸류 배열로 변환 후
                                                            // 디스트럭쳐링    
                                                            
    if (tokenType !== 'Bearer') {
        res.status(401).send({errorMessage: '로그인 후 사용하세요.'},)
        return;
    };

    try {
        const { userId } = jwt.verify(tokenValue, 'miraclenightdiving') // 토큰에서 userId값 뽑기
        Users.findById(userId).then((user) => { // db사용 필요하므로 User 모델 require할 것
                                    // 미들웨어 함수 자체가 async가 아니기 때문에 then 메서드 이용
            res.locals.user = user; // express 내에 잠시 정보 저장하는 메서드. 이 미들웨어를 이용하는
            next();                 // 다른 곳에서도 사용할 수 있어서 사용하면 매우 편리. 사용자가 인증 된 상태로 저장.
        });
    
    } catch (error) {
        res.status(401).send({errorMessage: '로그인 후 사용하세요'},)
        return;
    }
};
