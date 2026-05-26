const { randomNumberString } = require("../../helpers/random.helper");
const Order = require("../../models/order.model");
const Tour = require("../../models/tour.model");
module.exports.createPost = async (req, res) => {
  // mã đơn hàng
  while(true){
    const code = "DH" + randomNumberString(6);
    const existOrder = await Order.findOne({ code });
    if(!existOrder) {
      req.body.code = code;
      break;
    }
  }
  // danh sách tour đã chọn
  for(const tour of req.body.toursChecked) {
    const tourDetail = await Tour.findOne({
      _id: tour.tourId,
      deleted: false,
      status: "active"
    });

    if(!tourDetail) {
      res.json({
        code: "error",
        message: "Tour không tồn tại!"
      })
      return;
    }
    if(tourDetail.stockAdult < tour.quantityAdult || tourDetail.stockChildren < tour.quantityChildren || tourDetail.stockBaby < tour.quantityBaby) {
      res.json({
        code: "error",
        message: "Số lượng người đã vượt quá số lượng còn lại!"
      })
      return;
    }
    // Thông tin chi tiết tour
    tour.priceNewAdult = tourDetail.priceNewAdult;
    tour.priceNewChildren = tourDetail.priceNewChildren;
    tour.priceNewBaby = tourDetail.priceNewBaby;

    tour.departureDate = tourDetail.departureDate;
    tour.name = tourDetail.name;
    tour.avatar = tourDetail.avatar;
  }
  // Thanh toán
  req.body.subTotal = req.body.toursChecked.reduce((total, tour) => total + tour.priceNewAdult * tour.quantityAdult + tour.priceNewChildren * tour.quantityChildren + tour.priceNewBaby * tour.quantityBaby, 0); // Tổng tiền trước khi giảm giá

  req.body.discount = 0;

  req.body.total = req.body.subTotal - req.body.discount;
  req.body.paymentStatus = "unpaid";

  // Trạng thái đơn hàng
  req.body.status = "initial";

  // Lưu vào CSDL
  const newRecord = new Order(req.body);

  await newRecord.save();

  res.json({
    code: "success",
    message: "Tạo đơn hàng thành công!"
  })
}

