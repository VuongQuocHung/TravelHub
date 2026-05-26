const Tour = require('../../models/tour.model');
const moment = require("moment");
const City = require('../../models/city.model');

module.exports.cart = (req, res) => {
  res.render('client/pages/cart', {
    pageTitle: 'Giỏ hàng',
  });
}

module.exports.detail = async (req, res) => {
  try {
    const { cart } = req.body;
    const cartDetail = [];
    for(const item of cart){
      const tourDetail = await Tour.findOne({
        _id: item.tourId,
        status: "active",
        deleted: false
      })
      if(tourDetail){
        const city = await City.findOne({
          _id: item.locationFrom
        });
        const itemDetail = {
            ...item, 
            detail : {
              name: tourDetail.name,
              avatar: tourDetail.avatar,
              slug: tourDetail.slug,
              price: tourDetail.price,
              departureDate: moment(tourDetail.departureDate).format('DD/MM/YYYY'),
              locationFromName: city.name,
              priceNewAdult: tourDetail.priceNewAdult,
              priceNewChildren: tourDetail.priceNewChildren,
              priceNewBaby: tourDetail.priceNewBaby,
              stockAdult: tourDetail.stockAdult,
              stockChildren: tourDetail.stockChildren,
              stockBaby: tourDetail.stockBaby,
            }
        };
        cartDetail.push(itemDetail);
      } 
    }
    res.json({
      code: "success",
      message: "Lấy chi tiết giỏ hàng thành công!",
      cartDetail: cartDetail
    })
  } catch (error) {
    res.json({
      code: "error",
      message: "Lấy chi tiết giỏ hàng thất bại!"
    })
  }
  
}
