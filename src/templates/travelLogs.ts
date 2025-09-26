export function formatDate(date: Date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function buildTravelLogsTemplate(date = new Date()) {
  const today = formatDate(date);
  const content = `## Travel Log: [Destination]

**Dates:** [Start Date] - [End Date]
**Travel Companions:** [Who you traveled with]
**Transportation:** [How you got there]
**Accommodation:** [Where you stayed]

## Trip Overview
[Brief summary of the trip purpose and highlights]

## Itinerary

### Day 1 - ${today}
**Activities:**
- [Activity 1] - [Time]
- [Activity 2] - [Time]
- [Activity 3] - [Time]

**Meals:**
- **Breakfast:** [Where/What]
- **Lunch:** [Where/What]
- **Dinner:** [Where/What]

**Highlights:** [Best part of the day]
**Challenges:** [Any issues or problems]

### Day 2 - ${today}
**Activities:**
- [Activity 1] - [Time]
- [Activity 2] - [Time]

**Meals:**
- **Breakfast:** [Where/What]
- **Lunch:** [Where/What]
- **Dinner:** [Where/What]

**Highlights:** [Best part of the day]
**Challenges:** [Any issues or problems]

## Places Visited

### [Location 1]
- **Rating:** ★★★★☆
- **Description:** [What you did/saw there]
- **Tips:** [Advice for future visitors]
- **Cost:** [If applicable]

### [Location 2]
- **Rating:** ★★★★☆
- **Description:** [What you did/saw there]
- **Tips:** [Advice for future visitors]
- **Cost:** [If applicable]

## Food & Restaurants

### [Restaurant Name]
- **Type:** [Cuisine type]
- **Location:** [Address/area]
- **Must Try:** [Recommended dishes]
- **Rating:** ★★★★☆
- **Price Range:** [$ - $$$]

## Accommodations
**Hotel/Airbnb:** [Name and location]
**Rating:** ★★★★☆
**Pros:** [What was good]
**Cons:** [What could be better]
**Would stay again:** [Yes/No]

## Transportation
**Method:** [Plane/Train/Car/etc.]
**Experience:** [How it went]
**Tips:** [Advice for future trips]

## Budget Breakdown
| Category | Planned | Actual | Notes |
|----------|---------|--------|-------|
| Flight | $[Amount] | $[Amount] | [Notes] |
| Accommodation | $[Amount] | $[Amount] | [Notes] |
| Food | $[Amount] | $[Amount] | [Notes] |
| Activities | $[Amount] | $[Amount] | [Notes] |
| **Total** | **$[Amount]** | **$[Amount]** | |

## Packing Notes
**What I packed but didn't need:**
- [Item 1]
- [Item 2]

**What I wish I had brought:**
- [Item 1]
- [Item 2]

## Cultural Observations
[Interesting cultural differences or observations]

## Language Notes
**Useful phrases learned:**
- [Phrase] - [Meaning]
- [Phrase] - [Meaning]

## Best Memories
1. [Memory 1]
2. [Memory 2]
3. [Memory 3]

## Things I'd Do Differently
- [Change 1]
- [Change 2]

## Recommendations for Others
**Must-see:** [Essential attractions]
**Must-eat:** [Essential foods]
**Must-do:** [Essential experiences]

## Photo Highlights
[List of best photo opportunities or memorable shots taken]

## Souvenirs
- [Souvenir 1] - [Where bought] - [Price]
- [Souvenir 2] - [Where bought] - [Price]

## Overall Trip Rating: ★★★★★

**Would I return:** [Yes/No and why]

---
*Travel log completed ${today}*`;
  return content;
}
