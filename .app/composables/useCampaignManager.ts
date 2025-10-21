import type { 
  NotificationCampaign, 
  CampaignForm, 
  CampaignMetrics, 
  CampaignAnalytics 
} from '~/../../types/campaigns'

export function useCampaignManager() {
  const { $pb } = useNuxtApp()

  // State
  const campaigns = ref<NotificationCampaign[]>([])
  const isLoading = ref(false)
  const isSaving = ref(false)

  // Fetch campaigns with pagination
  const fetchCampaigns = async (page = 1, perPage = 20, filter?: string) => {
    try {
      isLoading.value = true
      
      const resultList = await $pb.collection('notification_campaigns').getList(page, perPage, {
        sort: '-created',
        filter: filter || '',
        expand: 'creator_id,target_groups,template_id'
      })

      campaigns.value = resultList.items as unknown as NotificationCampaign[]
      return resultList
    } catch (error) {
      console.error('خطا در دریافت کمپین‌ها:', error)
      throw error
    } finally {
      isLoading.value = false
    }
  }

  // Create new campaign
  const createCampaign = async (formData: CampaignForm) => {
    try {
      isSaving.value = true
      
      const campaignData = {
        name: formData.name,
        description: formData.description,
        status: 'draft',
        creator_id: $pb.authStore.model?.id,
        target_groups: formData.target_groups,
        template_id: formData.template_id,
        schedule: formData.schedule,
        sent_count: 0,
        delivered_count: 0,
        opened_count: 0,
        clicked_count: 0
      }

      const campaign = await $pb.collection('notification_campaigns').create(campaignData)
      campaigns.value.unshift(campaign as unknown as NotificationCampaign)
      
      return campaign
    } catch (error) {
      console.error('خطا در ایجاد کمپین:', error)
      throw error
    } finally {
      isSaving.value = false
    }
  }

  // Update campaign
  const updateCampaign = async (campaignId: string, formData: Partial<CampaignForm>) => {
    try {
      isSaving.value = true
      
      const updated = await $pb.collection('notification_campaigns').update(campaignId, formData)
      
      // Update local state
      const index = campaigns.value.findIndex(c => c.id === campaignId)
      if (index > -1) {
        campaigns.value[index] = { ...campaigns.value[index], ...updated }
      }
      
      return updated
    } catch (error) {
      console.error('خطا در بروزرسانی کمپین:', error)
      throw error
    } finally {
      isSaving.value = false
    }
  }

  // Update campaign status
  const updateCampaignStatus = async (campaignId: string, status: NotificationCampaign['status']) => {
    try {
      const updated = await $pb.collection('notification_campaigns').update(campaignId, { status })
      
      // Update local state
      const index = campaigns.value.findIndex(c => c.id === campaignId)
      if (index > -1) {
        campaigns.value[index].status = status
      }
      
      return updated
    } catch (error) {
      console.error('خطا در تغییر وضعیت کمپین:', error)
      throw error
    }
  }

  // Delete campaign
  const deleteCampaign = async (campaignId: string) => {
    try {
      await $pb.collection('notification_campaigns').delete(campaignId)
      
      // Remove from local state
      campaigns.value = campaigns.value.filter(c => c.id !== campaignId)
    } catch (error) {
      console.error('خطا در حذف کمپین:', error)
      throw error
    }
  }

  // Get campaign metrics
  const getCampaignMetrics = (campaign: NotificationCampaign): CampaignMetrics => {
    const delivery_rate = campaign.sent_count > 0 
      ? Math.round((campaign.delivered_count / campaign.sent_count) * 100) 
      : 0
    
    const open_rate = campaign.delivered_count > 0 
      ? Math.round((campaign.opened_count / campaign.delivered_count) * 100) 
      : 0
    
    const click_rate = campaign.opened_count > 0 
      ? Math.round((campaign.clicked_count / campaign.opened_count) * 100) 
      : 0

    return {
      sent_count: campaign.sent_count,
      delivered_count: campaign.delivered_count,
      opened_count: campaign.opened_count,
      clicked_count: campaign.clicked_count,
      delivery_rate,
      open_rate,
      click_rate
    }
  }

  // Get campaign analytics with trend data
  const getCampaignAnalytics = async (campaignId: string): Promise<CampaignAnalytics> => {
    try {
      const campaign = await $pb.collection('notification_campaigns').getOne(campaignId, {
        expand: 'creator_id,target_groups,template_id'
      })

      // For now, return basic metrics - in a real implementation, 
      // you'd fetch historical data from a separate analytics collection
      const metrics = getCampaignMetrics(campaign as unknown as NotificationCampaign)
      
      return {
        campaign: campaign as unknown as NotificationCampaign,
        metrics,
        performance_trend: [] // Would be populated from analytics data
      }
    } catch (error) {
      console.error('خطا در دریافت آنالیتیک کمپین:', error)
      throw error
    }
  }

  // Launch campaign (change status to active and start sending)
  const launchCampaign = async (campaignId: string) => {
    try {
      // Update status to active
      await updateCampaignStatus(campaignId, 'active')
      
      // Here you would trigger the actual notification sending process
      // This could involve calling a server-side function or API endpoint
      console.log(`کمپین ${campaignId} راه‌اندازی شد`)
      
      return true
    } catch (error) {
      console.error('خطا در راه‌اندازی کمپین:', error)
      throw error
    }
  }

  // Pause campaign
  const pauseCampaign = async (campaignId: string) => {
    return await updateCampaignStatus(campaignId, 'paused')
  }

  // Resume campaign
  const resumeCampaign = async (campaignId: string) => {
    return await updateCampaignStatus(campaignId, 'active')
  }

  // Get campaigns by status
  const getCampaignsByStatus = (status: NotificationCampaign['status']) => {
    return campaigns.value.filter(c => c.status === status)
  }

  // Computed properties
  const activeCampaigns = computed(() => getCampaignsByStatus('active'))
  const draftCampaigns = computed(() => getCampaignsByStatus('draft'))
  const completedCampaigns = computed(() => getCampaignsByStatus('completed'))

  return {
    // State
    campaigns,
    isLoading,
    isSaving,

    // Computed
    activeCampaigns,
    draftCampaigns,
    completedCampaigns,

    // Methods
    fetchCampaigns,
    createCampaign,
    updateCampaign,
    updateCampaignStatus,
    deleteCampaign,
    getCampaignMetrics,
    getCampaignAnalytics,
    launchCampaign,
    pauseCampaign,
    resumeCampaign,
    getCampaignsByStatus
  }
}