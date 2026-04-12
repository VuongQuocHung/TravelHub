const Contact = require("../../models/contact.model");
const moment = require("moment");

module.exports.list = async (req, res) => {
  const contactList = await Contact
    .find({
      deleted: "false"
    })
    .sort({ 
      createdAt: "desc"
    });
  console.log("contact email : ", contactList);
  
  for (const item of contactList) {
    item.createdAtFormat = moment(item.createdAt).format("HH:mm - DD/MM/YYYY");
  }

  console.log("contact email : ", contactList);

  res.render('admin/pages/contact-list', {
    pageTitle: 'Trang thông tin liên hệ',
    contactList: contactList
  });
}
