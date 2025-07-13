# راهنمای راه‌اندازی نوتیفیکیشن در PocketBase

## مرحله ۱: ایجاد Collection

1. وارد پنل Admin شوید
2. بر روی "Collections" کلیک کنید
3. "Import collections" را انتخاب کنید
4. فایل `notifications_pocketbase.json` را آپلود کنید

## ⚠️ مرحله ۱.۵: به‌روزرسانی Schema (ضروری)

اگر collection notifications قبلاً موجود است، باید فیلدهای جدید را اضافه کنید:

1. وارد collection "notifications" شوید
2. به تب "Fields" بروید
3. فیلدهای زیر را اضافه کنید:

### فیلد complete_message
- **Name**: `complete_message`
- **Type**: Text
- **Required**: ❌ (غیرضروری)
- **Max length**: 10000
- **توضیح**: برای محتوای HTML کامل اعلان

### فیلد announce_time
- **Name**: `announce_time`
- **Type**: Date
- **Required**: ❌ (غیرضروری)
- **توضیح**: زمان اعلان برای notifications زمان‌بندی شده

4. روی "Save" کلیک کنید

## مرحله ۲: ورود داده‌های نمونه

### روش اول: Import Records
1. به collection `notifications` بروید
2. "Import records" را کلیک کنید
3. فایل `notifications_import_records.json` را آپلود کنید
4. **مهم**: بعد از import، باید `recipient_user_id` را به ID کاربر لاگین شده تنظیم کنید:
   - هر record را ویرایش کنید
   - فیلد `recipient_user_id` را انتخاب کنید
   - User مورد نظر را از لیست انتخاب کنید

### روش دوم: ایجاد Manual
می‌توانید از طریق PocketBase Admin Panel هر نوتیفیکیشن را دستی ایجاد کنید.

### نکته مهم
فیلدهای `user` و `recipient_user_id` باید به users collection link شوند. اگر هنوز user ندارید:
1. ابتدا یک user در collection `users` ایجاد کنید
2. سپس در notifications، این user را به عنوان recipient انتخاب کنید

## مرحله ۳: تنظیمات Authentication

Collection دارای این قوانین امنیتی است:

```javascript
// List Rule
@request.auth.id != ""

// View Rule
@request.auth.id != ""

// Create Rule
@request.auth.id != ""

// Update Rule
@request.auth.id != "" && @request.auth.id = recipient_user_id

// Delete Rule
@request.auth.id != "" && @request.auth.id = recipient_user_id
```

## مرحله ۴: API Usage

### Get User Notifications
```javascript
// Get all notifications for logged-in user
const notifications = await pb.collection('notifications').getList(1, 50, {
  filter: 'recipient_user_id = "USER_ID"',
  sort: '-created'
});
```

### Mark as Read
```javascript
await pb.collection('notifications').update(id, {
  is_read: true,
  read_at: new Date().toISOString()
});
```

### Create New Notification with Scheduling
```javascript
await pb.collection('notifications').create({
  title: "عنوان نوتیفیکیشن",
  message: "متن پیام",
  complete_message: "<div class='rich-content'>محتوای HTML کامل</div>",
  type: "info", // info, success, warning, error, system
  priority: "medium", // low, medium, high, urgent
  is_read: false,
  user_id: "sender_id",
  user_name: "نام فرستنده",
  user_avatar: "/path/to/avatar.jpg",
  user_role: "therapist", // therapist, system, user
  action_url: "/path/to/action",
  action_text: "متن دکمه عمل",
  recipient_user_id: "receiver_id",
  announce_time: "2024-01-20T10:00:00.000Z" // زمان اعلان (اختیاری)
});
```

## Schema Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| title | text | Yes | عنوان نوتیفیکیشن |
| message | text | Yes | متن پیام |
| complete_message | text | No | محتوای HTML کامل (جدید) |
| type | select | Yes | نوع: info, success, warning, error, system |
| priority | select | Yes | اولویت: low, medium, high, urgent |
| is_read | bool | No | خوانده شده یا نه |
| user_id | text | No | شناسه فرستنده |
| user_name | text | No | نام فرستنده |
| user_avatar | text | No | آواتار فرستنده |
| user_role | text | No | نقش فرستنده |
| action_url | text | No | لینک عمل |
| action_text | text | No | متن دکمه عمل |
| read_at | date | No | زمان خوانده شدن |
| recipient_user_id | text | No | شناسه گیرنده |
| announce_time | date | No | زمان اعلان (جدید) |

## Auto-timestamps
PocketBase به صورت خودکار فیلدهای `created` و `updated` را اضافه می‌کند.

## 🔥 ویژگی‌های جدید v2.0

### 📅 زمان‌بندی اعلان‌ها
- فیلد `announce_time` برای زمان‌بندی دقیق اعلان‌ها
- اعلان‌ها تا رسیدن زمان‌شان نمایش داده نمی‌شوند
- مناسب برای پیام‌های مهربان درمانگران

### 🎨 محتوای غنی
- فیلد `complete_message` برای HTML content
- پشتیبانی از styling و formatting پیشرفته
- دکمه "بیشتر بخوانید" در UI

### 👥 اطلاعات فرستنده
- ذخیره مستقل اطلاعات فرستنده
- عدم وابستگی به relation برای عملکرد بهتر
- حفظ اطلاعات حتی در صورت تغییر user 