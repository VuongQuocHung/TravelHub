const SettingWebsiteInfo = require("../../models/setting-website-info.model");
const Role = require("../../models/role.model");
const { permissionsList } = require("../../configs/variable.config");
const slugify = require('slugify');
const bcrypt = require("bcryptjs");
const AccountAdmin = require("../../models/account-admin.model");

module.exports.list = (req, res) => {
  res.render('admin/pages/setting-list', {
    pageTitle: 'Trang cài đặt chung',
  });
}

module.exports.websiteInfo = async (req, res) => {
  const websiteInfo = await SettingWebsiteInfo.findOne();

  res.render('admin/pages/setting-website-info', {
    pageTitle: 'Trang thông tin website',
    websiteInfo: websiteInfo
  });
}

module.exports.websiteInfoPatch = async (req, res) => {
  console.log(req.body);
  console.log(req.files);

  if(req.files.logo){ // logo ở đây là 1 mảng các đối tượng
    req.body.logo = req.files.logo[0].path;
  } else {
    delete req.body.logo;
  }

  if(req.files.favicon){ // favicon ở đây là 1 mảng các đối tượng
    req.body.favicon = req.files.favicon[0].path;
  } else {
    delete req.body.favicon;
  }

  await SettingWebsiteInfo.findOneAndUpdate({}, req.body, {
    upsert: true // phải thêm cái này để khi chưa có bản ghi nào trong collection setting-website-infos ở db thì nó sẽ tự tạo mới, nếu không có thì nó sẽ không làm gì cả vì không tìm thấy document nào để update cả
  });

  res.json({
    code: "success",
    message: "Cập nhật website thành công"
  })

}

module.exports.accountAdminList = async (req, res) => {
  const accountAdminList = await AccountAdmin.find({
    deleted: false
  }).sort({
    createdAt: "desc"
  })

  for(const accountAdmin of accountAdminList){
    if(accountAdmin.role){
      const role = await Role.findOne({
        _id: accountAdmin.role
      });

      if(role){
        accountAdmin.roleName = role.name;
      }
    }
  }

  res.render('admin/pages/setting-account-admin-list', {
    pageTitle: 'Trang tài khoản quản trị',
    accountAdminList: accountAdminList
  });
}

module.exports.accountAdminCreate = async (req, res) => {
  const roleList = await Role.find({
    deleted: false
  });
  
  res.render('admin/pages/setting-account-admin-create', {
    pageTitle: 'Trang tạo mới tài khoản quản trị',
    roleList: roleList
  });
}

module.exports.accountAdminEdit = async (req, res) => {
  try {
    const id = req.params.id;

    // kiểm tra có tồn tại tài khoản admin với id và chưa bị xóa hay không
    const accountAdmin = await AccountAdmin.findOne({
      _id: id,
      deleted: false
    });

    // nếu ko có thì trở về trang danh sách tài khoản admin
    if(!accountAdmin){
      res.redirect('/admin/setting/account-admin/list');
    }

    // lấy danh sách role để hiển thị ở dropdown chọn role khi chỉnh sửa tài khoản admin
    const roleList = await Role.find({
      deleted: false
    });

    res.render('admin/pages/setting-account-admin-edit', {
      pageTitle: 'Trang chỉnh sửa tài khoản quản trị',
      accountAdmin: accountAdmin,
      roleList: roleList
    });

  } catch (error) {
    console.log(error);
    res.redirect('/admin/setting/account-admin/list');
  }
}

