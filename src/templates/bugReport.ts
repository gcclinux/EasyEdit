export function formatDate(date: Date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function buildBugReportTemplate(date = new Date()) {
  const today = formatDate(date);
  return `## Bug Report

**Title:** [Short descriptive title]
**Date:** ${today}
**Reported by:** [Your name]
**Environment:** [OS / Browser / App version]

**Severity:** [Blocker/Critical/High/Medium/Low]
**Assign to:** [Name or team]
**Status:** [Open/Triage/In Progress/Fixed/Closed]

## Description
[A clear and concise description of the bug]

## Steps to Reproduce
1. [Step 1]
2. [Step 2]
3. [Step 3 — expected vs actual shown below]

## Expected Result
[What you expected to happen]

## Actual Result
[What actually happened]

## Reproduction Example / Code Snippet
\`\`\`text
[Paste code, logs, or commands to reproduce here]
\`\`\`

## Screenshots / Attachments
- [Link or path to screenshot 1]
- [Link or path to screenshot 2]

## Workaround
[Short-term workaround if any]

## Notes & Logs
- App logs: [paste trimmed logs]
- Browser console: [paste if applicable]
- Additional context: [anything else useful]

---
*Reported on ${today}*`;
}
