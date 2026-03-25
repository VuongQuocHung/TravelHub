require('dotenv').config();

const express = require('express')
const path = require('path');
const { connectDB } = require("./configs/database.config");

const clientRoute = require("./routes/client/index.route")
const adminRoute = require("./routes/admin/index.route")
const variableConfig = require("./configs/variable.config");
const cookieParser = require('cookie-parser');

// Không cần session vì dùng JWT

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

// Tạo biến toàn cục dùng trong file pug 
app.locals.pathAdmin = variableConfig.pathAdmin;

// Tạo biến toàn cục dùng trong file js bên backend
global.pathAdmin = variableConfig.pathAdmin;

// cho phép gửi data lên dạng json
app.use(express.json());

// Sử dụng cookie-parser
app.use(cookieParser());

const passport = require('./configs/passport');
app.use(passport.initialize());


// Thiết lập đường dẫn
app.locals.pathAdmin = variableConfig.pathAdmin;
app.use(`/${variableConfig.pathAdmin}`, adminRoute);
app.use('/', clientRoute);


app.listen(port, () => {
  console.log(`Webiste đang chạy trên cổng ${port}`)
})
