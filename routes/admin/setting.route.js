const multer  = require('multer')
const cloudinaryHelper = require("../../helpers/cloudinary.helper")
const upload = multer({ storage: cloudinaryHelper.storage });

const router = require('express').Router();

const settingController =  require("../../controllers/admin/setting.controller");

router.get('/list', settingController.list);

router.get('/website-info', settingController.websiteInfo);

router.patch(
  '/website-info', 
  upload.fields([
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

router.get('/website-info-home', settingController.websiteInfoHome);

router.patch(
  '/website-info-home', 
  upload.none(), 
  settingController.websiteInfoHomePatch
);

router.get('/account-admin/list', settingController.accountAdminList);

router.get('/account-admin/create', settingController.accountAdminCreate);

router.post('/account-admin/create', upload.single('avatar'), settingController.accountAdminCreatePost);

router.get('/account-admin/edit/:id', settingController.accountAdminEdit);

router.patch('/account-admin/edit/:id', upload.single('avatar'), settingController.accountAdminEditPatch);

router.get('/account-admin/edit-password/:id', settingController.accountAdminEditPassword);

router.patch('/account-admin/edit-password/:id', upload.none(), settingController.accountAdminEditPasswordPatch);

router.get('/role/list', settingController.roleList);

router.get('/role/create', settingController.roleCreate);

router.post('/role/create', settingController.roleCreatePost);

router.get('/role/edit/:id', settingController.roleEdit);

router.patch('/role/edit/:id', settingController.roleEditPatch);

router.patch('/role/delete/:id', settingController.roleDeletePatch);

router.get('/role/trash/', settingController.roleTrash);

router.patch('/role/undo/:id', settingController.roleUndoPatch);

router.patch('/role/delete-eternal/:id', settingController.roleDeleteEternal);

router.patch('/role/change-multi/', settingController.roleChangeMultiPatch);

module.exports = router;  
