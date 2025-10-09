export function formatDate(date: Date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function buildStudyNotesTemplate(date = new Date()) {
  const today = formatDate(date);
  const content = `## Study Notes: [Subject/Topic]

**Course:** [Course Name]   
**Chapter/Unit:** [Chapter/Unit Number]   
**Date:** ${today}   
**Instructor:** [Instructor Name]   

## Learning Objectives
- [ ] [Objective 1]
- [ ] [Objective 2]
- [ ] [Objective 3]

## Key Concepts

### [Concept 1]
**Definition:** [Define the concept]   
**Explanation:** [Detailed explanation]   
**Examples:**    
- [Example 1]
- [Example 2]

### [Concept 2]
**Definition:** [Define the concept]   
**Explanation:** [Detailed explanation]   
**Examples:**   
- [Example 1]
- [Example 2]

## Important Formulas/Rules
| Formula/Rule | When to Use | Example |
|-------------|-------------|---------|
| [Formula 1] | [Application] | [Example] |
| [Formula 2] | [Application] | [Example] |

## Vocabulary Terms
- **[Term 1]:** [Definition]
- **[Term 2]:** [Definition]
- **[Term 3]:** [Definition]

## Practice Problems
1. **Problem:** [Problem statement]   
   **Solution:** [Step-by-step solution]   

2. **Problem:** [Problem statement]   
   **Solution:** [Step-by-step solution]   

## Summary
[Brief summary of main points learned]   

## Questions for Review
- [ ] [Question 1]
- [ ] [Question 2]
- [ ] [Question 3]

## Study Tips
- [Tip 1]
- [Tip 2]
- [Tip 3]

## Next Study Session
**Topics to cover:**
- [Topic 1]
- [Topic 2]

---
*Study notes completed on ${today}*`;
  return content;
}
