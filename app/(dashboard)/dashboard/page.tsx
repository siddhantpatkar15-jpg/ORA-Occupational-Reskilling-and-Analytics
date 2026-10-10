import { verifySession, getUser } from '@/lib/auth/dal';
import { redirect } from 'next/navigation';
import { db } from '@/lib/db';
import * as schema from '@/lib/db/schema';
import { eq, count, sql } from 'drizzle-orm';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent, 
  StatCard, 
  Badge,
  ProgressBar,
  Button
} from '@/components/ui';
import { 
  Trophy, 
  BookOpen, 
  Target, 
  Award,
  Users,
  GraduationCap,
  ClipboardList,
  AlertCircle,
  TrendingUp,
  BrainCircuit,
  Briefcase
} from 'lucide-react';
import Link from 'next/link';

export default async function DashboardPage() {
  const session = await verifySession();
  const user = await getUser();
  
  if (!user) redirect('/login');

  const userRole = (user.role || '').toLowerCase();
  const firstName = (user.name || 'User').split(' ')[0];

  if (userRole === 'learner') {
    // Using placeholder logic as we don't know the exact schema details beyond what's common.
    // In a real app we'd query db.select().from(schema.courses) etc.
    return (
      <div className="space-y-6">
        <div className="bg-teal-600/10 border border-teal-500/20 text-teal-800 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-sm">Demo Mode Active</h3>
            <p className="text-sm mt-1">This dashboard is currently showing simulated data. Complete assessments to generate your real skill profile.</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Welcome back, {firstName}!</h1>
            <p className="text-slate-500">Here's your learning progress for today.</p>
          </div>
          <div className="flex gap-2">
            <Button asChild variant="outline">
              <Link href="/roadmap">View Roadmap</Link>
            </Button>
            <Button asChild>
              <Link href="/assessments">Take Assessment</Link>
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard 
            title="Competency Score" 
            value="76%" 
            icon={<Trophy className="w-5 h-5" />} 
            trend={{ value: 4, label: "from last month", isPositive: true }}
          />
          <StatCard 
            title="Courses In Progress" 
            value="3" 
            icon={<BookOpen className="w-5 h-5" />} 
          />
          <StatCard 
            title="Skill Gaps" 
            value="5" 
            icon={<Target className="w-5 h-5" />} 
            trend={{ value: 2, label: "closed recently", isPositive: true }}
          />
          <StatCard 
            title="Certificates" 
            value="2" 
            icon={<Award className="w-5 h-5" />} 
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-teal-600" />
                  <CardTitle>Target Occupation: Data Analyst</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-600 mb-4">You are currently 76% matched to this role based on your assessed skills.</p>
                <ProgressBar value={76} className="mb-4" color="teal" />
                <div className="flex gap-2">
                  <Badge variant="success">Python (Matched)</Badge>
                  <Badge variant="success">SQL (Matched)</Badge>
                  <Badge variant="warning">PowerBI (Gap)</Badge>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <BrainCircuit className="w-5 h-5 text-teal-600" />
                  <CardTitle>Top Skills Profile</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { name: 'Python Programming', level: 85 },
                  { name: 'Data Visualization', level: 70 },
                  { name: 'Machine Learning', level: 45 },
                  { name: 'Cloud Architecture', level: 30 }
                ].map(skill => (
                  <div key={skill.name}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium text-slate-700">{skill.name}</span>
                      <span className="text-slate-500">{skill.level}%</span>
                    </div>
                    <ProgressBar value={skill.level} color="teal" />
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { title: "Completed Assessment: Python Basics", time: "2 hours ago" },
                  { title: "Started Course: Intro to Machine Learning", time: "Yesterday" },
                  { title: "Earned Badge: Data Explorer", time: "3 days ago" },
                  { title: "Updated Target Occupation", time: "1 week ago" }
                ].map((act, i) => (
                  <div key={i} className="flex gap-3">
                    <div className="w-2 h-2 mt-2 rounded-full bg-teal-500 shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-slate-800">{act.title}</p>
                      <p className="text-xs text-slate-500">{act.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (userRole === 'trainer') {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Trainer Dashboard</h1>
            <p className="text-slate-500">Welcome back, {firstName}. Here's an overview of your training programs.</p>
          </div>
          <div className="flex gap-2">
            <Button>Create Course</Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="My Learners" value="142" icon={<Users className="w-5 h-5" />} />
          <StatCard title="Courses Created" value="8" icon={<BookOpen className="w-5 h-5" />} />
          <StatCard title="Pending Reviews" value="15" icon={<ClipboardList className="w-5 h-5" />} />
          <StatCard title="Avg Completion" value="82%" icon={<TrendingUp className="w-5 h-5" />} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Learners Needing Attention</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1,2,3].map(i => (
                  <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-200" />
                      <div>
                        <p className="text-sm font-medium">Student Name {i}</p>
                        <p className="text-xs text-slate-500">Stuck on Module 3</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">Message</Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Submissions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1,2,3].map(i => (
                  <div key={i} className="flex items-center justify-between p-3 border-b border-slate-100 last:border-0">
                    <div>
                      <p className="text-sm font-medium">Data Analysis Project</p>
                      <p className="text-xs text-slate-500">Submitted by Student {i}</p>
                    </div>
                    <Badge>Pending</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Admin Dashboard
  return (
    <div className="space-y-6">
      <div className="bg-amber-500/10 border border-amber-500/20 text-amber-800 rounded-lg p-4 flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <h3 className="font-semibold text-sm">Sample Data Warning</h3>
          <p className="text-sm mt-1">Analytics are currently showing generated sample data for demonstration purposes.</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">System Overview</h1>
          <p className="text-slate-500">Global metrics and platform health.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">Manage Users</Button>
          <Button>View Full Analytics</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Users" value="1,248" icon={<Users className="w-5 h-5" />} />
        <StatCard title="Active Learners" value="892" icon={<GraduationCap className="w-5 h-5" />} />
        <StatCard title="Training Programs" value="45" icon={<BookOpen className="w-5 h-5" />} />
        <StatCard title="Workforce Readiness" value="68%" icon={<TrendingUp className="w-5 h-5" />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Top Organizational Skill Gaps</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { name: "Cloud Architecture", gap: "45% of target" },
              { name: "Machine Learning", gap: "38% of target" },
              { name: "Agile Leadership", gap: "30% of target" },
              { name: "Data Engineering", gap: "25% of target" }
            ].map(gap => (
              <div key={gap.name} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <span className="text-sm font-medium text-slate-700">{gap.name}</span>
                <Badge variant="destructive">{gap.gap}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Training Enrollment Overview</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-center h-64 bg-slate-50 rounded-lg border border-slate-100">
            <p className="text-slate-400 text-sm">[Chart Preview - Training Enrollments over time]</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
