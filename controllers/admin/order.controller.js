const Order = require('../../models/order.model');
const { paymentMethodList, paymentStatusList, orderStatusList } = require('../../configs/variable.config');
const City = require("../../models/city.model");
const moment = require('moment');

module.exports.list = async (req, res) => {
  const target = {
    deleted: false
  };

  // Lọc theo trạng thái
  if(req.query.status){
    target.status = req.query.status
  }
  // Hết lọc theo trạng thái

  // Lọc theo ngày 
  if(req.query.fromDate){
    target.createdAt = {
      $gte: new Date(req.query.fromDate)
    }
  }

  if(req.query.toDate){
    target.createdAt = {
      ...target.createdAt,
      $lte: new Date(req.query.toDate)
    }
  }
  // Hết lọc theo ngày

  // Lọc theo phương thức thanh toán
  if(req.query.paymentMethod){
    target.paymentMethod = req.query.paymentMethod
  }
  // Hết lọc theo phương thức thanh toán

  // Lọc theo trạng thái thanh toán
  if(req.query.paymentStatus){
    target.paymentStatus = req.query.paymentStatus
  }
  // Hết lọc theo trạng thái thanh toán

  // Tìm kiếm
  if(req.query.keyword){
    const keyword = req.query.keyword;
    const regex = new RegExp(keyword, "i");
    target.code = regex;
  }
  // Hết Tìm Kiếm

  // Pagination
  const limit = 5;
  let page = 1;
  if(req.query.page) {
    const currentPage = parseInt(req.query.page);
    if(currentPage > 0) {
      page = currentPage;
    }
  }
  const skip = (page - 1) * limit;
  const totalRecord = await Order.countDocuments(target);
  const totalPage = Math.ceil(totalRecord/limit);
  const paginationData = {
    skip: skip,
    totalRecord: totalRecord,
    totalPage: totalPage
  };
  // Hết Pagination

  const orderList = await Order
    .find(target)
    .sort({
      createdAt: "desc"
    })
    .limit(limit)
    .skip(skip);

  for(const orderDetail of orderList) {
    // Phương thức thanh toán
    orderDetail.paymentMethodName = paymentMethodList.find(item => item.value === orderDetail.paymentMethod).label;
  
    // Trạng thái thanh toán
    orderDetail.paymentStatusName = paymentStatusList.find(item => item.value === orderDetail.paymentStatus).label;
  
    // Trạng thái đơn hàng
    orderDetail.statusDetail = orderStatusList.find(item => item.value === orderDetail.status);

    // Ngày đặt
    orderDetail.createdAtFormat = moment(orderDetail.createdAt).format("HH:mm - DD/MM/YYYY");
  }

  res.render('admin/pages/order-list', {
    pageTitle: 'Trang danh sách đơn hàng',
    orderList: orderList,
    paymentMethodList: paymentMethodList,
    paymentStatusList: paymentStatusList,
    paginationData: paginationData
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