module.exports.accountAdminEditPatch = async (req, res) => {
  try {
    const id = req.params.id;
    console.log(id);
    const accountAdminDetail = await AccountAdmin.findOne({
      _id: id,
      deleted: false
    });
    // console.log(accountAdminDetail);

    if(!accountAdminDetail){
      res.json({
        code: "error",
        message: "Tài khoản quản trị không tồn tại"
      })
      return;
    }

    // Kiểm tra email đã tồn tại chưa 
    const exsitEmail = await AccountAdmin.findOne({
      email: req.body.email,
      _id: { $ne: req.account.id} // $ne - not equal là toán tử "không bằng"
    });
    console.log(req.account.id);

    if(exsitEmail){
      return res.json({
        code: "error",
        message: "Email đã tồn tại"
      }); 
    }

    req.body.avatar = req.file ? req.file.path : accountAdminDetail.avatar; // Nếu có file mới được tải lên thì cập nhật avatar, nếu không thì giữ nguyên avatar cũ

    req.body.updateBy = req.account.id;
    await AccountAdmin.updateOne({
      _id: id
    }, req.body);

    res.json({
      code: "success",
      message: "Cập nhật thành công"
    }) 
  } catch (error) {
    console.log(error);
    res.json({
      code: "error",
      message: "Cập nhật tài khoản quản trị thất bại"
    })
  }
}


module.exports.accountAdminCreatePost = async (req, res) => {
  try {
    console.log(req.body);

    const existingAccount = await AccountAdmin.findOne({
      email: req.body.email
    });

    if(existingAccount){
      return res.json({
        code: "error",
        message: "Email đã tồn tại"
      }); 
    }

    const salt = await bcrypt.genSalt(10); //  Tạo salt - Chuỗi ngẫu nhiên có 10 ký tự
    req.body.password = await bcrypt.hash(req.body.password, salt); // Mã hóa mật khẩu với salt

    req.body.avatar = req.file ? req.file.path : ""; // Lưu đường dẫn ảnh vào trường avatar, nếu không có file nào được tải lên thì để trống
    req.body.createdBy = req.account.id; // Lưu ID người tạo vào trường createdBy

    const newRecord = new AccountAdmin(req.body);
    await newRecord.save();
    res.json({
      code: "success",
      message: "Tạo tài khoản quản trị thành công"
    });

  } catch (error) {
    console.log(error);
    res.json({
      code: "error",
      message: "Tạo tài khoản quản trị thất bại"
    }) 
  }
}

module.exports.roleList = async (req, res) => {
  const target = {
    deleted: false
  };

  if(req.query.keyword){
    const keyword = slugify(req.query.keyword);
    const regex = new RegExp(keyword, "i");
    target.slug = regex;
  }

  const roleList = await Role
    .find(target)
    .sort({
      createdAt: "desc"
    });

  res.render('admin/pages/setting-role-list', {
    pageTitle: 'Trang nhóm quyền',
    roleList: roleList
  });
}

module.exports.roleCreate = async (req, res) => {
  res.render('admin/pages/setting-role-create', {
    pageTitle: 'Trang tạo nhóm quyền',
    permissionsList: permissionsList,
  });
}

module.exports.roleCreatePost = async (req, res) => {
  try {
    req.body.createBy = req.account.id;

    const newRecord = new Role(req.body);
    await newRecord.save();
    res.json({
      code: "success",
      message: "Tạo nhóm quyền thành công"
    }) 
  } catch (error) {
    console.log(error);
    res.json({
      code: "error",
      message: "Tạo nhóm quyền thất bại"
    }) 
  }
}

module.exports.roleEdit = async (req, res) => {
  try {
    const id = req.params.id;
    
    const roleDetail = await Role.findOne({
      _id: id,
      deleted: false
    });

    if(!roleDetail){
      res.redirect('/admin/setting/role/list');
    }

    console.log(roleDetail.permissions);
    console.log(permissionsList);

    res.render('admin/pages/setting-role-edit', {
      pageTitle: 'Trang chỉnh sửa nhóm quyền',
      permissionsList: permissionsList,
      roleDetail: roleDetail
    });

  } catch (error) {
    console.log(error);
  }
}

module.exports.roleEditPatch = async (req, res) => {
  try {
    const id = req.params.id;
    console.log(id);
    const roleDetail = await Role.findOne({
      _id: id,
      deleted: false
    });
    console.log(roleDetail);
    if(!id){  
      return res.json({
      code: "error",
      message: "Thiếu ID"
    });
}

    if(!roleDetail){
      res.json({
        code: "error",
        message: "Nhóm quyền không tồn tại"
      })
      return;
    }

    req.body.updateBy = req.account.id;
    await Role.updateOne({
      _id: id
    }, req.body);

    res.json({
      code: "success",
      message: "Cập nhật nhóm quyền thành công"
    }) 
  } catch (error) {
    console.log(error);
    res.json({
      code: "error",
      message: "Cập nhật nhóm quyền thất bại"
    })
  }
}

