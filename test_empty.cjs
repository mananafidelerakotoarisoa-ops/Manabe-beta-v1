const fs = require('fs');
let code = fs.readFileSync('src/components/PcppPhaseCard.tsx', 'utf8');

// I will just modify PcppPhaseCard to not render empty fields when NOT editing, 
// and when editing, add an "X" button to clear/hide them? 

