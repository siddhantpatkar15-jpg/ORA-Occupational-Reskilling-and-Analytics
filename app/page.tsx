import Link from 'next/link';
import { Button, Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui';
import { ClipboardCheck, Search, BookOpen, TrendingUp, ShieldCheck, CheckCircle2, ChevronRight, BarChart } from 'lucide-react';

export default function LandingPage({}: PageProps<"/">) {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-teal-600 flex items-center justify-center text-white font-bold text-xl">O</div>
            <span className="text-xl font-bold text-slate-900 tracking-tight">ORA</span>
          </div>
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <Link href="#problem" className="hover:text-teal-600 transition-colors">The Problem</Link>
            <Link href="#how-it-works" className="hover:text-teal-600 transition-colors">How it Works</Link>
            <Link href="#features" className="hover:text-teal-600 transition-colors">Features</Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-medium text-slate-600 hover:text-slate-900">Sign In</Link>
            <Button asChild className="bg-teal-600 hover:bg-teal-700 text-white shadow-sm shadow-teal-600/20">
              <Link href="/register">Get Started Free</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-grow pt-16">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-slate-900 text-white py-24 lg:py-32">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-900 to-teal-900/40" />
          <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-[800px] h-[800px] bg-teal-500/20 rounded-full blur-3xl opacity-50" />
          <div className="absolute bottom-0 left-0 translate-y-1/4 -translate-x-1/4 w-[600px] h-[600px] bg-indigo-500/20 rounded-full blur-3xl opacity-30" />
          
          <div className="container relative z-10 mx-auto px-4 text-center max-w-4xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700 text-teal-400 text-sm font-medium mb-8">
              <span className="flex h-2 w-2 rounded-full bg-teal-400 animate-pulse"></span>
              Introducing Occupational Reskilling & Analytics
            </div>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight mb-8 leading-tight">
              Discover Skills. <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-teal-200">Bridge Gaps.</span> <br className="hidden md:block" />
              Build Careers.
            </h1>
            
            <p className="text-lg md:text-xl text-slate-300 mb-10 max-w-2xl mx-auto leading-relaxed">
              AI-powered occupational reskilling platform empowering individuals to navigate career transitions and helping organizations build future-ready workforces.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button asChild size="lg" className="w-full sm:w-auto bg-teal-600 hover:bg-teal-500 text-white font-medium px-8 rounded-full h-14">
                <Link href="/register">Get Started Free <ChevronRight className="ml-2 h-4 w-4" /></Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="w-full sm:w-auto bg-white/5 hover:bg-white/10 text-white border-white/20 font-medium px-8 rounded-full h-14 backdrop-blur-sm">
                <Link href="/login?demo=true">View Interactive Demo</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* The Problem Section */}
        <section id="problem" className="py-24 bg-slate-50">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">The Skills Gap is Widening</h2>
              <p className="text-lg text-slate-600">The rapid pace of technological change is leaving both workers and organizations behind. Traditional education can't keep up.</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <Card className="border-none shadow-md shadow-slate-200/50 hover:shadow-lg transition-shadow bg-white">
                <CardHeader>
                  <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center text-orange-600 mb-4">
                    <TrendingUp className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-4xl font-extrabold text-slate-900 mb-2">67%</CardTitle>
                  <CardDescription className="text-base text-slate-600 font-medium">Of business leaders report facing significant skill gaps in their current workforce.</CardDescription>
                </CardHeader>
              </Card>
              
              <Card className="border-none shadow-md shadow-slate-200/50 hover:shadow-lg transition-shadow bg-white">
                <CardHeader>
                  <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 mb-4">
                    <Search className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-xl font-bold text-slate-900 mb-2">Hidden Potential</CardTitle>
                  <CardDescription className="text-base text-slate-600 font-medium">Employees often possess adjacent skills that go unrecognized when transitioning to new roles.</CardDescription>
                </CardHeader>
              </Card>
              
              <Card className="border-none shadow-md shadow-slate-200/50 hover:shadow-lg transition-shadow bg-white">
                <CardHeader>
                  <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center text-purple-600 mb-4">
                    <BookOpen className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-xl font-bold text-slate-900 mb-2">Fragmented Learning</CardTitle>
                  <CardDescription className="text-base text-slate-600 font-medium">Without personalized guidance, workers waste time on irrelevant training materials.</CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section id="how-it-works" className="py-24 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto mb-20">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">How ORA Works</h2>
              <p className="text-lg text-slate-600">A systematic, data-driven approach to occupational reskilling.</p>
            </div>

            <div className="max-w-5xl mx-auto relative">
              {/* Connecting line for desktop */}
              <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-slate-100 -translate-y-1/2 z-0"></div>
              
              <div className="grid md:grid-cols-4 gap-8 relative z-10">
                {[
                  { icon: ClipboardCheck, title: "1. Assess Skills", desc: "Evaluate current capabilities with AI-driven assessments." },
                  { icon: Search, title: "2. Identify Gaps", desc: "Map current skills against target role requirements." },
                  { icon: BookOpen, title: "3. Learn & Grow", desc: "Follow personalized learning paths to acquire new skills." },
                  { icon: BarChart, title: "4. Track Progress", desc: "Monitor development and demonstrate readiness." }
                ].map((step, i) => (
                  <div key={i} className="flex flex-col items-center text-center group">
                    <div className="w-20 h-20 rounded-2xl bg-white border-2 border-slate-100 shadow-sm flex items-center justify-center text-teal-600 mb-6 group-hover:border-teal-500 group-hover:scale-110 transition-all duration-300 relative">
                      <step.icon className="h-8 w-8" />
                      <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-teal-600 text-white text-sm font-bold flex items-center justify-center border-4 border-white shadow-sm">
                        {i + 1}
                      </div>
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 mb-2">{step.title}</h3>
                    <p className="text-slate-600 text-sm">{step.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="py-24 bg-slate-900 text-white overflow-hidden">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 text-sm font-medium mb-6">
                  Skill Gap Analysis
                </div>
                <h2 className="text-3xl md:text-4xl font-bold mb-6">Precision targeting for your next career move</h2>
                <p className="text-slate-400 text-lg mb-8 leading-relaxed">
                  Stop guessing what you need to learn. ORA analyzes your current skill profile against millions of job postings to pinpoint exactly what's missing for your target role.
                </p>
                <ul className="space-y-4">
                  {[
                    "AI-driven skill extraction from resumes",
                    "Real-time labor market alignment",
                    "Adjacent skill identification",
                    "Granular proficiency leveling"
                  ].map((feature, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <CheckCircle2 className="h-5 w-5 text-teal-400 shrink-0" />
                      <span className="text-slate-300">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-tr from-teal-500/20 to-indigo-500/20 blur-3xl rounded-full"></div>
                <Card className="relative bg-slate-800/80 backdrop-blur-xl border-slate-700 shadow-2xl">
                  <CardHeader>
                    <CardTitle className="text-white">Target Role: Data Analyst</CardTitle>
                    <CardDescription className="text-slate-400">Skill match: 65%</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-white font-medium">SQL & Database Querying</span>
                        <span className="text-teal-400">Match (Level 4/5)</span>
                      </div>
                      <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                        <div className="h-full bg-teal-500 w-[80%] rounded-full"></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-white font-medium">Data Visualization (Tableau/PowerBI)</span>
                        <span className="text-orange-400">Gap (Level 1/4)</span>
                      </div>
                      <div className="h-2 bg-slate-700 rounded-full overflow-hidden flex">
                        <div className="h-full bg-teal-500 w-[25%]"></div>
                        <div className="h-full bg-orange-400/50 w-[75%] border-l border-slate-800"></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-white font-medium">Python for Data Analysis</span>
                        <span className="text-orange-400">Gap (Level 2/4)</span>
                      </div>
                      <div className="h-2 bg-slate-700 rounded-full overflow-hidden flex">
                        <div className="h-full bg-teal-500 w-[50%]"></div>
                        <div className="h-full bg-orange-400/50 w-[50%] border-l border-slate-800"></div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Security & Access */}
        <section className="py-24 bg-slate-50 border-t border-slate-200">
          <div className="container mx-auto px-4 text-center">
            <ShieldCheck className="h-16 w-16 text-teal-600 mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-slate-900 mb-6">Enterprise-Grade Security</h2>
            <p className="text-slate-600 max-w-2xl mx-auto mb-12">
              Your career data is sensitive. We protect it with industry-leading security practices, encryption at rest and in transit, and granular access controls.
            </p>
            
            <Card className="max-w-md mx-auto bg-white border-slate-200 shadow-xl shadow-slate-200/50">
              <CardHeader>
                <CardTitle>Ready to explore?</CardTitle>
                <CardDescription>Use our interactive demo to see ORA in action.</CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full bg-slate-900 hover:bg-slate-800 text-white mb-4">
                  <Link href="/login?demo=true">Access Demo Environment</Link>
                </Button>
                <div className="text-sm text-slate-500 text-left bg-slate-50 p-4 rounded-lg border border-slate-100">
                  <p className="font-semibold text-slate-700 mb-2">Available personas:</p>
                  <ul className="space-y-1">
                    <li>• Job Seeker (Individual)</li>
                    <li>• Organization Admin</li>
                    <li>• Content Trainer</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div className="col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-teal-600 flex items-center justify-center text-white font-bold text-xl">O</div>
                <span className="text-xl font-bold text-white tracking-tight">ORA</span>
              </div>
              <p className="max-w-xs">Empowering the workforce of tomorrow through intelligent reskilling and analytics.</p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Platform</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="#" className="hover:text-teal-400 transition-colors">For Individuals</Link></li>
                <li><Link href="#" className="hover:text-teal-400 transition-colors">For Organizations</Link></li>
                <li><Link href="#" className="hover:text-teal-400 transition-colors">For Trainers</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="#" className="hover:text-teal-400 transition-colors">About</Link></li>
                <li><Link href="#" className="hover:text-teal-400 transition-colors">Privacy</Link></li>
                <li><Link href="#" className="hover:text-teal-400 transition-colors">Terms</Link></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-slate-800 text-sm text-center md:text-left flex flex-col md:flex-row justify-between items-center">
            <p>© {new Date().getFullYear()} Occupational Reskilling & Analytics. All rights reserved.</p>
            <div className="flex gap-4 mt-4 md:mt-0">
              {/* Social links could go here */}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}