import { useState } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { usersService } from '../services/usersService';
import { HiOutlineUser, HiOutlineLockClosed, HiOutlineDevicePhoneMobile } from 'react-icons/hi2';

const SettingsPage = () => {
  const { user } = useAuth();
  
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  const handleUpdateProfile = async () => {
    setSavingProfile(true);
    try {
      await usersService.updateProfile({ name, phone });
      toast.success('Profile updated successfully!');
      // Note: Ideally update the user in Context here, but refresh works for now.
    } catch (err) {
      toast.error('Failed to update profile');
    } finally {
      setSavingProfile(false);
    }
  };

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    if (newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setSavingPassword(true);
    try {
      await usersService.changePassword({ currentPassword, newPassword });
      toast.success('Password changed successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to change password');
    } finally {
      setSavingPassword(false);
    }
  };

  const inputClass = "w-full px-4 py-3 bg-surface-container-low border border-white/10 rounded-xl focus:ring-2 focus:ring-secondary/10 focus:border-secondary/50 text-on-surface text-[14px] outline-none transition-all placeholder-on-surface-variant/50";
  const labelClass = "block font-label-sm text-[12px] font-bold text-on-surface mb-2 uppercase tracking-wider";

  return (
    <div className="animate-fadeIn max-w-[1000px] mx-auto space-y-[32px] pb-8">
      <div>
        <h1 className="font-headline-lg text-[32px] text-on-surface font-extrabold tracking-tight">Account Settings</h1>
        <p className="font-body-md text-[16px] text-on-surface-variant mt-1">Manage your profile and security preferences.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-[24px]">
        
        {/* Profile Details */}
        <div className="glass-card p-[32px] rounded-2xl border border-white/10 h-fit">
          <h2 className="font-headline-md text-[20px] font-bold text-on-surface mb-[24px] flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center border border-secondary/20">
              <HiOutlineUser className="w-5 h-5" />
            </div>
            Profile Details
          </h2>
          
          <div className="space-y-[20px]">
            <div>
              <label className={labelClass}>Full Name</label>
              <input 
                type="text" 
                className={inputClass} 
                value={name} 
                onChange={e => setName(e.target.value)} 
              />
            </div>

            <div>
              <label className={labelClass}>Phone Number</label>
              <input 
                type="text" 
                className={inputClass} 
                value={phone} 
                onChange={e => setPhone(e.target.value)} 
                placeholder="e.g. +91 9876543210"
              />
            </div>

            <div>
              <label className={labelClass}>Email Address (Read-only)</label>
              <input 
                type="text" 
                className={`${inputClass} opacity-60 cursor-not-allowed`} 
                value={user?.email || ''} 
                disabled
              />
            </div>

            <div className="pt-4 mt-[8px]">
              <button 
                onClick={handleUpdateProfile}
                disabled={savingProfile}
                className="w-full px-6 py-3 bg-secondary text-on-secondary font-label-md font-bold rounded-xl hover:scale-[1.02] disabled:hover:scale-100 shadow-lg shadow-secondary/20 transition-all disabled:opacity-50"
              >
                {savingProfile ? 'Saving Changes...' : 'Save Profile'}
              </button>
            </div>
          </div>
        </div>

        {/* Change Password */}
        <div className="glass-card p-[32px] rounded-2xl border border-white/10 h-fit">
          <h2 className="font-headline-md text-[20px] font-bold text-on-surface mb-[24px] flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-error/10 text-error flex items-center justify-center border border-error/20">
              <HiOutlineLockClosed className="w-5 h-5" />
            </div>
            Security & Password
          </h2>

          <div className="space-y-[20px]">
            <div>
              <label className={labelClass}>Current Password</label>
              <input 
                type="password" 
                className={inputClass.replace('focus:border-secondary/50 focus:ring-secondary/10', 'focus:border-error/50 focus:ring-error/10')} 
                value={currentPassword} 
                onChange={e => setCurrentPassword(e.target.value)} 
              />
            </div>

            <div>
              <label className={labelClass}>New Password</label>
              <input 
                type="password" 
                className={inputClass.replace('focus:border-secondary/50 focus:ring-secondary/10', 'focus:border-error/50 focus:ring-error/10')} 
                value={newPassword} 
                onChange={e => setNewPassword(e.target.value)} 
              />
            </div>

            <div>
              <label className={labelClass}>Confirm New Password</label>
              <input 
                type="password" 
                className={inputClass.replace('focus:border-secondary/50 focus:ring-secondary/10', 'focus:border-error/50 focus:ring-error/10')} 
                value={confirmPassword} 
                onChange={e => setConfirmPassword(e.target.value)} 
              />
            </div>

            <div className="pt-4 mt-[8px]">
              <button 
                onClick={handleChangePassword}
                disabled={savingPassword}
                className="w-full px-6 py-3 bg-error text-on-error font-label-md font-bold rounded-xl hover:scale-[1.02] disabled:hover:scale-100 shadow-lg shadow-error/20 transition-all disabled:opacity-50"
              >
                {savingPassword ? 'Updating Password...' : 'Update Password'}
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default SettingsPage;
