// ─── Dashboard Home Page ───────────────────────────────────
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { dashboardService } from '../services/dashboardService';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer
} from 'recharts';
import { 
  HiOutlineClipboardDocumentList,
  HiOutlineChartBar,
  HiOutlineCheckCircle,
  HiOutlineCheck,
  HiOutlineClipboardDocumentCheck,
  HiOutlineSpeakerWave
} from 'react-icons/hi2';
import { 
  LuUsers, 
  LuGraduationCap, 
  LuPercent, 
  LuIndianRupee, 
  LuWallet, 
  LuBell,
  LuTrendingUp,
  LuTrendingDown,
  LuBookOpen,
  LuCalendar,
  LuLayoutDashboard,
  LuActivity,
  LuBellRing
} from 'react-icons/lu';

// Premium Glass KPI Card
const StatCard = ({ icon: Icon, label, value, trend, trendUp, borderColorClass, delay }) => (
  <div 
    className={`glass-card p-[24px] rounded-xl flex flex-col justify-between min-h-[140px] hover:scale-[1.02] transition-transform duration-300 group ${borderColorClass}`}
    style={{ animation: `fadeIn 0.5s ease-out ${delay}ms both` }}
  >
    <div className="flex justify-between items-start">
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center bg-white/5 text-primary group-hover:bg-primary/10 transition-colors`}>
        <Icon className="w-5 h-5" strokeWidth={2} />
      </div>
      {trend && (
        <div className={`flex items-center gap-1 font-label-md px-2 py-1 rounded-full ${trendUp ? 'bg-primary/10 text-primary' : 'bg-error/10 text-error'}`}>
          {trendUp ? <LuTrendingUp className="w-3.5 h-3.5" strokeWidth={3} /> : <LuTrendingDown className="w-3.5 h-3.5" strokeWidth={3} />}
          <span className="text-[10px] font-bold tracking-wider">{trend}</span>
        </div>
      )}
    </div>
    
    <div className="mt-4">
      <h3 className="font-label-sm text-[10px] text-on-surface-variant uppercase tracking-widest mb-1 opacity-80">{label}</h3>
      <div className="font-display text-[32px] text-on-surface tabular-nums leading-none tracking-tight">{value}</div>
    </div>
  </div>
);

// Mock data for charts
const attendanceTrendData = [
  { name: 'JAN', actual: 45, target: 50 },
  { name: 'FEB', actual: 52, target: 48 },
  { name: 'MAR', actual: 38, target: 42 },
  { name: 'APR', actual: 65, target: 55 },
  { name: 'MAY', actual: 48, target: 50 },
  { name: 'JUN', actual: 75, target: 60 },
  { name: 'JUL', actual: 55, target: 58 },
];

const DashboardPage = () => {
  const { user, isAdmin, isFaculty, isStudent } = useAuth();
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState({ stats: {}, recentActivity: [] });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchStats = async () => {
    try {
      const res = await dashboardService.getStats();
      setDashboardData(res.data.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleGenerateOverview = () => {
    setRefreshing(true);
    toast.promise(
      dashboardService.getStats().then(res => setDashboardData(res.data.data)),
      {
        loading: 'Generating real-time overview...',
        success: 'Overview generated successfully!',
        error: 'Failed to generate overview.',
      }
    ).finally(() => setRefreshing(false));
  };

  const adminStats = [
    { icon: LuUsers, label: 'Total Students', value: dashboardData.stats.totalStudents || 0, trend: '+12.4%', trendUp: true, borderColorClass: 'border-b-primary' },
    { icon: LuGraduationCap, label: 'Total Faculty', value: dashboardData.stats.totalFaculty || 0, trend: '+4.2%', trendUp: true, borderColorClass: 'border-b-secondary' },
    { icon: LuPercent, label: 'Avg. Attendance', value: dashboardData.stats.attendance || '0%', trend: '98.2%', trendUp: true, borderColorClass: 'border-b-tertiary' },
    { icon: LuWallet, label: 'Unpaid Fees', value: dashboardData.stats.pendingFees || '₹0', trend: '-2.1%', trendUp: false, borderColorClass: 'border-b-error' },
  ];

  const facultyStats = [
    { icon: LuCalendar, label: 'Classes Today', value: dashboardData.stats.classesToday || 0, borderColorClass: 'border-b-primary' },
    { icon: LuBookOpen, label: 'My Subjects', value: dashboardData.stats.mySubjects || 0, borderColorClass: 'border-b-secondary' },
    { icon: LuUsers, label: 'Total Students', value: dashboardData.stats.totalStudents || 0, borderColorClass: 'border-b-tertiary' },
    { icon: HiOutlineClipboardDocumentList, label: 'Pending Attendance', value: dashboardData.stats.pendingAttendance || 0, trend: 'Requires Action', trendUp: false, borderColorClass: 'border-b-error' },
  ];

  const studentStats = [
    { icon: HiOutlineChartBar, label: 'Attendance', value: dashboardData.stats.attendance || '0%', trend: '+2.4%', trendUp: true, borderColorClass: 'border-b-primary' },
    { icon: LuBookOpen, label: 'Total Subjects', value: dashboardData.stats.subjects || 0, trend: 'Active', trendUp: true, borderColorClass: 'border-b-secondary' },
    { icon: LuCalendar, label: 'Upcoming Exams', value: dashboardData.stats.upcomingExams || 0, trend: 'Next: 3d', trendUp: true, borderColorClass: 'border-b-tertiary' },
    { icon: LuWallet, label: 'Fees Due', value: dashboardData.stats.feesDue || '₹0', trend: 'Pending', trendUp: false, borderColorClass: 'border-b-error' },
  ];

  const stats = isAdmin ? adminStats : isFaculty ? facultyStats : studentStats;
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good Morning' : hour < 17 ? 'Good Afternoon' : 'Good Evening';

  return (
    <div className="space-y-[48px] animate-fadeIn">
      {/* Welcome Header */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-[24px]">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-primary">
            <LuLayoutDashboard className="w-5 h-5" />
            <span className="font-label-sm text-[12px] tracking-[0.2em] uppercase">Overview</span>
          </div>
          <h2 className="font-headline-lg text-[32px] text-on-surface font-extrabold tracking-tight">
            {greeting}, {user?.name?.split(' ')[0] || 'System'}
          </h2>
          <p className="font-body-md text-[16px] text-on-surface-variant max-w-xl">
            Real-time performance analytics and system snapshot for Semester II, 2024.
          </p>
        </div>
        <div className="flex items-center gap-3 print:hidden">
          <button 
            onClick={() => window.print()}
            className="px-6 py-3 rounded-lg bg-white/5 border border-white/10 text-on-surface font-label-md text-[14px] hover:bg-white/10 transition-all"
          >
            Download Report
          </button>
          <button 
            onClick={handleGenerateOverview}
            disabled={refreshing}
            className={`px-6 py-3 rounded-lg bg-primary-container text-on-primary-container font-label-md text-[14px] font-bold transition-all hover:scale-[1.02] flex items-center justify-center gap-2 shadow-sm ${refreshing ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            <LuActivity className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`} />
            {refreshing ? 'Generating...' : 'Refresh Data'}
          </button>
        </div>
      </section>

      {/* KPI Stats Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[24px]">
        {stats.map((stat, index) => (
          <StatCard key={stat.label} {...stat} delay={index * 100} />
        ))}
      </section>

      {/* Main Analytics Layout */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-[24px] items-start">
        
        {/* Main Chart Column */}
        <div className="lg:col-span-2 glass-card rounded-xl p-[48px] relative overflow-hidden">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h4 className="font-headline-md text-[24px] text-on-surface">Growth Analytics</h4>
              <p className="font-label-sm text-[12px] text-on-surface-variant mt-1">Monthly projection vs. actual intake</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-primary"></span>
                <span className="text-[10px] text-on-surface-variant font-medium uppercase tracking-wider">Actual</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-secondary"></span>
                <span className="text-[10px] text-on-surface-variant font-medium uppercase tracking-wider">Target</span>
              </div>
            </div>
          </div>
          
          {/* Recharts Area Chart */}
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={attendanceTrendData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorTarget" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-secondary)" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="var(--color-secondary)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: 'var(--color-on-surface-variant)', fontSize: 10, fontWeight: 700}} dy={15} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: 'var(--color-on-surface-variant)', fontSize: 10}} />
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: 'var(--color-surface-container-highest)', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff', fontSize: '12px' }} 
                  itemStyle={{ color: '#fff' }}
                />
                <Area type="monotone" dataKey="target" stroke="var(--color-secondary)" strokeWidth={2} strokeDasharray="4 4" fill="url(#colorTarget)" />
                <Area type="monotone" dataKey="actual" stroke="var(--color-primary)" strokeWidth={2} fillOpacity={1} fill="url(#colorActual)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right Column (Recent Activity Timeline) */}
        <div className="glass-card rounded-xl p-[48px] h-full flex flex-col">
          <h4 className="font-headline-md text-[24px] text-on-surface mb-[24px]">Recent Logs</h4>
          
          <div className="relative space-y-[24px] flex-1">
            {/* Timeline Line */}
            <div className="absolute left-6 top-2 bottom-0 w-[2px] bg-white/5"></div>
            
            {dashboardData.recentActivity.length > 0 ? dashboardData.recentActivity.map((activity, i) => (
              <div key={i} className="relative flex gap-[24px] group">
                <div className="z-10 h-12 w-12 rounded-xl bg-surface-container-high border border-white/10 flex items-center justify-center shrink-0 group-hover:border-primary/50 transition-colors">
                  <LuBellRing className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-label-md text-[14px] text-on-surface">{activity.title}</p>
                  <p className="font-label-sm text-[12px] text-on-surface-variant opacity-60 mt-0.5">
                    {activity.postedBy?.name ? `Posted by ${activity.postedBy.name}` : 'System update'}
                  </p>
                  <span className="text-[10px] font-bold text-on-surface-variant opacity-40 uppercase tracking-wider block mt-1">
                    {new Date(activity.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            )) : (
              <div className="flex flex-col items-center justify-center py-10 text-center relative z-20 bg-surface-container/50 rounded-xl">
                <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mb-4">
                  <HiOutlineCheckCircle className="w-6 h-6 text-primary" />
                </div>
                <p className="text-sm font-medium text-on-surface">You're all caught up!</p>
                <p className="text-xs text-on-surface-variant mt-1">No recent system logs.</p>
              </div>
            )}
          </div>
          
          <button className="mt-8 w-full py-3 rounded-lg border border-white/10 text-on-surface-variant font-label-sm hover:bg-white/5 transition-all text-center">
            View All Audit Logs
          </button>
        </div>
      </section>

      {/* Bottom Actions Section (Bento Grid) */}
      <section className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-[24px]">
        {[
          { label: 'View Timetable', icon: LuCalendar, path: '/dashboard/timetable', show: true, color: 'text-primary', bg: 'bg-primary/10' },
          { label: 'Check Marks', icon: HiOutlineCheck, path: '/dashboard/marks', show: true, color: 'text-secondary', bg: 'bg-secondary/10' },
          { label: 'Pay Fees', icon: LuWallet, path: '/dashboard/fees', show: isStudent, color: 'text-tertiary', bg: 'bg-tertiary/10' },
          { label: 'Mark Attendance', icon: HiOutlineClipboardDocumentCheck, path: '/dashboard/attendance', show: isAdmin || isFaculty, color: 'text-primary', bg: 'bg-primary/10' },
          { label: 'Manage Students', icon: LuUsers, path: '/dashboard/students', show: isAdmin, color: 'text-secondary', bg: 'bg-secondary/10' },
          { label: 'Post Notice', icon: HiOutlineSpeakerWave, path: '/dashboard/notices', show: isAdmin || isFaculty, color: 'text-error', bg: 'bg-error/10' },
        ].filter(a => a.show).map((action) => (
          <button
            key={action.label}
            onClick={() => navigate(action.path)}
            className="glass-panel p-6 rounded-xl flex flex-col items-center justify-center gap-3 hover:scale-105 hover:bg-white/10 transition-all duration-300 group shadow-sm border border-white/5"
          >
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${action.bg} ${action.color} group-hover:scale-110 transition-transform`}>
              <action.icon className="w-6 h-6" />
            </div>
            <span className="text-[12px] font-bold text-on-surface-variant group-hover:text-on-surface text-center leading-tight">
              {action.label}
            </span>
          </button>
        ))}
      </section>
    </div>
  );
};

export default DashboardPage;
