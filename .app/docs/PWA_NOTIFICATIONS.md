# سیستم اعلان‌های PWA

این مستند راهنمای جامعی برای سیستم اعلان‌های PWA در پلتفرم ذهنا ارائه می‌دهد.

## ویژگی‌ها

- ✅ **اعلان‌های فوری** - حتی زمانی که مرورگر بسته است
- ✅ **اعلان‌های آفلاین** - ذخیره و نمایش زمانی که اتصال برقرار می‌شود  
- ✅ **پشتیبانی RTL** - کاملاً بهینه‌سازی شده برای فارسی
- ✅ **انیمیشن‌های زیبا** - تجربه کاربری بهتر
- ✅ **اولویت‌بندی** - لرزش و نمایش بر اساس اولویت
- ✅ **Auto-sync** - هماهنگی خودکار با سیستم اعلان‌ها

## ساختار فایل‌ها

```
.app/
├── composables/
│   ├── useNotifications.ts      # سیستم اصلی اعلان‌ها
│   └── usePwaNotifications.ts   # مدیریت PWA notifications
├── components/global/
│   ├── NotificationIcon.vue     # آیکون زنگ با انیمیشن
│   ├── NotificationSidebar.vue  # سایدبار اعلان‌ها
│   └── PwaNotificationSettings.vue # تنظیمات PWA
├── public/
│   ├── sw.js                    # Service Worker
│   └── manifest.json           # PWA Manifest
└── plugins/
    └── pwa.client.ts           # پلاگین PWA
```

## استفاده

### فعال‌سازی اعلان‌های PWA

```vue
<template>
  <PwaNotificationSettings />
</template>
```

### ارسال اعلان محلی

```typescript
const { showLocalNotification } = usePwaNotifications()

await showLocalNotification({
  title: 'اعلان مهم',
  message: 'این یک پیام مهم است',
  type: 'warning',
  priority: 'high',
  url: '/notifications'
})
```

### ادغام با سیستم موجود

```typescript
const { createNotification, triggerPwaNotification } = useNotifications()

// ایجاد اعلان جدید که به صورت خودکار PWA notification نمایش می‌دهد
await createNotification({
  title: 'پیام جدید',
  message: 'شما پیام جدیدی دریافت کردید',
  type: 'info',
  priority: 'medium',
  recipient_user_id: 'user-id'
})
```

## تنظیمات Service Worker

Service Worker در `public/sw.js` تنظیم شده و شامل:

- **Push Event Handling** - مدیریت اعلان‌های دریافتی
- **Notification Click** - مدیریت کلیک روی اعلان‌ها
- **Background Sync** - همگام‌سازی در پس‌زمینه
- **Message Handling** - ارتباط با main thread

### ویژگی‌های فارسی

```javascript
const options = {
  dir: 'rtl',
  lang: 'fa',
  vibrate: priority === 'urgent' ? [200, 100, 200, 100, 200] : [200, 100, 200],
  requireInteraction: priority === 'urgent' || priority === 'high'
}
```

## API Reference

### usePwaNotifications()

| Method | توضیح |
|--------|-------|
| `requestPermission()` | درخواست مجوز اعلان‌ها |
| `subscribeToPush()` | فعال‌سازی push notifications |
| `unsubscribeFromPush()` | غیرفعال‌سازی |
| `showLocalNotification()` | نمایش اعلان محلی |
| `testNotification()` | تست اعلان |

### Properties

| Property | Type | توضیح |
|----------|------|-------|
| `isSupported` | `boolean` | پشتیبانی از PWA |
| `permission` | `NotificationPermission` | وضعیت مجوز |
| `isSubscribed` | `boolean` | وضعیت اشتراک |
| `isLoading` | `boolean` | در حال بارگیری |
| `error` | `string` | پیام خطا |

## رفع مشکلات

### اعلان‌ها نمایش داده نمی‌شوند

1. بررسی مجوز: `Notification.permission === 'granted'`
2. بررسی پشتیبانی: `'serviceWorker' in navigator`
3. بررسی HTTPS: PWA فقط روی HTTPS کار می‌کند
4. بررسی Service Worker: `/sw.js` در دسترس باشد

### مشکلات فارسی

- اطمینان از `dir: 'rtl'` در options
- استفاده از `lang: 'fa'` 
- فونت فارسی در manifest

### Console Commands for Debug

```javascript
// بررسی وضعیت
navigator.serviceWorker.ready.then(reg => console.log(reg))

// تست notification
new Notification('تست', { body: 'پیام تستی', dir: 'rtl' })

// بررسی permission
console.log(Notification.permission)
```

## مثال‌های کاربردی

### اعلان فوری برای پیام جدید

```typescript
// هنگام دریافت پیام از backend
const newMessage = await fetchNewMessage()

await triggerPwaNotification({
  id: newMessage.id,
  title: newMessage.sender.name,
  message: newMessage.content,
  type: 'info',
  priority: 'high',
  actionUrl: `/messages/${newMessage.id}`,
  actionText: 'مشاهده پیام'
})
```

### اعلان یادآوری جلسه

```typescript
await showLocalNotification({
  title: 'یادآوری جلسه',
  message: 'جلسه شما ۱۰ دقیقه دیگر شروع می‌شود',
  type: 'warning',
  priority: 'urgent',
  url: '/sessions/current',
  actionText: 'ورود به جلسه'
})
```

## نکات امنیتی

- همیشه مجوز کاربر را بررسی کنید
- از HTTPS استفاده کنید
- اطلاعات حساس در notification نگذارید
- URL های معتبر استفاده کنید

## پشتیبانی مرورگرها

| مرورگر | Desktop | Mobile |
|---------|---------|--------|
| Chrome | ✅ | ✅ |
| Firefox | ✅ | ✅ |
| Safari | ✅ | ⚠️ محدود |
| Edge | ✅ | ✅ |

⚠️ **نکته**: Safari روی iOS محدودیت‌هایی دارد و نیاز به Add to Home Screen دارد.

## به‌روزرسانی‌های آینده

- [ ] Push notifications از سرور
- [ ] Group notifications
- [ ] Rich notifications با تصاویر
- [ ] Action buttons سفارشی
- [ ] Notification analytics 