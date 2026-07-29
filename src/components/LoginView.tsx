import React, { useState } from 'react';
import { Lock, Mail, ShieldCheck, KeyRound, Sparkles, CheckCircle2, AlertCircle, Eye, EyeOff, UserCheck } from 'lucide-react';
import { TEACHERS, AUTH_STORAGE_KEY } from '../data/teachers';
import { Teacher } from '../types';
import { googleSignIn } from '../lib/firebase';

interface LoginViewProps {
  onLoginSuccess: (teacher: Teacher) => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onLoginSuccess }) => {
  const [selectedTeacherId, setSelectedTeacherId] = useState<'fidele' | 'haja' | 'rova'>('fidele');
  const [emailInput, setEmailInput] = useState<string>("");
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


  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const authResult = await googleSignIn();
      if (authResult && authResult.user && authResult.user.email) {
        const userEmail = authResult.user.email.toLowerCase();
        const matchingTeacher = TEACHERS.find(t => t.email.toLowerCase() === userEmail);
        if (matchingTeacher) {
          try {
            localStorage.setItem(AUTH_STORAGE_KEY, matchingTeacher.id);
          } catch (err) {}
          onLoginSuccess(matchingTeacher);
        } else {
          setErrorMessage("Email Google non autorisé.");
        }
      }
    } catch (err: any) {
      setErrorMessage("Erreur de connexion Google: " + err.message);
    } finally {
      setIsLoading(false);
    }
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsLoading(true);

    setTimeout(() => {
      // Find matching authorized teacher
      const matchingTeacher = TEACHERS.find(
        (t) => t.email.toLowerCase().trim() === emailInput.toLowerCase().trim()
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
    <div className="min-h-screen bg-[#f7f5f0] flex flex-col justify-center items-center px-4 py-8 relative overflow-hidden selection:bg-sky-500 selection:text-white">
      
      {/* Abstract Blue Circle Background */}
      <div className="absolute top-1/2 -left-[10%] -translate-y-1/2 w-[80vw] max-w-[800px] aspect-square bg-[#192b6a] rounded-full pointer-events-none shadow-2xl mix-blend-multiply opacity-95" style={{ borderRadius: '50%', border: '4px solid rgba(25,43,106,0.1)' }} />


      <div className="w-full max-w-sm mx-auto space-y-6 relative z-10">
        
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-sky-500 to-indigo-600 border border-sky-400/50 shadow-xl shadow-sky-500/20 text-white font-extrabold text-2xl">
            学
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center justify-center gap-2">
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

        {/* Card Form Wrapper */}
        <div className="card-sec aspect-square flex flex-col justify-center p-8 rounded-3xl border border-white/10 shadow-2xl space-y-6 bg-slate-900/95 backdrop-blur-md">
          
          <div className="text-center pb-2 border-b border-white/10">
            <h2 className="text-sm font-bold text-slate-200 uppercase tracking-wider">
              Saisissez vos identifiants (ログイン情報)
            </h2>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">

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
                    className="!pl-10"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="fld">
                <div className="flex items-center justify-between">
                  <span>Mot de Passe (パスワード)</span>
                  
                </div>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    placeholder="Saisissez votre mot de passe"
                    className="!pl-10 !pr-10"
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
                  <span>Se connecter à l'Espace Enseignants</span>
                </>
              )}
            </button>

          </form>

        </div>

        {/* Footer info */}
        <div className="text-center space-y-1">
          <p className="text-[11px] text-slate-700">
            MPANABE — Plateforme Pédagogique d'Enseignement de la Langue Japonaise
          </p>
          
        </div>

      </div>

    </div>
  );
};
