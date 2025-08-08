# Quick Integration Guide - Memory Analysis with Toast Notifications

This guide shows you how to quickly integrate automatic memory analysis and toast notifications into your existing chat system.

## 🚀 Quick Start

### 1. Simple Integration (Replace existing sendMessage)

```typescript
// In your chat component
import { useMemoryIntegratedChat } from '~/composables/useMemoryIntegratedChat'

const { sendMessage } = useMemoryIntegratedChat()

// Replace your existing sendMessage calls with this:
const handleSendMessage = async () => {
  try {
    await sendMessage(messageContent.value, sessionId)
    // Memory analysis and toast notifications happen automatically!
  } catch (error) {
    console.error('Error sending message:', error)
  }
}
```

### 2. Enhanced Integration (More control)

```typescript
// In your chat component
import { useMemoryIntegratedChat } from '~/composables/useMemoryIntegratedChat'

const { sendMessageWithMemoryAnalysis } = useMemoryIntegratedChat()

const handleSendMessage = async () => {
  try {
    await sendMessageWithMemoryAnalysis(messageContent.value, sessionId, {
      showAnalysisToast: false,    // Set to true for debugging
      showMemoryToast: true,       // Show memory creation toasts
      extractMemories: true        // Enable automatic memory extraction
    })
  } catch (error) {
    console.error('Error sending message:', error)
  }
}
```

## 🧪 Testing the Integration

### Access the Test Page
1. Start your development server: `pnpm dev`
2. Navigate to `/test-memory-analysis` (added to sidebar)
3. Test with sample messages or write your own

### Sample Test Messages

**Will CREATE memories:**
- "نام من علی محمدی است و 28 ساله هستم"
- "هدف من از درمان غلبه بر اضطراب اجتماعی است"
- "وقتی با افراد غریبه صحبت می‌کنم قلبم تند می‌زند"
- "دیشب با مادرم دعوا کردم و خیلی ناراحت شدم"

**Will NOT create memories:**
- "سلام، چطورید؟"
- "متشکرم بابت کمکتون"
- "امروز هوا خوب است"

## 📱 Toast Notification Features

When a memory is created, users will see:

### Toast Content:
- **Title**: Emoji + "خاطره جدید ذخیره شد"
- **Message**: Category + extracted info preview
- **Action Button**: "مشاهده خاطرات" (links to /memories page)
- **Duration**: 4-5 seconds
- **Style**: Success color with brain icon

### Emoji Indicators:
- 🔥 High importance (8-10/10)
- ⭐ Medium importance (6-7/10)  
- 💡 Lower importance (1-5/10)

## 🔧 Integration with Existing Chat Systems

### Option 1: Wrapper Function
```typescript
// Wrap your existing sendMessage function
const originalSendMessage = useMessage().saveMessage
const { analyzeMessageWorth, storeMemoryWithToast } = useMemoryIntegratedChat()

const enhancedSendMessage = async (messageData) => {
  // Send message normally
  const result = await originalSendMessage(messageData)
  
  // Add memory analysis
  const analysis = await analyzeMessageWorth(messageData.content)
  if (analysis.isWorth && analysis.extractedInfo) {
    await storeMemoryWithToast(
      analysis.extractedInfo,
      analysis.suggestedCategory,
      { importance: analysis.suggestedImportance }
    )
  }
  
  return result
}
```

### Option 2: Enhanced Messaging Composable
```typescript
// Direct integration with enhanced messaging
const { sendEnhancedMessage } = useEnhancedMessaging()

const handleSendMessage = async () => {
  await sendEnhancedMessage(content, sessionId, {
    extractMemories: true,
    injectContext: true,  // Add relevant memory context
    showToasts: true      // Show memory creation toasts
  })
}
```

## 🎯 Memory Categories & Examples

| Category | Example | Toast Message |
|----------|---------|---------------|
| `personal_info` | "نام من سارا است" | "اطلاعات شخصی: نام من سارا است" |
| `goals` | "می‌خواهم اعتماد به نفسم را بالا ببرم" | "اهداف: می‌خواهم اعتماد به نفسم را..." |
| `symptoms` | "شب‌ها خواب ندارم" | "علائم: شب‌ها خواب ندارم" |
| `triggers` | "کارم استرس‌زا است" | "محرک‌ها: کارم استرس‌زا است" |
| `relationships` | "با همسرم مشکل دارم" | "روابط: با همسرم مشکل دارم" |

## 🔍 Manual Memory Extraction

For processing existing chat history:

```typescript
const { batchProcessMessages } = useMemoryIntegratedChat()

// Process existing messages
const existingMessages = [
  { content: "نام من علی است", sessionId: "session1" },
  { content: "مشکل اضطراب دارم", sessionId: "session1" }
]

await batchProcessMessages(existingMessages, true) // Shows progress
```

## ⚙️ Configuration Options

### Environment Variables
```bash
# Required: OpenRouter API key for AI analysis
OPENROUTER_API_KEY=your_key_here

# Optional: Custom analysis model
MEM0_ANALYSIS_MODEL=anthropic/claude-3.5-haiku
MEM0_ANALYSIS_TEMPERATURE=0.1
```

### Memory Analysis Thresholds
```typescript
// Customize what gets stored as memories
const customAnalysis = await analyzeMessageWorth(content, {
  minImportance: 6,        // Only store importance 6+
  categories: ['goals', 'symptoms'], // Only these categories
  strictMode: true         // More conservative analysis
})
```

## 🐛 Troubleshooting

### Common Issues:

1. **No toasts showing**
   - Check if `showToasts: true` is set
   - Verify user is authenticated
   - Check browser console for errors

2. **Analysis not working**
   - Verify OpenRouter API key is configured
   - Check network connectivity
   - Test with simple messages first

3. **Memory not saving**
   - Ensure PocketBase collections are created
   - Check user permissions
   - Verify database connection

### Debug Mode:
```typescript
// Enable debug toasts
await sendMessageWithMemoryAnalysis(content, sessionId, {
  showAnalysisToast: true  // Shows analysis result for debugging
})
```

## 📊 Analytics & Monitoring

Track memory creation:
```typescript
// Get memory statistics
const { getMemoryStats } = useMem0()
const stats = await getMemoryStats()

console.log(`Total memories: ${stats.total}`)
console.log('By category:', stats.byCategory)
```

## 🎨 Customizing Toast Appearance

```typescript
// Custom toast styling
toaster.show({
  title: '🧠 خاطره جدید',
  message: 'اطلاعات مهم ذخیره شد',
  color: 'success',
  icon: 'ph:brain-duotone',
  duration: 5000,
  actions: [
    {
      label: 'مشاهده',
      color: 'primary',
      size: 'sm',
      to: '/memories'
    }
  ]
})
```

## 🔄 Real-time Updates

For real-time memory updates across multiple sessions:

```typescript
// Listen for new memories
const { $pb } = useNuxtApp()

$pb.collection('memories').subscribe('*', (data) => {
  if (data.action === 'create') {
    // Handle new memory created
    console.log('New memory created:', data.record)
  }
})
```

## 📝 Next Steps

1. **Test thoroughly** with different message types
2. **Adjust thresholds** based on your users' needs  
3. **Monitor performance** and API usage
4. **Customize categories** for your specific use case
5. **Add more integration points** (session summaries, progress tracking, etc.)

The system is now ready for production use! Users will automatically see helpful toast notifications when important information is detected and stored as memories.