const mongoose = require('mongoose');

module.exports.connectDB = async () => {
  try {
    await mongoose.connect(process.env.DATABASE);
    console.log("ket noi thanh cong");
  } catch (error) {
    console.log("ket noi that bai");
  }
}