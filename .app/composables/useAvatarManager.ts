export function useAvatarManager() {
  const { $pb } = useNuxtApp()

  /**
   * دانلود آواتار از URL و ذخیره در PocketBase
   * @param userId شناسه کاربر
   * @param avatarUrl آدرس آواتار از Google
   * @returns Promise<string | null> نام فایل ذخیره شده یا null در صورت خطا
   */
  const downloadAndSaveAvatar = async (userId: string, avatarUrl: string): Promise<string | null> => {
    try {
      if (!avatarUrl || !userId) {
        console.warn('userId or avatarUrl is missing')
        return null
      }

      // چک کردن اینکه آیا avatar از Google است
      if (!avatarUrl.includes('googleusercontent.com') && !avatarUrl.includes('googleapis.com')) {
        console.log('Avatar URL is not from Google, skipping download')
        return null
      }

      console.log('⬇️ Downloading avatar from:', avatarUrl)

      // دانلود تصویر از Google
      const response = await fetch(avatarUrl)
      if (!response.ok) {
        throw new Error(`Failed to download avatar: ${response.status}`)
      }

      const blob = await response.blob()
      const contentType = response.headers.get('content-type') || 'image/jpeg'

      // تعیین پسوند فایل بر اساس content type
      let extension = 'jpg'
      if (contentType.includes('png')) extension = 'png'
      else if (contentType.includes('gif')) extension = 'gif'
      else if (contentType.includes('webp')) extension = 'webp'

      // ایجاد نام فایل یکتا
      const fileName = `avatar_${userId}_${Date.now()}.${extension}`

      // تبدیل blob به File
      const file = new File([blob], fileName, { type: contentType })

      // آپلود به PocketBase
      const formData = new FormData()
      formData.append('avatar', file)

      const updatedUser = await $pb.collection('users').update(userId, formData)

      console.log('✅ Avatar saved successfully:', fileName)
      return updatedUser.avatar
    }
    catch (error) {
      console.error('❌ Error downloading/saving avatar:', error)
      return null
    }
  }

  /**
   * دریافت URL کامل آواتار از PocketBase
   * @param userId شناسه کاربر
   * @param avatarFileName نام فایل آواتار
   * @returns URL کامل آواتار
   */
  const getAvatarUrl = (userId: string, avatarFileName: string): string => {
    if (!userId || !avatarFileName) {
      return '/img/avatars/1.png'
    }

    return $pb.files.getUrl({ id: userId, collectionName: 'users' }, avatarFileName)
  }

  /**
   * دریافت URL آواتار برای کاربر - اگر آواتار محلی وجود داشته باشد از آن استفاده می‌کند، وگرنه از meta.avatarUrl
   * @param user کاربر
   * @returns URL آواتار
   */
  const getUserAvatarUrl = (user: any): string => {
    // اولویت با فایل آواتار محلی
    if (user?.avatar && user?.id) {
      return getAvatarUrl(user.id, user.avatar)
    }

    // اگر آواتار محلی نداشت، از meta استفاده کن
    if (user?.meta?.avatarUrl) {
      return user.meta.avatarUrl
    }

    // آواتار پیش‌فرض
    return '/img/avatars/1.png'
  }

  /**
   * همگام‌سازی آواتار برای کاربری که آواتار محلی ندارد
   * @param userId شناسه کاربر
   */
  const syncUserAvatar = async (userId: string) => {
    try {
      // دریافت اطلاعات کاربر
      const user = await $pb.collection('users').getOne(userId)

      // اگر قبلاً آواتار محلی دارد، نیازی به همگام‌سازی نیست
      if (user.avatar) {
        console.log('User already has local avatar, skipping sync')
        return user.avatar
      }

      // اگر avatarUrl در meta وجود دارد، آن را دانلود کن
      if (user.meta?.avatarUrl) {
        console.log('🔄 Syncing avatar for user:', userId)
        return await downloadAndSaveAvatar(userId, user.meta.avatarUrl)
      }

      console.log('No avatar URL found in meta for user:', userId)
      return null
    }
    catch (error) {
      console.error('Error syncing user avatar:', error)
      return null
    }
  }

  return {
    downloadAndSaveAvatar,
    getAvatarUrl,
    getUserAvatarUrl,
    syncUserAvatar,
  }
}
