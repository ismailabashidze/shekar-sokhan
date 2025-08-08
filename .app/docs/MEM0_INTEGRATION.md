# Mem0 Integration Documentation

## Overview

This document describes the implementation and usage of mem0 memory layer integration in the Zehna mental health application. The integration provides persistent memory capabilities for AI therapy sessions, allowing the system to remember important information about users across sessions.

## Features

- **Automatic Memory Extraction**: Extracts and categorizes important information from therapy conversations
- **Contextual Memory Retrieval**: Provides relevant context for therapy sessions based on stored memories
- **Memory Management UI**: User-friendly interface for viewing and managing personal memories
- **Category-based Organization**: Organizes memories into relevant psychological categories
- **Search and Analytics**: Search through memories and track usage statistics

## Architecture

### Backend Collections

#### `memories` Collection (PocketBase)
```javascript
{
  user: "relation to users",           // User ID
  content: "text",                     // Memory content
  category: "select",                  // Memory category
  importance: "number (1-10)",         // Importance level
  source_type: "select",               // Source of memory
  source_id: "text",                   // Reference to source
  session_id: "relation to sessions",  // Related therapy session
  tags: "json",                        // Array of tags
  metadata: "json",                    // Additional metadata
  is_active: "bool",                   // Soft delete flag
  last_accessed: "date",               // Last access time
  access_count: "number"               // Usage counter
}
```

#### `memory_search_logs` Collection (Optional - Analytics)
```javascript
{
  user: "relation to users",
  query: "text",                       // Search query
  results_count: "number",             // Number of results
  session_context: "text"              // Session context
}
```

### Memory Categories

- **`personal_info`**: Names, age, family info, demographics
- **`goals`**: Therapy goals and objectives
- **`symptoms`**: Mental health symptoms and conditions
- **`triggers`**: Stress triggers and patterns
- **`relationships`**: Family, friends, relationship issues
- **`progress`**: Therapeutic progress and improvements
- **`preferences`**: User preferences and communication style
- **`therapy_notes`**: Important therapeutic insights
- **`important_events`**: Significant life events
- **`other`**: Miscellaneous information

### Source Types

- **`therapy_session`**: Extracted from therapy conversations
- **`user_input`**: Directly provided by user
- **`system_inference`**: Inferred by AI system
- **`therapist_note`**: Added by therapist

## Implementation

### Core Composables

#### `useMem0()` - Main memory management
Located: `.app/composables/useMem0.ts`

Key methods:
- `addMemory()` - Store new memories
- `searchMemories()` - Search through memories
- `getUserMemories()` - Paginated memory retrieval
- `updateMemory()` - Modify existing memories
- `deleteMemory()` - Soft delete memories
- `getMemoryStats()` - Get usage statistics

#### `useEnhancedMessaging()` - Therapy session integration
Located: `.app/composables/useEnhancedMessaging.ts`

Key methods:
- `sendEnhancedMessage()` - Send message with memory context
- `processAIResponse()` - Process AI response and extract memories
- `extractAndStoreMemories()` - Extract memories from conversations
- `getPersonalizedContext()` - Get relevant context for responses
- `endSessionWithMemoryExtraction()` - Generate session summary

### Pages

#### Memories Management Page
Location: `.app/pages/memories.vue`

Features:
- View all user memories with pagination
- Search and filter by category/importance
- Add/edit/delete memories manually
- Export memories to CSV
- Category-based visual organization
- Importance-based color coding

## Usage Examples

### Basic Memory Operations

```typescript
// Add a memory
const { addMemory } = useMem0()

await addMemory(
  "بیماری دیابت دارم و باید روزانه انسولین تزریق کنم",
  'personal_info',
  {
    importance: 9,
    tags: ['health', 'diabetes', 'medication'],
    sourceType: 'user_input'
  }
)

// Search memories
const { searchMemories } = useMem0()

const results = await searchMemories("دیابت", {
  category: 'personal_info',
  limit: 5,
  minImportance: 7
})

// Get user statistics
const { getMemoryStats } = useMem0()
const stats = await getMemoryStats()
console.log(`Total memories: ${stats.total}`)
```

### Enhanced Messaging Integration

```typescript
// Send message with automatic memory extraction and context
const { sendEnhancedMessage } = useEnhancedMessaging()

await sendEnhancedMessage(
  "امروز با مادرم دعوا کردم و خیلی ناراحت شدم",
  sessionId,
  {
    extractMemories: true,      // Extract new memories
    injectContext: true,        // Add relevant context
    memoryCategories: ['relationships', 'symptoms', 'triggers']
  }
)

// Process AI response
const { processAIResponse } = useEnhancedMessaging()

await processAIResponse(
  aiResponseText,
  userMessage,
  sessionId
)

// End session with summary
const { endSessionWithMemoryExtraction } = useEnhancedMessaging()

const summary = await endSessionWithMemoryExtraction(sessionId)
```

