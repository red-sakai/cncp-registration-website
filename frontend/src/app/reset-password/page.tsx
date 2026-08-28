import Image from "next/image";
import Link from "next/link";
import AdminLoginBackground from "@/components/admin/AdminLoginBackground";
import ResetPasswordForm from "@/components/users/ResetPasswordForm";

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center p-4">
      <AdminLoginBackground />

      <div className="relative z-10 w-full max-w-[420px]">
        <div className="text-center mb-10 space-y-3">
          <div className="inline-block mb-4">
            <Image
              src="/images/logos/cncp-logo-transparent.png"
              alt="Cisco NetConnect PUP - Manila"
              width={96}
              height={96}
              className="opacity-95"
            />
          </div>
          <h1 className="text-[36px] sm:text-[44px] md:text-[48px] font-bold text-white tracking-tight leading-none">
            Set New Password
          </h1>
          <p className="text-[#c5a55a] text-[11px] tracking-[0.3em] uppercase font-semibold">
            Finish account recovery
          </p>
        </div>

        <ResetPasswordForm />

        <p className="mt-4 text-center text-[11px] text-white/50">
          Need to request another link?{" "}
          <Link
            href="/forgot-password"
            className="text-[#c5a55a] hover:text-[#d4b96a] underline-offset-4 hover:underline font-medium"
          >
            Forgot Password
          </Link>
        </p>
      </div>
    </div>
  );
}
