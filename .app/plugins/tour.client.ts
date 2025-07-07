import { driver } from 'driver.js'
import 'driver.js/dist/driver.css'

export default defineNuxtPlugin(() => {
  // Configuration for RTL support and Persian language
  const tourDriver = driver({
    showProgress: true,
    showButtons: ['next', 'previous', 'close'],
    allowClose: true,
    progressText: '{{current}} از {{total}}',
    nextBtnText: 'بعدی',
    prevBtnText: 'قبلی',
    doneBtnText: 'تمام',
    closeBtnText: '×',
    onDestroyed: () => {
      // Clean up when tour is finished
      localStorage.setItem('tour_completed', 'true')
    },
  })

  return {
    provide: {
      tour: tourDriver,
    },
  }
})
