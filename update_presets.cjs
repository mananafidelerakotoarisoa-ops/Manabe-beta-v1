const fs = require('fs');
const content = fs.readFileSync('src/data/presets.ts', 'utf8');

const additionalFields = `
      classId: '',
      date: new Date().toISOString().split('T')[0],
      teacherId: 'fidele',
      sessionType: 'hybride',
      targetedSkills: [],
      materials: [],
      manuals: [],
      objectives: [],
      prerequisites: '',
      prerequisitesChecked: false,
      homeworks: [],
      evaluations: [],
      attachments: [],
      hiddenSections: [],`;

const updatedContent = content.replace(/defaultPlan: \{/g, 'defaultPlan: {' + additionalFields);

fs.writeFileSync('src/data/presets.ts', updatedContent);
