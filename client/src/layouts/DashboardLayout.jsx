// ─── Dashboard Layout ──────────────────────────────────────
import { useState, useEffect, useRef } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { noticeService } from '../services/noticeService';
import { 
  HiOutlineHome, 
  HiOutlineUsers, 
  HiOutlineAcademicCap,
  HiOutlineClipboardDocumentList,
  HiOutlineCalendarDays,
  HiOutlineBanknotes,
  HiOutlineBell,
  HiOutlineChartBarSquare,
  HiOutlineCog6Tooth,
  HiOutlineArrowRightOnRectangle,
  HiOutlineBars3,
  HiOutlineXMark,
  HiOutlineMagnifyingGlass,
  HiOutlineUserCircle,
  HiOutlineSun,
  HiOutlineMoon
} from 'react-icons/hi2';

const DashboardLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [notices, setNotices] = useState([]);

  useEffect(() => {
    noticeService.getAll().then(res => {
      if (res.data?.data) {
        setNotices(res.data.data.slice(0, 5));
      }
    }).catch(console.error);
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);
  
  const searchRef = useRef(null);
  const searchInputRef = useRef(null);
  const notifRef = useRef();
  const profileRef = useRef();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) setShowNotifications(false);
      if (profileRef.current && !profileRef.current.contains(e.target)) setShowProfileMenu(false);
      if (searchRef.current && !searchRef.current.contains(e.target)) setIsSearchFocused(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
      if (e.key === 'Escape') {
        setIsSearchFocused(false);
        searchInputRef.current?.blur();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: HiOutlineHome, roles: ['ADMIN', 'FACULTY', 'STUDENT'] },
    { label: 'Students', path: '/dashboard/students', icon: HiOutlineUsers, roles: ['ADMIN', 'FACULTY'] },
    { label: 'Faculty', path: '/dashboard/faculty', icon: HiOutlineAcademicCap, roles: ['ADMIN'] },
    { label: 'Attendance', path: '/dashboard/attendance', icon: HiOutlineClipboardDocumentList, roles: ['ADMIN', 'FACULTY', 'STUDENT'] },
    { label: 'Timetable', path: '/dashboard/timetable', icon: HiOutlineCalendarDays, roles: ['ADMIN', 'FACULTY', 'STUDENT'] },
    { label: 'Marks', path: '/dashboard/marks', icon: HiOutlineChartBarSquare, roles: ['ADMIN', 'FACULTY', 'STUDENT'] },
    { label: 'Fees', path: '/dashboard/fees', icon: HiOutlineBanknotes, roles: ['ADMIN', 'STUDENT'] },
    { label: 'Documents', path: '/dashboard/documents', icon: HiOutlineClipboardDocumentList, roles: ['ADMIN', 'FACULTY', 'STUDENT'] },
    { label: 'Settings', path: '/dashboard/settings', icon: HiOutlineCog6Tooth, roles: ['ADMIN', 'FACULTY', 'STUDENT'] },
  ].filter(item => item.roles.includes(user?.role));

  const searchResults = navItems.filter(item => 
    item.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex h-screen overflow-hidden bg-background text-on-surface transition-colors duration-300">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-surface-container-highest/60 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={() => setSidebarOpen(false)} 
        />
      )}

      {/* Sidebar Anchor */}
      <aside 
        className={`
          print:hidden
          fixed lg:static inset-y-0 left-0 z-50 flex flex-col bg-surface-container/90 backdrop-blur-2xl border-r border-white/10
          transform transition-transform duration-300 ease-in-out shadow-2xl lg:shadow-[20px_0_40px_rgba(0,0,0,0.4)]
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          w-64 py-[24px]
        `}
      >
        {/* Logo Section */}
        <div className="px-6 mb-[40px] flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => navigate('/dashboard')}>
            <div className="h-10 w-10 bg-primary-container rounded-lg flex items-center justify-center transition-transform group-hover:scale-105">
              <HiOutlineAcademicCap className="w-6 h-6 text-on-primary-container" />
            </div>
            <div>
              <h1 className="font-headline-md text-[24px] font-black text-primary leading-none">CampusSync</h1>
              <p className="font-label-sm text-[10px] text-on-surface-variant uppercase tracking-[0.1em] opacity-60 mt-1">Enterprise ERP</p>
            </div>
          </div>
          <button 
            className="lg:hidden p-2 rounded-xl text-on-surface-variant hover:text-primary transition-colors"
            onClick={() => setSidebarOpen(false)}
          >
            <HiOutlineXMark className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 space-y-1 overflow-y-auto custom-scrollbar">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              replace={true}
              end={item.path === '/dashboard'}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) => `
                flex items-center px-6 py-4 transition-all duration-300 group
                ${isActive 
                  ? 'bg-primary/10 text-primary border-r-4 border-primary' 
                  : 'text-on-surface-variant hover:bg-white/5 hover:text-on-surface border-r-4 border-transparent'}
              `}
            >
              {({ isActive }) => (
                <>
                  <item.icon className={`w-5 h-5 mr-4 transition-colors duration-200 ${isActive ? 'text-primary' : 'text-on-surface-variant group-hover:text-primary'}`} />
                  <span className="font-label-md text-[14px]">{item.label}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* User Info (Bottom Sidebar) */}
        <div className="mt-auto px-6 pt-[24px]">
          <div className="flex items-center gap-3 p-3 glass-panel rounded-xl cursor-pointer hover:bg-white/5 transition-colors relative" onClick={() => setShowProfileMenu(!showProfileMenu)} ref={profileRef}>
            <div className="w-10 h-10 flex-shrink-0 rounded-full flex items-center justify-center text-sm font-bold text-white bg-gradient-to-br from-primary to-secondary shadow-inner border border-primary/20">
              {user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <div className="overflow-hidden flex-1">
              <p className="font-label-md text-[14px] text-on-surface truncate">{user?.name || 'System User'}</p>
              <p className="text-[10px] text-on-surface-variant/70 uppercase tracking-wider">{user?.role || 'Role'}</p>
            </div>
            
            {showProfileMenu && (
              <div className="absolute bottom-full left-0 mb-2 w-full bg-surface-container-highest rounded-xl shadow-xl border border-white/10 overflow-hidden z-50 animate-fadeIn">
                <div className="p-2">
                  <button onClick={() => navigate('/dashboard/settings')} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-on-surface hover:bg-white/5 transition-colors">
                    <HiOutlineUserCircle className="w-5 h-5 text-on-surface-variant" /> Profile
                  </button>
                </div>
                <div className="p-2 border-t border-white/5">
                  <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-error hover:bg-error/10 transition-colors">
                    <HiOutlineArrowRightOnRectangle className="w-5 h-5" /> Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content Wrapper */}
      <div className="flex-1 flex flex-col overflow-hidden w-full relative">
        {/* TopNavBar */}
        <header className="print:hidden h-20 w-full flex justify-between items-center px-6 lg:px-[40px] bg-surface/80 backdrop-blur-xl border-b border-white/10 shadow-lg shadow-black/20 z-40 shrink-0">
          <div className="flex items-center gap-4 flex-1">
            <button 
              className="lg:hidden p-2 rounded-xl text-on-surface-variant hover:text-primary transition-colors"
              onClick={() => setSidebarOpen(true)}
            >
              <HiOutlineBars3 className="w-6 h-6" />
            </button>

            {/* Search Bar */}
            <div className="hidden md:flex relative max-w-md w-full group" ref={searchRef}>
              <HiOutlineMagnifyingGlass className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant w-5 h-5 group-focus-within:text-primary transition-colors" />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search records (Ctrl+K)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                className="w-full bg-surface-container-low border border-white/10 rounded-full py-2.5 pl-12 pr-4 text-[14px] text-on-surface focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all placeholder-on-surface-variant/50"
              />
              
              {/* Search Dropdown */}
              {isSearchFocused && (
                <div className="absolute top-full mt-2 w-full bg-surface-container-highest rounded-2xl shadow-xl border border-white/10 overflow-hidden z-50 animate-fadeIn origin-top">
                  {searchResults.length > 0 ? (
                    <div className="p-2">
                      <p className="px-3 py-2 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Navigation</p>
                      {searchResults.map((item) => (
                        <button
                          key={item.path}
                          onClick={() => {
                            navigate(item.path);
                            setIsSearchFocused(false);
                            setSearchQuery('');
                            searchInputRef.current?.blur();
                          }}
                          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-on-surface hover:bg-white/5 transition-colors text-left"
                        >
                          <item.icon className="w-5 h-5 flex-shrink-0 text-primary" />
                          Go to {item.label}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="p-6 text-center">
                      <p className="text-sm font-medium text-on-surface">No results found</p>
                      <p className="text-xs text-on-surface-variant mt-1">Try searching for "Attendance"</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="relative" ref={notifRef}>
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 rounded-full hover:bg-white/5 text-on-surface-variant hover:text-primary transition-all duration-200"
              >
                <HiOutlineBell className="w-6 h-6" />
                <span className="absolute top-2 right-2 h-2 w-2 bg-error rounded-full ring-2 ring-surface"></span>
              </button>
              
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-surface-container-highest rounded-2xl shadow-xl border border-white/10 overflow-hidden z-50 animate-fadeIn origin-top-right">
                  <div className="p-4 border-b border-white/10 flex justify-between items-center bg-surface-container-low">
                    <h3 className="font-bold text-on-surface text-[14px]">Notifications</h3>
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {notices.length > 0 ? notices.map((n, i) => (
                      <div key={i} className="p-4 border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer flex gap-3">
                        <div className={`w-2 h-2 mt-1.5 rounded-full flex-shrink-0 bg-primary`} />
                        <div>
                          <p className="text-[14px] font-semibold text-on-surface">{n.title}</p>
                          <p className="text-[12px] text-on-surface-variant mt-1">{new Date(n.createdAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                    )) : (
                      <div className="p-4 text-center text-sm text-on-surface-variant">No recent notices</div>
                    )}
                  </div>
                  <div className="p-3 text-center border-t border-white/10 bg-surface-container-low hover:bg-white/5 transition-colors cursor-pointer" onClick={() => navigate('/dashboard/notices')}>
                    <span className="text-[12px] font-bold text-primary tracking-widest uppercase">View All</span>
                  </div>
                </div>
              )}
            </div>

            {/* Theme Toggle */}
            <button 
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-full hover:bg-white/5 text-on-surface-variant hover:text-primary transition-all duration-200"
            >
              {darkMode ? <HiOutlineSun className="w-6 h-6" /> : <HiOutlineMoon className="w-6 h-6" />}
            </button>

            <div className="hidden lg:block h-6 w-px bg-white/10"></div>
            <div className="hidden lg:flex flex-col items-end">
              <span className="font-label-sm text-[12px] font-bold text-primary tracking-widest uppercase">Academic Year</span>
              <span className="font-label-md text-[14px] text-on-surface">{new Date().getFullYear()} - {new Date().getFullYear() + 1}</span>
            </div>
          </div>
        </header>
        
        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6 lg:p-[40px] custom-scrollbar">
          <div className="max-w-[1280px] mx-auto w-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
