export function formatDate(date: Date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function buildProjectPlanTemplate(date = new Date()) {
  const today = formatDate(date);
  const content = `## Project: [Project Name]

**Status:** [Planning/In Progress/On Hold/Completed]   
**Priority:** [High/Medium/Low]   
**Start Date:** ${today}   
**Target Completion:** ${today}   

## Project Overview
[Brief description of the project goals and objectives]   

## Stakeholders
- **Project Manager:** [Name]   
- **Team Lead:** [Name]   
- **Client/Sponsor:** [Name]   
- **Team Members:** [Names]   

## Goals & Objectives
1. [Primary goal]   
2. [Secondary goal]   
3. [Additional objectives]   

## Project Scope

### In Scope
- [Feature/requirement 1]   
- [Feature/requirement 2]   
- [Feature/requirement 3]   

### Out of Scope
- [Excluded item 1]   
- [Excluded item 2]   

## Timeline & Milestones
| Milestone | Target Date | Status | Notes |
|-----------|-------------|--------|-------|
| [Milestone 1] | ${today} | [ ] | [Notes] |
| [Milestone 2] | ${today} | [ ] | [Notes] |
| [Milestone 3] | ${today} | [ ] | [Notes] |

## Task Breakdown
- [ ] **Phase 1: [Phase Name]**   
  - [ ] [Task 1]   
  - [ ] [Task 2]   
  - [ ] [Task 3]   

- [ ] **Phase 2: [Phase Name]**   
  - [ ] [Task 1]   
  - [ ] [Task 2]   
  - [ ] [Task 3]   

## Resources Required
- **Budget:** [Amount]   
- **Tools/Software:** [List]   
- **External Resources:** [List]   

## Risk Assessment
| Risk | Impact | Probability | Mitigation Strategy |
|------|--------|-------------|-------------------|
| [Risk 1] | [High/Med/Low] | [High/Med/Low] | [Strategy] |
| [Risk 2] | [High/Med/Low] | [High/Med/Low] | [Strategy] |

## Success Criteria
- [ ] [Criteria 1]   
- [ ] [Criteria 2]   
- [ ] [Criteria 3]   

## Notes
[Additional project notes and considerations]   

---
*Project template created on ${today}*`;
  return content;
}
