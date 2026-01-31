const express = require('express')
const app = express()
const port = 3000
const path = require('path');

// Thiết lập thư mujc views
app.set('views', path.join(__dirname, 'views'));

// Thiết lập view engine pug 
app.set('view engine', 'pug')

app.get('/', (req, res) => {
  res.render('client/pages/home', {
    pageTitle: 'Trang chủ 123',
  });
})

app.get('/tours', (req, res) => {
  res.render('client/pages/tour-list', {
    pageTitle: 'Dang sách tour du lịch',
  });
})

app.listen(port, () => {
  console.log(`Webiste đang chạy trên cổng ${port}`)
})
