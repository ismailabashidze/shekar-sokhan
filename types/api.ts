// API Types based on the OpenAPI specification

// Auth DTOs
export interface RegisterDto {
  email: string
  password: string
  acceptTerms?: boolean
}

export interface RegisterResponseDto {
  userId: string
  emailVerificationRequired: boolean
}

export interface LoginDto {
  email: string
  password: string
}

export interface AuthTokensDto {
  accessToken: string
  refreshToken: string
  tokenType: string
  expiresIn: number
}

export interface RefreshTokenDto {
  refreshToken: string
}

export interface EmailDto {
  email: string
}

export interface ResetPasswordDto {
  token: string
  newPassword: string
}

export interface GoogleOAuthUrlDto {
  url: string
}

export interface GoogleCallbackDto {
  code: string
}

export interface VerifyEmailDto {
  token: string
}

export interface MeResponseDto {
  userId: string
  email: string
  emailVerified: boolean
}

export interface JwksResponseDto {
  keys: Array<{
    [key: string]: any
  }>
}

// File DTOs
export interface UploadTokenRequestDto {
  fileType: 'PROFILE_IMAGE' | 'DOCUMENT' | 'SESSION_RECORDING' | 'COURSE_MATERIAL' | 'ASSESSMENT_FILE' | 'MESSAGE_ATTACHMENT' | 'NOTIFICATION_ATTACHMENT'
  fileName: string
  fileSize: number
}

export interface UploadTokenResponseDto {
  uploadUrl: string
  fileId: string
  expiresAt: string
}

export interface DownloadTokenRequestDto {
  fileId: string
}

export interface DownloadTokenResponseDto {
  downloadUrl: string
  expiresAt: string
}

export interface FileMetadataDto {
  id: string
  fileId: string
  userId: string
  fileName: string
  fileType: 'PROFILE_IMAGE' | 'DOCUMENT' | 'SESSION_RECORDING' | 'COURSE_MATERIAL' | 'ASSESSMENT_FILE' | 'MESSAGE_ATTACHMENT' | 'NOTIFICATION_ATTACHMENT'
  fileSize: number
  mimeType: string
  status: 'PENDING' | 'UPLOADED' | 'PROCESSING' | 'READY' | 'ERROR' | 'DELETED'
  s3Key: string
  createdAt: string
  updatedAt: string
  deletedAt: string
}

export interface FileAccessValidationDto {
  hasAccess: boolean
  permissions: string[]
}

// Profile DTOs
export interface PersonalInfoDto {
  id: string
  firstName: string
  lastName: string
  email: string
  phoneNumber: string
  dateOfBirth: string
  gender: 'MALE' | 'FEMALE'
  profilePicture?: string
}

export interface EducationInfoDto {
  id: string
  institutionName: string
  degree: string
  fieldOfStudy: string
  educationLevel: 'HIGH_SCHOOL' | 'BACHELOR' | 'MASTER' | 'PHD' | 'VOCATIONAL' | 'OTHER'
  startDate: string
  endDate?: string
  isCurrent: boolean
  isGraduated: boolean
}

export interface OccupationInfoDto {
  id: string
  currentPosition: string
  companyName: string
  industry: string
  employmentType: 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'FREELANCE' | 'INTERNSHIP'
  startDate: string
  endDate?: string
  isCurrentJob: boolean
}

export interface LocationInfoDto {
  id: string
  city: string
  state: string
  country: string
  isCurrent: boolean
}

export interface DemographicsDto {
  id: string
  education: EducationInfoDto[]
  occupation: OccupationInfoDto[]
  location: LocationInfoDto[]
}

export interface CommunicationPreferencesDto {
  email: boolean
  sms: boolean
}

export interface PreferencesDto {
  id: string
  communication: CommunicationPreferencesDto
}

export interface PrivacySettingsDto {
  id: string
  isProfileVisibleToCounselors: boolean
  isProfileVisibleToOtherUsers: boolean
  allowDataAnalysisForMatching: boolean
}

export interface UserProfileDto {
  id: string
  userId: string
  personalInfo: PersonalInfoDto
  demographics: DemographicsDto
  preferences: PreferencesDto
  privacySettings: PrivacySettingsDto
  status: 'ACTIVE' | 'PENDING_VERIFICATION' | 'SUSPENDED' | 'DEACTIVATED'
  createdAt: string
  updatedAt: string
}

