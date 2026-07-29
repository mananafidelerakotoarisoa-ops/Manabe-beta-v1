const fs = require('fs');
let code = fs.readFileSync('src/components/views/FichesView.tsx', 'utf8');

const hiddenToggleCode = `
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-2 mb-4">
        <div className="flex items-center space-x-2">
          <button onClick={() => setFichesTab('sequence')} className={\`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 \${fichesTab === 'sequence' ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30' : 'bg-slate-900 text-slate-400 border border-white/10 hover:bg-slate-800'}\`}>
            <Layers className="w-4 h-4" /> PCPP Sequence
          </button>
          <button onClick={() => setFichesTab('board')} className={\`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 \${fichesTab === 'board' ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30' : 'bg-slate-900 text-slate-400 border border-white/10 hover:bg-slate-800'}\`}>
            <Presentation className="w-4 h-4" /> Board Plan
          </button>
        </div>
        <div className="flex items-center space-x-2">
          {['general', 'objectives', 'homework'].map(section => (
            <button key={section} onClick={() => {
              const isHidden = plan.hiddenSections?.includes(section);
              const newHidden = isHidden 
                ? plan.hiddenSections.filter(s => s !== section)
                : [...(plan.hiddenSections || []), section];
              setPlan({ ...plan, hiddenSections: newHidden });
            }} className={\`text-[10px] px-2 py-1 rounded border \${plan.hiddenSections?.includes(section) ? 'bg-rose-900/30 text-rose-300 border-rose-500/30' : 'bg-emerald-900/30 text-emerald-300 border-emerald-500/30'}\`}>
              {plan.hiddenSections?.includes(section) ? '+' : 'x'} {section === 'general' ? 'Info' : section === 'objectives' ? 'Objectifs' : 'Devoirs'}
            </button>
          ))}
        </div>
      </div>
`;

const splitPoint = '      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-2">';
// Actually, let's just replace the exact block.
