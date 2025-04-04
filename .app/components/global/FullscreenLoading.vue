<template>
  <div id="loader-container" class="bg-slate-100 dark:bg-slate-300">
    <div
      id="loader"
      class="loader-container bg-slate-100 dark:bg-slate-300"
    >
      <div class="relative flex flex-col items-center justify-center rounded-full bg-white bg-opacity-50 p-12 shadow-lg backdrop-blur-sm dark:bg-slate-200">
        <div class="from-primary-300/30 to-primary-500/30 absolute inset-0 animate-pulse rounded-full bg-gradient-to-br" />
        <div class="emoji relative z-10" :class="{ animateOut }">
          {{ currentLoader.emoji }}
        </div>
        <div class="text relative z-10" :class="{ animateOut }">
          {{ currentLoader.text }}
        </div>
      </div>
    </div><NuxtLink
      to="/dashboard"
      class="bg-primary-500 hover:bg-primary-600 fixed bottom-8 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-xl px-6 py-3 font-medium text-white shadow-lg transition-colors duration-300 hover:shadow-xl"
    >
      <Icon name="ph:arrow-right" class="size-5" />
      <span>بازگشت به داشبورد</span>
    </NuxtLink>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
const props = defineProps(['loaderType'])
let LOADERS = []

onMounted(() => {
  cycleLoader() // Initial run
  setInterval(updateLoader, LOADER_INTERVAL)
})

