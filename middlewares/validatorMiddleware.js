  const { validationResult } = require('express-validator')
  // 2 - middleware -> catch errors from roles if exit 
    // finds the validations errors  in this request and wraps them in an object with handly function 
const validatorMiddleware = (req , res , next)=>{
    const err = validationResult(req);
        if(!err.isEmpty()){
                return res.status(404).json({err : err.array()});
            }
        next();
    };

module.exports = validatorMiddleware;