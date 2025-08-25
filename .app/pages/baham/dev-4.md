baham/
├── index.vue                       // صفحه اصلی - لندینگ صفحه
├── about.vue                       // درباره ما
├── contact.vue                     // تماس با ما
├── faq.vue                         // سوالات متداول
├── auth/
│   ├── login.vue                   // صفحه ورود - فرم login
│   └── register.vue                // صفحه ثبت‌نام - فرم register با انتخاب نقش
├── admin/
│   ├── index.vue                   // پیشخوان ادمین - آمار کلیدی
│   ├── users/
│   │   ├── index.vue               // مدیریت کاربران - لیست کاربران با فیلتر
│   │   └── [id].vue                // جزئیات کاربر - تایید هویت و مسدودی
│   ├── loads.vue                   // مدیریت بارهای جهانی - مشاهده و حذف
│   ├── orders.vue                  // مدیریت سفارشات جهانی - رصد تراکنش‌ها
│   ├── financial.vue               // مدیریت مالی - تنظیم کارمزد و تسویه حساب
│   ├── tickets.vue                 // مدیریت تیکت‌های پشتیبانی
│   ├── content/
│   │   ├── index.vue               // مدیریت محتوا - صفحات about, contact, faq
│   │   └── edit.vue                // ویرایش محتوا
│   └── settings.vue                // تنظیمات سیستم - کلیات پلتفرم

// types/admin.ts
export interface User {
  id: string;
  nationalCode: string;
  phoneNumber: string;
  email: string;
  role: 'buyer' | 'distributor' | 'provider' | 'admin';
  isVerified: boolean;
  createdAt: Date;
}

export interface AdminUser extends User {
  orderCount: number;
  lastActivity: Date;
}

export interface SystemFinancial {
  totalCommission: number;
  pendingSettlements: number;
  completedSettlements: number;
}

// types/auth.ts
export interface LoginForm {
  phoneNumber: string;
  password: string;
}

export interface RegisterForm {
  phoneNumber: string;
  email: string;
  password: string;
  role: 'buyer' | 'distributor' | 'provider';
  companyName?: string; // for distributor/provider
  businessLicenseNumber?: string; // for distributor/provider
}

توضیحات:

صفحه register.vue باید بر اساس نقش انتخاب شده، فیلدهای اضافه (مثل آپلود مدارک) را نشان دهد.

صفحات ادمین باید امکان جستجو، فیلتر و ویرایش را داشته باشند.

از کامپوننت‌های Tairo برای tables و فرم‌ها استفاده شود.

داده‌ها initially با ماک پر شوند.

