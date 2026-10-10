import Link from 'next/link';
import Image from 'next/image';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8f6f1] p-4 relative overflow-hidden">
      {/* Decorative brand background elements */}
      <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-[600px] h-[600px] bg-[#ad8075]/15 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 translate-y-1/4 -translate-x-1/4 w-[400px] h-[400px] bg-[#304250]/10 rounded-full blur-3xl" />
      
      <div className="w-full max-w-md relative z-10">
        <Link href="/" className="block text-center mb-6 group transition-transform hover:scale-[1.02]">
          <div className="flex justify-center">
            <Image
              src="/ora-logo-transparent.png"
              alt="ORA — Occupational Reskilling & Analytics"
              width={220}
              height={100}
              className="object-contain drop-shadow-sm"
              priority
            />
          </div>
        </Link>
        {children}
      </div>
    </div>
  );
}
