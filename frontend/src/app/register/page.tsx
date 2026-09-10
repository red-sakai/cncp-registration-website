import Image from "next/image";
import Link from "next/link";
import AdminLoginBackground from "@/components/admin/AdminLoginBackground";
import UserRegisterForm from "@/components/users/UserRegisterForm";

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;
  const nextUrl = typeof next === "string" ? next : undefined;
  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center p-4">
      {/* Background Layers (reuse admin login background) */}
      <AdminLoginBackground />

      {/* Content */}
      <div className="relative z-10 w-full max-w-[420px]">
        {/* Logo and Title */}
        <div className="text-center mb-10 space-y-3">
          <div className="inline-block mb-4">
            <Image
              src="/images/logos/cncp-white-logo.png"
              alt="Cisco NetConnect PUP - Manila"
              width={96}
              height={96}
              className="opacity-95"
            />
          </div>
          <h1 className="text-[40px] sm:text-[48px] md:text-[56px] font-bold text-white tracking-tight leading-none">
            Sign Up
          </h1>
          <p className="text-[#c5a55a] text-[11px] tracking-[0.3em] uppercase font-semibold">
            Cisco NetConnect PUP - Manila
          </p>
        </div>

        {/* Register Card */}
        <UserRegisterForm nextUrl={nextUrl} />

        {/* Sign in link */}
        <p className="mt-4 text-center text-[11px] text-white/50">
          Already have an account?{" "}
          <Link
            href="/"
            className="text-[#c5a55a] hover:text-[#d4b96a] underline-offset-4 hover:underline font-medium"
          >
            Sign In
          </Link>
        </p>

        {/* Bottom Text */}
        <p className="text-white/25 text-[10px] text-center mt-5 font-medium">
          Powered by Cisco NetConnect PUP - Manila
        </p>
      </div>
    </div>
  );
}
