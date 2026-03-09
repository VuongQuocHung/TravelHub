const Joi = require('joi');

module.exports.registerPost = (req, res, next) => {
  const schema = Joi.object({
    fullName: Joi.string()
    .required()
    .min(5)
    .max(20)
    .messages({
      "string.empty": "Vui lòng nhập họ tên",
      "string.min": "Họ tên phải có ít nhất 5 ký tự",
      "string.max": "Họ tên phải có nhiều nhất 20 ký tự",
    }),
    email: Joi.string()
    .required()
    .email()
    .messages({
      "string.empty": "Vui lòng nhập email",
      "string.email": "Email không đúng định dạng"
    }),
    password: Joi
    .string()
    .required()
    .min(8)
    .custom((value, helpers) =>{
      if(!/[A-Z]/.test(value)){
        return helpers.error('password.uppcase')
      }
      if(!/[a-z]/.test(value)){
        return helpers.error('password.lowercase')
      }
      if(!/\d/.test(value)){
        return helpers.error('password.number')
      }
      if(!/[@$!%*?&]/.test(value)){
        return helpers.error('password.special')
      }
    })
    .messages({
      "string.empty": "Vui lòng nhập mật khẩu",
      "string.min": "Mật khẩu phải chứa ít nhất 8 ký tự!",
      "password.uppcase": "Mật khẩu phải chứa ít nhất một ký tự in hoa!",
      "password.lowercase": "Mật khẩu phải chứa ít nhất một ký tự in hoa!",
      "password.number": "Mật khẩu phải chứa ít nhất một chữ số!",
      "password.special": "Mật khẩu phải chứa ít nhất một ký tự đặc biệt!",
    }),
  })
  const { error } = schema.validate(req.body);
  if(error){
    const errorMessage = error.details[0].message;
    res.json({
      code: "error",
      message: errorMessage,
    });
    return;
  } 
  next();
}


module.exports.loginPost = (req, res, next) => {
  const schema = Joi.object({
    email: Joi.string()
    .required()
    .email()
    .messages({
      "string.empty": "Vui lòng nhập email",
      "string.email": "Email không đúng định dạng"
    }),
    password: Joi.string()
    .required()
    .min(8)
    .messages({
      "string.empty": "Vui lòng nhập mật khẩu",
    }),
    rememberPassword: Joi.boolean()
  });
  const { error } = schema.validate(req.body);
  if(error){
    const errorMessage = error.details[0].message;
    res.json({
      code: "error",
      message: errorMessage,
    });
    return;
  } 
  // else {
  //   const errorMessage = error.details[0].message;
  //   req.json({
  //     code: "error",
  //     message: errorMessage
  //   });
  //   return;
  // }
  next();
}