export interface UpdateUserStatusDto {
  status: 'ACTIVE' | 'PENDING_VERIFICATION' | 'SUSPENDED' | 'DEACTIVATED'
}

// Notification DTOs
export interface NotificationDto {
  id: string
  userId: string
  type: string
  channel: string
  title: string
  message: string
  data?: { [key: string]: any }
  status: string
  createdAt: string
  deliveredAt?: string
  readAt?: string
}

export interface NotificationListDto {
  notifications: NotificationDto[]
  total: number
  page: number
}

export interface UnreadCountResponseDto {
  count: number
}

export interface NotificationPreferencesDto {
  inApp: boolean
  email: boolean
  sms: boolean
  push: boolean
}

// System Notification DTOs
export interface SystemNotificationDto {
  id: string
  userId: string
  type: string
  channel: string
  title: string
  message: string
  data?: { [key: string]: any }
  status: string
  createdAt: string
  deliveredAt?: string
  readAt?: string
  recipients: string[]
}

export interface SystemNotificationListDto {
  notifications: SystemNotificationDto[]
  total: number
  page: number
}

export interface CreateNotificationDto {
  title: string
  message: string
  type: string
  recipients: string[]
  data?: { [key: string]: any }
}

// Session DTOs
export interface SessionNoteDto {
  id: string
  sessionId: string
  title: string
  content: string
  isPrivate: boolean
  type: 'OBSERVATION' | 'RECOMMENDATION' | 'PROGRESS' | 'ISSUE' | 'GOAL'
  priority: 'LOW' | 'MEDIUM' | 'HIGH'
  attachments: string[]
}

export interface SessionReportDto {
  id: string
  summary: string
  generatedAt: string
}

export interface SessionAnalysisDto {
  status: 'QUEUED' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'CANCELLED'
  completedAt?: string
  analysis?: { [key: string]: any }
}

export interface SessionMetadataDto {
  platform: string
  meetingUrl?: string
  recordingUrl?: string
}

export interface CounselingSessionDto {
  id: string
  applicantId: string
  counselorId: string
  status: 'REQUESTED' | 'ACCEPTED' | 'REJECTED' | 'CANCELLED_BY_APPLICANT' | 'CANCELLED_BY_COUNSELOR' | 'COMPLETED' | 'CONFIRMED' | 'IN_PROGRESS' | 'NO_SHOW'
  type: 'INITIAL_CONSULTATION' | 'FOLLOW_UP' | 'CRISIS_INTERVENTION' | 'ASSESSMENT_SESSION' | 'PROGRESS_REVIEW' | 'TERMINATION'
  scheduledAt: string
  startedAt?: string
  endedAt?: string
  durationMinutes: number
  paymentStatus: 'PENDING' | 'PROCESSING' | 'SUCCESSFUL' | 'FAILED' | 'CANCELLED' | 'REFUNDED'
  notes?: SessionNoteDto[]
  report?: SessionReportDto
  analysis?: SessionAnalysisDto
  metadata?: SessionMetadataDto
}

export interface CreateSessionDto {
  applicantId: string
  counselorId: string
  type: 'INITIAL_CONSULTATION' | 'FOLLOW_UP' | 'CRISIS_INTERVENTION' | 'ASSESSMENT_SESSION' | 'PROGRESS_REVIEW' | 'TERMINATION'
  scheduledAt: string
}

export interface CreateSessionResponseDto {
  session: CounselingSessionDto
  paymentUrl?: string
}

export interface UpdateSessionDto {
  status?: 'REQUESTED' | 'ACCEPTED' | 'REJECTED' | 'CANCELLED_BY_APPLICANT' | 'CANCELLED_BY_COUNSELOR' | 'COMPLETED' | 'CONFIRMED' | 'IN_PROGRESS' | 'NO_SHOW'
  meetingUrl?: string
  startedAt?: string
  endedAt?: string
  durationMinutes?: number
  paymentStatus?: 'PENDING' | 'PROCESSING' | 'SUCCESSFUL' | 'FAILED' | 'CANCELLED' | 'REFUNDED'
}

