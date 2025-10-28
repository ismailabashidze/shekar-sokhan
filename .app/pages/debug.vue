<template>
  <div class="min-h-screen bg-gray-50 p-8">
    <div class="mx-auto max-w-4xl">
      <h1 class="mb-6 text-2xl font-bold text-gray-900">
        Middleware Debug Test
      </h1>

      <div class="mb-6 rounded-lg bg-white p-6 shadow">
        <h2 class="mb-4 text-lg font-semibold text-gray-900">
          Current Path Info
        </h2>
        <div class="space-y-2 text-sm">
          <div><strong>Path:</strong> {{ $route.path }}</div>
          <div><strong>Full Path:</strong> {{ $route.fullPath }}</div>
          <div><strong>Query:</strong> {{ $route.query }}</div>
        </div>
      </div>

      <div class="mb-6 rounded-lg bg-white p-6 shadow">
        <h2 class="mb-4 text-lg font-semibold text-gray-900">
          User Info
        </h2>
        <div class="space-y-2 text-sm">
          <div><strong>Authenticated:</strong> {{ !!user?.id }}</div>
          <div><strong>User ID:</strong> {{ user?.id || 'None' }}</div>
          <div><strong>User Name:</strong> {{ user?.name || 'None' }}</div>
          <div><strong>User Role:</strong> {{ user?.role || 'None' }}</div>
          <div><strong>User Zones:</strong> {{ user?.zones || [] }}</div>
        </div>
      </div>

      <div class="rounded-lg bg-white p-6 shadow">
        <h2 class="mb-4 text-lg font-semibold text-gray-900">
          Test Navigation
        </h2>
        <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
          <NuxtLink to="/publicDomain" class="btn btn-secondary">
            Public Domain (Should work)
          </NuxtLink>
          <NuxtLink to="/dashboard" class="btn btn-secondary">
            Dashboard (Requires auth)
          </NuxtLink>
          <NuxtLink to="/hamdel" class="btn btn-secondary">
            Hamdel Zone (Requires auth + zone)
          </NuxtLink>
          <NuxtLink to="/admin" class="btn btn-secondary">
            Admin Zone (Requires auth + admin role)
          </NuxtLink>
          <NuxtLink to="/publicDomain/zone-restriction?zone=test" class="btn btn-secondary">
            Zone Restriction (Should work)
          </NuxtLink>
          <NuxtLink to="/auth/login" class="btn btn-secondary">
            Login Page (Should work)
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// This page should be public - no middleware
definePageMeta({
  layout: false,
})

const { user } = useUser()
</script>
