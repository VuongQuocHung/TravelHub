const { randomNumberString } = require("../../helpers/random.helper");
const Order = require("../../models/order.model");
const Tour = require("../../models/tour.model");
const City = require("../../models/city.model");
const { paymentMethodList, paymentStatusList, orderStatusList } = require("../../configs/variable.config");
const moment = require("moment");
const axios = require('axios').default; 
const CryptoJS = require('crypto-js');

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
    message: "Tạo đơn hàng thành công!",
    orderCode: req.body.code
  })
}

module.exports.success = async (req, res) => {
  const {orderCode, phone} = req.query;
  const orderDetail = await Order.findOne({ 
    code: orderCode, 
    phone: phone,
    deleted: false
  });

  if(!orderDetail) {
    res.redirect("/");
    return;
  }

  // Phương thức thanh toán
  orderDetail.paymentMethodName = paymentMethodList.find(item => item.value === orderDetail.paymentMethod).label;

  // Trạng thái thanh toán
  orderDetail.paymentStatusName = paymentStatusList.find(item => item.value === orderDetail.paymentStatus).label;

  // Trạng thái đơn hàng
  orderDetail.statusName = orderStatusList.find(item => item.value === orderDetail.status).label;

  orderDetail.createdAtFormat = moment(orderDetail.createdAt).format("HH:mm - DD/MM/YYYY");

  for(const tour of orderDetail.toursChecked) {
    tour.departureDateFormatted = moment(tour.departureDate).format("HH:mm DD/MM/YYYY");
    const city = await City.findOne({
      _id: tour.locationFrom
    });
    tour.cityName = city.name;
    const tourInfo = await Tour.findOne({
      _id: tour.tourId,
      deleted: false,
      status: "active"
    });
    if(tourInfo){
      tour.slug = tourInfo.slug;
    }
  }

  res.render("client/pages/order-success", {
    pageTitle: "Đặt tour thành công",
    orderDetail: orderDetail
  });
}

module.exports.paymentZaloPay = async (req, res) => {
  const {orderCode, phone} = req.query;
  const orderDetail = await Order.findOne({ 
    code: orderCode, 
    phone: phone,
    deleted: false,
    paymentMethod: "zalopay",
    paymentStatus: "unpaid"
  });
  if(!orderDetail) {
    res.redirect("/");
    return;
  }
  // APP INFO
  const config = {
    app_id: process.env.ZALOPAY_APP_ID,
    key1: process.env.ZALOPAY_KEY1,
    key2: process.env.ZALOPAY_KEY2,
    endpoint: `${process.env.ZALOPAY_DOMAIN}/v2/create`
  };

  const embed_data = {
    redirecturl: `${process.env.WEBSITE_DOMAIN}/order/success?orderCode=${orderCode}&phone=${phone}`
  };

  const items = [{}];
  const transID = Math.floor(Math.random() * 1000000);
  const order = {
    app_id: config.app_id,
    app_trans_id: `${moment().format('YYMMDD')}_${transID}`, // translation missing: vi.docs.shared.sample_code.comments.app_trans_id
    app_user: `${orderCode} - ${phone}`,
    app_time: Date.now(), // miliseconds
    item: JSON.stringify(items),
    embed_data: JSON.stringify(embed_data),
    amount: orderDetail.total,
    description: `Thanh toán đơn hàng: ${orderCode}`,
    bank_code: "",
    callback_url: `${process.env.WEBSITE_DOMAIN}/order/payment-zalopay-result`
  };

  // appid|app_trans_id|appuser|amount|apptime|embeddata|item
  const data = config.app_id + "|" + order.app_trans_id + "|" + order.app_user + "|" + order.amount + "|" + order.app_time + "|" + order.embed_data + "|" + order.item;
  order.mac = CryptoJS.HmacSHA256(data, config.key1).toString();

  const response = await axios.post(config.endpoint, null, { params: order });
  res.redirect(response.data.order_url);
}

module.exports.paymentZaloPayResultPost = async (req, res) => {
  const config = {
    key2: process.env.ZALOPAY_KEY2
  };
  let result = {};
  try {
    let dataStr = req.body.data;
    let reqMac = req.body.mac;

    let mac = CryptoJS.HmacSHA256(dataStr, config.key2).toString();
    console.log("mac =", mac);

    // kiểm tra callback hợp lệ (đến từ ZaloPay server)
    if (reqMac !== mac) {
      // callback không hợp lệ
      result.return_code = -1;
      result.return_message = "mac not equal";
    }
    else {
      // thanh toán thành công
      // merchant cập nhật trạng thái cho đơn hàng
      let dataJson = JSON.parse(dataStr, config.key2);
      // Cập nhật trạng thái đơn hàng trong CSDL
      const [orderCode, phone] = dataJson.app_user.split(" - ");
      await Order.updateOne({
        code: orderCode,
        phone: phone,
        paymentMethod: "zalopay",
        paymentStatus: "unpaid",
        deleted: false
      }, {
        paymentStatus: "paid",
      });

      result.return_code = 1;
      result.return_message = "success";
    }
    } catch (ex) {
      result.return_code = 0; // ZaloPay server sẽ callback lại (tối đa 3 lần)
      result.return_message = ex.message;
    }
  res.json(result);
}

