# راهنمای راه‌اندازی سیستم پرداخت درگاه‌نو

## ✅ کارهای انجام شده

1. **Composable درگاه‌نو** - کاملاً پیاده‌سازی شده در `.app/composables/dargah.ts`
2. **Composable مدیریت پرداخت** - موجود در `.app/composables/payment.ts`
3. **صفحه callback** - در `.app/pages/onboarding/payment-callback.vue`
4. **فانکشن پرداخت** - اضافه شده به صفحه onboarding
5. **API تایید پرداخت** - اضافه شده به `main.pb.js`
6. **Linter errors** - برطرف شده

## 🔧 کارهای باقی‌مانده

### 1. پیکربندی اطلاعات درگاه‌نو

**باید این کارها را انجام دهید:**
1. **ثبت‌نام در درگاه‌نو:** https://dargahno.net
2. **دریافت اطلاعات حساب:** username, password, merchant_id
3. **تنظیم در فایل `.app/.env`:**
   ```env
   DARGAH_USERNAME=your_username
   DARGAH_PASSWORD=your_password  
   DARGAH_MERCHANT_ID=your_merchant_id
   ```
4. **اضافه کردن کارت و خرید بسته** (طبق مستندات درگاه‌نو)

### 2. ایجاد collection های مورد نیاز در PocketBase

در PocketBase باید این collection ها موجود باشند:

#### Collection: `payments`
```javascript
{
  id: "string",
  user: "relation(users)",
  session: "relation(sessions)", // اختیاری
  alternativeDeed: "string", // اختیاری
  discountCopoun: "relation(discountCopoun)", // اختیاری
  description: "text",
  amount: "number",
  transactionId: "string", // authority از درگاه
  status: "select(success,pending,failed,refunded,cancelled)",
  created: "date",
  updated: "date"
}
```

#### Collection: `charge` (به نظر موجود است)
```javascript
{
  user: "relation(users)",
  totalCharge: "number",
  used: "number",
  duration: "number", // بر حسب دقیقه
  isDone: "bool",
  isOutdated: "bool"
}
```

### 3. به‌روزرسانی schema کاربران

در collection `users` این فیلدها باید موجود باشد:
- `hasCharge: boolean`
- `expireChargeTime: datetime`
- `startChargeTime: datetime`
- `phoneNumber: string`
- `firstName: string`
- `email: string`

### 4. تنظیمات امنیتی و Environment Variables

یک فایل `.env` در دایرکتوری `.app` ایجاد کنید:
```env
# Application URL
PUBLIC_APP_URL=http://localhost:4000

# OpenRouter API Key (for AI features)
OPENROUTER_API_KEY=your_openrouter_api_key_here

# Dargah Payment Gateway Configuration
DARGAH_USERNAME=your_dargah_username_here
DARGAH_PASSWORD=your_dargah_password_here
DARGAH_MERCHANT_ID=your_dargah_merchant_id_here
DARGAH_BASE_URL=https://dargahno.net

# For production use:
# DARGAH_BASE_URL=https://dargahno.net
# For sandbox/testing use:  
# DARGAH_BASE_URL=https://sandbox.dargahno.net
```

**📍 مسیر فایل:** `.app/.env` (نه در ریشه پروژه)

**⚠️ نکات امنیتی مهم:**
1. هرگز فایل `.env` را در git commit نکنید
2. اطلاعات لاگین در `public` runtime config قرار دارند (برای سادگی توسعه)
3. **در production:** این اطلاعات را به backend منتقل کنید
4. **بهتر است:** authentication در سمت server انجام شود نه client

## 🚀 نحوه استفاده

### 1. شروع پرداخت
```javascript
const { startPayment } = // از صفحه onboarding
await startPayment()
```

### 2. بررسی وضعیت پرداخت
```javascript
const { getPayments } = usePayment()
const userPayments = await getPayments()
```

### 3. تایید پرداخت (backend)
```javascript
// API endpoint: POST /verifyPayment
{
  "authority": "transaction_authority_from_gateway"
}
```

## 📝 نکات مهم

1. **Testing**: ابتدا در حالت sandbox درگاه‌نو تست کنید
2. **Security**: هرگز merchant ID را در frontend قرار ندهید
3. **Timeout**: درگاه‌نو timeout مشخصی دارد، کاربر را آگاه کنید
4. **Error Handling**: برای تمام حالات خطا پیام مناسب نمایش دهید

