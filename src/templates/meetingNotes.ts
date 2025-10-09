export function formatDate(date: Date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function buildMeetingNotesTemplate(date = new Date()) {
  const today = formatDate(date);
  const content = `## Meeting Notes - ${today}

**Meeting Type:** [Weekly/Monthly/Project/Team/Client]   
**Date:** ${today}   
**Time:** [Start Time] - [End Time]   
**Location:** [Physical/Virtual]   

## Attendees
- [Name] - [Role]
- [Name] - [Role]
- [Name] - [Role]

## Agenda
1. [Agenda Item 1]
2. [Agenda Item 2]
3. [Agenda Item 3]

## Discussion Points

### [Topic 1]
- [Key point discussed]
- [Decision made]
- [Action required]

### [Topic 2]
- [Key point discussed]
- [Decision made]
- [Action required]

## Action Items
| Task | Assigned To | Due Date | Status |
|------|-------------|----------|--------|
| [Task description] | [Name] | ${today} | [ ] |
| [Task description] | [Name] | ${today} | [ ] |
| [Task description] | [Name] | ${today} | [ ] |

## Next Steps
- [ ] [Next step 1]
- [ ] [Next step 2]
- [ ] [Next step 3]

## Next Meeting
**Date:** [Next meeting date]   
**Topics to cover:**
- [Topic 1]
- [Topic 2]

---
*Meeting notes by Your Name*`;
  return content;
}
