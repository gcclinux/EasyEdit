export type TaskTemplate = {
  label: string;
  markdown: string;
  description: string;
};

export const taskTemplates: TaskTemplate[] = [
  {
    label: 'Basic Task List',
    markdown: '- [ ] This item is unchecked\n- [x] This item is checked',
    description: 'Simple checked/unchecked items',
  },
  {
    label: 'Project Tasks',
    markdown:
      '## Project Tasks\n\n- [ ] Define requirements\n- [ ] Create wireframes\n- [ ] Develop features\n- [ ] Testing\n- [ ] Deployment',
    description: 'Project management template',
  },
  {
    label: 'Daily Checklist',
    markdown:
      '### Daily Tasks\n\n- [ ] Morning routine\n- [ ] Check emails\n- [ ] Important meetings\n- [ ] Review progress\n- [ ] Plan tomorrow',
    description: 'Daily productivity template',
  },
  {
    label: 'Shopping List',
    markdown:
      '### Shopping List\n\n- [ ] Groceries\n  - [ ] Milk\n  - [ ] Bread\n  - [ ] Eggs\n- [ ] Household items\n  - [ ] Soap\n  - [ ] Paper towels',
    description: 'Nested shopping list',
  },
  {
    label: 'Study Checklist',
    markdown:
      '### Study Plan\n\n- [ ] Read chapter 1\n- [ ] Take notes\n- [ ] Practice exercises\n- [ ] Review concepts\n- [ ] Prepare for quiz',
    description: 'Academic study template',
  },
];

export default taskTemplates;
