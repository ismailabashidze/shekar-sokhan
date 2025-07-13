# راهنمای راه‌اندازی سیستم مقالات در PocketBase

## مشکل فعلی
صفحه نمایش مقالات اطلاعات اصلی را نمایش نمی‌دهد. احتمالاً collection `posts` در PocketBase وجود ندارد یا داده‌ای در آن نیست.

## راه‌حل: راه‌اندازی Collection Posts

### مرحله ۱: ایجاد Collection

1. وارد پنل Admin PocketBase شوید
2. بر روی "Collections" کلیک کنید
3. "Import collections" را انتخاب کنید
4. فایل `posts_pocketbase.json` را آپلود کنید

### مرحله ۲: ایجاد داده‌های نمونه

بعد از ایجاد collection، باید چند مقاله نمونه ایجاد کنید:

1. به collection `posts` بروید
2. روی "New record" کلیک کنید
3. فیلدهای زیر را پر کنید:

#### مقاله نمونه ۱:
```json
{
  "title": "مدیتیشن برای مبتدیان",
  "description": "راهنمای کاملی برای شروع مدیتیشن و کسب آرامش ذهنی",
  "contentLong": "# مدیتیشن برای مبتدیان\n\nمدیتیشن یکی از قدرتمندترین ابزارهای رسیدن به آرامش ذهنی است...\n\n## فواید مدیتیشن\n- کاهش استرس\n- بهبود تمرکز\n- افزایش آگاهی\n\n## نحوه شروع\n1. محیط آرامی انتخاب کنید\n2. در وضعیت راحتی بنشینید\n3. روی تنفس متمرکز شوید",
  "category": "meditation",
  "tags": ["مدیتیشن", "آرامش", "تنفس", "مبتدی"],
  "publishDate": "2024-01-15T10:00:00.000Z",
  "readTime": 5,
  "status": "published",
  "author": "USER_ID_HERE",
  "viewCount": 0,
  "likeCount": 0,
  "isFeatured": true,
  "allowComments": true
}
```

#### مقاله نمونه ۲:
```json
{
  "title": "تکنیک‌های مدیریت استرس",
  "description": "روش‌های مؤثر برای مدیریت استرس روزانه و بهبود کیفیت زندگی",
  "contentLong": "# تکنیک‌های مدیریت استرس\n\nاسترس بخشی از زندگی روزانه همه ماست...\n\n## علائم استرس\n- خستگی مداوم\n- بی‌خوابی\n- تغییرات خلقی\n\n## راهکارهای مدیریت\n- ورزش منظم\n- تکنیک‌های تنفسی\n- مدیریت زمان",
  "category": "stress-management",
  "tags": ["استرس", "مدیریت", "سلامت روان"],
  "publishDate": "2024-01-20T15:30:00.000Z",
  "readTime": 8,
  "status": "published",
  "author": "USER_ID_HERE",
  "viewCount": 0,
  "likeCount": 0,
  "isFeatured": false,
  "allowComments": true
}
```

#### مقاله نمونه ۳:
```json
{
  "title": "روابط سالم و مؤثر",
  "description": "چگونه روابط سالم و پایداری با دیگران برقرار کنیم",
  "contentLong": "# روابط سالم و مؤثر\n\nروابط انسانی یکی از مهم‌ترین جنبه‌های زندگی است...\n\n## ویژگی‌های روابط سالم\n- احترام متقابل\n- صداقت\n- حمایت عاطفی\n\n## نحوه بهبود روابط\n- گوش دادن فعال\n- ابراز احساسات\n- حل تعارض سازنده",
  "category": "relationship",
  "tags": ["روابط", "عشق", "دوستی", "خانواده"],
  "publishDate": "2024-01-25T12:15:00.000Z",
  "readTime": 6,
  "status": "published",
  "author": "USER_ID_HERE",
  "viewCount": 0,
  "likeCount": 0,
  "isFeatured": false,
  "allowComments": true
}
```

**نکته مهم**: `USER_ID_HERE` را با ID کاربر واقعی از collection `users` جایگزین کنید.

