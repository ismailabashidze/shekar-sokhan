import type { DriveStep } from 'driver.js'

interface TourStep extends DriveStep {
  element: string
  popover: {
    title: string
    description: string
    side?: 'left' | 'right' | 'top' | 'bottom'
    align?: 'start' | 'center' | 'end'
  }
}

interface Tour {
  id: string
  name: string
  steps: TourStep[]
}

export const useTour = () => {
  const { $tour } = useNuxtApp()

  // Define available tours
  const tours: Tour[] = [
    {
      id: 'onboarding',
      name: 'راهنمای شروع کار',
      steps: [
        {
          element: '[data-tour="welcome"]',
          popover: {
            title: 'خوش آمدید به ذهنا! 🎉',
            description: 'در اینجا می‌توانید اشتراک خود را فعال کنید و از خدمات ذهنا استفاده کنید.',
            side: 'bottom',
            align: 'center',
          },
        },
        {
          element: '[data-tour="payment-options"]',
          popover: {
            title: 'گزینه‌های پرداخت 💳',
            description: 'می‌توانید اشتراک خود را پرداخت کنید یا اگر کد تخفیف دارید از آن استفاده کنید.',
            side: 'top',
            align: 'center',
          },
        },
        {
          element: '[data-tour="payment-button"]',
          popover: {
            title: 'پرداخت اشتراک 💎',
            description: 'با کلیک روی این دکمه، مراحل پرداخت اشتراک ماهانه ذهنا را شروع کنید.',
            side: 'top',
          },
        },
        {
          element: '[data-tour="coupon-button"]',
          popover: {
            title: 'کد تخفیف 🎟️',
            description: 'اگر کد تخفیف دارید، می‌توانید از این قسمت استفاده کنید.',
            side: 'top',
          },
        },
      ],
    },
    {
      id: 'dashboard',
      name: 'راهنمای داشبورد',
      steps: [
        {
          element: '[data-tour="welcome-section"]',
          popover: {
            title: 'خوش آمدید به داشبورد ذهنا! 🏠',
            description: 'این محل اصلی شماست. از اینجا می‌توانید به تمام امکانات دسترسی داشته باشید.',
            side: 'bottom',
            align: 'center',
          },
        },
        {
          element: '[data-tour="statistics"]',
          popover: {
            title: 'آمار و ارقام 📊',
            description: 'در این بخش آمار کلی فعالیت‌های سیستم نمایش داده می‌شود.',
            side: 'bottom',
          },
        },
        {
          element: '[data-tour="quick-actions"]',
          popover: {
            title: 'دسترسی سریع ⚡',
            description: 'از این دکمه‌ها برای دسترسی سریع به بخش‌های مهم استفاده کنید.',
            side: 'top',
            align: 'center',
          },
        },
        {
          element: '[data-tour="therapists-button"]',
          popover: {
            title: 'روانشناسان هوش مصنوعی 🤖',
            description: 'برای شروع جلسه مشاوره با روانشناسان هوش مصنوعی روی این دکمه کلیک کنید.',
            side: 'top',
          },
        },
        {
          element: '[data-tour="new-features"]',
          popover: {
            title: 'امکانات جدید ✨',
            description: 'آخرین امکانات و بروزرسانی‌های سیستم در اینجا نمایش داده می‌شود.',
            side: 'bottom',
          },
        },
        {
          element: '[data-tour="articles-section"]',
          popover: {
            title: 'آخرین مقالات 📰',
            description: 'مقالات مفید روانشناسی و بهداشت روان در این بخش قرار دارد. می‌توانید بین مقالات اخیر و محبوب جابجا شوید.',
            side: 'left',
            align: 'center',
          },
        },
        {
          element: '[data-tour="video-section"]',
          popover: {
            title: 'ویدئوهای آموزشی 🎥',
            description: 'ویدئوهای آموزشی و محتوای مفید در این بخش قرار دارد.',
            side: 'top',
            align: 'center',
          },
        },
      ],
    },
    {
      id: 'therapist-selection',
      name: 'راهنمای انتخاب درمانگر',
      steps: [
        {
          element: '[data-tour="therapist-filters"]',
          popover: {
            title: 'فیلترهای جستجو',
            description: 'با استفاده از این فیلترها می‌توانید درمانگر مناسب خود را پیدا کنید.',
            side: 'right',
          },
        },
        {
          element: '[data-tour="therapist-card"]',
          popover: {
            title: 'کارت درمانگر',
            description: 'اطلاعات هر درمانگر در کارت‌های جداگانه نمایش داده می‌شود.',
            side: 'top',
          },
        },
        {
          element: '[data-tour="book-session"]',
          popover: {
            title: 'رزرو جلسه',
            description: 'با کلیک روی این دکمه می‌توانید جلسه رزرو کنید.',
            side: 'bottom',
          },
        },
      ],
    },
    {
      id: 'sessions',
      name: 'راهنمای صفحه جلسات مشاوره',
      steps: [
        {
          element: '[data-tour="sessions-filter"]',
          popover: {
            title: 'فیلتر وضعیت جلسات 🔍',
            description: 'با استفاده از این فیلتر می‌توانید جلسات را بر اساس وضعیت (در حال انجام، تکمیل شده، بسته شده) مشاهده کنید.',
            side: 'bottom',
            align: 'center',
          },
        },
        {
          element: '[data-tour="sessions-search"]',
          popover: {
            title: 'جستجو در جلسات 🔎',
            description: 'می‌توانید بر اساس نام درمانگر یا شناسه جلسه در جلسات خود جستجو کنید.',
            side: 'bottom',
          },
        },
        {
          element: '[data-tour="sessions-refresh"]',
          popover: {
            title: 'بروزرسانی 🔄',
            description: 'برای دریافت آخرین اطلاعات جلسات خود، روی این دکمه کلیک کنید.',
            side: 'bottom',
          },
        },
        {
          element: '[data-tour="sessions-new"]',
          popover: {
            title: 'شروع جلسه جدید ➕',
            description: 'برای شروع یک جلسه مشاوره جدید با روانشناسان هوش مصنوعی، روی این دکمه کلیک کنید.',
            side: 'bottom',
          },
        },
        {
          element: '[data-tour="sessions-list"]',
          popover: {
            title: 'لیست جلسات 📋',
            description: 'در اینجا تمام جلسات مشاوره شما نمایش داده می‌شود. هر کارت حاوی اطلاعات کاملی از یک جلسه است.',
            side: 'top',
            align: 'center',
          },
        },
        {
          element: '[data-tour="sessions-card"]',
          popover: {
            title: 'کارت جلسه 📄',
            description: 'هر کارت شامل اطلاعات درمانگر، مدت جلسه، تعداد پیام‌ها، تحلیل جلسه و وضعیت فعلی جلسه است.',
            side: 'top',
          },
        },
        {
          element: '[data-tour="sessions-actions"]',
          popover: {
            title: 'عملکردهای جلسه ⚡',
            description: 'بسته به وضعیت جلسه، می‌توانید گفتگو را ادامه دهید، تحلیل را مشاهده کنید یا تاریخچه را ببینید.',
            side: 'top',
          },
        },
        {
          element: '[data-tour="sessions-history"]',
          popover: {
            title: 'مشاهده تاریخچه 📚',
            description: 'برای مشاهده کامل گفتگوها و پیام‌های رد و بدل شده در جلسه، روی دکمه تاریخچه کلیک کنید.',
            side: 'top',
          },
        },
      ],
    },
    {
      id: 'session-management',
      name: 'راهنمای مدیریت جلسات',
      steps: [
        {
          element: '[data-tour="upcoming-sessions"]',
          popover: {
            title: 'جلسات آینده',
            description: 'جلسات رزرو شده شما در این بخش نمایش داده می‌شود.',
            side: 'top',
          },
        },
        {
          element: '[data-tour="session-notes"]',
          popover: {
            title: 'یادداشت‌های جلسه',
            description: 'می‌توانید یادداشت‌های خود را برای هر جلسه ثبت کنید.',
            side: 'left',
          },
        },
      ],
    },
    {
      id: 'deeds-start',
      name: 'راهنمای کارهای نیک',
      steps: [
        {
          element: '[data-tour="deeds-intro"]',
          popover: {
            title: 'به کارهای نیک خوش آمدید! 🎉',
            description: 'در این بخش می‌توانید کارهای نیک مختلف را مشاهده کنید و با انجام آن‌ها کد تخفیف دریافت کنید.',
            side: 'bottom',
            align: 'center',
          },
        },
        {
          element: '[data-tour="deeds-categories-top"]',
          popover: {
            title: 'دسته‌بندی‌های کارهای نیک 📚',
            description: 'کارهای نیک در این دسته‌بندی‌ها قرار دارند: خانواده و دوستان، جامعه، معنویت.',
            side: 'bottom',
            align: 'center',
          },
        },
        {
          element: '[data-tour="deeds-categories-bottom"]',
          popover: {
            title: 'دیگر دسته‌بندی‌ها 🌱',
            description: 'همچنین دسته‌بندی‌های دیگری مانند آموزش، سلامت و محیط زیست نیز وجود دارند.',
            side: 'top',
            align: 'center',
          },
        },
        {
          element: '[data-tour="deeds-actions"]',
          popover: {
            title: 'شروع کار با کارهای نیک ⚡',
            description: 'می‌توانید کارهای نیک موجود را مشاهده کنید یا در آینده کارهای نیک خود را پیشنهاد دهید.',
            side: 'top',
          },
        },
      ],
    },
  ]

  // Start a specific tour
  const startTour = (tourId: string) => {
    const tour = tours.find(t => t.id === tourId)
    if (!tour) {
      console.warn(`Tour with id "${tourId}" not found`)
      return
    }

    // Check if elements exist before starting
    const firstElement = document.querySelector(tour.steps[0].element)
    if (!firstElement) {
      console.warn(`First tour element "${tour.steps[0].element}" not found`)
      return
    }

    $tour.setSteps(tour.steps)
    $tour.drive()
  }

  // Highlight a single element
  const highlight = (selector: string, options?: {
    title?: string
    description?: string
    side?: 'left' | 'right' | 'top' | 'bottom'
  }) => {
    const element = document.querySelector(selector)
    if (!element) {
      console.warn(`Element "${selector}" not found`)
      return
    }

    $tour.highlight({
      element: selector,
      popover: {
        title: options?.title || 'توجه',
        description: options?.description || 'این المان مهم است',
        side: options?.side || 'top',
      },
    })
  }

  // Check if user has seen a tour
  const hasSeen = (tourId: string): boolean => {
    if (process.client) {
      return localStorage.getItem(`tour_${tourId}_seen`) === 'true'
    }
    return false
  }

  // Mark tour as seen
  const markAsSeen = (tourId: string) => {
    if (process.client) {
      localStorage.setItem(`tour_${tourId}_seen`, 'true')
    }
  }

  // Reset tour status
  const resetTour = (tourId: string) => {
    if (process.client) {
      localStorage.removeItem(`tour_${tourId}_seen`)
    }
  }

  // Reset all tours
  const resetAllTours = () => {
    if (process.client) {
      tours.forEach((tour) => {
        localStorage.removeItem(`tour_${tour.id}_seen`)
      })
      localStorage.removeItem('tour_completed')
    }
  }

  // Auto-start tour if user hasn't seen it
  const autoStartTour = (tourId: string, delay: number = 1000) => {
    if (!hasSeen(tourId)) {
      setTimeout(() => {
        startTour(tourId)
        markAsSeen(tourId)
      }, delay)
    }
  }

  return {
    tours,
    startTour,
    highlight,
    hasSeen,
    markAsSeen,
    resetTour,
    resetAllTours,
    autoStartTour,
  }
}
