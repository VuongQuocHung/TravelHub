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
