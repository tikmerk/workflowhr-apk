import React from "react";
import {
  LayoutDashboard,
  UserCheck,
  ScanFace,
  Users,
  CalendarCheck,
  Menu,
} from "lucide-react";
import { NavTabId } from "./Sidebar";

interface MobileBottomNavProps {
  activeTab: NavTabId;
  isGeneralEmployee?: boolean;
  onTabChange: (tab: NavTabId) => void;
  onOpenAttendance: () => void;
  onOpenMobileMenu: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeTab,
  isGeneralEmployee = false,
  onTabChange,
  onOpenAttendance,
  onOpenMobileMenu,
}) => {
  const triggerHaptic = () => {
    if (typeof navigator !== "undefined" && navigator.vibrate) {
      try {
        navigator.vibrate(20);
      } catch (e) {
        // ignore
      }
    }
  };

  const handleTab = (tab: NavTabId) => {
    triggerHaptic();
    onTabChange(tab);
  };

  const handleAttendance = () => {
    triggerHaptic();
    onOpenAttendance();
  };

  const handleMenu = () => {
    triggerHaptic();
    onOpenMobileMenu();
  };

  return (
    <div
      id="mobile-bottom-navigation-bar"
      className="fixed bottom-0 inset-x-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-t border-slate-200 dark:border-slate-800/90 px-3 py-1 flex items-center justify-around shadow-2xl safe-bottom text-slate-600 dark:text-slate-400 select-none transition-all"
    >
      {/* 1. Dashboard */}
      <button
        type="button"
        onClick={() => handleTab("dashboard")}
        className="flex flex-col items-center justify-center py-1 px-3 min-h-[50px] transition-all cursor-pointer group"
      >
        <div
          className={`px-3 py-1 rounded-full transition-all flex items-center justify-center ${
            activeTab === "dashboard"
              ? "bg-teal-500/15 text-teal-600 dark:text-teal-400"
              : "text-slate-500 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-slate-200"
          }`}
        >
          <LayoutDashboard className="w-5 h-5" />
        </div>
        <span
          className={`text-[10px] mt-0.5 tracking-tight ${
            activeTab === "dashboard"
              ? "font-bold text-teal-600 dark:text-teal-400"
              : "font-medium text-slate-500 dark:text-slate-400"
          }`}
        >
          ড্যাশবোর্ড
        </span>
      </button>

      {/* 2. Self Service Portal */}
      <button
        type="button"
        onClick={() => handleTab("my-portal")}
        className="flex flex-col items-center justify-center py-1 px-3 min-h-[50px] transition-all cursor-pointer group"
      >
        <div
          className={`px-3 py-1 rounded-full transition-all flex items-center justify-center ${
            activeTab === "my-portal" || (activeTab as any) === "self-service"
              ? "bg-teal-500/15 text-teal-600 dark:text-teal-400"
              : "text-slate-500 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-slate-200"
          }`}
        >
          <UserCheck className="w-5 h-5" />
        </div>
        <span
          className={`text-[10px] mt-0.5 tracking-tight ${
            activeTab === "my-portal" || (activeTab as any) === "self-service"
              ? "font-bold text-teal-600 dark:text-teal-400"
              : "font-medium text-slate-500 dark:text-slate-400"
          }`}
        >
          মাই পোর্টাল
        </span>
      </button>

      {/* 3. Central Android Biometric Floating Action Button */}
      <button
        type="button"
        onClick={handleAttendance}
        className="relative -top-3.5 flex flex-col items-center justify-center cursor-pointer group px-2"
        title="স্মার্ট ফেস ক্লক হাজিরা"
      >
        <div className="w-13 h-13 rounded-2xl bg-gradient-to-tr from-teal-600 via-teal-500 to-emerald-400 text-white flex items-center justify-center shadow-lg shadow-teal-500/40 border-3 border-white dark:border-slate-900 group-hover:scale-105 active:scale-95 transition-all">
          <ScanFace className="w-6 h-6 animate-pulse" />
        </div>
        <span className="text-[10px] font-bold text-teal-600 dark:text-teal-400 mt-1">
          ফেস ক্লক
        </span>
      </button>

      {/* 4. Staff Directory OR Leaves for General Employees */}
      {isGeneralEmployee ? (
        <button
          type="button"
          onClick={() => handleTab("leaves")}
          className="flex flex-col items-center justify-center py-1 px-3 min-h-[50px] transition-all cursor-pointer group"
        >
          <div
            className={`px-3 py-1 rounded-full transition-all flex items-center justify-center ${
              activeTab === "leaves"
                ? "bg-teal-500/15 text-teal-600 dark:text-teal-400"
                : "text-slate-500 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-slate-200"
            }`}
          >
            <CalendarCheck className="w-5 h-5" />
          </div>
          <span
            className={`text-[10px] mt-0.5 tracking-tight ${
              activeTab === "leaves"
                ? "font-bold text-teal-600 dark:text-teal-400"
                : "font-medium text-slate-500 dark:text-slate-400"
            }`}
          >
            ছুটি
          </span>
        </button>
      ) : (
        <button
          type="button"
          onClick={() => handleTab("employees")}
          className="flex flex-col items-center justify-center py-1 px-3 min-h-[50px] transition-all cursor-pointer group"
        >
          <div
            className={`px-3 py-1 rounded-full transition-all flex items-center justify-center ${
              activeTab === "employees"
                ? "bg-teal-500/15 text-teal-600 dark:text-teal-400"
                : "text-slate-500 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-slate-200"
            }`}
          >
            <Users className="w-5 h-5" />
          </div>
          <span
            className={`text-[10px] mt-0.5 tracking-tight ${
              activeTab === "employees"
                ? "font-bold text-teal-600 dark:text-teal-400"
                : "font-medium text-slate-500 dark:text-slate-400"
            }`}
          >
            কর্মী তালিকা
          </span>
        </button>
      )}

      {/* 5. Android Navigation Drawer Menu */}
      <button
        type="button"
        onClick={handleMenu}
        className="flex flex-col items-center justify-center py-1 px-3 min-h-[50px] text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all cursor-pointer group"
      >
        <div className="px-3 py-1 rounded-full transition-all flex items-center justify-center text-slate-500 dark:text-slate-400 group-hover:bg-slate-100 dark:group-hover:bg-slate-800">
          <Menu className="w-5 h-5" />
        </div>
        <span className="text-[10px] mt-0.5 tracking-tight font-medium">মেনু</span>
      </button>
    </div>
  );
};