## 🔍 Debug و عیب‌یابی

### لاگ‌ها
- Console browser برای خطاهای frontend
- PocketBase logs برای خطاهای backend
- درگاه‌نو dashboard برای وضعیت تراکنش‌ها

### مشکلات رایج
- **Merchant ID اشتباه**: تراکنش register نمی‌شود
- **Callback URL اشتباه**: بازگشت از درگاه کار نمی‌کند
- **Collection ناموجود**: خطا در ذخیره پرداخت

## 🧪 تست سیستم

### قبل از راه‌اندازی:
1. ✅ Environment variables را تنظیم کنید
2. ✅ Collection های PocketBase را ایجاد کنید  
3. ✅ اطلاعات لاگین درگاه‌نو را دریافت کنید

### 🔍 مراحل عیب‌یابی:

#### 1. **بررسی Environment Variables:**
   ```bash
   # مسیر: http://localhost:4000/debug-env
   ```
   - همه متغیرها باید مقدار داشته باشند
   - `dargahUsername` و `dargahPassword` نباید خالی باشند

#### 2. **تست Login مستقل:**
   ```bash
   # مسیر: http://localhost:4000/test-dargah
   ```
   - تست مستقل login به درگاه‌نو
   - مشاهده console برای debugging 
   - انواع field names را تست می‌کند

#### 3. **تست فرآیند کامل پرداخت:**
   ```bash
   # مسیر: http://localhost:4000/onboarding
   ```
   - تست integration کامل
   - پیگیری console browser
   - بررسی نتایج

### مراحل تست:
1. **تست محیط توسعه:**
   ```bash
   pnpm dev
   ```

2. **دیباگ مرحله‌ای:**
   - 🔍 `/debug-env` - بررسی متغیرها
   - 🧪 `/test-dargah` - تست login
   - 💳 `/onboarding` - تست کامل

3. **بررسی نتایج:**
   - Console browser (F12)
   - Network tab برای API calls
   - PocketBase Admin Panel برای records

## 📞 پشتیبانی

- مستندات درگاه‌نو: https://dargahno.net/docs
- API Reference: در پنل درگاه‌نو موجود است
- Google Docs راهنما: https://docs.google.com/document/d/1wFjdqpRBZdT7Irif3IKqVH2_So6v_qTtrDkxjPKX-hs/edit

## ✨ خلاصه تغییرات

### Frontend:
- ✅ اضافه شده: فانکشن `startPayment()` در onboarding
- ✅ بهبود شده: error handling و user feedback
- ✅ اضافه شده: localStorage management برای callback
- ✅ برطرف شده: تمام linter errors
- ✅ بهبود شده: composable درگاه‌نو با authentication
- ✅ اضافه شده: login flow قبل از register transaction

### Backend:
- ✅ اضافه شده: API `/verifyPayment` در main.pb.js
- ✅ بهبود شده: payment record handling
- ✅ اضافه شده: user subscription management

### Configuration:
- ✅ اضافه شده: runtime config برای Nuxt
- ✅ مستندسازی: environment variables
- ✅ بهبود شده: error messages فارسی

## ❗ مشکلات معمول و راه‌حل

### 🔑 خطای 401 "Not authenticated":
- **علت:** عدم لاگین موفق به درگاه‌نو
- **راه‌حل:** بررسی صحت username/password در `.env`

### 📝 خطای 422 "Unprocessable Entity" یا "Field required":
- **علت:** فیلدهای مورد نیاز پر نشده یا API فرمت متفاوتی انتظار دارد
- **راه‌حل:** استفاده از `/test-dargah` برای تست انواع field names
- **جزئیات:** سیستم خودکار field names مختلف را تست می‌کند:
  - `username/password`
  - `email/password` 
  - `phone/password`
  - `mobile/password`

### 🌐 خطاهای شبکه:
- **علت:** عدم دسترسی به API درگاه‌نو
- **راه‌حل:** بررسی اتصال اینترنت و firewall

### 🔧 مراحل دیباگ پیشنهادی:
1. **ابتدا:** `/debug-env` - بررسی environment variables
2. **سپس:** `/test-dargah` - تست login مستقل  
3. **در نهایت:** `/onboarding` - تست integration کامل
4. **همواره:** Console browser (F12) برای مشاهده خطاها 