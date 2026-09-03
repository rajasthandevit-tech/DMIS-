import React, { useState, useEffect } from 'react';
import { useDMIS } from '../../context/DMISContext';
import { KeyRound, ShieldCheck, CheckCircle2, Clock, X, Lock, FileText } from 'lucide-react';

export const ESignModal: React.FC = () => {
  const { eSignModalState, closeESignModal, currentUser } = useDMIS();
  const [otp, setOtp] = useState('');
  const [timer, setTimer] = useState(120);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (!eSignModalState.isOpen) {
      setOtp('');
      setTimer(120);
      setIsVerifying(false);
      setIsSuccess(false);
      setErrorMsg('');
      return;
    }

    const interval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [eSignModalState.isOpen]);

  if (!eSignModalState.isOpen) return null;

  const handleVerifyOTP = () => {
    if (otp.length !== 6) {
      setErrorMsg('Please enter a valid 6-digit Aadhaar OTP.');
      return;
    }

    setIsVerifying(true);
    setErrorMsg('');

    setTimeout(() => {
      setIsVerifying(false);
      setIsSuccess(true);

      const signatureMeta = {
        signatureId: `ESIGN-RJ-${Date.now().toString(36).toUpperCase()}`,
        signedAt: new Date().toISOString(),
        hash: `SHA256:${Math.random().toString(36).substring(2)}${Math.random().toString(36).substring(2)}`,
        signerName: currentUser.fullName,
        signerDesignation: currentUser.designation,
      };

      setTimeout(() => {
        if (eSignModalState.onSigned) {
          eSignModalState.onSigned(signatureMeta);
        }
        closeESignModal();
      }, 1200);
    }, 1000);
  };

  const minutes = Math.floor(timer / 60);
  const seconds = timer % 60;
  const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-amber-300 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#1A365D] to-[#2a4d7d] text-white p-5 flex items-center justify-between border-b-2 border-amber-500">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-lg bg-amber-500 text-slate-900 flex items-center justify-center font-bold shadow">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base">Raj e-Sign OTP Authentication</h3>
              <p className="text-xs text-amber-300">Aadhaar e-KYC Electronic Signature</p>
            </div>
          </div>
          <button
            onClick={closeESignModal}
            className="p-1 rounded-md text-slate-300 hover:text-white hover:bg-slate-700/50 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          {isSuccess ? (
            <div className="text-center py-6 space-y-3">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full mx-auto flex items-center justify-center animate-in zoom-in">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h4 className="font-bold text-lg text-slate-800">Electronic Signature Applied!</h4>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                Digitally sealed and cryptographically stamped with Aadhaar e-KYC credentials of{' '}
                <strong className="text-slate-800">{currentUser.fullName}</strong>.
              </p>
              <div className="p-2.5 bg-emerald-50 text-emerald-800 font-mono text-xs rounded-lg border border-emerald-200">
                Status: Tamper-Evident SHA-256 Validated
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="p-3 bg-blue-50 rounded-xl border border-blue-200 text-xs text-slate-700 space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-blue-900">
                  <FileText className="w-4 h-4 text-blue-700" />
                  <span>{eSignModalState.title}</span>
                </div>
                <div className="text-[11px] text-slate-600 font-mono">
                  Doc Ref: <span className="font-semibold text-slate-900">{eSignModalState.docRef}</span>
                </div>
                <div className="text-[11px] text-slate-500">
                  Authorized Signatory: <strong>{currentUser.fullName}</strong> ({currentUser.designation})
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">
                  Enter 6-Digit Aadhaar OTP <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    id="esign-otp-input"
                    type="password"
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                    placeholder="• • • • • •"
                    className="w-full text-center tracking-[0.6em] font-mono text-xl py-3 border-2 border-slate-300 rounded-xl focus:border-blue-600 focus:outline-none bg-slate-50 font-bold"
                  />
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-4" />
                </div>
                <div className="flex items-center justify-between text-xs text-slate-500 mt-1">
                  <span className="flex items-center gap-1 text-[11px]">
                    <Clock className="w-3.5 h-3.5 text-amber-500" />
                    Expires in: <strong className="text-slate-800 font-mono">{formattedTime}</strong>
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setTimer(120);
                      setOtp('728194'); // convenience autofill
                    }}
                    className="text-blue-600 hover:underline text-[11px] font-semibold cursor-pointer"
                  >
                    Demo: Fill OTP (728194)
                  </button>
                </div>
              </div>

              {errorMsg && <p className="text-xs text-red-600 bg-red-50 p-2 rounded border border-red-200">{errorMsg}</p>}

              <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 text-[11px] text-amber-900">
                <p className="font-semibold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
                  Legal Verification Notice
                </p>
                <p className="mt-0.5 text-amber-800/90 leading-relaxed">
                  By clicking Verify & e-Sign, you authorize applying your Aadhaar electronic signature under Section 3A of the Information Technology Act.
                </p>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={closeESignModal}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-100 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  id="esign-verify-submit-btn"
                  onClick={handleVerifyOTP}
                  disabled={isVerifying}
                  className="px-5 py-2 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-lg text-xs font-bold hover:from-emerald-700 hover:to-emerald-800 transition shadow-md flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isVerifying ? (
                    <span>Validating with UIDAI...</span>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Verify & Apply e-Sign</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
