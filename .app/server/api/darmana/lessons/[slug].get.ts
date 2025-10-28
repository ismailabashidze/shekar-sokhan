import { defineEventHandler, createError } from 'h3';

interface Technique {
  id: number;
  name: string;
  description: string;
  icon: string;
}

interface Exercise {
  id: number;
  name: string;
  description: string;
  duration: number;
  difficulty: string;
  status: 'completed' | 'in_progress' | 'not_started';
}

interface Resource {
  name: string;
  size: string;
  type: string;
  icon: string;
}

interface Requirement {
  name: string;
  description: string;
  icon: string;
}

interface Lesson {
  name: string;
  category: string;
  description: string;
  difficulty: string;
  duration: number;
  image: string;
  completed: number;
  techniques: Technique[];
  exercises: Exercise[];
  resources: Resource[];
  requirements: Requirement[];
}

type LessonsMap = {
  [key in 'resistance-management' | 'deep-emotions' | 'transference-management']: Lesson
};

export default defineEventHandler(async (event) => {
  const slug = event.context.params?.slug as keyof LessonsMap | undefined;
  if (!slug) {
    throw createError({
      statusCode: 400,
      message: 'شناسه درس مورد نیاز است',
    });
  }

  // Mock data map for lessons
  const lessonsMap: LessonsMap = {
    'resistance-management': {
      name: 'مدیریت مقاومت در جلسه درمان',
      category: 'مهارت های پایه',
      description: 'در این درس، شما با تکنیک‌های مدیریت مقاومت بیمار در جلسات درمانی آشنا می‌شوید و با عامل هوش مصنوعی تمرین خواهید کرد.',
      difficulty: 'متوسط',
      duration: 60,
      image: '/img/illustrations/lessons/resistance.svg',
      completed: 45,
      techniques: [
        {
          id: 1,
          name: 'گوش دادن فعال',
          description: 'تکنیک‌های گوش دادن مؤثر و درک عمیق صحبت‌های مراجع',
          icon: 'ph:ear-duotone',
        },
        {
          id: 2,
          name: 'بازتاب احساسات',
          description: 'شناسایی و انعکاس احساسات مراجع در گفتگو',
          icon: 'ph:heart-duotone',
        },
        {
          id: 3,
          name: 'مواجهه سازنده',
          description: 'مواجهه با مقاومت بیمار به شیوه‌ای سازنده',
          icon: 'ph:shield-duotone',
        },
      ],
      exercises: [
        {
          id: 1,
          name: 'تمرین گوش دادن فعال',
          description: 'در این تمرین، شما مهارت‌های گوش دادن فعال را با یک مراجع مجازی تمرین می‌کنید.',
          duration: 15,
          difficulty: 'آسان',
          status: 'completed',
        },
        {
          id: 2,
          name: 'بازتاب احساسات',
          description: 'تمرین شناسایی و بیان احساسات مراجع در یک گفتگوی درمانی',
          duration: 20,
          difficulty: 'متوسط',
          status: 'in_progress',
        },
        {
          id: 3,
          name: 'مدیریت سکوت',
          description: 'تمرین مدیریت لحظات سکوت در جلسه درمانی',
          duration: 25,
          difficulty: 'پیشرفته',
          status: 'not_started',
        },
      ],
      resources: [
        {
          name: 'راهنمای گوش دادن فعال',
          size: '2.5 MB',
          type: 'PDF',
          icon: '/img/icons/files/pdf.svg',
        },
        {
          name: 'تکنیک‌های پایه مصاحبه',
          size: '15 MB',
          type: 'ویدیو',
          icon: '/img/icons/files/video.svg',
        },
      ],
      requirements: [
        {
          name: 'آشنایی با مفاهیم پایه',
          description: 'درک اصول اولیه روانشناسی و مشاوره',
          icon: 'ph:book-duotone',
        },
        {
          name: 'مهارت ارتباطی',
          description: 'توانایی برقراری ارتباط مؤثر و همدلانه',
          icon: 'ph:chats-duotone',
        },
      ],
    },
    'deep-emotions': {
      name: 'کار با احساسات عمیق',
      category: 'مهارت های پیشرفته',
      description: 'تمرین تکنیک‌های کار با احساسات عمیق و دردناک بیمار، با تمرکز بر ایجاد فضای امن و حمایتگر.',
      difficulty: 'پیشرفته',
      duration: 90,
      image: '/img/illustrations/lessons/emotions.svg',
      completed: 20,
      techniques: [
        {
          id: 1,
          name: 'همدلی عمیق',
          description: 'درک و انعکاس عمیق احساسات مراجع',
          icon: 'ph:heart-duotone',
        },
      ],
      exercises: [],
      resources: [],
      requirements: [],
    },
    'transference-management': {
      name: 'مدیریت انتقال و انتقال متقابل',
      category: 'روان پویشی',
      description: 'آشنایی با مفاهیم انتقال و انتقال متقابل و تمرین تشخیص و مدیریت آنها در جلسه درمان.',
      difficulty: 'پیشرفته',
      duration: 75,
      image: '/img/illustrations/lessons/transference.svg',
      completed: 0,
      techniques: [
        {
          id: 1,
          name: 'تحلیل انتقال',
          description: 'شناسایی و تحلیل پدیده انتقال در رابطه درمانی',
          icon: 'ph:arrows-in-duotone',
        },
      ],
      exercises: [],
      resources: [],
      requirements: [],
    },
  };

  const lesson = lessonsMap[slug];
  if (!lesson) {
    throw createError({
      statusCode: 404,
      message: 'درس مورد نظر یافت نشد',
    });
  }

  return {
    lesson,
  };
});
