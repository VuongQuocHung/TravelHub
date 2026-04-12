const Joi = require('joi');

module.exports.createPost = (req, res, next) => {
  const schema = Joi.object({
    email: Joi.string()
      .required()
      .email()
      .messages({
        "string.empty": "Vui lòng nhập tên danh mục",
        "string.email": "Email không đúng định dạng !",
      }),
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
  next();
}