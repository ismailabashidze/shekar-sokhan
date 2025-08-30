# Refactor Plan: Messaging System Composables

## Overview
Refactor the large `messaging.vue` component script into smaller, focused composables organized by domain. This will improve maintainability, testability, and reusability.

## 1. Current Problems Analysis

### 1.1 State Management Issues
- 50+ refs in single component
- State scattered across multiple domains
- No clear ownership of state pieces
- Complex interdependencies between state items

### 1.2 Business Logic Problems
- Session management mixed with UI logic
- Message handling intertwined with AI integration
- Feedback system embedded in main component
- Audio features scattered throughout

### 1.3 Code Organization Issues
- 1000+ lines in single script setup
- No clear boundaries between concerns
- Difficult to test individual functionalities
- Hard to locate specific functionality

## 2. Target Architecture

### 2.1 Core Principles
- Single Responsibility Principle for each composable
- Clear domain boundaries
- Explicit dependencies between composables
- Shared state minimized and centralized

### 2.2 Domain Separation
1. **Messaging Domain** - Messages, sessions, therapist conversations
2. **AI Domain** - Chat streaming, analysis, typing effects
3. **User Domain** - Authentication, subscription, reports
4. **UI Domain** - Modals, emoji picker, scrolling
5. **Feedback Domain** - Message feedback collection
6. **Audio Domain** - Recording, TTS playback

## 3. Detailed Composable Breakdown

### 3.1 Messaging Domain

#### composables/messaging/useMessageOperations.ts
**Current Location**: Lines 200-350, 550-650, 750-850
**Responsibilities**:
- Load messages from database (`getMessages`)
- Send messages to database (`sendMessage`)
- Clear message history
- Coordinate with analysis system
**State Extracted**:
- `messages` ref
- `messageLoading` ref
- `currentLoadingTherapistId` ref

#### composables/messaging/useSessionOperations.ts
**Current Location**: Lines 350-450, 650-750, 1200-1350
**Responsibilities**:
- Create/get current session (`getCurrentSession`, `createSession`)
- End session (`endSession`)
- Generate session analysis and reports
- Handle session-based message operations
**State Extracted**:
- `activeSession` ref
- `sessionId` ref
- `isReportModalOpen` ref
- `isGeneratingAnalysis` ref

#### composables/messaging/useTherapistConversations.ts
**Current Location**: Lines 50-150, 950-1100
**Responsibilities**:
- Load therapist list (`getTherapists`)
- Manage conversation selection
- Handle therapist-specific UI (avatars, colors)
**State Extracted**:
- `conversations` ref
- `activeTherapistId` ref
- `expanded` ref

### 3.2 AI Domain

#### composables/ai/useChatStreaming.ts
**Current Location**: Lines 450-550, 850-950
**Responsibilities**:
- Stream AI responses (`streamChat`)
- Handle streaming chunks
- Manage streaming state
**State Extracted**:
- `streamingResponse` ref
- `isAIResponding` ref
- `isAIThinking` ref
- `thinkingResponse` ref

#### composables/ai/useInlineAnalysis.ts
**Current Location**: Lines 300-400, 700-800
**Responsibilities**:
- Generate inline message analysis (`generateInlineAnalysis`)
- Save analysis to database (`createAndLinkAnalysis`)
- Format analysis results
**State Extracted**:
- Analysis-related logic from submitMessage

#### composables/ai/useMultiMessageHandler.ts
**Current Location**: Lines 1050-1200
**Responsibilities**:
- Handle multi-message responses
- Sequential message display
- Timing coordination
**State Extracted**:
- `pendingMultiMessages` ref
- `isMultiMessageMode` ref

#### composables/ai/useTypingEffect.ts
**Current Location**: Lines 1400-1550
**Responsibilities**:
- Typing simulation effects
- Streaming buffer management
- Character-by-character display
**State Extracted**:
- `typingQueue` ref
- `displayedResponse` ref
- `isTypingActive` ref
- `streamingBuffer` ref
- `streamingTypingTimeout` ref

### 3.3 User Domain

#### composables/user/useUserSessionState.ts
**Current Location**: Lines 150-300, 1350-1500
**Responsibilities**:
- User authentication state
- Subscription monitoring
- Charge status management
- User report loading
**State Extracted**:
- `showNoCharge` ref
- `remainingTime` ref
- `startChargeTime` ref
- `timeToShow` ref
- `userSubscription` ref
- `userReport` ref
- `hasPreviousData` ref

### 3.4 UI Domain

#### composables/ui/useModals.ts
**Current Location**: Lines 1100-1200, 1500-1600
**Responsibilities**:
- All modal state management
- Modal open/close operations
- Modal-specific state
**State Extracted**:
- `isDeleteModalOpen` ref
- `isPremiumModalOpen` ref
- `isMessageDetailModalOpen` ref
- `isReportModalOpen` ref (shared with session)

#### composables/ui/useEmojiPicker.ts
**Current Location**: Lines 150-200, 1600-1700
**Responsibilities**:
- Emoji category management
- Emoji selection and insertion
- Tab navigation
**State Extracted**:
- `showEmojiPicker` ref
- `emojiCategories` array
- `currentCategory` ref
- `tabContainerRef` ref

