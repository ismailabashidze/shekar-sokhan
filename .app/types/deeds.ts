export type DeedType = 'family' | 'society' | 'spiritual'

export interface DeedCategory {
  name: string | undefined
  icon: string | undefined
  difficulty: string | undefined
}

export interface Deed {
  type: DeedType | undefined
  title: string
  description: string
  startDate: Date | undefined
  endDate: Date | undefined
  category: DeedCategory
  evidence: File | null
  avatar: File | null
  beneficiaries: string[]
  requirements: string[]
  reward: string
}

export interface DeedStepData {
  to: string
  meta: {
    name: string
    title: string
    subtitle: string
    preview?: boolean
  }
  validate?: (context: {
    data: Ref<Deed>
    setFieldError: (field: string, message: string) => void
    resetFieldError: (fields: string[]) => void
  }) => void
}
