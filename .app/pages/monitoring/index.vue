<template>
    <div class="min-h-screen bg-muted-50 dark:bg-muted-950 p-6">
        <div class="max-w-4xl mx-auto">
            <div class="text-center mb-8">
                <h1 class="text-3xl font-bold text-muted-800 dark:text-muted-100 mb-4">
                    سیستم نظارت
                </h1>
                <p class="text-muted-600 dark:text-muted-400">
                    نظارت و مدیریت سلامت سیستم اعلان‌ها
                </p>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                <NuxtLink to="/monitoring/overview"
                    class="bg-white dark:bg-muted-900 rounded-lg border border-muted-200 dark:border-muted-800 p-6 hover:shadow-lg transition-shadow">
                    <div class="flex items-center gap-4">
                        <div
                            class="w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-lg flex items-center justify-center">
                            <Icon name="lucide:activity" class="w-6 h-6 text-primary-600" />
                        </div>
                        <div>
                            <h3 class="text-lg font-semibold text-muted-800 dark:text-muted-100">
                                نمای کلی
                            </h3>
                            <p class="text-sm text-muted-600 dark:text-muted-400">
                                وضعیت کلی سیستم
                            </p>
                        </div>
                    </div>
                </NuxtLink>

                <NuxtLink to="/monitoring/logs"
                    class="bg-white dark:bg-muted-900 rounded-lg border border-muted-200 dark:border-muted-800 p-6 hover:shadow-lg transition-shadow">
                    <div class="flex items-center gap-4">
                        <div class="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                            <Icon name="lucide:file-text" class="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                            <h3 class="text-lg font-semibold text-muted-800 dark:text-muted-100">
                                گزارش‌ها
                            </h3>
                            <p class="text-sm text-muted-600 dark:text-muted-400">
                                گزارش‌های سیستم
                            </p>
                        </div>
                    </div>
                </NuxtLink>

                <NuxtLink to="/monitoring/alerting"
                    class="bg-white dark:bg-muted-900 rounded-lg border border-muted-200 dark:border-muted-800 p-6 hover:shadow-lg transition-shadow">
                    <div class="flex items-center gap-4">
                        <div class="w-12 h-12 bg-red-100 dark:bg-red-900 rounded-lg flex items-center justify-center">
                            <Icon name="lucide:alert-triangle" class="w-6 h-6 text-red-600" />
                        </div>
                        <div>
                            <h3 class="text-lg font-semibold text-muted-800 dark:text-muted-100">
                                هشدارها
                            </h3>
                            <p class="text-sm text-muted-600 dark:text-muted-400">
                                مدیریت هشدارها
                            </p>
                        </div>
                    </div>
                </NuxtLink>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
definePageMeta({
    title: 'سیستم نظارت',
    layout: 'sidebar'
})

useHead({ htmlAttrs: { dir: 'rtl' } })
</script>