import React, { useState, useEffect } from "react";
import {
  GitBranch,
  RefreshCw,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Clock,
  GitCommit,
  X,
  Code2,
  Sparkles,
  ArrowDownToLine,
  ShieldCheck,
  Lock,
} from "lucide-react";
import { Employee } from "../../types";

interface CommitInfo {
  sha: string;
  message: string;
  author: string;
  date: string;
}

interface GitHubSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser?: Employee | null;
  onSyncComplete?: () => void;
}

export const GitHubSyncModal: React.FC<GitHubSyncModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onSyncComplete,
}) => {
  const [repoUrl] = useState("https://github.com/tikmerk/workflowhr");
  const [branch] = useState("main");
  const [loading, setLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [commits, setCommits] = useState<CommitInfo[]>([]);
  const [syncStatus, setSyncStatus] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fetchStatus = async () => {
    setLoading(true);
    setErrorMessage(null);
    try {
      const res = await fetch("/api/system/git-status");
      const data = await res.json();
      if (data.commits && Array.isArray(data.commits)) {
        setCommits(data.commits);
      }
    } catch (err: any) {
      console.warn("Failed to fetch git status:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchStatus();
    }
  }, [isOpen]);

  const handleTriggerSync = async () => {
    setSyncing(true);
    setSyncStatus(null);
    setErrorMessage(null);
    try {
      const res = await fetch("/api/system/git-sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role: currentUser?.role || "SUPER_ADMIN",
          employeeId: currentUser?.id,
          employeeName: currentUser?.fullName,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSyncStatus("গিটহাব রিপোজিটরি থেকে সর্বশেষ কোড সফলভাবে সিঙ্ক ও আপডেট করা হয়েছে!");
        fetchStatus();
        if (onSyncComplete) onSyncComplete();
      } else {
        setErrorMessage(data.error || "সিঙ্ক করতে ব্যর্থ হয়েছে। পরে আবার চেষ্টা করুন।");
      }
    } catch (err: any) {
      setErrorMessage(err.message || "সার্ভার এরর: সিঙ্ক সম্পন্ন করা যায়নি।");
    } finally {
      setSyncing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      id="github-sync-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div
        id="github-sync-modal-card"
        className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-purple-600/10 dark:bg-purple-400/10 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <GitBranch className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  গিটহাব অটো-সিঙ্ক ও ডিপ্লয়মেন্ট
                </h3>
                <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 border border-purple-300 dark:border-purple-800">
                  <ShieldCheck className="w-3 h-3 text-purple-600" />
                  সুপার অ্যাডমিন
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                GitHub Repository: <span className="font-mono text-purple-600 dark:text-purple-400">tikmerk/workflowhr</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Target Repo Card */}
          <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                লিঙ্কড আপস্ট্রিম রিপোজিটরি
              </span>
              <a
                href={repoUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-xs font-semibold text-purple-600 dark:text-purple-400 hover:underline"
              >
                <span>GitHub-এ দেখুন</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
            <div className="flex items-center gap-2 text-sm font-mono font-bold text-slate-800 dark:text-slate-200 break-all">
              <Code2 className="w-4 h-4 text-purple-500 shrink-0" />
              <span>{repoUrl}</span>
            </div>
            <div className="mt-2 flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1">
                <GitBranch className="w-3.5 h-3.5 text-teal-500" />
                শাখা: <strong className="text-slate-700 dark:text-slate-300">{branch}</strong>
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                সুপার অ্যাডমিন এক্সেস সক্রিয়
              </span>
            </div>
          </div>

          {/* User Instructions notice */}
          <div className="p-3.5 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800/60 text-xs text-purple-900 dark:text-purple-200 flex items-start gap-2.5">
            <Sparkles className="w-4 h-4 text-purple-600 dark:text-purple-400 shrink-0 mt-0.5" />
            <div>
              <strong className="block font-semibold mb-0.5">সুপার অ্যাডমিনদের জন্য অটো-সিঙ্ক গাইড:</strong>
              আপনি যখন আপনার গিটহাবে নতুন কোড পুশ করবেন, তখন এই উইন্ডোতে থাকা <strong>"এখনই গিটহাব থেকে সিঙ্ক করুন"</strong> বাটনে ক্লিক করলেই আপনার রিপোজিটরির সর্বশেষ কোড স্বয়ংক্রিয়ভাবে ডাউনলোড ও সিঙ্ক হয়ে যাবে। সাধারণ কর্মীরা এই অপশন দেখতে পারবে না।
            </div>
          </div>

          {/* Sync Success / Error Notices */}
          {syncStatus && (
            <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-200 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>{syncStatus}</span>
            </div>
          )}

          {errorMessage && (
            <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-xs text-red-800 dark:text-red-200 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Latest Commits Feed */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <GitCommit className="w-4 h-4 text-purple-500" />
                সর্বশেষ গিটহাব কমিটসমূহ
              </h4>
              <button
                onClick={fetchStatus}
                disabled={loading}
                className="text-xs text-slate-500 dark:text-slate-400 hover:text-purple-600 flex items-center gap-1 cursor-pointer"
              >
                <RefreshCw className={`w-3 h-3 ${loading ? "animate-spin" : ""}`} />
                <span>রিফ্রেশ</span>
              </button>
            </div>

            {loading ? (
              <div className="py-8 text-center text-xs text-slate-400">
                <RefreshCw className="w-5 h-5 mx-auto mb-2 animate-spin text-purple-500" />
                কমিট তথ্য লোড হচ্ছে...
              </div>
            ) : commits.length > 0 ? (
              <div className="space-y-2">
                {commits.map((c, i) => (
                  <div
                    key={c.sha || i}
                    className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 hover:border-purple-300 dark:hover:border-purple-800/80 transition"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 line-clamp-2">
                        {c.message}
                      </p>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-purple-100 dark:bg-purple-900/60 text-purple-700 dark:text-purple-300 font-bold shrink-0">
                        {c.sha}
                      </span>
                    </div>
                    <div className="mt-1.5 flex items-center gap-3 text-[10px] text-slate-500 dark:text-slate-400">
                      <span>{c.author}</span>
                      {c.date && (
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {new Date(c.date).toLocaleDateString("bn-BD", {
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-6 text-center text-xs text-slate-400 border border-dashed border-slate-300 dark:border-slate-800 rounded-xl">
                কোনো সাম্প্রতিক কমিট পাওয়া যায়নি অথবা অফলাইন মোডে রয়েছে।
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition cursor-pointer"
          >
            বন্ধ করুন
          </button>
          <button
            type="button"
            onClick={handleTriggerSync}
            disabled={syncing}
            className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 active:scale-95 disabled:opacity-50 transition shadow-lg shadow-purple-600/20 flex items-center gap-2 cursor-pointer"
          >
            <ArrowDownToLine className={`w-4 h-4 ${syncing ? "animate-bounce" : ""}`} />
            <span>{syncing ? "সিঙ্ক হচ্ছে..." : "এখনই গিটহাব থেকে সিঙ্ক করুন"}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