const LOADER_INTERVAL = 1600
const REPORT_LOADERS = [
  ['🧠', 'تحلیل وضعیت روانی مراجع'],
  ['🔍', 'ارزیابی الگوهای رفتاری'],
  ['📊', 'جمع‌آوری داده‌های بالینی'],
  ['📝', 'نگارش گزارش روانشناختی'],
  ['🔑', 'شناسایی مشکلات اصلی'],
  ['💬', 'بررسی گفتگوهای درمانی'],
  ['🧾', 'ثبت تاریخچه بالینی'],
  ['🔄', 'ردیابی تغییرات رفتاری'],
  ['📅', 'برنامه‌ریزی جلسات درمانی'],
  ['📈', 'پیگیری پیشرفت مراجع'],
  ['💡', 'پیشنهاد راهکارهای درمانی'],
  ['🎯', 'تمرکز بر اهداف درمانی'],
  ['📂', 'طبقه‌بندی پرونده‌های مراجعین'],
  ['📚', 'مطالعه پرونده‌ها و سوابق'],
  ['🔐', 'حفظ حریم شخصی مراجعین'],
  ['🧘‍♀️', 'ارزیابی میزان استرس'],
  ['💼', 'تشکیل جلسات مشاوره'],
  ['💭', 'تحلیل افکار و احساسات مراجع'],
  ['💬', 'گزارش‌دهی نتایج جلسات'],
  ['🔥', 'مدیریت بحران‌های روانی'],
  ['💪', 'بررسی نقاط قوت مراجع'],
  ['🌳', 'پیش‌بینی رشد و بهبود'],
  ['📈', 'اندازه‌گیری تغییرات در طول زمان'],
  ['🧩', 'حل مشکلات پیچیده روانشناختی'],
  ['🔬', 'ارزیابی آزمون‌های روانشناسی'],
  ['⚖️', 'متوازن‌سازی احساسات و رفتارها'],
  ['💧', 'آزادسازی عواطف فروخورده'],
  ['🛠', 'پیشنهاد تکنیک‌های مقابله‌ای'],
  ['🎭', 'شناسایی ماسک‌های رفتاری'],
  ['📋', 'تدوین برنامه درمانی'],
  ['🌱', 'مشاهده نشانه‌های رشد فردی'],
  ['🌐', 'بررسی تأثیرات محیطی'],
  ['🎶', 'تأثیر درمانی موسیقی'],
  ['📸', 'ارزیابی تصویرسازی ذهنی'],
  ['🛑', 'تشخیص و مداخله در زمان اضطرار'],
  ['🌍', 'تحلیل فرهنگ و ارزش‌های فردی'],
  ['🔔', 'شناسایی نشانه‌های هشداردهنده'],
  ['🔧', 'تعدیل روش‌های درمانی'],
  ['📖', 'مرور گزارش‌های گذشته'],
  ['🧳', 'برنامه‌ریزی برای ادامه درمان'],
  ['🎯', 'تمرکز بر اهداف درمانی خاص'],
  ['💭', 'تجزیه و تحلیل الگوهای فکری'],
  ['📅', 'زمان‌بندی جلسات آتی'],
  ['🔄', 'بررسی اثرات درمانی'],
  ['🌿', 'بررسی روش‌های درمانی جایگزین'],
  ['💬', 'گزارش‌دهی منظم به مراجع'],
  ['🎯', 'تقویت مهارت‌های روانی'],
  ['📑', 'جمع‌آوری داده‌های جلسه'],
  ['⚗️', 'آزمایش و تنظیم مداخلات جدید'],
  ['📊', 'مقایسه نتایج بالینی'],
  ['📋', 'ارائه توصیه‌های روانشناختی'],
  ['🔬', 'استفاده از ابزارهای تشخیصی'],
  ['🏆', 'شناسایی موفقیت‌های درمانی'],
  ['📎', 'تکمیل اسناد و مدارک بالینی'],
  ['💬', 'ارزیابی بازخورد مراجع'],
  ['🔍', 'تحلیل وضعیت عاطفی مراجع'],
  ['🛠', 'ارائه راهکارهای بهبود مراجع'],
  ['🔗', 'تقویت ارتباطات درمانی'],
  ['📉', 'مدیریت روند بهبودی در طول زمان'],
  ['🔓', 'باز کردن زوایای جدید مشکلات'],
  ['🔑', 'کشف راه‌حل‌های جایگزین'],
  ['🌟', 'شناسایی نقاط پیشرفت'],
]
const USER_LOADERS = [
  ['🧠', 'تحلیل افکار'],
  ['🔍', 'بررسی احساسات'],
  ['📝', 'یادداشت‌برداری از احساسات'],
  ['🔑', 'یافتن کلید مشکلات'],
  ['💡', 'درک یک ایده جدید'],
  ['🎯', 'تمرکز بر اهداف'],
  ['📊', 'تحلیل داده‌های روانی'],
  ['🔄', 'چرخه تفکرات منفی'],
  ['🌳', 'رشد شخصی و درونی'],
  ['📅', 'برنامه‌ریزی برای پیشرفت'],
  ['💬', 'گفت‌وگو با مشاور'],
  ['❤️', 'توجه به احساسات خود'],
  ['🔨', 'ابزارهای مقابله با استرس'],
  ['🧘‍♀️', 'تمرین آرامش'],
  ['🌞', 'شروع روز با انگیزه'],
  ['🌧', 'مقابله با احساسات منفی'],
  ['💭', 'پردازش خاطرات'],
  ['🚪', 'پیدا کردن در خروج از بحران'],
  ['🔥', 'مدیریت خشم'],
  ['🛑', 'توقف افکار منفی'],
  ['🤔', 'تفکر عمیق'],
  ['💧', 'آزاد کردن احساسات'],
  ['❄️', 'خنک کردن ذهن در موقعیت‌های استرس‌زا'],
  ['🎨', 'ابراز خلاقانه احساسات'],
  ['📚', 'مطالعه برای خودشناسی'],
  ['🔒', 'محافظت از مرزهای شخصی'],
  ['💪', 'تقویت اعتماد به نفس'],
  ['⏰', 'مدیریت زمان'],
  ['🌱', 'کاشت بذرهای خودآگاهی'],
  ['🌸', 'پذیرش خود و دیگران'],
  ['🔗', 'ارتباطات سالم'],
  ['🎭', 'شناسایی نقش‌ها و هویت‌ها'],
  ['✨', 'ایجاد تغییرات مثبت'],
  ['🔬', 'آزمایش و ارزیابی روش‌های مختلف'],
  ['🛌', 'استراحت و بازیابی انرژی'],
  ['📖', 'یادگیری از تجربیات'],
  ['🚶‍♀️', 'گام برداشتن به سوی بهبود'],
  ['🎈', 'رها کردن استرس'],
  ['👥', 'مشارکت در گروه‌های حمایتی'],
  ['💭', 'تصورات سازنده'],
  ['🌳', 'ارتباط با طبیعت'],
  ['🧳', 'سفر به درون خود'],
  ['🕊️', 'رسیدن به آرامش'],
  ['🎶', 'گوش دادن به موسیقی آرام‌بخش'],
  ['🔔', 'هشدار به نشانه‌های استرس'],
  ['🌍', 'درک دیدگاه‌های جدید'],
  ['💡', 'یادگیری مهارت‌های جدید'],
  ['🖼️', 'تجسم زندگی بهتر'],
  ['🧩', 'حل مسائل پیچیده'],
  ['🎯', 'تمرکز بر هدف‌های روانی'],
  ['📸', 'مشاهده و تحلیل رفتارها'],
  ['🧴', 'مراقبت از خود'],
  ['⚖️', 'متعادل کردن احساسات'],
  ['🔑', 'کشف الگوهای رفتاری'],
  ['🌻', 'پرورش ذهن مثبت'],
  ['💬', 'ابراز صادقانه احساسات'],
  ['🤲', 'پذیرش حمایت از دیگران'],
  ['🎯', 'هدایت انرژی به سوی اهداف'],
  ['🧳', 'سفر به اعماق ذهن'],
  ['⚖️', 'یافتن تعادل ذهنی'],
  ['🚀', 'حرکت به سوی اهداف جدید'],
  ['🎯', 'دستیابی به موفقیت'],
  ['🌟', 'درخشیدن در مسیر پیشرفت'],
  ['⚗️', 'آزمایش راهکارهای جدید'],
]

