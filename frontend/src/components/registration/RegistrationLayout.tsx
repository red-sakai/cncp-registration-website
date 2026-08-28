import { RegistrationStepper } from './RegistrationStepper';
import AdminLoginBackground from '@/components/admin/AdminLoginBackground';

interface RegistrationLayoutProps {
  children: React.ReactNode;
  currentStep: number;
  totalSteps?: number;
}

export function RegistrationLayout({
  children,
  currentStep,
  totalSteps = 6,
}: RegistrationLayoutProps) {
  return (
    <div className="min-h-screen text-white relative overflow-hidden flex items-center justify-center p-4">
      <AdminLoginBackground />

      <main className="relative z-10 w-full max-w-[420px] sm:max-w-[480px] md:max-w-[520px] flex flex-col gap-6">
        {/* Stepper Header */}
        <div className="animate-fade-in">
          <RegistrationStepper currentStep={currentStep} totalSteps={totalSteps} />
        </div>

        {/* Form Card - same as login/register */}
        <div className="animate-fade-in animate-delay-200 relative overflow-hidden bg-white/5 backdrop-blur-md border border-white/10 rounded-[24px] p-6 sm:p-8 shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
          {children}
        </div>

        <p className="text-white/25 text-[10px] text-center font-medium">
          Powered by Cisco NetConnect PUP - Manila
        </p>
      </main>
    </div>
  );
}
