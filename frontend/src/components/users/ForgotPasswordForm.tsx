"use client";

import { useActionState, useState } from "react";
import { Loader2 } from "lucide-react";
import { forgotPasswordAction } from "@/actions/authActions";

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [state, formAction, isPending] = useActionState(forgotPasswordAction, null);

  const error = state?.error ?? "";
  const successMessage =
    state?.success && state?.data && "message" in state.data
      ? (state.data.message as string)
      : "";

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
      <form action={formAction} className="space-y-5">
        {error && (
          <div className="bg-red-500/10 border border-red-400/30 rounded-xl px-4 py-3 mb-4">
            <p className="text-red-200 text-xs text-center">{error}</p>
          </div>
        )}

        {successMessage && (
          <div className="bg-emerald-500/10 border border-emerald-400/30 rounded-xl px-4 py-3 mb-4">
            <p className="text-emerald-200 text-xs text-center">{successMessage}</p>
          </div>
        )}

        <div className="space-y-2">
          <label className="text-[#c5a55a] text-[11px] font-medium block">Email</label>
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
                focusedField === "email" ? "!border-[#c5a55a]" : "!border-white/20"
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

        <button
          type="submit"
          disabled={isPending}
          className="
            w-full
            bg-[#049fd9]
            hover:bg-[#0389b8]
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
          {isPending ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              Sending reset link...
            </span>
          ) : (
            "Send Reset Link"
          )}
        </button>
      </form>

      <div className="mt-7 pt-6 border-t border-white/10">
        <p className="text-white/40 text-[10px] text-center font-medium">
          We will send a secure, single-use reset link if your account exists.
        </p>
      </div>
    </div>
  );
}
