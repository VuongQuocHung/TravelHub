const Order = require('../../models/order.model');
const { paymentMethodList, paymentStatusList, orderStatusList } = require('../../configs/variable.config');
const moment = require('moment');

module.exports.list = async (req, res) => {
  const orderList = await Order.find({
    deleted: false
  }).sort({
    createdAt: "desc"
  })
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
  res.render('admin/pages/order-edit', {
    pageTitle: 'Đơn hàng: OD000001',
  });
}