#### composables/ui/useScrollManagement.ts
**Current Location**: Lines 400-500, 1700-1800
**Responsibilities**:
- Scroll position management
- Auto-scroll to bottom
- Scroll button visibility
**State Extracted**:
- `chatEl` ref
- `showScrollButton` ref

#### composables/ui/useAudioUI.ts
**Current Location**: Lines 1800-1900
**Responsibilities**:
- Audio UI state management
- Audio recording UI coordination
**State Extracted**:
- `showAudioUser` ref

### 3.5 Feedback Domain

#### composables/feedback/useMessageFeedback.ts
**Current Location**: Lines 900-1100
**Responsibilities**:
- Feedback form management
- Validation logic
- Submission handling
- Multi-step navigation
**State Extracted**:
- `isFeedbackModalOpen` ref
- `selectedMessageForFeedback` ref
- `feedbackForm` ref
- `feedbackStep` ref
- `feedbackErrors` ref
- `existingFeedback` ref
- `isSubmittingFeedback` ref

### 3.6 Audio Domain

#### composables/audio/useAudioFeatures.ts
**Current Location**: Lines 1900-2000
**Responsibilities**:
- Audio recording functionality
- Text-to-speech playback
- Audio state management
**State Extracted**:
- `play` function
- `isTTSLoading` ref
- `ttsError` ref
- `ttsLoadingMessageId` ref

## 4. State Centralization

### 4.1 composables/messaging/useMessagingState.ts
**Purpose**: Centralize shared state between composables
**State to Include**:
- `newMessage` ref (used by input and submission)
- `showAnalysis` ref (toggled for analysis display)
- Any state that multiple composables need to read/write

## 5. Implementation Strategy

### 5.1 Phase 1: Foundation (Days 1-3)
1. Create directory structure
2. Implement `useMessagingState.ts` with shared refs
3. Extract `useUserSessionState.ts`
4. Extract `useTherapistConversations.ts`

### 5.2 Phase 2: Core Messaging (Days 4-6)
1. Extract `useSessionOperations.ts`
2. Extract `useMessageOperations.ts`
3. Create coordination between session and message operations
4. Implement basic message loading/sending

### 5.3 Phase 3: UI Management (Days 7-9)
1. Extract `useModals.ts`
2. Extract `useEmojiPicker.ts`
3. Extract `useScrollManagement.ts`
4. Extract `useAudioUI.ts`

### 5.4 Phase 4: AI Integration (Days 10-13)
1. Extract `useChatStreaming.ts`
2. Extract `useInlineAnalysis.ts`
3. Extract `useMultiMessageHandler.ts`
4. Extract `useTypingEffect.ts`
5. Extract `useAIConversationStarter.ts`

### 5.5 Phase 5: Specialized Features (Days 14-16)
1. Extract `useMessageFeedback.ts`
2. Extract `useAudioFeatures.ts`
3. Implement TTS integration
4. Implement feedback collection

### 5.6 Phase 6: Integration (Days 17-20)
1. Integrate all composables in main component
2. Replace direct refs with composable returns
3. Test all user flows
4. Optimize performance
5. Documentation

## 6. Coordination Patterns

### 6.1 Parent-Child Relationships
```
Main Component
├── useMessagingState (shared state)
├── useUserSessionState → useTherapistConversations
├── useSessionOperations → useMessageOperations
└── useChatStreaming → useInlineAnalysis
```

### 6.2 Cross-Domain Communication
- Modals coordinate with session operations (end session → report modal)
- Message operations coordinate with AI streaming (send → stream response)
- Feedback system coordinates with message operations (feedback for specific message)

## 7. Migration Checklist

### 7.1 Before Each Composable
- [ ] Identify all state and methods in current component
- [ ] Map dependencies (other composables, external functions)
- [ ] Define clear interface/API
- [ ] Plan testing strategy

### 7.2 During Composable Creation
- [ ] Extract relevant state and methods
- [ ] Maintain existing functionality
- [ ] Add TypeScript typing
- [ ] Create unit tests

### 7.3 After Composable Integration
- [ ] Verify all functionality works
- [ ] Test edge cases
- [ ] Check performance impact
- [ ] Update documentation

## 8. Timeline and Milestones

### Week 1: Foundation and Core Messaging
- Days 1-3: Setup and user/session state
- Days 4-6: Message and session operations

### Week 2: UI Management
- Days 7-9: Modals, emoji picker, scrolling
- Days 10-11: AI streaming foundation

### Week 3: AI Integration
- Days 12-14: Complete AI functionality
- Days 15-16: Feedback and audio features

### Week 4: Integration and Testing
- Days 17-18: Main component integration
- Days 19-20: Testing and optimization

## 9. Success Metrics

### Code Quality
- Main component < 150 lines (from 1000+)
- Each composable < 150 lines
- 90%+ test coverage for business logic
- TypeScript typing for 100% of interfaces

### Performance
- No performance degradation in message loading
- Streaming response times maintained
- Memory usage optimized

### Maintainability
- Clear ownership of each functionality
- Easy to add new features
- Simple to modify existing behavior
- Comprehensive documentation