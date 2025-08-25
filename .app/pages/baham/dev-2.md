baham/
├── distributor/
│   ├── index.vue                   // پیشخوان توزیع‌کننده - آمار و نقشه منطقه
│   ├── orders/
│   │   ├── index.vue               // مدیریت سفارشات - لیست سفارشات جدید و همه
│   │   └── [id].vue                // جزئیات سفارش - امکان تغییر وضعیت
│   ├── coordination.vue            // هماهنگی با ارائه‌دهندگان - لیست بارهای اختصاص یافته
│   ├── area.vue                    // مدیریت منطقه - تعریف محدوده روی نقشه
│   ├── reports.vue                 // گزارشات مالی - کارمزدها و تسویه حساب
│   ├── profile/
│   │   ├── index.vue               // پروفایل کسب‌وکار - نمایش به خریداران
│   │   └── edit.vue                // ویرایش پروفایل
│   └── settings.vue                // تنظیمات سیستم

import { Order, Load } from './buyer';

export interface DistributorOrder extends Order {
  buyerName: string;
  buyerPhone: string;
  loadDetails: Load;
}

export interface ServiceArea {
  id: string;
  name: string;
  polygonCoordinates: [number, number][];
  capacity: number;
}

export interface AssignedLoad {
  loadId: string;
  productName: string;
  totalQuantity: number;
  assignedQuantity: number;
  expectedDeliveryDate: Date;
}

export interface FinancialReport {
  period: string;
  totalSales: number;
  totalCommission: number;
  netIncome: number;
}

توضیحات:

صفحه orders/index.vue باید امکان فیلتر کردن سفارشات بر اساس وضعیت را داشته باشد.

صفحه area.vue باید از یک کامپوننت نقشه برای تعیین محدوده خدمات استفاده کند.

صفحه reports.vue باید نمودارها و tables برای نمایش گزارشات مالی داشته باشد.

از کامپوننت‌های Tairo برای maps و charts استفاده شود.

داده‌ها initially با ماک پر شوند.

