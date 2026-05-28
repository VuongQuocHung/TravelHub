const Joi = require('joi');

module.exports.editPatch = (req, res, next) => {
  const schema = Joi.object({
    fullName: Joi.string()
      .required()
      .messages({
        "string.empty": "Vui lòng nhập tên danh mục",
      }),
    id: Joi.string().allow(''),
    phone : Joi.string().allow(''),
    note : Joi.string().allow(''),
    paymentMethod : Joi.string().allow(''),
    paymentStatus : Joi.string().allow(''),
    status : Joi.string().allow(''),
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