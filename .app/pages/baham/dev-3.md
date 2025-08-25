baham/
├── provider/
│   ├── index.vue                   // پیشخوان ارائه‌دهنده - نمودار فروش و بارها
│   ├── loads/
│   │   ├── index.vue               // مدیریت بارها - لیست بارهای فعال، تکمیل شده، منقضی
│   │   ├── new.vue                 // ثبت بار جدید - فرم چند مرحله‌ای
│   │   └── [id].vue                // ویرایش بار - مشاهده جزئیات
│   ├── requests/
│   │   ├── index.vue               // مدیریت درخواست‌ها - لیست درخواست‌های خرید
│   │   └── [id].vue                // جزئیات درخواست - تایید یا رد
│   ├── inventory.vue               // مدیریت موجودی - overview
│   ├── reports.vue                 // گزارشات مالی - صورت‌حساب و تسویه حساب
│   └── settings.vue                // پروفایل کسب‌وکار و تنظیمات

import { Load } from './buyer';

export interface ProviderLoad extends Load {
  requests: LoadRequest[];
  totalSales: number;
}

export interface LoadRequest {
  id: string;
  orderId: string;
  buyerName: string;
  quantityKg: number;
  requestedAt: Date;
  status: 'pending' | 'approved' | 'rejected';
}

export interface FinancialReport {
  period: string;
  totalSales: number;
  totalCommission: number;
  netIncome: number;
}

توضیحات:

صفحه loads/new.vue باید یک فرم چند مرحله‌ای برای ثبت بار جدید باشد.

صفحه requests/index.vue باید امکان تأیید یا رد درخواست‌ها را فراهم کند.

صفحه reports.vue باید گزارشات مالی را نمایش دهد.

از کامپوننت‌های Tairo برای فرم‌های چند مرحله‌ای و tables استفاده شود.

داده‌ها initially با ماک پر شوند.

