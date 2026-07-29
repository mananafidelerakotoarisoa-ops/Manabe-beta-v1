import React from 'react';
import { Attachment } from '../types';
import { Paperclip, X } from 'lucide-react';

interface Props {
  attachments: Attachment[];
  onChange: (attachments: Attachment[]) => void;
}

export const AttachmentsList: React.FC<Props> = ({ attachments, onChange }) => {
  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (ev) => {
        const newAtt = {
          id: Date.now().toString(),
          name: file.name,
          url: ev.target?.result as string,
          size: file.size
        };
        onChange([...attachments, newAtt]);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="mt-2 space-y-2">
      {attachments.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {attachments.map(att => (
            <div key={att.id} className="flex items-center gap-1 bg-slate-800/50 text-xs px-2 py-1 rounded text-slate-300 border border-slate-700">
              <Paperclip className="w-3 h-3 text-sky-400" />
              <span className="truncate max-w-[100px]" title={att.name}>{att.name}</span>
              <button 
                type="button" 
                className="text-rose-400 hover:text-rose-300 ml-1"
                onClick={() => onChange(attachments.filter(a => a.id !== att.id))}
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}
      <div>
        <label className="text-[10px] text-sky-400 hover:text-sky-300 cursor-pointer flex items-center gap-1 border border-sky-900/30 bg-sky-900/10 px-2 py-1 rounded inline-flex">
          <input type="file" className="hidden" accept="image/*,.pdf,.doc,.docx" onChange={handleFile} />
          <Paperclip className="w-3 h-3" />
          Ajouter Fichier
        </label>
      </div>
    </div>
  );
};
