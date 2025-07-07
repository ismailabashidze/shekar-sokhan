# راهنمای پنل ادمین نوتیفیکیشن

## دسترسی به پنل ادمین

### URL مستقیم
```
/admin/notifications
```

### استفاده از کامپوننت Navigation
```vue
<!-- در هر کامپوننت -->
<AdminNavButton variant="button" />
<AdminNavButton variant="link" show-label />
<AdminNavButton variant="icon" size="sm" />
```

## قابلیت‌های پنل ادمین

### 📊 **آمار و گزارش‌ها**
- کل اعلان‌های ارسال شده
- تعداد اعلان‌های خوانده نشده
- نرخ خوانده شده (درصد)
- تعداد کل کاربران

### 📝 **ارسال اعلان جدید**
- **عنوان**: متن کوتاه اعلان
- **پیام**: توضیحات کامل
- **نوع**: اطلاعاتی، موفقیت، هشدار، خطا، سیستمی
- **اولویت**: کم، متوسط، بالا، فوری
- **لینک عمل**: URL برای انجام عمل (اختیاری)
- **متن دکمه**: متن دکمه عمل (اختیاری)

### 👥 **انتخاب گیرندگان**
- **ارسال برای همه**: تمام کاربران
- **انتخاب فردی**: انتخاب کاربران خاص
- پیش‌نمایش قبل از ارسال

### 📋 **مدیریت اعلان‌ها**
- مشاهده لیست کامل اعلان‌های ارسال شده
- اطلاعات گیرنده و وضعیت خوانده شده
- حذف اعلان‌ها
- بروزرسانی خودکار

## استفاده از Composable

### `useAdminNotifications()`

```typescript
const {
  // State
  isLoading,
  isSending,
  allNotifications,
  users,
  userRoles,

  // Computed
  getNotificationStats,

  // Methods
  fetchUsers,
  fetchAllNotifications,
  sendBulkNotification,
  deleteNotificationAdmin,
  updateNotification,
  getUsersByRole,
  searchUsers,
  sendSystemNotification,
} = useAdminNotifications()
```

### ارسال اعلان گروهی
```typescript
const recipientCount = await sendBulkNotification(
  {
    title: 'عنوان اعلان',
    message: 'متن پیام',
    type: 'info',
    priority: 'medium',
    action_url: '/action',
    action_text: 'انجام عمل'
  },
  {
    sendToAll: false,
    selectedRecipients: ['user1', 'user2']
  }
)
```

### ارسال اعلان سیستمی (Template)
```typescript
// Templates آماده: welcome, reminder, warning, maintenance
await sendSystemNotification('welcome', ['user1', 'user2'], {
  // داده‌های اختیاری برای override
  message: 'پیام سفارشی خوش‌آمدگویی'
})
```

## تنظیمات دسترسی

### بررسی نقش کاربر
```typescript
// در کامپوننت یا middleware
const { $pb } = useNuxtApp()
const isAdmin = computed(() => {
  return $pb.authStore.model?.role === 'admin' || 
         $pb.authStore.model?.role === 'super_admin'
})
```

### Middleware محافظت
```typescript
// در صفحه admin
definePageMeta({
  middleware: 'auth', // یا 'admin'
})
```

## نکات مهم

### 🔒 **امنیت**
- فقط کاربران با نقش `admin` یا `super_admin` دسترسی دارند
- تمام عملیات در PocketBase لاگ می‌شود
- Validation کامل در frontend و backend

### ⚡ **عملکرد**
- Auto-refresh هر 30 ثانیه
- Pagination برای لیست‌های بزرگ
- Loading states مناسب
- Error handling کامل

### 🎨 **UI/UX**
- Responsive design
- Dark mode support
- RTL layout
- Smooth animations
- Real-time stats

## مثال‌های کاربردی

### اعلان خوش‌آمدگویی برای کاربران جدید
```typescript
await sendSystemNotification('welcome', [newUserId])
```

### هشدار تعمیرات سیستم
```typescript
await sendBulkNotification({
  title: 'تعمیرات سیستم',
  message: 'سیستم فردا از ساعت 2 تا 4 صبح در دسترس نخواهد بود.',
  type: 'warning',
  priority: 'urgent'
}, {
  sendToAll: true
})
```

### یادآوری برای گروه خاص
```typescript
const therapists = getUsersByRole('therapist')
await sendBulkNotification({
  title: 'جلسه هماهنگی',
  message: 'جلسه هماهنگی فردا ساعت 10 صبح',
  type: 'info',
  priority: 'high',
  action_url: '/meetings',
  action_text: 'مشاهده جزئیات'
}, {
  sendToAll: false,
  selectedRecipients: therapists.map(t => t.id)
})
``` 