### Context Injection for Therapy

```typescript
// Get personalized context for AI responses
const { getPersonalizedContext } = useEnhancedMessaging()

const context = await getPersonalizedContext(
  "چطور میتونم استرسم رو کنترل کنم؟",
  sessionId
)

// Context will include relevant memories about:
// - Previous stress triggers
// - Coping strategies that worked
// - Personal information relevant to stress management
// - Progress in stress management
```

## Configuration

### Environment Variables

Add to your `.env` file:
```bash
# OpenRouter API key for mem0 LLM operations
OPENROUTER_API_KEY=your_openrouter_api_key_here

# Optional: Custom mem0 configuration
MEM0_MODEL=anthropic/claude-3.5-haiku  # Default model for extractions
MEM0_TEMPERATURE=0.1                    # Temperature for memory extraction
```

### Nuxt Configuration

The system is configured to externalize mem0 in production builds:

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  vite: {
    rollupOptions: {
      external: ['mem0ai'] // Prevent client-side bundling
    },
    optimizeDeps: {
      exclude: ['mem0ai']  // Exclude from optimization
    },
    ssr: {
      external: ['mem0ai'] // Server-side only
    }
  }
})
```

## Memory Extraction Process

### Automatic Extraction

When a user sends a message in therapy, the system:

1. **Context Injection**: Retrieves relevant memories and adds them to the AI prompt
2. **Message Processing**: Processes the user message and AI response
3. **Information Extraction**: Uses AI to extract new information in categories:
   - Personal information (name, age, family)
   - Goals and motivations
   - Symptoms and mental health issues
   - Triggers and stressors
   - Relationship information
   - Progress and improvements

4. **Storage**: Stores extracted information with metadata:
   - Importance score (1-10)
   - Category classification
   - Source tracking
   - Automatic tagging

### Manual Memory Management

Users can:
- Add memories manually through the UI
- Edit existing memories
- Delete unwanted memories
- Export their memory data
- View memory statistics and usage

## Privacy and Security

- **User Isolation**: Each user's memories are completely isolated
- **Soft Deletion**: Memories are soft-deleted (marked inactive) rather than permanently removed
- **Access Logging**: Memory access is logged for analytics and debugging
- **Encryption**: All memory data is stored encrypted in PocketBase
- **Data Export**: Users can export their memory data at any time

## Performance Considerations

### Optimization Features

- **Pagination**: Memory lists are paginated for performance
- **Lazy Loading**: Memories are loaded on-demand
- **Search Indexing**: Full-text search is optimized
- **Caching**: Frequently accessed memories are cached
- **Batch Processing**: Multiple memories can be processed in batches

### Memory Usage

- **Client-side**: Only essential memory management UI
- **Server-side**: All heavy mem0 processing happens server-side
- **Database**: Efficient indexing on user, category, and importance fields

## Integration Points

### Navigation
Added to sidebar navigation in `app.config.ts`:
```typescript
{
  title: 'خاطرات من',
  icon: { name: 'ph:brain', class: 'w-7 h-7' },
  to: '/memories'
}
```

### Therapy Chat Integration
Enhanced messaging can be integrated into existing chat systems by replacing standard message handling with enhanced versions.

### Report Integration
Memory data can be integrated into therapy reports and progress tracking.

## Troubleshooting

### Common Issues

1. **Mem0 Connection Issues**
   - Check OpenRouter API key configuration
   - Verify network connectivity
   - Check server logs for detailed errors

2. **Memory Not Saving**
   - Verify user authentication
   - Check PocketBase collection permissions
   - Ensure required fields are provided

3. **Search Not Working**
   - Check search query length (minimum 3 characters)
   - Verify user has memories to search
   - Check network connectivity

4. **Performance Issues**
   - Reduce search result limits
   - Check memory count per user
   - Consider archiving old memories

### Debug Mode

Enable debug logging by setting:
```typescript
// In your component
const debug = process.env.NODE_ENV === 'development'
if (debug) {
  console.log('Memory operation:', result)
}
```

## Future Enhancements

### Planned Features

1. **Advanced Analytics**
   - Memory usage patterns
   - Progress tracking through memories
   - Therapeutic insight generation

2. **AI-Powered Insights**
   - Pattern recognition in memories
   - Automated progress tracking
   - Therapeutic recommendation system

3. **Integration Expansions**
   - Export to external therapy systems
   - Integration with wearable devices
   - Voice-to-memory transcription

4. **Advanced Search**
   - Semantic search improvements
   - Time-based filtering
   - Emotional context search

## Support

For technical support or questions about the mem0 integration:

1. Check the troubleshooting section above
2. Review server logs for error details
3. Verify configuration settings
4. Test with minimal examples
5. Contact development team with specific error messages and reproduction steps

---

**Note**: This integration requires proper setup of PocketBase collections and OpenRouter API access. Make sure to test thoroughly in a development environment before deploying to production.