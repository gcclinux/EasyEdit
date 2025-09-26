export function formatDate(date: Date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function buildDailyJournalTemplate(date = new Date()) {
  const today = formatDate(date);
  return `## Daily Journal - ${today}

## Today's Focus
**Main Goal:** [What's your primary focus today?]

**Priorities:**
1. [Priority 1]
2. [Priority 2]
3. [Priority 3]

## Morning Reflection
**Mood:** [How are you feeling?]
**Energy Level:** [1-10]
**Weather:** [Current weather]

**Gratitude:**
- [Thing you're grateful for 1]
- [Thing you're grateful for 2]
- [Thing you're grateful for 3]

## Daily Tasks
- [ ] [Task 1]
- [ ] [Task 2]
- [ ] [Task 3]
- [ ] [Task 4]
- [ ] [Task 5]

## Habits Tracker
- [ ] Exercise/Movement
- [ ] Healthy Eating
- [ ] Reading
- [ ] Meditation/Mindfulness
- [ ] Adequate Sleep
- [ ] Water Intake

## Highlights
**Best Part of Today:**
[What made today special?]

**Something I Learned:**
[New insight, skill, or knowledge gained]

**Acts of Kindness:**
[Kind acts given or received]

## Challenges & Solutions
**Challenge:** [What was difficult today?]
**How I handled it:** [Your response/solution]
**What I learned:** [Insight gained]

## Evening Reflection
**Accomplishments:**
- [What did you achieve today?]
- [Small wins count too!]

**Things to Improve:**
- [What could be better tomorrow?]

**Tomorrow's Preparation:**
- [ ] [Prep task 1]
- [ ] [Prep task 2]

## Random Thoughts
[Space for any other thoughts, ideas, or observations]

---
*Journal entry for ${today}*`;
}