module.exports.roleDeletePatch = async (req, res) => {
  try {
    const id = req.params.id;

    const roleDetail = await Role.findOne({
      _id: id,
      deleted: false
    });

    if(!roleDetail){
      res.json({
        code: "error",
        message: "Nhóm quyền không tồn tại"
      })
      return;
    }
    
    await Role.updateOne({
      _id: id
    }, {
      deleted: true,
      deletedBy: req.account.id,
      deletedAt: Date.now()
     });

    res.json({
      code: "success",
      message: "Xóa nhóm quyền thành công"
    }) ;
  } catch (error) {
    console.log(error);
    res.json({
      code: "error",
      message: "Xóa nhóm quyền thất bại"
    }) ;
  }
}

module.exports.roleDeleteEternal = async (req, res) => {
  try {
    const id = req.params.id;

    const roleDetail = await Role.findOne({
      _id: id,
      deleted: true
    });

    if(!roleDetail){
      res.json({
        code: "error",
        message: "Nhóm quyền không tồn tại"
      })
      return;
    }
    
    await Role.deleteOne({
      _id: id
    })

    res.json({
      code: "success",
      message: "Xóa vĩnh viễn role thành công"
    }) ;
  } catch (error) {
    console.log(error);
    res.json({
      code: "error",
      message: "Xóa nhóm quyền thất bại"
    }) ;
  }
}

module.exports.roleTrash = async (req, res) => {
  const roleList = await Role
    .find({
      deleted: true
    })
    .sort({
      createdAt: "desc"
    });

  res.render('admin/pages/setting-role-trash', {
    pageTitle: 'Trang nhóm quyền đã xóa',
    roleList: roleList
  });
}

module.exports.roleUndoPatch = async (req, res) => {
  try {
    const id = req.params.id;
    console.log(id);
    const roleDetail = await Role.findOne({
      _id: id,
      deleted: true
    });

    if(!roleDetail){
      res.json({
        code: "error",
        message: "Nhóm quyền không tồn tại"
      })
      return;
    }
    console.log(roleDetail);

    await Role.updateOne({
      _id: id
    }, {
      deleted: false,
    });

    res.json({
      code: "success",
      message: "Khôi phục nhóm quyền thành công"
    }) 
  } catch (error) {
    console.log(error);
    res.json({
      code: "error",
      message: "Cập nhật nhóm quyền thất bại"
    })
  }
}

module.exports.roleChangeMultiPatch = async (req, res) => {
  try {
    const { listId, option } = req.body;
    console.log(listId);
    console.log(option);
    switch (option) {
      case "delete":
        await Role.updateMany({
          _id: { $in: listId},
          deleted: false
        }, {
          deleted: true,
          deletedBy: req.account.id,
          deletedAt: Date.now()
        });
        res.json({
          code: "success",
          message: "Xóa nhóm quyền thành công"
        }) 
        break;

      case "undo":
        await Role.updateMany({
          _id: { $in: listId},
          deleted: true
        }, {
          deleted: false
        });
        res.json({
          code: "success",
          message: "Khôi phục nhóm quyền thành công"
        }) 
        break;

      case "delete-eternal":
        await Role.deleteMany({
          _id: { $in: listId},
          deleted: true
        });
        res.json({
          code: "success",
          message: "Xóa vĩnh viễn nhóm quyền thành công"
        }) 
        break;
        
      default:
        res.json({
          code: "error",
          message: "Không có tùy chọn nào được chọn"
        }) 
        break;
    }

  } catch (error) {
    console.log(error);
    res.json({
      code: "error",
      message: "Thay đổi nhóm quyền thất bại"
    })
  }
}