const currentLoader = ref({ emoji: '', text: '' })
const animateOut = ref(false)

const cycleLoader = () => {
  const index = Math.floor(Math.random() * LOADERS.length)
  const selected = LOADERS[index]
  currentLoader.value = { emoji: selected[0], text: selected[1] }
}

const updateLoader = () => {
  animateOut.value = true

  setTimeout(() => {
    cycleLoader()
    animateOut.value = false
  }, 300) // Matches CSS transition duration
}
if (props.loaderType === 'user') {
  LOADERS = USER_LOADERS
}
else {
  LOADERS = REPORT_LOADERS
}
</script>

<style scoped>
/* Example CSS for the transition */
.emoji, .text {
  transition: opacity 0.3s;
}

.animateOut {
  opacity: 0;
}
@-webkit-keyframes blurIn {
  0% {
    transform: translate3d(0, -60px, 0) scale(0.9, 2);
    filter: blur(3px);
    opacity: 0;
  }
  100% {
    transform: translate3d(0, 0, 0) scale(1);
    filter: blur(0);
    opacity: 1;
  }
}

@keyframes blurIn {
  0% {
    transform: translate3d(0, -60px, 0) scale(0.9, 2);
    filter: blur(3px);
    opacity: 0;
  }
  100% {
    transform: translate3d(0, 0, 0) scale(1);
    filter: blur(0);
    opacity: 1;
  }
}
@-webkit-keyframes blurOut {
  0% {
    transform: translate3d(0, 0, 0) scale(1);
    filter: blur(0);
    opacity: 1;
  }
  100% {
    transform: translate3d(0, 60px, 0) scale(0.9, 2);
    filter: blur(3px);
    opacity: 0;
  }
}
@keyframes blurOut {
  0% {
    transform: translate3d(0, 0, 0) scale(1);
    filter: blur(0);
    opacity: 1;
  }
  100% {
    transform: translate3d(0, 60px, 0) scale(0.9, 2);
    filter: blur(3px);
    opacity: 0;
  }
}
@-webkit-keyframes pulseEllipsis {
  0% {
    box-shadow: -3px 0 0 rgba(71, 85, 105, 0.6), -9px 0 0 rgba(71, 85, 105, 0.6), -15px 0 0 rgba(71, 85, 105, 0.6);
  }
  20% {
    box-shadow: -3px 0 rgba(71, 85, 105, 0.6), -9px 0 0 rgba(71, 85, 105, 0.6), -15px 0 0 #475569;
  }
  40% {
    box-shadow: -3px 0 0 rgba(71, 85, 105, 0.6), -9px 0 0 #475569, -15px 0 0 rgba(71, 85, 105, 0.6);
  }
  60% {
    box-shadow: -3px 0 0 #475569, -9px 0 0 rgba(71, 85, 105, 0.6), -15px 0 0 rgba(71, 85, 105, 0.6);
  }
}
@keyframes pulseEllipsis {
  0% {
    box-shadow: -3px 0 0 rgba(71, 85, 105, 0.6), -9px 0 0 rgba(71, 85, 105, 0.6), -15px 0 0 rgba(71, 85, 105, 0.6);
  }
  20% {
    box-shadow: -3px 0 rgba(71, 85, 105, 0.6), -9px 0 0 rgba(71, 85, 105, 0.6), -15px 0 0 #475569;
  }
  40% {
    box-shadow: -3px 0 0 rgba(71, 85, 105, 0.6), -9px 0 0 #475569, -15px 0 0 rgba(71, 85, 105, 0.6);
  }
  60% {
    box-shadow: -3px 0 0 #475569, -9px 0 0 rgba(71, 85, 105, 0.6), -15px 0 0 rgba(71, 85, 105, 0.6);
  }
}
@-webkit-keyframes fadeInOutLong {
  0%, 35% {
    opacity: 0;
  }
  40%, 85% {
    opacity: 1;
  }
  90%, 100% {
    opacity: 0;
  }
}
@keyframes fadeInOutLong {
  0%, 35% {
    opacity: 0;
  }
  40%, 85% {
    opacity: 1;
  }
  90%, 100% {
    opacity: 0;
  }
}
#loader-container {
  position: absolute;
  width: 100vw;
  height: 100vh;
  top: 0;
  left: 0;
}
#loader {
  width: 400px;
  position: fixed;
  top: 50%;
  left: 50%;
  text-align: center;
  transform: translate3d(-50%, -50%, 0);
}
#loader .emoji, #loader .text {
  -webkit-animation-name: blurIn;
          animation-name: blurIn;
  -webkit-animation-duration: 0.3s;
          animation-duration: 0.3s;
  -webkit-animation-timing-function: cubic-bezier(0.58, -0.23, 0.3, 1.3);
          animation-timing-function: cubic-bezier(0.58, -0.23, 0.3, 1.3);
  -webkit-animation-fill-mode: both;
          animation-fill-mode: both;
}
#loader .emoji {
  display: block;
  font-size: 3.5em;
  margin-bottom: 0.2em;
  -webkit-animation-delay: 0.1s;
          animation-delay: 0.1s;
}
#loader .text {
  line-height: 1;
  color: #475569;
  font-size: 20px;
  margin-right: -14px;
}
#loader .text:after {
  content: "";
  display: inline-block;
  background: transparent;
  width: 3px;
  height: 3px;
  border-radius: 50%;
  margin-left: 18px;
  box-shadow: -3px 0 0 rgba(71, 85, 105, 0.6), -9px 0 0 rgba(71, 85, 105, 0.6), -15px 0 0 rgba(71, 85, 105, 0.6);
  -webkit-animation: pulseEllipsis 0.8s infinite both ease-in-out;
          animation: pulseEllipsis 0.8s infinite both ease-in-out;
}
#loader .animateOut {
  -webkit-animation-name: blurOut;
          animation-name: blurOut;
  -webkit-animation-duration: 0.3s;
          animation-duration: 0.3s;
  -webkit-animation-timing-function: cubic-bezier(0.58, -0.23, 0.3, 1.3);
          animation-timing-function: cubic-bezier(0.58, -0.23, 0.3, 1.3);
  -webkit-animation-fill-mode: both;
          animation-fill-mode: both;
}
</style>
