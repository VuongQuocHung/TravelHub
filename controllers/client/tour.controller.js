const { Tour } = require("../../models/tour.model");

module.exports.tourList = async (req, res) => {
  const tourList = await Tour.find({});

  // console.log(`Đã kết nối`);
  res.render('client/pages/tour-list', {
    pageTitle: 'Dang sách tour du lịch',
    tourList: tourList
  });
}

module.exports.detail = async (req, res) => {
  res.render('client/pages/tour-detail', {
    pageTitle: 'Chi tiết tour',
  });
}