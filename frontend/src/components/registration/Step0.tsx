import { useState } from 'react';
import { Shield, CheckCircle } from 'lucide-react';

interface Step0Props {
  onNext: () => void;
}

export function Step0({ onNext }: Step0Props) {
  const [agreedToPolicy, setAgreedToPolicy] = useState(false);

  return (
    <div className="flex flex-col h-full animate-in fade-in duration-500">
      <div className="flex flex-col items-center text-center mb-3 sm:mb-4">
        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-[rgba(197,165,90,0.15)] border border-[#c5a55a]/30 flex items-center justify-center mb-2 sm:mb-3">
          <Shield size={20} className="text-[#c5a55a] sm:w-6 sm:h-6" />
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Privacy Policy</h2>
      </div>
      
      <p className="text-white/60 mb-3 sm:mb-4 leading-relaxed text-[11px] sm:text-sm text-center">
        Please read and understand our privacy policy before proceeding with registration.
      </p>

      {/* Scrollable Content Box */}
      <div className="h-[240px] sm:h-[280px] md:h-[320px] bg-[rgba(0,26,51,0.9)] border border-white/20 rounded-xl p-4 sm:p-5 overflow-y-auto custom-scrollbar mb-3 sm:mb-4">
        <div className="space-y-5 text-xs sm:text-sm">
          <section>
            <h3 className="text-sm font-semibold text-white mb-2 flex items-center gap-2">
              <CheckCircle size={16} className="text-[#c5a55a]" />
              Data Collection
            </h3>
            <p className="text-white/70 leading-relaxed ml-6">
              We collect personal information including your name, email address, mobile number, 
              occupation, and institution for event registration and communication purposes.
            </p>
          </section>

          <section>
            <h3 className="text-sm font-semibold text-white mb-2 flex items-center gap-2">
              <CheckCircle size={16} className="text-[#c5a55a]" />
              How We Use Your Data
            </h3>
            <p className="text-white/70 leading-relaxed ml-6">
              Your information will be used to process your event registration, send event updates, 
              and communicate important information. We may also use your data to improve our services 
              and future events.
            </p>
          </section>

          <section>
            <h3 className="text-sm font-semibold text-white mb-2 flex items-center gap-2">
              <CheckCircle size={16} className="text-[#c5a55a]" />
              Data Security
            </h3>
            <p className="text-white/70 leading-relaxed ml-6">
              We implement appropriate security measures to protect your personal information from 
              unauthorized access, alteration, disclosure, or destruction.
            </p>
          </section>

          <section>
            <h3 className="text-sm font-semibold text-white mb-2 flex items-center gap-2">
              <CheckCircle size={16} className="text-[#c5a55a]" />
              Data Sharing
            </h3>
            <p className="text-white/70 leading-relaxed ml-6">
              We do not sell or rent your personal information to third parties. Your data may be 
              shared with event sponsors only if you explicitly consent to scholarship or career opportunities.
            </p>
          </section>

          <section>
            <h3 className="text-sm font-semibold text-white mb-2 flex items-center gap-2">
              <CheckCircle size={16} className="text-[#c5a55a]" />
              Your Rights
            </h3>
            <p className="text-white/70 leading-relaxed ml-6">
              You have the right to access, correct, or delete your personal information at any time. 
              You may also opt out of communications by contacting us directly.
            </p>
          </section>

          <section>
            <h3 className="text-sm font-semibold text-white mb-2 flex items-center gap-2">
              <CheckCircle size={16} className="text-[#c5a55a]" />
              Contact Us
            </h3>
            <p className="text-white/70 leading-relaxed ml-6">
              If you have questions about this privacy policy or how we handle your data, 
              please contact us through our official channels.
            </p>
          </section>
        </div>
      </div>

      {/* Checkbox */}
      <label className="flex items-start gap-2 sm:gap-3 p-2 sm:p-3 mb-3 sm:mb-4 group cursor-pointer hover:bg-[rgba(255,255,255,0.04)] rounded-xl transition-colors">
        <div className="relative flex items-center pt-0.5">
          <input 
            type="checkbox" 
            className="peer sr-only"
            checked={agreedToPolicy}
            onChange={(e) => setAgreedToPolicy(e.target.checked)}
          />
          <div className="w-5 h-5 border-2 border-white/20 rounded transition-all peer-checked:bg-[#c5a55a] peer-checked:border-[#c5a55a] peer-hover:border-[#c5a55a] bg-transparent flex items-center justify-center">
             {agreedToPolicy && <div className="w-2.5 h-1.5 border-l-2 border-b-2 border-white rotate-[-45deg] translate-y-[-1px]" />}
          </div>
        </div>
        <span className="text-[11px] sm:text-sm text-white/70 leading-tight group-hover:text-white transition-colors select-none">
          I have read and agree to the Privacy Policy
        </span>
      </label>

      <div className="pt-1 sm:pt-2">
        <button
          type="button"
          onClick={onNext}
          disabled={!agreedToPolicy}
          className="w-full bg-[#8b5cf6] hover:bg-[#7c3aed] text-white font-semibold py-3.5 rounded-xl transition-all duration-200 text-sm disabled:opacity-60 disabled:cursor-not-allowed"
        >
          Accept & Continue
        </button>
      </div>
    </div>
  );
}
