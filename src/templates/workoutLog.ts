export function formatDate(date: Date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function buildWorkoutLogTemplate(date = new Date()) {
  const today = formatDate(date);
  const content = `## Workout Log - ${today}

**Workout Type:** [Strength/Cardio/HIIT/Yoga/etc.]
**Duration:** [Total workout time]
**Location:** [Gym/Home/Outdoor]
**Energy Level:** [1-10 before workout]

## Goals for Today
- [Goal 1]
- [Goal 2]
- [Goal 3]

## Warm-Up (5-10 minutes)
- [Warm-up exercise 1] - [Duration/Reps]
- [Warm-up exercise 2] - [Duration/Reps]
- [Warm-up exercise 3] - [Duration/Reps]

## Main Workout

### Strength Training
| Exercise | Sets | Reps | Weight | Rest | Notes |
|----------|------|------|--------|------|-------|
| [Exercise 1] | [Sets] | [Reps] | [Weight] | [Rest] | [Form notes] |
| [Exercise 2] | [Sets] | [Reps] | [Weight] | [Rest] | [Form notes] |
| [Exercise 3] | [Sets] | [Reps] | [Weight] | [Rest] | [Form notes] |

### Cardio
| Exercise | Duration | Intensity | Distance | Calories | Notes |
|----------|----------|-----------|----------|----------|-------|
| [Exercise] | [Time] | [Level] | [Distance] | [Calories] | [How it felt] |

## Cool-Down (5-10 minutes)
- [Cool-down exercise 1] - [Duration]
- [Cool-down exercise 2] - [Duration]
- [Stretching] - [Duration]

## Workout Summary
**Total Time:** [Time]
**Calories Burned:** [Estimate]
**Post-Workout Energy:** [1-10]
**Muscle Groups Targeted:** [List]

## Personal Records (PRs)
- [Exercise]: [New PR or progress made]

## How I Felt
**During Workout:** [Energy, motivation, strength]
**After Workout:** [How you feel post-exercise]

## Improvements Noted
- [What went better than last time]
- [Strength gains or form improvements]

## Areas to Work On
- [What needs improvement]
- [Form issues to address]

## Next Workout Plan
**Target Date:** [Next workout date]
**Focus:** [What to work on next]
**Exercises to try:** [New exercises to incorporate]

## Nutrition
**Pre-Workout:** [What you ate/drank before]
**Post-Workout:** [What you ate/drank after]
**Water Intake:** [Amount during workout]

## Sleep & Recovery
**Sleep Last Night:** [Hours and quality]
**Recovery Status:** [How recovered you felt]
**Soreness:** [Any muscle soreness from previous workouts]

## Weekly Progress Notes
[Progress toward weekly/monthly fitness goals]

---
*Workout completed ${today}*`;
  return content;
}
