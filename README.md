
````markdown
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
git clone https://github.com/username/task-manager.git
cd task-manager
````

2. نصب وابستگی‌ها:

```bash
npm install
```

3. ایجاد فایل `.env` در روت فولدر بک‌اند با محتوای زیر:

```
PORT=8000
MONGO_URL= لینکی که شما باید پس از ثبت نام از سایت Mongo DB بگیرید
JWT_SECRET= حاصل اجرای کد زیر
# Enter 'node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"'
ADMIN_INVITE_TOKEN= توکنی که اختیاری شما معلوم میکنین با هرکارکتری و اگر کاربر این توکن رو وارد کند، مدیر میشود
```

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
│  │  └─ App.jsx         # فایل اصلی فرانت‌اند
│  └─ package.json
│
└─ README.md
```

---

## 🧩 نحوه استفاده

* با Postman یا فرانت‌اند می‌توانید از APIها استفاده کنید.
* برای ایجاد یک مدیر (Admin)، در هنگام ثبت‌نام از `ADMIN_INVITE_TOKEN` استفاده کنید 🔑.
* تسک‌ها و کاربران از طریق داشبورد مدیریت می‌شوند و گزارش‌ها به فرمت Excel قابل دانلود هستند 📄.

---

## 📬 تماس

* ایمیل: [papa.molla8@gmail.com](mailto:papa.molla8@gmail.com) ✉️
* لینکدین: [Mehran Molakazemi](https://www.linkedin.com/in/mehran-molakazemi/) 💼

```


```
