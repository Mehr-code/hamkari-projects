# 🚀 همکاری پروژه‌ها (Task Manager)

**همکاری پروژه‌ها** یک مدیریت‌کننده تسک (Task Manager) فارسی است که برای تیم‌ها و پروژه‌ها طراحی شده است. با این برنامه می‌توانید تسک‌ها را ایجاد، ویرایش، حذف و مدیریت کنید و وضعیت آن‌ها را با نمودارهای جذاب مشاهده کنید 📊.

---

## ✨ ویژگی‌ها

- 📝 ثبت‌نام و ورود کاربران با قابلیت آپلود عکس پروفایل  
- 🎨 داشبورد جذاب با رابط کاربری فارسی و زیبا  
- ✅ مدیریت تسک‌ها (CRUD)  
- 📊 نمایش وضعیت تسک‌ها با نمودارهای Pie و Bar  
- 🟡 سه حالت وضعیت برای هر تسک:  
  - ⬜ بدون شروع  
  - 🟡 در حال پیشرفت  
  - 🟢 تکمیل شده  
- 📈 گزارش‌گیری از تسک‌ها و کاربران در قالب فایل Excel  
- 👥 نمایش تعداد تسک‌ها و وضعیت آن‌ها برای هر کاربر  
- 📅 پشتیبانی از تاریخ جلالی  
- 🔔 اعلان‌ها و نوتیفیکیشن‌های فارسی و جذاب

---

## 🛠 تکنولوژی‌ها

**Frontend:**  
- React.js ⚛️  
- Vite ⚡  
- TailwindCSS 🎨  
- Recharts 📊  
- React Hot Toast 🔥  
- React Multi Date Picker 📅  
- SweetAlert2 🍬  

**Backend:**  
- Node.js 🟢  
- Express.js 🚂  
- MongoDB 🍃  
- Mongoose 🐍  
- JWT Authentication 🔑  
- Multer برای آپلود فایل 📁  
- ExcelJS برای گزارش‌دهی 📄

---

## ⚡ نصب و راه‌اندازی

1. کلون کردن پروژه:
```bash
git clone https://github.com/Mehr-code/hamkari-projects.git
cd hamkari-projects
```

2. نصب وابستگی‌ها:

```bash
npm install
```

3. ایجاد فایل `.env` در روت فولدر بک‌اند با محتوای زیر:

```env
PORT=8000
MONGO_URL=your-mongo-db-url
JWT_SECRET=your-jwt-secret
ADMIN_INVITE_TOKEN=your-admin-token
```

> نکته: مقدار `MONGO_URL` لینک اتصال به دیتابیس MongoDB، `JWT_SECRET` کلید امنیتی برای توکن JWT و `ADMIN_INVITE_TOKEN` توکن اختصاصی برای ایجاد مدیر است 🔑.

4. اجرای سرور:

```bash
npm run dev
```

سرور روی پورت مشخص‌شده در `.env` اجرا خواهد شد 🖥️.

---

## 📂 ساختار پروژه

```
project-root/
│
├─ backend/
│  ├─ controllers/      # کنترلرهای API
│  ├─ middlewares/      # میدل‌ورها (Auth، Upload)
│  ├─ models/           # مدل‌های MongoDB
│  ├─ routes/           # مسیرهای API
│  └─ server.js         # فایل اصلی سرور
│
├─ frontend/
│  ├─ src/
│  │  ├─ components/    # کامپوننت‌های React
│  │  ├─ pages/         # صفحات
│  │  └─ App.jsx        # فایل اصلی فرانت‌اند
│  └─ package.json
│
└─ README.md
```

---

## 🧩 نحوه استفاده

- با Postman یا فرانت‌اند می‌توانید از APIها استفاده کنید.  
- برای ایجاد یک مدیر (Admin)، در هنگام ثبت‌نام از `ADMIN_INVITE_TOKEN` استفاده کنید 🔑.  
- تسک‌ها و کاربران از طریق داشبورد مدیریت می‌شوند و گزارش‌ها به فرمت Excel قابل دانلود هستند 📄.  
- نمودارها وضعیت الویت‌ها و پیشرفت تسک‌ها را نشان می‌دهند 📊.

---

## 📬 تماس

- ایمیل: [papa.molla8@gmail.com](mailto:papa.molla8@gmail.com) ✉️  
- لینکدین: [Mehran Molakazemi](https://www.linkedin.com/in/mehran-molakazemi/) 💼

---
```
