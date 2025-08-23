export default defineNuxtPlugin(() => {
  let tourDriver: any = null;

  // Lazy initialization of tour driver
  const getTourDriver = () => {
    if (!tourDriver) {
      // Dynamic import to reduce initial bundle size
      const { driver } = require('driver.js')
      require('driver.js/dist/driver.css')
      
      // Configuration for RTL support and Persian language
      tourDriver = driver({
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
    }
    
    return tourDriver;
  }

  return {
    provide: {
      tour: {
        // Proxy methods to ensure driver is loaded when needed
        start: (...args: any[]) => getTourDriver().start(...args),
        moveNext: (...args: any[]) => getTourDriver().moveNext(...args),
        movePrevious: (...args: any[]) => getTourDriver().movePrevious(...args),
        hasNextStep: (...args: any[]) => getTourDriver().hasNextStep(...args),
        hasPreviousStep: (...args: any[]) => getTourDriver().hasPreviousStep(...args),
        getActiveIndex: (...args: any[]) => getTourDriver().getActiveIndex(...args),
        isActive: (...args: any[]) => getTourDriver().isActive(...args),
        destroy: (...args: any[]) => getTourDriver().destroy(...args),
        defineSteps: (...args: any[]) => getTourDriver().defineSteps(...args),
      },
    },
  }
})
