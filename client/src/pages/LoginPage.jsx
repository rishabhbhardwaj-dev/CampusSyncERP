import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { 
  HiOutlineEnvelope, 
  HiOutlineLockClosed, 
  HiOutlineEye, 
  HiOutlineEyeSlash,
  HiOutlineArrowRightOnRectangle,
  HiOutlineShieldCheck,
  HiAcademicCap,
} from 'react-icons/hi2';
import { 
  HiOutlineClipboardList, 
  HiOutlineChartBar, 
  HiOutlineCash, 
  HiOutlineBell,
} from 'react-icons/hi';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please fill in all fields');
      return;
    }
    setIsLoading(true);
    try {
      const response = await login(email, password);
      if (response.success) {
        navigate('/dashboard');
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed. Please try again.';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const fillCredentials = (demoEmail, demoPass) => {
    setEmail(demoEmail);
    setPassword(demoPass);
  };

  return (
    <div className="min-h-screen flex bg-background">
      {/* ─── Left Panel: Branding ─────────────────────────────── */}
      <div className="hidden lg:flex lg:w-[52%] relative overflow-hidden flex-col justify-between p-[40px] bg-gradient-to-br from-surface-container-low via-surface-container to-surface-container-high border-r border-white/5">
        
        {/* Background campus image with overlay */}
        <div className="absolute inset-0">
          <img src="/campus-bg.png" alt="" className="w-full h-full object-cover opacity-10" />
          <div className="absolute inset-0 bg-surface/80 backdrop-blur-sm" />
        </div>

        {/* Decorative dots */}
        <div className="absolute top-20 right-16 grid grid-cols-5 gap-2 opacity-20">
          {Array(15).fill(0).map((_, i) => (
            <div key={i} className="w-1.5 h-1.5 rounded-full bg-primary" />
          ))}
        </div>
        <div className="absolute bottom-32 left-8 w-3 h-3 rounded-full border-2 border-secondary/40" />
        <div className="absolute top-40 right-8 w-4 h-4 rounded-full border-2 border-primary/30" />

        {/* ── Top: Logo ── */}
        <div className="relative z-10 flex items-center gap-3 group cursor-default">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-primary/10 border border-primary/20 group-hover:scale-105 transition-transform">
            <HiAcademicCap className="w-6 h-6 text-primary" />
          </div>
          <div>
            <span className="text-on-surface font-headline-md text-[24px] font-black tracking-tight leading-none">CampusSync</span>
            <p className="text-primary font-label-sm text-[10px] uppercase tracking-[0.2em] mt-1">Enterprise ERP</p>
          </div>
        </div>

        {/* ── Middle: Hero Text ── */}
        <div className="relative z-10 -mt-8">
          <h1 className="font-display text-[48px] font-bold text-on-surface leading-tight mb-[16px]">
            One Platform,<br />
            Complete <span className="text-primary">Campus</span><br />
            Management
          </h1>
          <p className="font-body-md text-[16px] text-on-surface-variant max-w-sm leading-relaxed">
            Empowering institutions to manage academics, administration, communication, and more — efficiently and intelligently.
          </p>

          {/* Feature Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-[16px] mt-[32px]">
            {[
              { icon: HiOutlineClipboardList, label: 'Attendance', sub: 'Track in real-time', color: 'text-primary' },
              { icon: HiOutlineChartBar, label: 'Grades', sub: 'Performance insights', color: 'text-secondary' },
              { icon: HiOutlineCash, label: 'Fees', sub: 'Secure payments', color: 'text-tertiary' },
              { icon: HiOutlineBell, label: 'Notices', sub: 'Instant updates', color: 'text-error' },
            ].map(({ icon: Icon, label, sub, color }) => (
              <div key={label} className="glass-card rounded-xl p-[16px] text-center hover:bg-white/5 group border border-white/10 transition-all cursor-default">
                <Icon className={`w-6 h-6 ${color} mx-auto mb-2 opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all`} />
                <p className="font-label-md text-[14px] font-bold text-on-surface">{label}</p>
                <p className="font-label-sm text-[10px] text-on-surface-variant mt-1">{sub}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Bottom: Stats ── */}
        <div className="relative z-10 flex items-end justify-between mt-8">
          <div className="glass-card rounded-2xl p-[24px] min-w-[240px] border border-white/10 hover:border-primary/30 transition-colors">
            <p className="font-label-sm text-[12px] font-bold text-on-surface-variant uppercase tracking-widest mb-[16px]">Today's Overview</p>
            {/* Mini chart bars */}
            <div className="flex items-end gap-2 h-12 mb-[16px]">
              {[40, 65, 45, 80, 55, 70, 90, 60, 75, 85].map((h, i) => (
                <div key={i} className="flex-1 rounded-sm transition-all duration-500 bg-white/10 hover:bg-primary/50"
                  style={{ height: `${h}%` }} />
              ))}
            </div>
            <div className="flex gap-[24px]">
              <div>
                <p className="font-display text-[24px] font-bold text-on-surface">92%</p>
                <p className="font-label-sm text-[10px] text-on-surface-variant uppercase mt-1">Attendance <span className="text-primary ml-1">↑4%</span></p>
              </div>
              <div>
                <p className="font-display text-[24px] font-bold text-on-surface">85</p>
                <p className="font-label-sm text-[10px] text-on-surface-variant uppercase mt-1">Assignments <span className="text-primary ml-1">↑7%</span></p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Right Panel: Login Form ─────────────────────────── */}
      <div className="w-full lg:w-[48%] flex items-center justify-center p-[24px] md:p-[40px] relative overflow-hidden bg-background">
        
        {/* Subtle background pattern */}
        <div className="absolute inset-0 opacity-30" style={{
          backgroundImage: 'radial-gradient(circle at 20% 80%, var(--color-primary-container) 0%, transparent 40%), radial-gradient(circle at 80% 20%, var(--color-secondary-container) 0%, transparent 40%)',
          filter: 'blur(100px)'
        }} />
        
        <div className="w-full max-w-md animate-fadeIn relative z-10">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-3 mb-[32px] justify-center">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-primary/10 border border-primary/20">
              <HiAcademicCap className="w-6 h-6 text-primary" />
            </div>
            <div>
              <span className="text-on-surface font-headline-md text-[24px] font-black tracking-tight leading-none">CampusSync</span>
            </div>
          </div>

          {/* Form Card */}
          <div className="glass-card rounded-3xl p-[32px] md:p-[40px] border border-white/10 shadow-2xl shadow-black/50 bg-surface-container-lowest/80">
            {/* Header */}
            <div className="mb-[32px] text-center">
              <h2 className="font-headline-md text-[28px] font-bold text-on-surface mb-2 tracking-tight">Welcome Back</h2>
              <p className="font-body-md text-[15px] text-on-surface-variant">Sign in to your CampusSync account.</p>
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-[20px]">
              {/* Email */}
              <div>
                <label className="block font-label-sm text-[12px] font-bold text-on-surface mb-2 uppercase tracking-wider">
                  Email Address
                </label>
                <div className="relative group">
                  <HiOutlineEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-on-surface-variant group-focus-within:text-primary transition-colors" />
                  <input
                    id="login-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full pl-12 pr-4 py-3.5 bg-surface-container-low border border-white/10 rounded-xl text-[14px] text-on-surface outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all placeholder-on-surface-variant/50"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block font-label-sm text-[12px] font-bold text-on-surface mb-2 uppercase tracking-wider">
                  Password
                </label>
                <div className="relative group">
                  <HiOutlineLockClosed className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-on-surface-variant group-focus-within:text-primary transition-colors" />
                  <input
                    id="login-password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full pl-12 pr-12 py-3.5 bg-surface-container-low border border-white/10 rounded-xl text-[14px] text-on-surface outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all placeholder-on-surface-variant/50"
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface transition-colors"
                    tabIndex={-1}>
                    {showPassword 
                      ? <HiOutlineEyeSlash className="w-5 h-5" /> 
                      : <HiOutlineEye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Remember me + Forgot */}
              <div className="flex items-center justify-between pt-1 pb-2">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input type="checkbox" className="w-4 h-4 rounded border-white/10 bg-surface-container-low text-primary focus:ring-primary focus:ring-offset-background" />
                  <span className="font-label-sm text-[13px] text-on-surface-variant group-hover:text-on-surface transition-colors">Remember me</span>
                </label>
                <button type="button" className="font-label-sm text-[13px] font-bold text-primary hover:text-primary-container transition-colors">
                  Forgot password?
                </button>
              </div>

              {/* Submit Button */}
              <button
                id="login-submit"
                type="submit"
                disabled={isLoading}
                className="w-full py-4 rounded-xl bg-primary text-on-primary font-label-md text-[15px] font-bold flex items-center justify-center gap-2 transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:hover:scale-100 shadow-lg shadow-primary/20"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-on-primary/30 border-t-on-primary rounded-full animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    <HiOutlineArrowRightOnRectangle className="w-5 h-5" />
                    Sign In
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Role Quick Login */}
          <div className="mt-[32px]">
            <div className="flex items-center gap-4 mb-[24px]">
              <div className="flex-1 h-px bg-white/10" />
              <span className="font-label-sm text-[10px] font-bold text-on-surface-variant uppercase tracking-widest px-2">or sign in as</span>
              <div className="flex-1 h-px bg-white/10" />
            </div>
            <div className="grid grid-cols-3 gap-[16px]">
              {[
                { role: 'Admin', email: 'admin@campussync.com', pass: 'admin123', icon: '👑', accentColor: 'hover:border-primary/50 hover:shadow-primary/10', textColor: 'group-hover:text-primary' },
                { role: 'Faculty', email: 'faculty@campussync.com', pass: 'faculty123', icon: '👨‍🏫', accentColor: 'hover:border-secondary/50 hover:shadow-secondary/10', textColor: 'group-hover:text-secondary' },
                { role: 'Student', email: 'student@campussync.com', pass: 'student123', icon: '🎓', accentColor: 'hover:border-tertiary/50 hover:shadow-tertiary/10', textColor: 'group-hover:text-tertiary' },
              ].map(({ role, email: e, pass, icon, accentColor, textColor }) => (
                <button
                  key={role}
                  type="button"
                  onClick={() => fillCredentials(e, pass)}
                  className={`glass-card flex flex-col items-center justify-center gap-2 py-[16px] rounded-xl border border-white/5 transition-all duration-300 hover:scale-105 hover:bg-white/5 shadow-lg shadow-black/20 group ${accentColor}`}
                >
                  <span className="text-[24px] mb-1 group-hover:scale-110 transition-transform">{icon}</span>
                  <span className={`font-label-sm text-[12px] font-bold text-on-surface transition-colors ${textColor}`}>{role}</span>
                  <span className="font-label-sm text-[9px] text-on-surface-variant opacity-60">1-Click</span>
                </button>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="mt-[32px] text-center space-y-4">
            <p className="font-body-md text-[14px] text-on-surface-variant">
              New here? <button className="font-bold text-primary hover:text-primary-container transition-colors ml-1">Create an account</button>
            </p>
            <div className="flex items-center justify-center gap-2 font-label-sm text-[11px] text-on-surface-variant opacity-60 uppercase tracking-widest">
              <HiOutlineShieldCheck className="w-4 h-4 text-primary" />
              Secure • Reliable • Enterprise ERP
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
