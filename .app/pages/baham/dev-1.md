baham/
├── buyer/
│   ├── index.vue                   // پیشخوان خریدار - خلاصه وضعیت و پیام‌های مهم
│   ├── marketplace.vue             // صفحه بازار - لیست بارهای فعال با فیلتر و جستجو
│   ├── cart.vue                    // سبد خرید - بررسی سفارشات
│   ├── checkout.vue                // پرداخت - انتخاب آدرس و درگاه پرداخت
│   ├── orders/
│   │   ├── index.vue               // لیست سفارشات با فیلتر وضعیت
│   │   └── [id].vue                // جزئیات سفارش با رهگیری وضعیت
│   ├── distributors/
│   │   ├── index.vue               // لیست توزیع‌کنندگان و جستجو
│   │   └── [id].vue                // جزئیات توزیع‌کننده و درخواست اتصال
│   ├── support/
│   │   ├── index.vue               // تاریخچه تیکت‌های پشتیبانی
│   │   └── new.vue                 // ایجاد تیکت جدید
│   ├── transactions.vue            // تراکنش‌های مالی
│   ├── wallet.vue                  // مدیریت کیف پول و شارژ
│   └── settings/
│       ├── index.vue               // تنظیمات پروفایل و اطلاعات شخصی
│       ├── addresses.vue           // مدیریت آدرس‌ها
│       └── notifications.vue       // تنظیمات اعلان‌ها

export interface Product {
  id: string;
  name: string;
  category: string;
  description?: string;
}

export interface Load {
  id: string;
  providerId: string;
  product: Product;
  totalQuantityKg: number;
  availableQuantityKg: number;
  pricePerKg: number;
  status: 'active' | 'completed' | 'expired';
  availabilityDate: Date;
  expiryDate: Date;
}

export interface Order {
  id: string;
  buyerId: string;
  loadId: string;
  distributorId?: string;
  quantityKg: number;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  deliveryMethod: 'pickup_from_distributor' | 'direct_delivery';
  deliveryAddress?: Address;
  createdAt: Date;
  updatedAt: Date;
}

export interface Address {
  id: string;
  title: string;
  addressLine: string;
  city: string;
  isDefault: boolean;
}

export interface Distributor {
  id: string;
  companyName: string;
  serviceArea: string;
  contactInfo: string;
}

export interface Ticket {
  id: string;
  subject: string;
  status: 'open' | 'in_progress' | 'closed';
  priority: 'low' | 'medium' | 'high';
  createdAt: Date;
}

توضیحات:

صفحه marketplace.vue باید شامل فیلترهای پیشرفته (محصول، قیمت، ارائه‌دهنده) و کارت‌های بار باشد.

صفحه checkout.vue باید شامل انتخاب آدرس و درگاه پرداخت mock باشد.

صفحه orders/[id].vue باید تاریخچه وضعیت سفارش را به صورت timeline نشان دهد.

از کامپوننت‌های Tairo برای فرم‌ها، tables و modalها استفاده شود.

داده‌ها initially با ماک پر شوند.

