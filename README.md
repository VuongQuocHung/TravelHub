# Project-1 (Backend)

Repository: https://gitlab.com/qhung8a-group/project-1-be-t12-2025

## Tổng quan
Backend của một website bán tour du lịch được xây dựng bằng Node.js + Express theo kiến trúc MVC. Ứng dụng gồm hai phần: client-facing (hiển thị danh sách/chi tiết tour, giỏ hàng, form liên hệ) và admin panel (CRUD tour, category, account, order, setting, dashboard).

## Công nghệ chính
- Node.js, Express
- MongoDB, Mongoose
- Pug (server-side templates)
- Passport (passport-local, passport-google-oauth20)
- Multer + Cloudinary (upload ảnh)
- Joi (validate dữ liệu)
- bcryptjs (hash mật khẩu)
- Nodemailer (gửi email: OTP, reset password)
- dotenv, cookie-parser, nodemon

## Yêu cầu trước khi chạy
- Node.js 18+
- MongoDB (URL truy cập qua biến môi trường)
- Cloudinary account (API keys)

## Biến môi trường 
- DATABASE = 
- JWT_SECRET=
- EMAIL_USER= 
- EMAIL_PASS= 
- CLOUD_NAME=
- CLOUD_KEY= 
- CLOUD_SECRET= 
- GOOGLE_CLIENT_ID=
- GOOGLE_CLIENT_SECRET=
- GOOGLE_CALLBACK_URL=

## Cài đặt và chạy
1. Cài dependencies:

Bạn có thể dùng `npm` hoặc `yarn`:

- Với `npm`:

```bash
npm install
```

- Với `yarn`:

```bash
yarn
```

2. Tạo file `.env` theo các biến môi trường ở trên.

3. Chạy ứng dụng (phát triển):

```bash
npm run start
```

Hoặc với `yarn`:

```bash
yarn start
```

Server mặc định lắng nghe ở cổng 3000 (cấu hình trong `index.js`).

## Cấu trúc thư mục chính
- `controllers/` — business logic (admin, client)
- `routes/` — định tuyến
- `models/` — Mongoose schemas
- `views/` — Pug templates (admin, client)
- `public/` — static assets
- `middlewares/` — auth, setting, permission
- `helpers/` — mail, cloudinary, utils

## Hướng dẫn hiển thị dữ liệu từ backend ra frontend
Ứng dụng hiện hỗ trợ hai cách phổ biến để hiển thị dữ liệu:

1) Server-side rendering (Pug)
- Controller lấy dữ liệu từ database và gọi `res.render('tên_view', { data })`.
- Hoặc sử dụng middleware (ví dụ `setting.middleware.js`) để gắn dữ liệu chung vào `res.locals`:
  - Middleware mẫu:

```js
const SettingWebsiteInfo = require('../models/setting-website-info.model');
module.exports.websiteInfo = async (req, res, next) => {
  const settingWebsiteInfo = await SettingWebsiteInfo.findOne();
  res.locals.settingWebsiteInfo = settingWebsiteInfo;
  next();
}
```

- Trong controller khi render template, dữ liệu có thể được dùng trực tiếp trong Pug (ví dụ `res.render('home', { tours })`), hoặc thông qua `res.locals` nếu middleware đã gắn sẵn.

2) Client-side fetching (AJAX / Fetch)
- Tạo REST API endpoint trong `routes/` (ví dụ `/api/tours`) trả JSON từ controller:

```js

const tours = await Tour.find(...);
res.json({ success: true, data: tours });
```


## Các endpoint chính (tổng quan)
- Client: `/`, `/tours`, `/tours/:slug`, `/cart`, `/contact`...
- Admin: `/{adminPath}/dashboard`, `/{adminPath}/tour`, `/{adminPath}/category`, `/{adminPath}/order`, `/{adminPath}/account`...

(Chi tiết endpoint có trong `routes/`)

## Những phần đang in progress 
- Hoàn thiện hiển thị một số dữ liệu backend ra frontend (một vài route chưa render đầy đủ dữ liệu).
- Chưa tích hợp thanh toán (payment gateway).
- Thiếu unit/integration tests và CI/CD.
- Deployment (Docker/hosting) đang thực hiện.
