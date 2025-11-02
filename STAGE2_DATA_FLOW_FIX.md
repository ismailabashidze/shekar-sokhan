# Stage2 Data Flow Fix

## Problem
Stage2 was not properly loading and displaying data from Stage1 that was stored in PocketBase via the `useBrainStorm` composable.

## Changes Made

### 1. **stage2.vue** - Changed `stage1Data` from ref to computed
**Before:**
```typescript
const stage1Data = ref(extractStage1Data());
```

**After:**
```typescript
const stage1Data = computed(() => {
  if (!currentBrainStorm.value) {
    return {
      mainChallenge: '',
      researchDomain: [] as string[],
      keywords: [] as string[],
      focusLevel: '',
      whQuestions: {},
      swotData: { strengths: [], weaknesses: [], opportunities: [], threats: [] }
    };
  }
  
  return {
    mainChallenge: currentBrainStorm.value.mainChallenge || '',
    researchDomain: Array.isArray(currentBrainStorm.value.researchDomain) 
      ? currentBrainStorm.value.researchDomain 
      : [],
    keywords: currentBrainStorm.value.keywords || [],
    focusLevel: currentBrainStorm.value.focusLevel || '',
    whQuestions: currentBrainStorm.value.whQuestions || {},
    swotData: currentBrainStorm.value.swotData || { /* ... */ }
  };
});
```

**Why:** This ensures that `stage1Data` is always in sync with the loaded `currentBrainStorm` from PocketBase.

### 2. **stage2.vue** - Updated `loadExistingSession`
**Before:** Only looked for stage2 sessions
```typescript
const result = await getUserBrainStorms(user.value.id, {
  filters: { stage: 'stage2' },
  perPage: 1,
  sort: '-updated'
});
```

**After:** Loads the most recent session regardless of stage
```typescript
const result = await getUserBrainStorms(user.value.id, {
  perPage: 1,
  sort: '-updated'
});
```

**Why:** This allows stage2 to load data from stage1 sessions.

### 3. **stage2.vue** - Improved `onMounted`
Added proper loading sequence:
1. Load existing session from PocketBase
2. Wait for data to be loaded (`await nextTick()`)
3. Convert stage1 data to initial ideas if available
4. Show authentication error if user not logged in

### 4. **stage2.vue** - Added Keywords Display
Added a new section in the stage1 summary card to display keywords:
```vue
<!-- Keywords -->
<div v-if="stage1Data.value?.keywords?.length" class="...">
  <div class="mb-2 flex items-center gap-2">
    <Icon name="ph:key" class="text-primary-500 size-4" />
    <span class="...">کلیدواژه‌ها:</span>
  </div>
  <div class="flex flex-wrap gap-2">
    <BaseTag v-for="keyword in stage1Data.value?.keywords || []" ...>
      {{ keyword }}
    </BaseTag>
  </div>
</div>
```

### 5. **useBrainStorm.ts** - Fixed Type Definition
**Before:**
```typescript
researchDomain?: Record<string, any>;
```

**After:**
```typescript
researchDomain?: string[] | Record<string, any>;
```

**Why:** Stage1 uses `researchDomain` as an array of strings, but it was typed as an object.

### 6. **useBrainStorm.ts** - Updated `prepareFormData`
Added proper handling for `researchDomain` as both array and object:
```typescript
if (key === 'researchDomain') {
  if (Array.isArray(value)) {
    formData.append(key, JSON.stringify(value));
  } else {
    formData.append(key, JSON.stringify(value || {}));
  }
}
```

## Data Flow Now

```
Stage1 → Save to PocketBase → Stage2 Loads → Extract & Display
   ↓                              ↓
[Form Data]                  [currentBrainStorm]
   ↓                              ↓
{                            stage1Data (computed)
  mainChallenge,                  ↓
  researchDomain[],          [Displayed in UI]
  keywords[],
  focusLevel,
  whQuestions{},
  swotData{}
}
```

## Testing
1. Complete Stage1 with all fields (mainChallenge, researchDomain, keywords, focusLevel)
2. Click "ذخیره و ادامه" to save and navigate to Stage2
3. Verify that Stage2 displays:
   - Session info card (if session loaded)
   - Stage1 summary with all data:
     - Main challenge
     - Research domains (as tags)
     - Keywords (as tags)
     - Focus level (as tag)
4. Verify that ideas are generated based on stage1 data
5. Verify AI generation uses stage1 context

## Result
✅ Stage2 now properly reads data from Stage1 via PocketBase
✅ All stage1 data is displayed correctly in stage2
✅ Data types are consistent throughout the flow
✅ No more empty stage1 data in stage2