module.exports.paymentVNPay = async (req, res) => {
  const {orderCode, phone} = req.query;
  const orderDetail = await Order.findOne({ 
    code: orderCode, 
    phone: phone,
    deleted: false,
    paymentMethod: "vnpay",
    paymentStatus: "unpaid"
  });
  if(!orderDetail) {
    res.redirect("/");
    return;
  }
  
  let date = new Date();
  let createDate = moment(date).format('YYYYMMDDHHmmss');
  
  let ipAddr = req.headers['x-forwarded-for'] ||
      req.connection.remoteAddress ||
      req.socket.remoteAddress ||
      req.connection.socket.remoteAddress;

  let config = {
    vnp_TmnCode: process.env.VNPAY_TMN_CODE,
    vnp_HashSecret: process.env.VNPAY_HASH_SECRET,
    vnp_Url: process.env.VNPAY_URL,
    vnp_ReturnUrl: `${process.env.WEBSITE_DOMAIN}/order/payment-vnpay-result`
  };
  
  let tmnCode = config.vnp_TmnCode;
  let secretKey = config.vnp_HashSecret;
  let vnpUrl = config.vnp_Url;
  let returnUrl = config.vnp_ReturnUrl;
  let orderId = `${orderCode}-${phone}-${Date.now()}`; 
  let amount = orderDetail.total;
  let bankCode = "";
  
  let locale = "vn";
  let currCode = 'VND';
  let vnp_Params = {};
  vnp_Params['vnp_Version'] = '2.1.0';
  vnp_Params['vnp_Command'] = 'pay';
  vnp_Params['vnp_TmnCode'] = tmnCode;
  vnp_Params['vnp_Locale'] = locale;
  vnp_Params['vnp_CurrCode'] = currCode;
  vnp_Params['vnp_TxnRef'] = orderId;
  vnp_Params['vnp_OrderInfo'] = 'Thanh toan cho ma GD:' + orderId;
  vnp_Params['vnp_OrderType'] = 'other';
  vnp_Params['vnp_Amount'] = amount * 100;
  vnp_Params['vnp_ReturnUrl'] = returnUrl;
  vnp_Params['vnp_IpAddr'] = ipAddr;
  vnp_Params['vnp_CreateDate'] = createDate;
  if(bankCode !== null && bankCode !== ''){
      vnp_Params['vnp_BankCode'] = bankCode;
  }

  vnp_Params = sortObject(vnp_Params);

  let querystring = require('qs');
  let signData = querystring.stringify(vnp_Params, { encode: false });
  let crypto = require("crypto");     
  let hmac = crypto.createHmac("sha512", secretKey);
  let signed = hmac.update(Buffer.from(signData, 'utf-8')).digest("hex"); 
  vnp_Params['vnp_SecureHash'] = signed;
  vnpUrl += '?' + querystring.stringify(vnp_Params, { encode: false });

  res.redirect(vnpUrl);
}

module.exports.paymentVNPayResult = async (req, res) => {
  console.log("req.query", req.query);
  let vnp_Params = req.query;

  let secureHash = vnp_Params['vnp_SecureHash'];

  delete vnp_Params['vnp_SecureHash'];
  delete vnp_Params['vnp_SecureHashType'];

  vnp_Params = sortObject(vnp_Params);

  let config = {
    vnp_TmnCode: process.env.VNPAY_TMN_CODE,
    vnp_HashSecret: process.env.VNPAY_HASH_SECRET
  };
  let tmnCode = config.vnp_TmnCode;
  let secretKey = config.vnp_HashSecret;

  let querystring = require('qs');
  let signData = querystring.stringify(vnp_Params, { encode: false });
  let crypto = require("crypto");     
  let hmac = crypto.createHmac("sha512", secretKey);
  let signed = hmac.update(Buffer.from(signData, 'utf-8')).digest("hex");     

  if(secureHash === signed){
    const [orderCode, phone] = vnp_Params['vnp_TxnRef'].split("-");
    await Order.updateOne({
      phone: phone,
      code: orderCode,
      paymentMethod: "vnpay",
      paymentStatus: "unpaid",
      deleted: false
    }, {
      paymentStatus: "paid"
    });
    res.redirect(`${process.env.WEBSITE_DOMAIN}/order/success?orderCode=${orderCode}&phone=${phone}`);
  } else{
    res.redirect(`/`);
  }
}

function sortObject(obj) {
	let sorted = {};
	let str = [];
	let key;
	for (key in obj){
		if (Object.prototype.hasOwnProperty.call(obj, key)) {
		  str.push(encodeURIComponent(key));
		}
	}
	str.sort();
  for (key = 0; key < str.length; key++) {
      sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
  }
  return sorted;
}