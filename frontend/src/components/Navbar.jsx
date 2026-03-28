import React, { useState, useEffect } from 'react';
import { Sun, Moon, User, Settings, X, Check } from 'lucide-react';

const Navbar = () => {
    // 1. Get name from localStorage, default to 'Project Lead' if empty
    const [name, setName] = useState(localStorage.getItem('leadName') || 'Project Lead');
    const [tempName, setTempName] = useState(name);
    const [isDark, setIsDark] = useState(localStorage.getItem('theme') !== 'light');
    const [showProfileModal, setShowProfileModal] = useState(false);

    // 2. Derive initials dynamically
    const initials = name
        .split(' ')
        .map(word => word[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);

    // 3. Persist Theme & Name Changes
    useEffect(() => {
        const root = window.document.documentElement;
        isDark ? root.classList.add('dark') : root.classList.remove('dark');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
    }, [isDark]);

    const handleSaveName = (e) => {
        e.preventDefault();
        setName(tempName);
        localStorage.setItem('leadName', tempName);
        setShowProfileModal(false);
    };

    return (
        <nav className="fixed top-0 w-full z-50 backdrop-blur-md bg-white/70 dark:bg-[#0a0a0c]/70 border-b border-slate-200 dark:border-white/10 px-6 py-4 flex justify-between items-center transition-all duration-300">
            <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                    <div className="w-4 h-4 border-2 border-white rounded-sm" />
                </div>
                <h1 className="text-xl font-black bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-500 bg-clip-text text-transparent uppercase tracking-tighter">
                    Project Management System
                </h1>
            </div>

            <div className="flex items-center gap-3">
                {/* Theme Toggle */}
                <button onClick={() => setIsDark(!isDark)} className="p-2 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-500 dark:text-yellow-400 hover:scale-105 transition-all">
                    {isDark ? <Sun size={18} /> : <Moon size={18} className="text-blue-600" />}
                </button>

                {/* Profile Section (Click to edit) */}
                <div 
                    onClick={() => setShowProfileModal(true)}
                    className="flex items-center gap-3 pl-3 border-l border-slate-200 dark:border-white/10 cursor-pointer group"
                >
                    <div className="hidden sm:block text-right">
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] leading-none mb-1">Lead</p>
                        <p className="text-xs font-bold text-slate-800 dark:text-white group-hover:text-blue-600 transition-colors">{name}</p>
                    </div>
                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center font-black text-white shadow-lg shadow-blue-500/20 ring-2 ring-white dark:ring-black transition-transform group-hover:scale-105">
                        {initials}
                    </div>
                </div>
            </div>

            {/* QUICK PROFILE EDIT MODAL */}
            {showProfileModal && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                    <div className="bg-white dark:bg-[#16161a] border border-slate-200 dark:border-white/10 p-8 rounded-[2rem] w-full max-w-sm shadow-2xl animate-in fade-in zoom-in duration-200">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold dark:text-white">Lead Profile</h2>
                            <button onClick={() => setShowProfileModal(false)} className="text-slate-400 hover:text-red-500"><X size={20}/></button>
                        </div>
                        
                        <form onSubmit={handleSaveName}>
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Your Name</label>
                            <input 
                                autoFocus
                                className="w-full mt-2 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl p-4 outline-none focus:border-blue-500 dark:text-white"
                                value={tempName}
                                onChange={(e) => setTempName(e.target.value)}
                                placeholder="Enter Lead Name"
                            />
                            <button type="submit" className="w-full mt-6 py-4 bg-blue-600 text-white font-bold rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20 hover:bg-blue-500 transition-all">
                                <Check size={18}/> Save Profile
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;