export interface TimeSlotDto {
  startTime: string
  endTime: string
  isAvailable: boolean
}

export interface PaymentStatusCallbackDto {
  paymentId: string
  sessionId: string
  status: 'PENDING' | 'PROCESSING' | 'SUCCESSFUL' | 'FAILED' | 'CANCELLED' | 'REFUNDED'
}

// Course DTOs
export interface LessonDto {
  id: string
  title: string
}

export interface CourseDto {
  id: string
  title: string
  thumbnail?: string
  lessons: LessonDto[]
}

export interface CreateLessonDto {
  title: string
}

export interface UpdateLessonDto {
  title: string
}

export interface EnrollInCourseDto {
  courseId: string
}

export interface EnrollmentMetadataDto {
  couponCode?: string
}

export interface EnrollmentDto {
  id: string
  courseId: string
  status: 'IN_PROGRESS' | 'COMPLETED'
  paymentStatus: 'PENDING' | 'SUCCESSFUL' | 'FAILED'
  metadata?: EnrollmentMetadataDto
}

export interface PaymentCallbackDto {
  enrollmentId: string
  status: 'PENDING' | 'SUCCESSFUL' | 'FAILED'
  paymentId: string
}

export interface LearningProgressDto {
  courseId: string
}

export interface UpdateLessonProgressDto {
  status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED'
}

export interface CourseNoteDto {
  userId: string
  courseId: string
  content: string
  type: 'OBSERVATION' | 'RECOMMENDATION' | 'ISSUE'
  priority: 'LOW' | 'MEDIUM' | 'HIGH'
  analyzeRequested: boolean
}

export interface AddNoteAttachmentDto {
  noteId: string
  fileId: string
  fileName: string
  fileType: string
  fileSize: number
}

export interface NotesUploadUrlResponseDto {
  uploadUrl: string
  fileId: string
}

export interface LearningReportDto {
  id: string
  reportType: 'LEARNING_PROGRESS' | 'KNOWLEDGE_GAPS'
  analysis?: { [key: string]: any }
}

// Matchmaking DTOs
export interface MatchSuggestionDto {
  id: string
  suggestedUserId: string
  compatibilityScore: number
  analysis?: { [key: string]: any }
  status: string
  createdAt: string
  expiresAt: string
}

export interface SuggestionListDto {
  suggestions: MatchSuggestionDto[]
  total: number
  page: number
}

export interface UpdateSuggestionRequestDto {
  action: string
  feedback?: string
}

export interface PairAnalysisViewDto {
  userId: string
  compatibilityScore: number
  analysis?: { [key: string]: any }
  createdAt: string
}

export interface AnalysisViewListDto {
  analyses: PairAnalysisViewDto[]
  total: number
  page: number
}

export interface CreateIntroductionRequestDto {
  targetId: string
  message?: string
}

export interface IntroductionRequestDto {
  id: string
  requesterId: string
  targetId: string
  status: string
  message?: string
  requestedAt: string
  respondedAt?: string
  expiresAt: string
}

export interface IntroductionRequestListDto {
  requests: IntroductionRequestDto[]
  total: number
  page: number
}

export interface RespondRequestDto {
  action: string
  message?: string
}

export interface MatchmakingModuleDto {
  id: string
  userId: string
  status: string
  enabledAt?: string
  disabledAt?: string
  createdAt: string
  updatedAt: string
}

export interface DisableModuleDto {
  reason?: string
}

export interface UpdateModuleStatusAdminDto {
  status: string
  reason?: string
}

// Assessment DTOs
export interface AssessmentTemplateDto {
  id: string
  name: string
  description: string
  version: number
  formSchema: { [key: string]: any }
  createdAt: string
  updatedAt: string
}

export interface AssessmentInstanceDto {
  id: string
  userId: string
  templateId: string
  status: string
  templateSnapshot: { [key: string]: any }
  responses: { [key: string]: any }
  assignedAt: string
  completedAt?: string
}

export interface SubmitAssessmentDto {
  responses: { [key: string]: any }
}

export interface AssessmentResultDto {
  id: string
  assessmentId: string
  userId: string
  summary: string
  scores: Array<{ [key: string]: any }>
  analysis?: { [key: string]: any }
  generatedAt: string
}

