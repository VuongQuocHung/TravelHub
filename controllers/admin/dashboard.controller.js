const AccountAdmin = require('../../models/account-admin.model');
const Order = require('../../models/order.model');
module.exports.dashboard = async (req, res) => {
  const overview = {
    user: 0,
    admin: 0,
    order: 0,
    revenue: 0
  }

  overview.admin = await AccountAdmin.countDocuments({
    deleted: false
  });

  overview.order = await Order.countDocuments({
    deleted: false
  })

  const orderList = await Order.find({
    deleted: false,
    paymentStatus: "paid",
    status: "done"
  })
  overview.revenue = orderList.reduce((total, order) => total + order.total, 0);
  
  res.render('admin/pages/dashboard', {
    pageTitle: 'Trang dashboard',
    overview: overview
  });
}


module.exports.revenueChartPost = async (req, res) => {
  try {
    const { currentMonth, currentYear, prevMonth, prevYear, arrayDay } = req.body;

    // Truy vấn tất cả đơn hàng trong tháng hiện tại
    const ordersCurrentMonth = await Order.find({
      deleted: false,
      paymentStatus: "paid",
      status: "done",
      createdAt: {
        $gte: new Date(currentYear, currentMonth - 1, 1),
        $lt: new Date(currentYear, currentMonth, 1)
      }
    });

    // Truy vấn tất cả đơn hàng trong tháng trước
    const ordersPrevMonth = await Order.find({
      deleted: false,
      paymentStatus: "paid",
      status: "done",
      createdAt: {
        $gte: new Date(prevYear, prevMonth - 1, 1),
        $lt: new Date(prevYear, prevMonth, 1)
      }
    });
    
    // Tạo mảng doanh thu theo từng ngày của tháng hiện tại và tháng trước
    const dataCurrentMonth = [];
    const dataPrevMonth = [];

    for (const day of arrayDay) {
      // Tính doanh thu theo từng ngày của tháng hiện tại
      let revenueCurrent = 0;
      for (const order of ordersCurrentMonth) {
        const orderDate = new Date(order.createdAt).getDate();
        if (orderDate === day) {
          revenueCurrent += order.total;
        }
      }
      dataCurrentMonth.push(revenueCurrent);

      // Tính doanh thu theo từng ngày của tháng trước
      let revenuePrev = 0;
      for (const order of ordersPrevMonth) {
        const orderDate = new Date(order.createdAt).getDate();
        if (orderDate === day) {
          revenuePrev += order.total;
        }
      }
      dataPrevMonth.push(revenuePrev);
    }

    res.json({
      code: "success",
      message: "Thành công!",
      dataCurrentMonth: dataCurrentMonth,
      dataPrevMonth: dataPrevMonth
    });
  } catch (error) {
    console.log(error);
    res.json({
      code: "error",
      message: "Dữ liệu không hợp lệ!"
    })
  }
}