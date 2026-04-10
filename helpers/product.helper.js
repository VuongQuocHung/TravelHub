const moment = require("moment");
module.exports.formatProduct = (item) => {
  item.departureDateFormat = moment(item.departureDate).format("DD/MM/YYYY");
  item.discountAdult = item.priceAdult > 0 ?  
  Math.ceil((item.priceAdult - item.priceNewAdult) / item.priceAdult * 100) : 0;
}