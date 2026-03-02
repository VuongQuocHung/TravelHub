const mongoose = require('mongoose');
require('dns').setServers(['8.8.8.8', '8.8.4.4'])

module.exports.connectDB = async () => {
  try {
    await mongoose.connect(process.env.DATABASE);
    console.log("ket noi thanh cong");
  } catch (error) {
    console.log("ket noi that bai");
    console.log(error);
  }
}