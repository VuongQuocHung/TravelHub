const uploadMiddleware = require("../../middlewares/admin/upload.middleware");

const router = require('express').Router();

const settingController =  require("../../controllers/admin/setting.controller");
const { checkPer, checkPerByOption } = require("../../middlewares/admin/permission.middleware");

// user-* được giữ làm quyền tương thích cho các role quản trị cũ.
router.get(
  '/list',
  checkPer(["setting-view", "account-admin-view", "role-view", "user-view"]),
  settingController.list
);

router.get('/website-info', checkPer(["setting-view"]), settingController.websiteInfo);

router.patch(
  '/website-info', 
  checkPer(["setting-edit"]),
  uploadMiddleware.imageFields([
    {
      name: "logo",
      maxCount: 1
    },
    {
      name: "favicon",
      maxCount: 1
    },
  ]), 
  settingController.websiteInfoPatch
);

router.get('/website-info-home', checkPer(["setting-view"]), settingController.websiteInfoHome);

router.patch(
  '/website-info-home', 
  checkPer(["setting-edit"]),
  uploadMiddleware.noFile(),
  settingController.websiteInfoHomePatch
);

router.get(
  '/account-admin/list',
  checkPer(["account-admin-view", "user-view"]),
  settingController.accountAdminList
);

router.get(
  '/account-admin/create',
  checkPer(["account-admin-create", "user-create"]),
  settingController.accountAdminCreate
);

router.post(
  '/account-admin/create',
  checkPer(["account-admin-create", "user-create"]),
  uploadMiddleware.singleImage('avatar'),
  settingController.accountAdminCreatePost
);

router.get(
  '/account-admin/edit/:id',
  checkPer(["account-admin-edit", "user-edit"]),
  settingController.accountAdminEdit
);

router.patch(
  '/account-admin/edit/:id',
  checkPer(["account-admin-edit", "user-edit"]),
  uploadMiddleware.singleImage('avatar'),
  settingController.accountAdminEditPatch
);

router.get(
  '/account-admin/edit-password/:id',
  checkPer(["account-admin-edit", "user-edit"]),
  settingController.accountAdminEditPassword
);

router.patch(
  '/account-admin/edit-password/:id',
  checkPer(["account-admin-edit", "user-edit"]),
  uploadMiddleware.noFile(),
  settingController.accountAdminEditPasswordPatch
);

router.get('/role/list', checkPer(["role-view", "user-view"]), settingController.roleList);

router.get('/role/create', checkPer(["role-create", "user-create"]), settingController.roleCreate);

router.post('/role/create', checkPer(["role-create", "user-create"]), settingController.roleCreatePost);

router.get('/role/edit/:id', checkPer(["role-edit", "user-edit"]), settingController.roleEdit);

router.patch('/role/edit/:id', checkPer(["role-edit", "user-edit"]), settingController.roleEditPatch);

router.patch('/role/delete/:id', checkPer(["role-delete", "user-delete"]), settingController.roleDeletePatch);

router.get('/role/trash/', checkPer(["role-trash", "user-trash"]), settingController.roleTrash);

router.patch('/role/undo/:id', checkPer(["role-trash", "user-trash"]), settingController.roleUndoPatch);

router.patch(
  '/role/delete-eternal/:id',
  checkPer(["role-trash", "user-trash"]),
  settingController.roleDeleteEternal
);

router.patch(
  '/role/change-multi/',
  checkPerByOption({
    delete: ["role-delete", "user-delete"],
    undo: ["role-trash", "user-trash"],
    "delete-eternal": ["role-trash", "user-trash"]
  }),
  settingController.roleChangeMultiPatch
);

module.exports = router;  
