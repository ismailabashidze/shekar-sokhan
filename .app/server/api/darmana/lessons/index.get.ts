import { defineEventHandler } from 'h3'

export default defineEventHandler(async () => {
  // Mock data for lessons list
  const lessons = [
    {
      id: 1,
      slug: 'therapeutic-conversation',
      name: 'مهارت‌های گفتگوی درمانی',
      category: 'روانشناسی بالینی',
      description: 'در این درس، شما با مهارت‌های اساسی گفتگوی درمانی آشنا می‌شوید و آنها را در محیطی امن با عامل هوش مصنوعی تمرین می‌کنید.',
      difficulty: 'متوسط',
      duration: 30,
      completed: 45,
      techniques: ['گوش دادن فعال', 'بازتاب احساسات', 'سؤالات باز'],
      image: '/img/illustrations/lessons/therapy-skills.svg',
    },
    {
      id: 2,
      slug: 'cognitive-behavioral',
      name: 'درمان شناختی رفتاری',
      category: 'روانشناسی بالینی',
      description: 'آشنایی با اصول و تکنیک‌های درمان شناختی رفتاری (CBT) و تمرین عملی با مراجع مجازی',
      difficulty: 'پیشرفته',
      duration: 45,
      completed: 20,
      techniques: ['شناسایی افکار خودآیند', 'بازسازی شناختی', 'تکنیک‌های رفتاری'],
      image: '/img/illustrations/lessons/cbt.svg',
    },
    {
      id: 3,
      slug: 'crisis-intervention',
      name: 'مداخله در بحران',
      category: 'روانشناسی بالینی',
      description: 'یادگیری مهارت‌های مداخله در بحران و مدیریت شرایط اضطراری در جلسات درمانی',
      difficulty: 'پیشرفته',
      duration: 40,
      completed: 0,
      techniques: ['ارزیابی خطر', 'مداخله فوری', 'ارجاع مناسب'],
      image: '/img/illustrations/lessons/crisis.svg',
    },
  ]

  return {
    lessons,
  }
})