### مرحله ۳: بررسی عملکرد

بعد از ایجاد مقالات نمونه:

1. به صفحه `/posts/test` بروید تا بررسی کنید همه چیز کار می‌کند
2. به صفحه `/posts/list` بروید تا لیست مقالات را ببینید
3. روی هر مقاله کلیک کنید تا به صفحه جزئیات بروید

### مرحله ۴: عیب‌یابی

اگر همچنان مشکل دارید:

1. **بررسی لاگ‌ها**: در console مرورگر (F12) خطاها را بررسی کنید
2. **بررسی PocketBase**: در پنل Admin PocketBase، collection و records را بررسی کنید
3. **بررسی Authentication**: مطمئن شوید که کاربر لاگین کرده است

### مرحله ۵: تنظیمات امنیتی

Collection دارای این قوانین امنیتی است:

```javascript
// List Rule - همه می‌توانند مقالات را ببینند
listRule: ""

// View Rule - همه می‌توانند مقاله را ببینند
viewRule: ""

// Create Rule - فقط کاربران لاگین شده می‌توانند مقاله ایجاد کنند
createRule: "@request.auth.id != \"\""

// Update Rule - فقط نویسنده می‌تواند مقاله را ویرایش کند
updateRule: "@request.auth.id != \"\" && @request.auth.id = author"

// Delete Rule - فقط نویسنده می‌تواند مقاله را حذف کند
deleteRule: "@request.auth.id != \"\" && @request.auth.id = author"
```

## Schema فیلدها

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| title | text | Yes | عنوان مقاله |
| description | text | Yes | توضیح کوتاه |
| contentLong | text | Yes | محتوای اصلی مقاله (Markdown) |
| category | select | Yes | دسته‌بندی مقاله |
| tags | json | No | تگ‌های مقاله |
| publishDate | date | Yes | تاریخ انتشار |
| readTime | number | No | زمان مطالعه (دقیقه) |
| featuredImage | file | No | تصویر شاخص |
| status | select | Yes | وضعیت: draft, published, archived, scheduled |
| author | relation | Yes | لینک به کاربر نویسنده |
| viewCount | number | No | تعداد بازدید |
| likeCount | number | No | تعداد لایک |
| isFeatured | bool | No | مقاله ویژه |
| allowComments | bool | No | امکان نظردهی |

## Categories موجود

- meditation (مدیتیشن)
- yoga (یوگا)
- mental-health (سلامت روان)
- self-help (خودیاری)
- motivation (انگیزشی)
- relationship (روابط)
- stress-management (مدیریت استرس)
- mindfulness (ذهن‌آگاهی)
- psychology (روانشناسی)

## نکات مهم

1. **Markdown Support**: فیلد `contentLong` از Markdown پشتیبانی می‌کند
2. **Featured Images**: تصاویر شاخص در سایزهای مختلف thumbnail تولید می‌شوند
3. **Author Relation**: هر مقاله باید به یک کاربر واقعی لینک شود
4. **Status Control**: فقط مقالات با وضعیت `published` در سایت نمایش داده می‌شوند

## مشکلات معمول

### خطای "Collection not found"
- مطمئن شوید که collection `posts` درست ایجاد شده
- Schema را با فایل `posts_pocketbase.json` بررسی کنید

### خطای "No records found"
- مطمئن شوید که حداقل یک مقاله با وضعیت `published` ایجاد کرده‌اید
- Author field را درست تنظیم کنید

### خطای "Authentication required"
- در صورت نیاز، کاربر باید لاگین کند
- Rules collection را بررسی کنید

## 🔧 عیب‌یابی سریع

برای تشخیص سریع مشکل:

1. **بروید به**: `/posts/test`
2. **بررسی کنید**: آیا collection موجود است؟
3. **بررسی کنید**: آیا records وجود دارند؟
4. **بررسی کنید**: آیا usePosts composable کار می‌کند؟

اگر تمام تست‌ها موفق بودند، مشکل برطرف شده است! 