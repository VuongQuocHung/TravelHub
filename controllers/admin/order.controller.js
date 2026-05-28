const Order = require('../../models/order.model');
const { paymentMethodList, paymentStatusList, orderStatusList } = require('../../configs/variable.config');
const City = require("../../models/city.model");
const moment = require('moment');

module.exports.list = async (req, res) => {
  const orderList = await Order.find({
    deleted: false
  }).sort({
    createdAt: "desc"
  })
  console.log(orderList);
  for(const orderDetail of orderList) {
    // Phương thức thanh toán
      orderDetail.paymentMethodName = paymentMethodList.find(item => item.value === orderDetail.paymentMethod).label;
    
      // Trạng thái thanh toán
      orderDetail.paymentStatusName = paymentStatusList.find(item => item.value === orderDetail.paymentStatus).label;
    
      // Trạng thái đơn hàng
      orderDetail.status = orderStatusList.find(item => item.value === orderDetail.status);
    
      orderDetail.createdAtFormat = moment(orderDetail.createdAt).format("HH:mm - DD/MM/YYYY");
  }
  res.render('admin/pages/order-list', {
    pageTitle: 'Trang danh sách đơn hàng',
    orderList: orderList
  });
}

module.exports.edit = async (req, res) => {
  try {
    const orderId = req.params.id;  
    const orderDetail = await Order.findOne({
      _id: orderId,
      deleted: false
    });

    if(!orderDetail) {
      return res.redirect(`/${pathAdmin}/order/list`);
    }
    orderDetail.createdAtFormat = moment(orderDetail.createdAt).format("YYYY-MM-DDTHH:mm");
    for(const tour of orderDetail.toursChecked) {
      tour.departureDateFormat = moment(tour.departureDate).format("DD/MM/YYYY");
      const city = await City.findOne({
        _id: tour.locationFrom
      });
      tour.locationFrom = city.name;
    }
    console.log("detail", orderDetail.createdAtFormat);
    res.render('admin/pages/order-edit', {
      pageTitle: `Đơn hàng: ${orderDetail.code}`,
      orderDetail: orderDetail,
      paymentMethodList: paymentMethodList,
      paymentStatusList: paymentStatusList,
      orderStatusList: orderStatusList
    });
  } catch (error) {
    console.log(error);
    res.redirect(`/${pathAdmin}/order/list`);
  }
}
module.exports.editPatch = async (req, res) => {
  try {
    const orderId = req.params.id;  
    const orderDetail = await Order.findOne({
      _id: orderId,
      deleted: false
    });

    if(!orderDetail) {
      res.json({
        code: "error",
        message: "Không tìm thấy đơn hàng"
      });
    }

    await Order.updateOne({
      _id: orderId,
      deleted: false
    }, req.body);

    res.json({
      code: "success",
      message: "Cập nhật đơn hàng thành công"
    });
    
  } catch (error) {
    console.log(error);
    res.json({
      code: "error",
      message: "Dữ liệu không hợp lệ"
    });
  }
}



