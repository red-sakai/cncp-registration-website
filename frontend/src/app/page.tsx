import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import AdminLoginBackground from "@/components/admin/AdminLoginBackground";
import UserLoginForm from "@/components/users/UserLoginForm";
import { getUserRole } from "@/services/authService";

type PageProps = {
  searchParams: Promise<{ registered?: string; next?: string }>;
};

export default async function Home({ searchParams }: PageProps) {
  const { registered, next } = await searchParams;
  const safeNext =
    next && next.startsWith("/") && !next.startsWith("//") ? next : null;
  const { role } = await getUserRole();

  if (safeNext && role) {
    redirect(safeNext);
  }

  if (role === "admin") {
    redirect("/admin/dashboard");
  }

  if (role === "user") {
    redirect("/my-events");
  }

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center p-4">
      {/* Background Layers */}
      <AdminLoginBackground />

      {/* Content */}
      <div className="relative z-10 w-full max-w-[420px]">
        {/* Logo and Title */}
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
          <h1 className="text-[40px] sm:text-[48px] md:text-[56px] font-bold text-white tracking-tight leading-none">
            Sign In
          </h1>
          <p className="text-[#c5a55a] text-[11px] tracking-[0.3em] uppercase font-semibold">
            Cisco NetConnect PUP - Manila
          </p>
        </div>

        {/* Login Card */}
        <UserLoginForm showRegisteredMessage={registered === "1"} />

        {/* Sign up link */}
        <p className="mt-4 text-center text-[11px] text-white/50">
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            className="text-[#c5a55a] hover:text-[#d4b96a] underline-offset-4 hover:underline font-medium"
          >
            Sign Up
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
