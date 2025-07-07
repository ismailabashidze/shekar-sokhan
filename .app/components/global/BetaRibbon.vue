<template>
  <div class="beta-ribbon from-primary-500 to-primary-600 dark:from-primary-600 dark:to-primary-700 hidden border border-white/10 bg-gradient-to-r font-semibold text-white shadow-md lg:block dark:border-white/5 dark:shadow-lg">
    <span>آزمایشی</span>
  </div>
</template>

<style scoped>
.beta-ribbon {
  position: fixed;
  top: 35px;
  left: -65px;
  transform: rotate(-45deg);
  padding: 8px 70px;
  z-index: 9999;
  font-family: var(--font-sans);
  transition: all 0.3s ease;
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}

.beta-ribbon span {
  display: inline-block;
  direction: rtl;
  font-size: 1.1rem;
  text-shadow: 0 1px 2px rgba(0,0,0,0.2);
}

@media (max-width: 768px) {
  .beta-ribbon {
    transform: rotate(-45deg) scale(0.85);
    top: 25px;
    left: -70px;
  }
}
</style>
