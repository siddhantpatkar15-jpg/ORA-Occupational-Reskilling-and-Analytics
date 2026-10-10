import Link from 'next/link';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-[600px] h-[600px] bg-teal-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 translate-y-1/4 -translate-x-1/4 w-[400px] h-[400px] bg-indigo-500/10 rounded-full blur-3xl" />
      
      <div className="w-full max-w-md relative z-10">
        <Link href="/" className="block text-center mb-8 group">
          <div className="mx-auto w-12 h-12 rounded-xl bg-teal-600 flex items-center justify-center text-white font-bold text-2xl mb-4 group-hover:scale-105 transition-transform shadow-lg shadow-teal-600/20">O</div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">ORA</h1>
          <p className="text-sm font-medium text-slate-500 mt-1">Occupational Reskilling & Analytics</p>
        </Link>
        {children}
      </div>
    </div>
  );
}
