"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { ResetPasswordSchema } from "@/validators/authValidators";

export default function ResetPasswordForm() {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const [canReset, setCanReset] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    let cancelled = false;

    const bootstrap = async () => {
      const hashParams = new URLSearchParams(window.location.hash.replace("#", ""));
      const searchParams = new URLSearchParams(window.location.search);
      const isRecoveryFlow =
        hashParams.get("type") === "recovery" || searchParams.get("type") === "recovery";

      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (cancelled) return;

      setCanReset(Boolean(session) || isRecoveryFlow);
      setIsCheckingSession(false);
    };

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (cancelled) return;
      if (event === "PASSWORD_RECOVERY" || event === "SIGNED_IN") {
        setCanReset(Boolean(session));
        setIsCheckingSession(false);
      }
    });

    bootstrap();

    return () => {
      cancelled = true;
      subscription.unsubscribe();
    };
  }, [supabase]);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    const parsed = ResetPasswordSchema.safeParse({ password, confirmPassword });
    if (!parsed.success) {
      const issue = parsed.error.issues[0];
      setError(issue?.message ?? "Please check your password entries.");
      return;
    }

    setIsSubmitting(true);
    const { error: updateError } = await supabase.auth.updateUser({ password });
    setIsSubmitting(false);

    if (updateError) {
      setError(updateError.message);
      return;
    }

    setSuccess("Password updated successfully. Redirecting to sign in...");
    setTimeout(() => {
      router.replace("/");
    }, 1400);
  };

  return (
    <div
      className="
      relative overflow-hidden
      bg-white/5
      backdrop-blur-md
      border border-white/10
      rounded-[24px]
      p-8
      shadow-[0_8px_32px_rgba(0,0,0,0.4)]
    "
    >
      {isCheckingSession ? (
        <div className="py-10 text-center text-white/70 text-sm flex items-center justify-center gap-2">
          <Loader2 className="w-4 h-4 animate-spin" />
          Validating reset link...
        </div>
      ) : !canReset ? (
        <div className="bg-red-500/10 border border-red-400/30 rounded-xl px-4 py-3">
          <p className="text-red-200 text-xs text-center">
            This reset link is invalid or has expired. Request a new password reset link.
          </p>
        </div>
      ) : (
        <form onSubmit={onSubmit} className="space-y-5">
          {error && (
            <div className="bg-red-500/10 border border-red-400/30 rounded-xl px-4 py-3 mb-4">
              <p className="text-red-200 text-xs text-center">{error}</p>
            </div>
          )}

          {success && (
            <div className="bg-emerald-500/10 border border-emerald-400/30 rounded-xl px-4 py-3 mb-4">
              <p className="text-emerald-200 text-xs text-center">{success}</p>
            </div>
          )}

          <div className="space-y-2">
            <label className="text-[#c5a55a] text-[11px] font-medium block">
              New Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="At least 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setFocusedField("password")}
                onBlur={() => setFocusedField(null)}
                disabled={isSubmitting}
                className={`
                  w-full
                  !bg-[rgba(0,26,51,0.9)]
                  border ${
                    focusedField === "password"
                      ? "!border-[#c5a55a]"
                      : "!border-white/20"
                  }
                  rounded-xl
                  px-4 py-3 pr-12
                  !text-white text-sm
                  !placeholder:text-white/40
                  outline-none
                  transition-all duration-200
                  focus:!border-[#c5a55a]
                  disabled:opacity-50 disabled:cursor-not-allowed
                `}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isSubmitting}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#c5a55a] hover:text-[#d4b96a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[#c5a55a] text-[11px] font-medium block">
              Confirm Password
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Repeat new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                onFocus={() => setFocusedField("confirmPassword")}
                onBlur={() => setFocusedField(null)}
                disabled={isSubmitting}
                className={`
                  w-full
                  !bg-[rgba(0,26,51,0.9)]
                  border ${
                    focusedField === "confirmPassword"
                      ? "!border-[#c5a55a]"
                      : "!border-white/20"
                  }
                  rounded-xl
                  px-4 py-3 pr-12
                  !text-white text-sm
                  !placeholder:text-white/40
                  outline-none
                  transition-all duration-200
                  focus:!border-[#c5a55a]
                  disabled:opacity-50 disabled:cursor-not-allowed
                `}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                disabled={isSubmitting}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#c5a55a] hover:text-[#d4b96a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label={showConfirmPassword ? "Hide confirmation password" : "Show confirmation password"}
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting || !!success}
            className="
              w-full
              bg-[#8b5cf6]
              hover:bg-[#7c3aed]
              text-white
              font-semibold
              py-3.5
              rounded-xl
              transition-all duration-200
              text-sm
              mt-4
              disabled:opacity-60
              disabled:cursor-not-allowed
            "
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                Updating password...
              </span>
            ) : (
              "Update Password"
            )}
          </button>
        </form>
      )}

      <div className="mt-7 pt-6 border-t border-white/10">
        <p className="text-white/40 text-[10px] text-center font-medium">
          Your reset link is secure, single-use, and time-limited.
        </p>
      </div>
    </div>
  );
}
