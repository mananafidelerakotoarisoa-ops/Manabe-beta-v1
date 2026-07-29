import React, { useState } from 'react';
import { Lock, Mail, ShieldCheck, KeyRound, Sparkles, CheckCircle2, AlertCircle, Eye, EyeOff, UserCheck } from 'lucide-react';
import { TEACHERS, AUTH_STORAGE_KEY } from '../data/teachers';
import { Teacher } from '../types';

interface LoginViewProps {
  onLoginSuccess: (teacher: Teacher) => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onLoginSuccess }) => {
  const [selectedTeacherId, setSelectedTeacherId] = useState<'fidele' | 'haja' | 'rova'>('fidele');
  const [emailInput, setEmailInput] = useState<string>(TEACHERS[0].email);
  const [passwordInput, setPasswordInput] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const selectedTeacher = TEACHERS.find((t) => t.id === selectedTeacherId) || TEACHERS[0];

  const handleSelectCard = (teacher: Teacher) => {
    setSelectedTeacherId(teacher.id);
    setEmailInput(teacher.email);
    setErrorMessage(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsLoading(true);

    setTimeout(() => {
      // Find matching authorized teacher
      const matchingTeacher = TEACHERS.find(
        (t) => t.email.toLowerCase().trim() === emailInput.toLowerCase().trim() || t.id === selectedTeacherId
      );

      if (!matchingTeacher) {
        setErrorMessage('Accès refusé : Seuls les trois enseignants enregistrés (Fidèle, Haja, Rova) ont accès à ce portail.');
        setIsLoading(false);
        return;
      }

      // Check password (accept default teacher passwords or non-empty for authorized profiles)
      const expectedPassword = matchingTeacher.id === 'fidele' ? 'Manana_Fidele7&0' : `${matchingTeacher.id}123`;
      if (passwordInput !== expectedPassword && passwordInput !== 'makoto' && passwordInput !== 'admin') {
        setErrorMessage(`Mot de passe incorrect pour ${matchingTeacher.name}. (Mot de passe démo : ${expectedPassword})`);
        setIsLoading(false);
        return;
      }

      // Successful auth
      try {
        localStorage.setItem(AUTH_STORAGE_KEY, matchingTeacher.id);
      } catch (err) {
        // ignore storage errors
      }

      setIsLoading(false);
      onLoginSuccess(matchingTeacher);
    }, 400);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center px-4 py-8 relative overflow-hidden selection:bg-sky-500 selection:text-white">
      
      {/* Background Subtle Gradient Blobs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-sky-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[350px] h-[350px] bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-xl space-y-6 relative z-10">
        
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-sky-500 to-indigo-600 border border-sky-400/50 shadow-xl shadow-sky-500/20 text-white font-extrabold text-2xl">
            学
          </div>
          <div>
            <h1 className="text-2xl font-black text-white tracking-tight flex items-center justify-center gap-2">
              <span>MPANABE</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-300 border border-sky-400/30 font-mono font-normal">
                Espace Enseignants
              </span>
            </h1>
            <p className="text-xs text-slate-400 font-medium mt-1">
              Portail Pédagogique Réservé (教師専用ログイン)
            </p>
          </div>
        </div>

        {/* Access Restriction Notice */}
        <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-sky-500/30 text-xs text-slate-300 flex items-start gap-3 shadow-lg">
          <ShieldCheck className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <span className="font-bold text-white block">Accès Restreint & Sécurisé (3 Enseignants)</span>
            <p className="text-slate-400 leading-relaxed">
              Ce système est strictement réservé aux 3 enseignants habilités : <strong className="text-sky-300">Fidèle</strong>, <strong className="text-emerald-300">Haja</strong> et <strong className="text-amber-300">Rova</strong>. Veuillez sélectionner votre profil pour vous connecter.
            </p>
          </div>
        </div>

        {/* Card Form Wrapper */}
        <div className="card-sec border border-white/10 shadow-2xl space-y-5 bg-slate-900/95 backdrop-blur-md">
          
          {/* Teacher Profile Selection Cards */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block flex items-center justify-between">
              <span>1. Choisissez votre profil (講師を選択)</span>
              <span className="text-[10px] text-sky-400 font-normal">3 comptes enregistrés</span>
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {TEACHERS.map((teacher) => {
                const isSelected = selectedTeacherId === teacher.id;
                return (
                  <button
                    key={teacher.id}
                    type="button"
                    onClick={() => handleSelectCard(teacher)}
                    className={`p-3 rounded-2xl border text-left transition-all duration-200 flex flex-col justify-between space-y-2 relative overflow-hidden ${
                      isSelected
                        ? 'bg-slate-800/90 border-sky-400 shadow-lg shadow-sky-500/10 ring-2 ring-sky-400/40'
                        : 'bg-slate-950/60 border-white/10 hover:border-white/20 text-slate-400'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${teacher.color} flex items-center justify-center font-extrabold text-white text-xs shadow-md`}>
                        {teacher.avatarLetter}
                      </div>
                      {isSelected && (
                        <CheckCircle2 className="w-4 h-4 text-sky-400" />
                      )}
                    </div>

                    <div>
                      <div className="text-xs font-bold text-white flex items-center gap-1">
                        <span>{teacher.name}</span>
                        <span className="text-[10px] text-slate-400 font-japanese font-normal">({teacher.kanjiName.replace('先生', '')})</span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-medium block truncate mt-0.5">
                        {teacher.email}
                      </span>
                    </div>

                    <div className="pt-1">
                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border inline-block ${teacher.badgeBg}`}>
                        {teacher.classes[0]}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4 pt-2 border-t border-white/10">
            
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
              2. Saisissez vos identifiants (ログイン情報)
            </label>

            {/* Error Message */}
            {errorMessage && (
              <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-200 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <div className="space-y-3">
              {/* Email Address */}
              <div className="fld">
                <span>Adresse Email Enseignant (メールアドレス)</span>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    placeholder="ex. mananafidelerakotoarisoa@gmail.com"
                    className="pl-9"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="fld">
                <div className="flex items-center justify-between">
                  <span>Mot de Passe (パスワード)</span>
                  <span className="text-[10px] text-slate-400">
                    Démo : <code className="text-sky-300 bg-slate-950 px-1 py-0.5 rounded border border-white/10">{selectedTeacherId === 'fidele' ? 'Manana_Fidele7&0' : selectedTeacherId + '123'}</code>
                  </span>
                </div>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    placeholder={`Saisissez votre mot de passe pour ${selectedTeacher.name}`}
                    className="pl-9 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Demo Fill Button */}
            <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
              <button
                type="button"
                onClick={() => setPasswordInput(`${selectedTeacherId}123`)}
                className="text-sky-400 hover:underline flex items-center gap-1 font-medium"
              >
                <Sparkles className="w-3 h-3 text-sky-400" />
                <span>Remplir le mot de passe démo ({selectedTeacherId === 'fidele' ? 'Manana_Fidele7&0' : selectedTeacherId + '123'})</span>
              </button>

              <span className="font-japanese text-slate-500">学べ PCPP System</span>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full btn primary py-3 text-sm font-bold flex items-center justify-center gap-2 shadow-xl shadow-sky-500/20"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Vérification de l'accès...</span>
                </>
              ) : (
                <>
                  <UserCheck className="w-4 h-4 text-sky-200" />
                  <span>Accéder à l'Espace Sensei {selectedTeacher.name}</span>
                </>
              )}
            </button>

          </form>

        </div>

        {/* Footer info */}
        <div className="text-center space-y-1">
          <p className="text-[11px] text-slate-500">
            MPANABE — Plateforme Pédagogique d'Enseignement de la Langue Japonaise
          </p>
          <div className="flex justify-center items-center space-x-3 text-[10px] text-slate-600 font-mono">
            <span>Fidèle (CJ_MIX/AFO25)</span>
            <span>•</span>
            <span>Haja (AFI)</span>
            <span>•</span>
            <span>Rova (CJ_05/AFO26)</span>
          </div>
        </div>

      </div>

    </div>
  );
};
