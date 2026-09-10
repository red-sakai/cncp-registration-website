"use client";

import { useActionState, useState } from "react";
import { Loader2, Eye, EyeOff } from "lucide-react";
import { registerAction } from "@/actions/authActions";

interface UserRegisterFormProps {
  nextUrl?: string;
}

export default function UserRegisterForm({ nextUrl }: UserRegisterFormProps) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [step, setStep] = useState<1 | 2>(1);

  const [state, formAction, isPending] = useActionState(registerAction, null);
  const error = state?.error ?? "";

  const passwordsMismatch =
    password.length > 0 &&
    (confirmPassword.length === 0 || password !== confirmPassword);

  const canGoNext =
    firstName.trim().length > 0 &&
    lastName.trim().length > 0 &&
    email.trim().length > 0;

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
      <form action={step === 2 ? formAction : undefined} className="space-y-5">
        {/* error message */}
        {error && (
          <div className="bg-red-500/10 border border-red-400/30 rounded-xl px-4 py-3 mb-4">
            <p className="text-red-200 text-xs text-center">{error}</p>
          </div>
        )}

        {step === 1 && (
          <>
            {/* first name */}
            <div className="space-y-2">
              <label className="text-[#c5a55a] text-[11px] font-medium block">
                First name
              </label>
              <input
                name="firstName"
                type="text"
                placeholder="Juan"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                onFocus={() => setFocusedField("firstName")}
                onBlur={() => setFocusedField(null)}
                disabled={isPending}
                className={`
                  w-full
                  !bg-[rgba(0,26,51,0.9)]
                  border ${
                    focusedField === "firstName"
                      ? "!border-[#c5a55a]"
                      : "!border-white/20"
                  }
                  rounded-xl
                  px-4 py-3
                  !text-white text-sm
                  !placeholder:text-white/40
                  outline-none
                  transition-all duration-200
                  focus:!border-[#c5a55a]
                  disabled:opacity-50 disabled:cursor-not-allowed
                `}
              />
            </div>

            {/* last name */}
            <div className="space-y-2">
              <label className="text-[#c5a55a] text-[11px] font-medium block">
                Last name
              </label>
              <input
                name="lastName"
                type="text"
                placeholder="Dela Cruz"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                onFocus={() => setFocusedField("lastName")}
                onBlur={() => setFocusedField(null)}
                disabled={isPending}
                className={`
                  w-full
                  !bg-[rgba(0,26,51,0.9)]
                  border ${
                    focusedField === "lastName"
                      ? "!border-[#c5a55a]"
                      : "!border-white/20"
                  }
                  rounded-xl
                  px-4 py-3
                  !text-white text-sm
                  !placeholder:text-white/40
                  outline-none
                  transition-all duration-200
                  focus:!border-[#c5a55a]
                  disabled:opacity-50 disabled:cursor-not-allowed
                `}
              />
            </div>

            {/* email */}
            <div className="space-y-2">
              <label className="text-[#c5a55a] text-[11px] font-medium block">
                Email
              </label>
              <input
                name="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={() => setFocusedField("email")}
                onBlur={() => setFocusedField(null)}
                disabled={isPending}
                className={`
                  w-full
                  !bg-[rgba(0,26,51,0.9)]
                  border ${
                    focusedField === "email"
                      ? "!border-[#c5a55a]"
                      : "!border-white/20"
                  }
                  rounded-xl
                  px-4 py-3
                  !text-white text-sm
                  !placeholder:text-white/40
                  outline-none
                  transition-all duration-200
                  focus:!border-[#c5a55a]
                  disabled:opacity-50 disabled:cursor-not-allowed
                `}
              />
            </div>

            {/* next button */}
            <button
              type="button"
              disabled={isPending || !canGoNext}
              onClick={() => setStep(2)}
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
              Continue
            </button>
          </>
        )}

        {step === 2 && (
          <>
            {/* keep previous step values in the form */}
            <input type="hidden" name="firstName" value={firstName} />
            <input type="hidden" name="lastName" value={lastName} />
            <input type="hidden" name="email" value={email} />
            {nextUrl && <input type="hidden" name="next" value={nextUrl} />}

            {/* password */}
            <div className="space-y-2">
              <label className="text-[#c5a55a] text-[11px] font-medium block">
                Password
              </label>
              <div className="relative">
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setFocusedField("password")}
                  onBlur={() => setFocusedField(null)}
                  disabled={isPending}
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

                {/* show password toggle */}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isPending}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#c5a55a] hover:text-[#d4b96a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* confirm password */}
            <div className="space-y-2">
              <label className="text-[#c5a55a] text-[11px] font-medium block">
                Confirm password
              </label>
              <div className="relative">
                <input
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  onFocus={() => setFocusedField("confirmPassword")}
                  onBlur={() => setFocusedField(null)}
                  disabled={isPending}
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

                {/* show confirm password toggle */}
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  disabled={isPending}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#c5a55a] hover:text-[#d4b96a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label={
                    showConfirmPassword ? "Hide password" : "Show password"
                  }
                >
                  {showConfirmPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
              {passwordsMismatch && (
                <p className="text-[11px] text-red-300">
                  Passwords do not match.
                </p>
              )}
            </div>

            {/* back + submit buttons */}
            <div className="flex gap-3 pt-1">
              <button
                type="button"
                disabled={isPending}
                onClick={() => setStep(1)}
                className="
                  w-full
                  bg-transparent
                  border border-white/20
                  hover:bg-white/5
                  text-white/70
                  font-semibold
                  py-3.5
                  rounded-xl
                  transition-all duration-200
                  text-sm
                  disabled:opacity-60
                  disabled:cursor-not-allowed
                "
              >
                Back
              </button>

              <button
                type="submit"
                disabled={
                  isPending ||
                  passwordsMismatch ||
                  !password ||
                  !confirmPassword
                }
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
                  disabled:opacity-60
                  disabled:cursor-not-allowed
                "
              >
                {isPending ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Signing up...
                  </span>
                ) : (
                  "Sign Up"
                )}
              </button>
            </div>
          </>
        )}
      </form>

      {/* Footer Text inside card */}
      <div className="mt-7 pt-6 border-t border-white/10">
        <p className="text-white/40 text-[10px] text-center font-medium">
          Join the Cisco NetConnect PUP - Manila community
        </p>
      </div>
    </div>
  );
}
