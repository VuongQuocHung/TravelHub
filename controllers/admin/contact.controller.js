const Contact = require("../../models/contact.model");
const AccountAdmin = require("../../models/account-admin.model");
const moment = require("moment");
const slugify = require('slugify');
module.exports.list = async (req, res) => {
  const target = {
    deleted: false
  };

  // Tìm kiếm
  if(req.query.keyword){
    const keyword = slugify(req.query.keyword);
    const regex = new RegExp(keyword, "i");
    target.slug = regex;
  }
  console.log("target tìm kiếm: " + target.slug);
  console.log("keyword tìm kiếm: " + req.query.keyword);
  // Hết Tìm Kiếm

  const contactList = await Contact
    .find(target)
    .sort({ 
      createdAt: "desc"
    });
  console.log("contactList: " + contactList);
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
    switch (option) {
      case "delete":
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
        })
        break;

      case "undo": // khôi phục
        await Contact.updateMany({
          _id: { $in: listId },
          deleted: true // tìm các bản ghi đang ở trong thùng rác
        }, {
          deleted: false // khôi phục lại các bản ghi
        });
        res.json({
          code: "success",
          message: "Khôi phục thông tin liên hệ đã xóa thành công!"
        })
        break;

      default:
        res.json({
          code: "error",
          message: "Dữ liệu không hợp lệ!"
        })
        break;
    }

  } catch (error) {
    res.json({
      code: "error",
      message: "Dữ liệu không hợp lệ!"
    })
  }
}

module.exports.trash = async (req, res) => {
  const target = {
    deleted: true
  };

  const contactList = await Contact
    .find(target)
    .sort({
      deletedAt: "desc"
    })

  for(const item of contactList){
    if(item.createdAt){
      const infoCreater = await AccountAdmin.findOne({
        _id: item.createdBy 
      })
      if(infoCreater){
        item.createByName = infoCreater.fullName
        item.createAtFormat = moment(item.createdAt).format("HH:mm DD/MM/YYYY");
      }
    }

    if(item.deletedBy){
      const infoDeleter = await AccountAdmin.findOne({
        _id: item.deletedBy   
      })
      if(infoDeleter){  
        item.deletedByName = infoDeleter.fullName
        item.deletedAtFormat = moment(item.deletedAt).format("HH:mm DD/MM/YYYY");
      }
    }
  }


  res.render('admin/pages/contact-trash', {
    pageTitle: 'Trang thông tin liên hệ đã xóa',
    contactList: contactList,
  });
}