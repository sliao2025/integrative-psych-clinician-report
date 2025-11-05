# AI Insights Implementation

## Overview

Created a new **AI Insights** component that displays sentiment analysis data from the backend API, showing the top 5 most positive and top 5 most negative patient responses.

## Features

### 1. **InsightsBlock Component** (`TopBlocks.tsx`)

- Fetches sentiment data from the sentiment analysis API
- Displays loading state with animated spinner
- Handles error states gracefully
- Shows comprehensive sentiment analysis results

### 2. **Visual Elements**

#### Summary Statistics (3 cards):

- **Total Analyzed**: Shows total number of sentences analyzed
- **Positive**: Count and percentage of positive responses (emerald theme)
- **Negative**: Count and percentage of negative responses (rose theme)

#### Sentiment Cards:

Each sentence is displayed in a polished card with:

- **Quote**: The actual patient response in quotation marks
- **Field Label**: Human-readable label (e.g., "Living Situation", "Presenting Goals")
- **Confidence Score**: Visual progress bar + percentage
- **Icon**: TrendingUp (↗) for positive, TrendingDown (↘) for negative
- **Color Coding**:
  - Positive: Emerald green background/borders
  - Negative: Rose red background/borders

### 3. **Field Label Mapping**

Converts technical field names to readable labels:

- `livingSituation` → "Living Situation"
- `storyNarrative` → "Story/Narrative"
- `goals` → "Presenting Goals"
- `cultureContext` → "Cultural Context"
- `followupQuestion1/2/3` → "Follow-up Question 1/2/3"
- etc.

### 4. **Responsive Design**

- Mobile-first approach
- Two-column layout on desktop (positive | negative)
- Single column on mobile
- Scales text sizes appropriately
- Touch-friendly hover states

### 5. **Integration**

- Added to `PatientReportClient.tsx` right after `DemographicsHeader`
- Uses patient ID from route parameter for API call
- Matches existing design system with `intPsychTheme` colors

## API Integration

### Endpoint

```
POST https://sentiment-analysis-b5ikba4x4q-uk.a.run.app/analyze
```

### Request Body

```json
{
  "userId": "cmgi991fx0000s60d6dk383l5"
}
```

### Response Format

```typescript
{
  success: boolean;
  userId: string;
  result: {
    sentences: Array<{
      sentence: string;
      field: string;
      label: "positive" | "neutral" | "negative";
      score: number;
      scores: {
        positive: number;
        neutral: number;
        negative: number;
      };
    }>;
    average_score: number;
    total_sentences: number;
    breakdown: {
      positive: number;
      neutral: number;
      negative: number;
    }
  }
}
```

## UI/UX Details

### Loading State

- Branded spinner with secondary color accent
- "Analyzing responses..." message
- Consistent with report loading pattern

### Error State

- Amber warning card
- Clear error message
- Graceful degradation

### Color Palette

- **Positive**: Emerald (50, 200, 600, 700, 900 shades)
- **Negative**: Rose (50, 200, 600, 700, 900 shades)
- **Neutral**: Slate (for fallbacks)
- **Brand**: intPsychTheme.primary and secondary

### Typography

- Headings: DM Serif Text (matching report style)
- Body: System font stack
- Sizes: Responsive (11px → 16px based on breakpoint)

### Spacing

- Consistent with existing card spacing (3-5 units)
- Proper gap management in grids
- Balanced padding (3.5-5 units)

### Accessibility

- Semantic HTML structure
- ARIA labels where appropriate
- Clear visual hierarchy
- Sufficient color contrast ratios
- Keyboard navigation support

## Testing Checklist

- [ ] Verify API connection works with real patient IDs
- [ ] Test loading state appears and disappears correctly
- [ ] Confirm error handling for network failures
- [ ] Check responsive layout on mobile/tablet/desktop
- [ ] Validate sentiment scores display as percentages
- [ ] Ensure field labels map correctly
- [ ] Test with patients who have varying amounts of data
- [ ] Verify empty states (no positive/negative sentences)
- [ ] Check hover states and interactions

## Future Enhancements

Potential improvements:

1. Add filtering by field type
2. Include neutral sentences with toggle
3. Export insights as PDF section
4. Add tooltips with full sentiment breakdown
5. Trend analysis across multiple sessions
6. Highlight key phrases within sentences
7. Add comparison with population averages
