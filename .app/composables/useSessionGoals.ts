export type GoalType = 'general' | 'specific'
export type GoalStatus = 'pending' | 'in_progress' | 'achieved' | 'partially_achieved' | 'modified'
export type GoalPriority = 'high' | 'medium' | 'low'

export interface SessionGoal {
  id: string
  session_id: string
  user_id: string
  therapist_id: string
  goal_type: GoalType
  title: string
  description: string
  target_behaviors: string[]
  success_criteria: string[]
  priority: GoalPriority
  status: GoalStatus
  progress_percentage: number
  ai_evaluation: string
  notes: string
  created: string
  updated: string
  target_date?: string
  achieved_date?: string
  based_on_sessions?: string[] // IDs of sessions this goal is based on
}

export interface GoalTemplate {
  id: string
  title: string
  description: string
  goal_type: GoalType
  category: string
  target_behaviors: string[]
  success_criteria: string[]
  priority: GoalPriority
}

export interface GoalProgress {
  goal_id: string
  session_id: string
  progress_notes: string
  behavior_changes: string[]
  ai_assessment: string
  progress_percentage: number
  created: string
}

export const useSessionGoals = () => {
  const nuxtApp = useNuxtApp()

  // Predefined goal templates
  const goalTemplates: GoalTemplate[] = [
    {
      id: 'emotional_regulation',
      title: 'بهبود تنظیم احساسات',
      description: 'یادگیری مهارت‌های مدیریت احساسات منفی و افزایش آگاهی عاطفی',
      goal_type: 'general',
      category: 'emotional',
      target_behaviors: ['شناسایی احساسات', 'تکنیک‌های آرامش', 'مدیریت استرس'],
      success_criteria: ['کاهش شدت احساسات منفی', 'افزایش کنترل عاطفی'],
      priority: 'high'
    },
    {
      id: 'communication_skills',
      title: 'بهبود مهارت‌های ارتباطی',
      description: 'تقویت قدرت بیان، گوش دادن فعال و برقراری ارتباط سالم',
      goal_type: 'general',
      category: 'social',
      target_behaviors: ['بیان احساسات', 'گوش دادن فعال', 'حل تعارض'],
      success_criteria: ['بهبود روابط بین فردی', 'افزایش اعتماد به نفس در ارتباط'],
      priority: 'medium'
    },
    {
      id: 'anxiety_management',
      title: 'مدیریت اضطراب',
      description: 'کاهش علائم اضطراب و یادگیری تکنیک‌های مقابله‌ای',
      goal_type: 'specific',
      category: 'anxiety',
      target_behaviors: ['تکنیک‌های تنفسی', 'مواجهه تدریجی', 'تغییر الگوهای فکری'],
      success_criteria: ['کاهش حملات اضطراب', 'افزایش فعالیت‌های روزانه'],
      priority: 'high'
    },
    {
      id: 'self_esteem',
      title: 'تقویت عزت نفس',
      description: 'بهبود تصویر خود و افزایش اعتماد به نفس',
      goal_type: 'general',
      category: 'self_worth',
      target_behaviors: ['خودشناسی', 'تقویت نقاط قوت', 'چالش افکار منفی'],
      success_criteria: ['افزایش اعتماد به نفس', 'بهبود رضایت از زندگی'],
      priority: 'medium'
    },
    {
      id: 'depression_support',
      title: 'حمایت در مواجهه با افسردگی',
      description: 'کاهش علائم افسردگی و بهبود حالت خلقی',
      goal_type: 'specific',
      category: 'depression',
      target_behaviors: ['فعال‌سازی رفتاری', 'برنامه‌ریزی روزانه', 'حمایت اجتماعی'],
      success_criteria: ['بهبود خلق و خو', 'افزایش انگیزه و انرژی'],
      priority: 'high'
    }
  ]

  // Create a new session goal
  const createGoal = async (goalData: Partial<SessionGoal>) => {
    try {
      const goal = await nuxtApp.$pb.collection('session_goals').create({
        session_id: goalData.session_id,
        user_id: goalData.user_id,
        therapist_id: goalData.therapist_id,
        goal_type: goalData.goal_type,
        title: goalData.title,
        description: goalData.description,
        target_behaviors: goalData.target_behaviors || [],
        success_criteria: goalData.success_criteria || [],
        priority: goalData.priority || 'medium',
        status: 'pending',
        progress_percentage: 0,
        ai_evaluation: '',
        notes: '',
        based_on_sessions: goalData.based_on_sessions || [],
        created: new Date().toISOString(),
        updated: new Date().toISOString()
      })
      return goal
    } catch (error) {
      console.error('Error creating goal:', error)
      throw error
    }
  }

  // Get goals for a session
  const getSessionGoals = async (sessionId: string) => {
    try {
      const goals = await nuxtApp.$pb.collection('session_goals').getFullList({
        filter: `session_id = "${sessionId}"`,
        sort: '-created'
      })
      return goals as SessionGoal[]
    } catch (error) {
      console.error('Error fetching session goals:', error)
      return []
    }
  }

  // Get goals for a user across all sessions
  const getUserGoals = async (userId: string) => {
    try {
      const goals = await nuxtApp.$pb.collection('session_goals').getFullList({
        filter: `user_id = "${userId}"`,
        sort: '-created'
      })
      return goals as SessionGoal[]
    } catch (error) {
      console.error('Error fetching user goals:', error)
      return []
    }
  }

  // Update goal progress
  const updateGoalProgress = async (goalId: string, progressData: Partial<SessionGoal>) => {
    try {
      const updatedGoal = await nuxtApp.$pb.collection('session_goals').update(goalId, {
        ...progressData,
        updated: new Date().toISOString()
      })
      return updatedGoal
    } catch (error) {
      console.error('Error updating goal progress:', error)
      throw error
    }
  }

  // Generate AI-based goals from previous sessions
  const generateAIGoals = async (userId: string, sessionId: string, recentSessions: any[]) => {
    try {
      const { generateGoalsFromHistory } = useOpenRouter()
      
      // Validate input data
      if (!userId || !sessionId) {
        console.warn('Missing required parameters for AI goals generation')
        return []
      }
      
      if (!recentSessions || recentSessions.length === 0) {
        console.warn('No recent sessions available for AI goals generation')
        return []
      }
      
      // Prepare session history for AI analysis
      const sessionHistory = recentSessions.map(session => ({
        date: session.created || session.date || new Date().toISOString(),
        analysis: session.summary || session.analysis || 'خلاصه‌ای در دسترس نیست',
        emotions: session.emotions || 'احساسات مشخص نیست',
        topics: session.title || session.topics || 'موضوعات مشخص نیست',
        achievements: session.achievements || 'دستاوردهای مشخص نیست'
      }))

      // Generate goals based on session history
      const aiGoals = await generateGoalsFromHistory({
        userId,
        sessionId,
        sessionHistory,
        goalTemplates
      })

      return aiGoals
    } catch (error) {
      console.error('Error generating AI goals:', error)
      return []
    }
  }

  // Evaluate goal achievement
  const evaluateGoalAchievement = async (goalId: string, sessionMessages: any[]) => {
    try {
      const { evaluateGoalProgress } = useOpenRouter()
      
      const goal = await nuxtApp.$pb.collection('session_goals').getOne(goalId)
      
      const evaluation = await evaluateGoalProgress({
        goal,
        sessionMessages,
        previousProgress: goal.progress_percentage
      })

      // Update goal with AI evaluation
      await updateGoalProgress(goalId, {
        progress_percentage: evaluation.progress_percentage,
        ai_evaluation: evaluation.evaluation,
        status: evaluation.status
      })

      return evaluation
    } catch (error) {
      console.error('Error evaluating goal achievement:', error)
      throw error
    }
  }

  // Create goal progress entry
  const createGoalProgress = async (progressData: Partial<GoalProgress>) => {
    try {
      const progress = await nuxtApp.$pb.collection('goal_progress').create({
        goal_id: progressData.goal_id,
        session_id: progressData.session_id,
        progress_notes: progressData.progress_notes,
        behavior_changes: progressData.behavior_changes || [],
        ai_assessment: progressData.ai_assessment || '',
        progress_percentage: progressData.progress_percentage || 0,
        created: new Date().toISOString()
      })
      return progress
    } catch (error) {
      console.error('Error creating goal progress:', error)
      throw error
    }
  }

  // Get goal progress history
  const getGoalProgressHistory = async (goalId: string) => {
    try {
      const progressHistory = await nuxtApp.$pb.collection('goal_progress').getFullList({
        filter: `goal_id = "${goalId}"`,
        sort: '-created'
      })
      return progressHistory as GoalProgress[]
    } catch (error) {
      console.error('Error fetching goal progress history:', error)
      return []
    }
  }

  // First session goal templates
  const firstSessionGoalTemplates = [
    {
      title: 'معرفی سیستم و آشنایی با قابلیت‌های هوش مصنوعی',
      description: 'هوش مصنوعی باید خود و سیستم را معرفی کند و کاربر را تشویق کند درباره چیزهایی که می‌تواند انتظار داشته باشد سوال کند (شامل حمایت عاطفی، گفتگوهای روزانه درباره زندگی، معنای زندگی، خودشناسی، و سرویس‌های شخصی‌سازی شده)',
      goal_type: 'general' as GoalType,
      priority: 'high' as GoalPriority,
      target_behaviors: ['معرفی سیستم', 'توضیح قابلیت‌های حمایتی', 'ایجاد اعتماد اولیه'],
      success_criteria: ['کاربر درک کند که چه انتظاراتی می‌تواند داشته باشد', 'احساس راحتی در برقراری ارتباط']
    },
    {
      title: 'جمع‌آوری اطلاعات جمعیت‌شناختی',
      description: 'جمع‌آوری اطلاعات پایه کاربر شامل سن، جنسیت، وضعیت تحصیلات، شغل، و سایر اطلاعات مرتبط برای ارائه خدمات شخصی‌سازی شده',
      goal_type: 'specific' as GoalType,
      priority: 'high' as GoalPriority,
      target_behaviors: ['پرسش سوالات جمعیت‌شناختی', 'ثبت اطلاعات پایه', 'تکمیل پروفایل کاربر'],
      success_criteria: ['تکمیل اطلاعات پایه کاربر', 'شخصی‌سازی تعاملات بر اساس اطلاعات جمع‌آوری شده']
    },
    {
      title: 'ارزیابی وضعیت روانی کاربر',
      description: 'بررسی وضعیت روانی فعلی کاربر، شناسایی نیازهای عاطفی و روانی، و تعیین نقاط قوت و ضعف',
      goal_type: 'specific' as GoalType,
      priority: 'high' as GoalPriority,
      target_behaviors: ['پرسش سوالات مربوط به وضعیت روانی', 'ارزیابی حالت خلقی', 'شناسایی نیازهای روانی'],
      success_criteria: ['درک کلی از وضعیت روانی کاربر', 'شناسایی حوزه‌های نیازمند توجه']
    },
    {
      title: 'ایجاد رابطه حمایتی و مهربان',
      description: 'استفاده از کلمات بسیار حمایتی و مهربان برای ایجاد اعتماد و احساس امنیت در کاربر',
      goal_type: 'general' as GoalType,
      priority: 'high' as GoalPriority,
      target_behaviors: ['استفاده از زبان حمایتی', 'نشان دادن همدلی', 'ایجاد محیط امن'],
      success_criteria: ['کاربر احساس امنیت و اعتماد کند', 'برقراری ارتباط مثبت']
    },
    {
      title: 'بررسی علائم DSM-5 و اختلالات روانی',
      description: 'بررسی دقیق علائم مطابق با DSM-5 و شناسایی انواع عمده اختلالات روانی که ممکن است کاربر با آنها مواجه باشد',
      goal_type: 'specific' as GoalType,
      priority: 'medium' as GoalPriority,
      target_behaviors: ['ارزیابی علائم DSM-5', 'بررسی اختلالات مختلف روانی', 'شناسایی الگوهای رفتاری'],
      success_criteria: ['شناسایی علائم موجود', 'درک بهتر از وضعیت روانی کاربر', 'برنامه‌ریزی برای جلسات آینده']
    }
  ]

  // Check if this is the first session for a user
  const isFirstSession = async (userId: string) => {
    try {
      const userSessions = await nuxtApp.$pb.collection('sessions').getFullList({
        filter: `user = "${userId}" && status != "delete"`,
        sort: 'created'
      })
      return userSessions.length === 1 // Current session is the first one
    } catch (error) {
      console.error('Error checking if first session:', error)
      return false
    }
  }

  // Create first session goals automatically
  const createFirstSessionGoals = async (sessionId: string, userId: string, therapistId: string) => {
    try {
      // Check if this is the first session
      const isFirst = await isFirstSession(userId)
      if (!isFirst) {
        console.log('Not the first session, skipping automatic goal creation')
        return []
      }

      // Check if goals already exist for this session
      const existingGoals = await getSessionGoals(sessionId)
      if (existingGoals.length > 0) {
        console.log('Goals already exist for this session, skipping creation')
        return existingGoals
      }

      console.log('Creating first session goals automatically...')
      const createdGoals = []

      // Create goals for each first session template
      for (const template of firstSessionGoalTemplates) {
        const goalData = {
          session_id: sessionId,
          user_id: userId,
          therapist_id: therapistId,
          goal_type: template.goal_type,
          title: template.title,
          description: template.description,
          target_behaviors: template.target_behaviors,
          success_criteria: template.success_criteria,
          priority: template.priority
        }

        const goal = await createGoal(goalData)
        createdGoals.push(goal)
      }

      console.log(`Created ${createdGoals.length} first session goals`)
      return createdGoals
    } catch (error) {
      console.error('Error creating first session goals:', error)
      throw error
    }
  }

  return {
    goalTemplates,
    firstSessionGoalTemplates,
    createGoal,
    getSessionGoals,
    getUserGoals,
    updateGoalProgress,
    generateAIGoals,
    evaluateGoalAchievement,
    createGoalProgress,
    getGoalProgressHistory,
    isFirstSession,
    createFirstSessionGoals
  }
}