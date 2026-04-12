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
  
  for (const item of contactList) {
    item.createdAtFormat = moment(item.createdAt).format("HH:mm - DD/MM/YYYY");
  }

  res.render('admin/pages/contact-list', {
    pageTitle: 'Trang thông tin liên hệ',
    contactList: contactList
  });
}

module.exports.deletePatch = async (req, res) => {
  try {
    const id = req.params.id;

    const contactDetail = await Contact.findOne({
      _id: id,
      deleted: false
    });

    if(!contactDetail) {
      res.json({
        code: "error",
        message: "Thông tin liên hệ không tồn tại!"
      })
      return;
    }
    await Contact.updateOne({
      _id: id
    }, {
      deleted: true,
      deletedBy: req.account.id,
      deletedAt: Date.now()
    })

    res.json({
      code: "success",
      message: "Xóa thông tin liên hệ thành công!"
    });

  } catch (error) {
    res.json({
      code: "error",
      message: "Dữ liệu không hợp lệ!"
    });
  }
}

module.exports.changeMultiPatch = async (req, res) => {
  try {
    const { listId, option } = req.body;
    await Contact.updateMany({
      _id: { $in: listId },
      deleted: false
    }, {
      deleted: true,
      deletedBy: req.account.id,
      deletedAt: Date.now()
    });
    res.json({
      code: "success",
      message: "Đã xóa thông tin liên hệ!"
    });

  } catch (error) {
    res.json({
      code: "error",
      message: "Dữ liệu không hợp lệ!"
    })
  }
}