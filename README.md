## Node.js 숙련주차 API 명세입니다!

내용|Method|API|request|response|
---|---|---|---|---|
회원가입|POST|/users|(email, nickname, password, confirmPassword)(JSON)|HttpStatus 및 메시지|
로그인|POST|/auth|(nickname, password)(JSON)|token, HttpStatus 및 메시지|
게시글 작성|POST|/posts|token, (postbody posttitle postId)(JSON) |HttpStatus 및 메시지|
게시글 목록 조회|GET|/posts||(postId, posttitle, postbody, userId, nickname)(JSON)|
게시글 상세 조회|GET|/posts/:postId|postId(parameter)|postId, posttitle, postbody, userId, nickname, commentbody, commentId)(JSON)|
게시글 수정|PUT|/posts/:postId|token, postId(parameter), (changeval, changevaltitle)(JSON)|HttpStatus 및 메시지|
게시글 삭제|DELETE|/posts/:postId|token, postId(parameter)|HttpStatus 및 메시지|
댓글 작성|POST|/comments|token, (postId, commentId, commentbody)(JSON)|HttpStatus 및 메시지|
댓글 조회|GET|/comments|postId(parameter)|(postId, commentbody, commentId, userId, nickname)(JSON)|
댓글 수정|PUT|/comments/:commentId|token, commentId(parameter), changeval(JSON)|HttpStatus 및 메시지|
댓글 삭제|DELETE|/comments/:commentId|token, commentId(parameter)|HttpStatus 및 메시지|
