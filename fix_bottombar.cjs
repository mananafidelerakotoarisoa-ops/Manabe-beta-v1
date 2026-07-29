const fs = require('fs');
let code = fs.readFileSync('src/components/BottomBar.tsx', 'utf8');

code = code.replace(
  "className={`nav-tab hidden sm:flex ${activeTab === 'seances_list' ? 'nav-active' : ''}`}`}",
  "className={`nav-tab hidden sm:flex ${activeTab === 'seances_list' ? 'nav-active' : ''}`}"
);

fs.writeFileSync('src/components/BottomBar.tsx', code);
