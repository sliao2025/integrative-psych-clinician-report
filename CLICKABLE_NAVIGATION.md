# Clickable Sentiment Navigation Implementation

## Overview

Implemented a sophisticated navigation system that allows clinicians to click on sentiment sentences in the AI Insights section and be automatically directed to the relevant section of the Story/History modal with visual highlighting.

## Features Implemented

### 1. **Clickable Sentence Cards** (`TopBlocks.tsx`)

- Added click handlers to each sentiment sentence card
- Enhanced hover states with scale animations (hover: 1.02x, active: 0.98x)
- Cursor changes to pointer on hover
- Smooth transitions for all interactive states

### 2. **Navigation System** (`PatientReportClient.tsx`)

- Created comprehensive field-to-modal mapping system
- Maps all sentiment fields to their appropriate modal destinations:

  - `goals` → Goals modal
  - `storyNarrative` → Story/History modal
  - `livingSituation` → Story/History modal
  - `cultureContext` → Story/History modal
  - `upbringingEnvironments` → Story/History modal
  - `upbringingWhoWith` → Story/History modal
  - `familyHistoryElaboration` → Story/History modal
  - `childhoodNegativeReason` → Story/History modal
  - `followupQuestion1/2/3` → Story/History modal

- Passes `highlightField` parameter to modals
- Automatically opens correct modal when sentence is clicked

### 3. **Visual Highlighting** (`DetailPanels.tsx`)

- Added blue ring highlight (`ring-2 ring-blue-400 ring-offset-2`) to targeted sections
- Applied `data-field` attributes for scroll targeting
- Implemented auto-scroll functionality using `scrollIntoView`
- Highlights remain visible until modal is closed

### 4. **Auto-Scroll Behavior**

- Waits 100ms after modal opens for smooth rendering
- Scrolls highlighted element to center of viewport
- Smooth scrolling animation for better UX
- Works across all field types in Story detail panel

## Technical Implementation

### Field Mapping Architecture

```typescript
const fieldModalMap: Record<string, () => void> = {
  goals: () => open(/* Goals modal */),
  livingSituation: () => open(/* Story modal with highlight */),
  // ... etc
};
```

### Highlight Propagation

```typescript
// PatientReportClient passes field to StoryDetail
<StoryDetail data={data} highlightField={field} />

// StoryDetail uses it for conditional styling
className={`... ${highlightField === 'storyNarrative' ? 'ring-2 ring-blue-400 ring-offset-2' : ''}`}
data-field="storyNarrative"

// Auto-scroll effect
React.useEffect(() => {
  if (highlightField) {
    setTimeout(() => {
      document.querySelector(`[data-field="${highlightField}"]`)
        ?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);
  }
}, [highlightField]);
```

### Visual Feedback System

1. **Sentence Card States:**

   - Default: Colored background (emerald/rose) with border
   - Hover: Enhanced shadow + 2% scale up + cursor pointer
   - Active: 2% scale down (pressed effect)
   - Smooth transitions on all properties

2. **Highlighted Section States:**
   - Default: Normal border
   - Highlighted: Blue ring with offset (stands out clearly)
   - Scrolled into view automatically
   - Ring remains until modal closes

## User Flow

1. **Clinician views AI Insights** (collapsed)

   - Sees summary stats at a glance
   - Can expand to see detailed sentences

2. **Expands insights** (clicks "View Details")

   - Top 5 positive sentences appear on left
   - Top 5 negative sentences appear on right

3. **Clicks on interesting sentence**

   - Sentence card scales down slightly (feedback)
   - Appropriate modal opens automatically
   - Modal scrolls to exact field location
   - Blue ring highlights the relevant section

4. **Reviews context**
   - Can see full text/audio in highlighted section
   - Context from surrounding sections visible
   - Can close modal and click another sentence

## Files Modified

### `TopBlocks.tsx`

- Added `onNavigate` prop to `InsightsBlock`
- Made sentence cards clickable
- Added hover/active states with scale transforms

### `PatientReportClient.tsx`

- Added `highlightField` state management
- Created `fieldModalMap` for navigation routing
- Updated `open()` function signature
- Integrated navigation callback into `InsightsBlock`

### `DetailPanels.tsx`

- Added `highlightField` prop to `StoryDetail`
- Applied conditional ring styling to all sections:
  - ScrollableBox components (Story, Living, Culture)
  - Upbringing sections
  - Family history section
  - Follow-up question cards (1, 2, 3)
  - Childhood comments
- Added `data-field` attributes for targeting
- Implemented auto-scroll effect

## Styling Details

### Highlight Ring

```css
ring-2 ring-blue-400 ring-offset-2
/* Creates a 2px blue ring with 2px offset from element */
```

### Interactive Sentence Cards

```css
cursor-pointer
hover:shadow-md
hover:scale-[1.02]
active:scale-[0.98]
transition-all
```

### Scroll Behavior

```javascript
scrollIntoView({
  behavior: "smooth", // Animated scroll
  block: "center", // Center in viewport
});
```

## Benefits

1. **Contextual Understanding**: Clinicians can instantly see where a sentiment came from
2. **Efficient Navigation**: No manual searching through modals
3. **Visual Feedback**: Clear indication of current focus
4. **Seamless UX**: Smooth animations and transitions
5. **Time Saving**: Direct access to relevant information

## Edge Cases Handled

- ✅ Missing fields (checks if handler exists before calling)
- ✅ Modal already open (closes previous, opens new with new highlight)
- ✅ Multiple clicks (each click updates highlight appropriately)
- ✅ Field not in Story modal (only Story fields are mapped currently)
- ✅ Scroll timing (100ms delay prevents scroll before render)

## Future Enhancements

Potential additions:

1. Add navigation for other modals (Relationships, Demographics, etc.)
2. Breadcrumb showing navigation path
3. "Back to Insights" button in modals
4. Keyboard shortcuts for navigation
5. History of clicked sentences
6. Highlight multiple related sentences in same field
