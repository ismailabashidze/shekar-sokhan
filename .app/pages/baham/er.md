مدل ER دیاگرام پلتفرم «با هم»
توضیح نمادها:

PK = کلید اصلی (Primary Key)

FK = کلید خارجی (Foreign Key)

UQ = منحصر به فرد (Unique)

FK1, FK2 = کلید خارجی مرکب (Composite Foreign Key)

فهرست موجودیت ها (Entities) و ویژگی های آنها:
1. موجودیت: users (کاربران)
(این جدول اطلاعات پایه تمام کاربران را ذخیره می کند. نقش (role) نوع کاربر را مشخص می کند)

user_id (PK, Auto Increment)

national_code (UQ) -- برای احراز هویت

phone_number (UQ)

email

password_hash

role (buyer, distributor, provider, admin)

is_verified (Boolean) -- تاییدیه ادمین برای توزیع‌کنندگان و ارائه‌دهندگان

created_at

updated_at

2. موجودیت: buyer_profiles (پروفایل خریداران)
user_id (PK, FK to users) -- هر کاربر فقط یک پروفایل خریداری دارد

first_name

last_name

3. موجودیت: distributor_profiles (پروفایل توزیع کنندگان)
user_id (PK, FK to users)

company_name

business_license_number (UQ) -- شماره پروانه کسب

service_area -- منطقه تحت پوشش (مثلاً JSON برای ذخیره چندین منطقه)

4. موجودیت: provider_profiles (پروفایل ارائه دهندگان)
user_id (PK, FK to users)

company_name

business_license_number (UQ)

production_capacity_info -- اطلاعاتی درباره ظرفیت تولید

5. موجودیت: addresses (آدرس ها)
(برای مدیریت آدرس های همه کاربران)

address_id (PK)

user_id (FK to users)

title (e.g., "منزل", "دفتر")

address_line

city

latitude

longitude

is_default (Boolean)

6. موجودیت: products (محصولات)
(کاتالوگ محصولات برای استانداردسازی)

product_id (PK)

name (UQ) (e.g., "سیب زمینی مرغوب", "پیاز زرد")

category (e.g., "صیفی جات", "میوه")

description

7. موجودیت: loads (بارها)
(بارهای عرضه شده توسط ارائه دهندگان)

load_id (PK)

provider_id (FK to provider_profiles(user_id))

product_id (FK to products)

total_quantity_kg -- مقدار کل بار به کیلوگرم

available_quantity_kg -- مقدار باقیمانده برای فروش

price_per_kg -- قیمت پایه هر کیلو

status (active, completed, expired, canceled)

availability_date -- تاریخ آماده شدن بار برای تحویل

expiry_date -- تاریخ انقضای ثبت سفارش برای این بار

created_at

updated_at

8. موجودیت: orders (سفارشات)
order_id (PK)

buyer_id (FK to buyer_profiles(user_id))

load_id (FK to loads)

distributor_id (FK to distributor_profiles(user_id), Nullable) -- اگر خریدار مستقیم خرید کند می تواند null باشد.

quantity_kg -- مقدار سفارش داده شده

total_price -- quantity_kg * load.price_per_kg

status (pending, confirmed_by_provider, shipped, out_for_delivery, delivered, cancelled)

delivery_method (pickup_from_distributor, direct_delivery)

delivery_address_id (FK to addresses) -- اگر مستقیم باشد

created_at

updated_at

9. موجودیت: payments (پرداخت ها)
payment_id (PK)

order_id (FK to orders, UQ) -- هر سفارش یک پرداخت موفق دارد

amount

payment_gateway_ref -- شماره مرجع درگاه

status (success, failed, pending)

paid_at

10. موجودیت: settlements (تسویه حساب ها)
(برای مدیریت پرداخت به ارائه دهندگان و توزیع کنندگان)

settlement_id (PK)

user_id (FK to users) -- طرف تسویه حساب (ارائه دهنده یا توزیع کننده)

order_id (FK to orders)

amount -- مبلغی که به کاربر تعلق می گیرد

commission_rate -- درصد کارمزد پلتفرم

commission_amount -- مبلغ کارمزد پلتفرم

status (pending, paid)

settled_at

11. موجودیت: tickets (تیکت های پشتیبانی)
ticket_id (PK)

user_id (FK to users) -- ایجاد کننده تیکت

assigned_admin_id (FK to users(user_id), Nullable) -- ادمین مسئول

subject

description

status (open, in_progress, closed)

priority (low, medium, high)

created_at

updated_at

12. موجودیت: notifications (اعلان ها)
notification_id (PK)

user_id (FK to users) -- دریافت کننده

title

message

is_read (Boolean)

related_entity_type (e.g., order, load, ticket) -- برای لینک دادن

related_entity_id -- ID آن موجودیت (e.g., order_id)

created_at

توضیحات مهم روی ارتباطات:
ارتباط users و profiles: یک رابطه یک به یک (||--||) است. هر کاربر فقط یک پروفایل دارد (مثلاً فقط می‌تواند یک خریدار یا یک توزیع‌کننده باشد).

ارتباط provider_profiles و loads: یک رابطه یک به چند (||--o{) است. یک ارائه‌دهنده می‌تواند چندین بار مختلف را عرضه کند.

ارتباط loads و orders: یک رابطه یک به چند است. یک بار (مثلاً ۱ تن سیب‌زمینی) می‌تواند به چندین سفارش ۱۰ کیلویی تقسیم شود. فیلد available_quantity_kg در جدول loads برای مدیریت موجودی استفاده می‌شود.

ارتباط orders و distributor_profiles: این رابطه چند به یک (}o--||) و اختیاری (Nullable) است. یک سفارش می‌تواند به یک توزیع‌کننده خاص مرتبط باشد (اگر خریدار از این روش استفاده کند) یا می‌تواند null باشد (اگر خرید مستقیماً از ارائه‌دهنده انجام شده باشد).

ارتباط orders و payments: یک رابطه یک به یک (||--||) است. هر سفارش فقط یک رکورد پرداخت موفق دارد.

ارتباط orders و settlements: یک رابطه یک به چند (||--o{) است. یک سفارش می‌تواند دو رکورد تسویه‌حساب ایجاد کند: یکی برای ارائه‌دهنده و یکی برای توزیع‌کننده (در صورتی که نقش داشته باشد).

