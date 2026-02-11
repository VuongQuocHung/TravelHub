require('dotenv').config();
require('dns').setServers(['8.8.8.8', '8.8.4.4']);

const express = require('express')
const path = require('path');
const { connectDB } = require("./configs/database.config");

const clientRoute = require("./routes/client/index.route")
const adminRoute = require("./routes/admin/index.route")


const app = express()
const port = 3000

// Kết nối DATABASE 
connectDB();

// Thiết lập thư mujc views
app.set('views', path.join(__dirname, 'views'));

// Thiết lập view engine pug 
app.set('view engine', 'pug');

// Thiết lập thư mục chứa file tĩnh 
app.use(express.static(path.join(__dirname, 'public')));


// Thiết lập đường dẫn
app.use('/admin', adminRoute);
app.use('/', clientRoute);


app.listen(port, () => {
  console.log(`Webiste đang chạy trên cổng ${port}`)
})