export interface QuestionnaireProgressDto {
  questionnaireId: string
  title: string
  category: string
  status: string
  progress: number
  startedAt: string
  completedAt?: string
}

export interface AssessmentProgressDto {
  userId: string
  questionnaires: QuestionnaireProgressDto[]
  overallProgress: number
  totalCompleted: number
  totalInProgress: number
}

// Counselor DTOs
export interface SpecializationDto {
  name: string
  level: string
}

export interface CounselorPublicProfileDto {
  id: string
  firstName: string
  lastName: string
  profilePicture?: string
  bio?: string
  specializations: SpecializationDto[]
  yearsOfExperience: number
}

export interface AvailabilityDto {
  timeSlots: TimeSlotDto[]
  timezone: string
}

export interface CounselorPersonalInfoDto {
  firstName: string
  lastName: string
  gender: 'MALE' | 'FEMALE'
  bio?: string
  profilePicture?: string
}

export interface ProfessionalInfoDto {
  certifications: string[]
  yearsOfExperience: number
}

export interface RateInfoDto {
  amount: number
  currency: string
  unit: string
}

export interface CounselorProfileDto {
  id: string
  personalInfo: CounselorPersonalInfoDto
  professionalInfo: ProfessionalInfoDto
  specializations: SpecializationDto[]
  availability: AvailabilityDto
  rates: RateInfoDto[]
  verificationStatus: string
}

export interface GenerateProfilePhotoUploadTokenDto {
  fileName: string
  fileSize: number
}

export interface UpdateProfilePhotoDto {
  fileId: string
}

export interface ProfilePhotoResponseDto {
  profilePicture: string
}

export interface ClientNoteDto {
  content: string
  createdAt: string
}

export interface ClientGoalDto {
  title: string
  description: string
  status: string
  targetDate: string
}

export interface CreateCounselorApplicantLinkDto {
  counselorId: string
  applicantId: string
  notes?: string
}

export interface CounselorApplicantLinkDto {
  counselorId: string
  applicantId: string
  status: string
  notes?: string
}

export interface UpdateCounselorApplicantLinkDto {
  status?: string
  notes?: string
}

export interface VerificationDocumentDto {
  fileId: string
  type: string
}

export interface VerificationStatusDto {
  status: string
  submittedAt?: string
}

export interface VerificationRequestDto {
  id: string
  counselorId: string
  status: string
  documents: VerificationDocumentDto[]
}

export interface KeycloakConsistencyValidationDto {
  lastSyncAt: string
}

export interface SyncStatusDto {
  keycloakLastUpdate: string
  profileLastUpdate: string
  syncStatus: string
}

// Onboarding DTOs
export interface JourneyViewDto {
  currentState: { [key: string]: any }
  overallProgress: { [key: string]: any }
  currentTasks: Array<{ [key: string]: any }>
  nextState: { [key: string]: any }
  roadmapView: Array<{ [key: string]: any }>
}

export interface UpdateMyJourneyTaskDto {
  status?: string
  progress?: number
}

export interface StateTaskAssignmentDto {
  id: string
  type: string
  refId: string
  required: boolean
  status: string
  progress: number
}

export interface StateChangeLogDto {
  id: string
  at: string
  actor: string
  action: string
  field: string
  before: { [key: string]: any }
  after: { [key: string]: any }
  reason?: string
}

export interface UserStateNodeDto {
  id: string
  key: string
  title: string
  status: string
  progress: number
  order: number
  assignments: StateTaskAssignmentDto[]
  startedAt: string
  completedAt?: string
  changeLog: StateChangeLogDto[]
}

export interface TransitionDefinitionDto {
  id: string
  fromStateId: string
  toStateId: string
  auto: boolean
  conditions: Array<{ [key: string]: any }>
}

export interface UserRoadmapDto {
  id: string
  userId: string
  startStateId: string
  nodes: UserStateNodeDto[]
  transitions: TransitionDefinitionDto[]
  createdAt: string
  updatedAt: string
}

export interface RoadmapTemplateDto {
  id: string
  name: string
  description: string
  startStateId: string
  nodes: UserStateNodeDto[]
  transitions: TransitionDefinitionDto[]
  version: number
  createdAt: string
  updatedAt: string
}