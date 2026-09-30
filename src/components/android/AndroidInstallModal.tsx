import React, { useState } from "react";
import {
  Smartphone,
  Download,
  CheckCircle2,
  X,
  Share2,
  PlusSquare,
  Sparkles,
  Terminal,
  Layers,
  ShieldCheck,
  Zap,
  Copy,
  Check,
  QrCode,
  ExternalLink,
  AlertTriangle,
} from "lucide-react";

interface AndroidInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
  deferredPrompt?: any;
}

export const AndroidInstallModal: React.FC<AndroidInstallModalProps> = ({
  isOpen,
  onClose,
  deferredPrompt,
}) => {
  const [activeTab, setActiveTab] = useState<"quick" | "pwabuilder" | "bubblewrap">("quick");
  const [copiedCmd, setCopiedCmd] = useState(false);
  const [copiedBubblewrapCmd, setCopiedBubblewrapCmd] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [installNotice, setInstallNotice] = useState<string | null>(null);

  if (!isOpen) return null;

  const currentAppUrl =
    typeof window !== "undefined" && window.location.origin && !window.location.origin.includes("localhost")
      ? window.location.origin
      : "https://ais-dev-cdyx7al2szkdubymhk77tc-926788587175.asia-east1.run.app";

  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(
    currentAppUrl
  )}&margin=4`;

  const pwaBuilderUrl = `https://www.pwabuilder.com/?url=${encodeURIComponent(currentAppUrl)}`;

  const bubblewrapScript = `# ১. Google এর অফিশিয়াল Bubblewrap CLI ইনস্টল করুন:
npm install -g @bubblewrap/cli

# ২. সরাসরি আপনার অ্যাপের Manifest URL দিয়ে প্রজেক্ট ইনিশিয়ালাইজ করুন:
bubblewrap init --manifest="${currentAppUrl}/manifest.json"

# (প্রম্পটে Package ID: com.workflowhr.app দিন এবং এন্টার চাপুন)

# ৩. সাইন করা APK এবং Play Store AAB তৈরি করুন:
bubblewrap build

# আপনার প্রজেক্ট ডিরেক্টরিতে "app-release-signed.apk" তৈরি হয়ে যাবে!`;

  const capacitorScript = `# বিকল্প: Capacitor দিয়ে Android Studio প্রজেক্ট তৈরি:
npm install @capacitor/core @capacitor/cli @capacitor/android
npx cap init "Workflow HR" "com.workflowhr.app"
npx cap add android
npm run build && npx cap sync android
npx cap open android`;

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      try {
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        console.log(`User response to the install prompt: ${outcome}`);
      } catch (err) {
        console.error(err);
      }
    } else {
      setInstallNotice(
        "অ্যান্ড্রয়েড ক্রোম ব্রাউজারের থ্রি-ডট (⋮) মেনু থেকে 'Install app' বা 'Add to Home screen' চাপুন।"
      );
    }
  };

  const copyUrl = () => {
    navigator.clipboard.writeText(currentAppUrl);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2500);
  };

  const copyBubblewrapScript = () => {
    navigator.clipboard.writeText(bubblewrapScript);
    setCopiedBubblewrapCmd(true);
    setTimeout(() => setCopiedBubblewrapCmd(false), 3000);
  };

  const copyBuildScript = () => {
    navigator.clipboard.writeText(capacitorScript);
    setCopiedCmd(true);
    setTimeout(() => setCopiedCmd(false), 3000);
  };

  return (
    <div
      id="android-install-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div
        id="android-install-modal-card"
        className="relative w-full max-w-xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-gradient-to-r from-emerald-600/10 via-teal-500/10 to-transparent">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <span>অ্যান্ড্রয়েড অ্যাপ ইনস্টলেশন ও এপিকে</span>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold">
                  Android Native
                </span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                স্মার্টফোনে সরাসরি অ্যাপ হিসেবে ব্যবহার ও টেস্ট করুন
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 px-6 pt-3 gap-2 overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab("quick")}
            className={`pb-3 px-1 text-xs font-bold transition border-b-2 cursor-pointer whitespace-nowrap ${
              activeTab === "quick"
                ? "border-emerald-500 text-emerald-600 dark:text-emerald-400"
                : "border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
            }`}
          >
            ১. ফোনে সরাসরি ইনস্টল (WebAPK)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("pwabuilder")}
            className={`pb-3 px-1 text-xs font-bold transition border-b-2 cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === "pwabuilder"
                ? "border-emerald-500 text-emerald-600 dark:text-emerald-400"
                : "border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
            }`}
          >
            <span>২. PWA Builder (অনলাইন APK)</span>
            <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-600 dark:text-amber-400 font-bold uppercase">
              সহজতম
            </span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("bubblewrap")}
            className={`pb-3 px-1 text-xs font-bold transition border-b-2 cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === "bubblewrap"
                ? "border-emerald-500 text-emerald-600 dark:text-emerald-400"
                : "border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
            }`}
          >
            <span>৩. Google Bubblewrap CLI</span>
            <span className="text-[9px] px-1.5 py-0.2 rounded bg-blue-500/20 text-blue-600 dark:text-blue-400 font-bold uppercase">
              অফিশিয়াল
            </span>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 max-h-[72vh] overflow-y-auto">
          {activeTab === "quick" && (
            <div className="space-y-4">
              {/* Important Clarification Banner */}
              <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800/80 text-amber-900 dark:text-amber-200 text-xs flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="block font-bold mb-0.5">ব্রাউজারে কোন লিংকটি দিবেন?</strong>
                  কখনোই Google AI Studio-র কোডিং স্টুডিও বা এডিটর লিংক পেস্ট করবেন না। শুধুমাত্র নিচের সরাসরি অ্যাপ লিংকটি আপনার ফোনের <strong>গুগল ক্রোম (Google Chrome)</strong> ব্রাউজারে ওপেন করবেন।
                </div>
              </div>

              {/* Direct App Link & QR Code Box */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  {/* QR Code */}
                  <div className="shrink-0 p-2 bg-white rounded-xl shadow-md border border-slate-200 text-center">
                    <img
                      src={qrCodeUrl}
                      alt="Workflow HR Mobile App QR Code"
                      className="w-28 h-28 object-contain"
                      loading="lazy"
                    />
                    <span className="block mt-1 text-[10px] font-bold text-slate-600 flex items-center justify-center gap-1">
                      <QrCode className="w-3 h-3 text-emerald-600" />
                      ক্যামেরা দিয়ে স্ক্যান করুন
                    </span>
                  </div>

                  {/* Direct Link details */}
                  <div className="flex-1 w-full min-w-0 space-y-2">
                    <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                      সরাসরি মোবাইল অ্যাপ্লিকেশন লিংক:
                    </span>
                    <div className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-mono text-xs text-emerald-600 dark:text-emerald-400 break-all select-all font-semibold">
                      {currentAppUrl}
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={copyUrl}
                        className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-sm"
                      >
                        {copiedUrl ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>লিংক কপি হয়েছে!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>লিংক কপি করুন</span>
                          </>
                        )}
                      </button>
                      <a
                        href={currentAppUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-1.5 rounded-lg bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 text-xs font-bold transition flex items-center gap-1.5"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>নতুন ট্যাবে খুলুন</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step by step */}
              <div className="space-y-2.5">
                <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  মোবাইলে যেভাবে ইনস্টল ও টেস্ট করবেন:
                </h4>

                <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700">
                  <div className="w-6 h-6 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                    ১
                  </div>
                  <div className="text-xs">
                    <p className="font-semibold text-slate-800 dark:text-slate-200">
                      আপনার ফোনের ক্যামেরা দিয়ে উপরের <strong>QR কোডটি স্ক্যান করুন</strong> অথবা কপি করা লিংকটি ফোনের <strong>Google Chrome</strong> ব্রাউজারে পেস্ট করুন।
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700">
                  <div className="w-6 h-6 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                    ২
                  </div>
                  <div className="text-xs">
                    <p className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1">
                      ওয়েবসাইট লোড হলে নিচে স্বয়ংক্রিয়ভাবে <strong>"Add Workflow HR to Home screen"</strong> পপআপ আসবে। অথবা ব্রাউজারের ওপরের ডানদিকের থ্রি-ডট <span className="font-mono bg-slate-200 dark:bg-slate-700 px-1 py-0.5 rounded">⋮</span> মেনু থেকে <strong>"Install app"</strong> চাপুন।
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700">
                  <div className="w-6 h-6 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                    ৩
                  </div>
                  <div className="text-xs">
                    <p className="font-semibold text-slate-800 dark:text-slate-200">
                      ইনস্টল বাটনে চাপার সাথে সাথে ফোনের হোমস্ক্রিনে <strong>Workflow HR</strong> অ্যাপের আইকন যুক্ত হয়ে যাবে। এখন ব্রাউজার ছাড়াই সরাসরি অ্যাপ থেকে ফুলস্ক্রিন ব্যবহার ও টেস্ট করতে পারবেন।
                    </p>
                  </div>
                </div>
              </div>

              {/* Native Advantages */}
              <div className="grid grid-cols-2 gap-2 pt-1 text-xs">
                <div className="p-2.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-teal-500 shrink-0" />
                  <span>ফেস ক্যামেরা ও অফলাইন সাপোর্ট</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-amber-500 shrink-0" />
                  <span>জিপিএস জিওফেন্সিং উপস্থিতি</span>
                </div>
              </div>

              {/* 1-click install button if supported */}
              <button
                type="button"
                onClick={handleInstallClick}
                className="w-full py-3 px-4 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 active:scale-98 transition shadow-lg shadow-teal-600/30 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>ব্রাউজার থেকে সরাসরি ইনস্টল করুন</span>
              </button>

              {installNotice && (
                <div className="p-3 rounded-xl bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 text-teal-800 dark:text-teal-200 text-xs flex items-center justify-between gap-2">
                  <span>{installNotice}</span>
                  <button
                    type="button"
                    onClick={() => setInstallNotice(null)}
                    className="p-1 rounded-md hover:bg-teal-200/50 dark:hover:bg-teal-900/50 text-teal-700 dark:text-teal-300"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          )}

          {activeTab === "pwabuilder" && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 border border-amber-200/80 dark:border-amber-800/60 text-xs space-y-2">
                <div className="flex items-center gap-2 text-amber-900 dark:text-amber-200 font-bold text-sm">
                  <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>PWABuilder দিয়ে অনলাইন থেকে সরাসরি APK ডাউনলোড:</span>
                </div>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  কম্পিউটারে কোনো SDK, জাভা বা জটিল টুল ইনস্টল না করেই <strong>PWABuilder (pwabuilder.com)</strong> ব্যবহার করে ১-ক্লিকে সাইন করা <strong>.apk</strong> এবং Google Play Store-এর <strong>.aab</strong> ফাইল তৈরি করা যায়।
                </p>
              </div>

              {/* Direct 1-Click Launch PWABuilder Button */}
              <a
                href={pwaBuilderUrl}
                target="_blank"
                rel="noreferrer"
                className="w-full py-3 px-4 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 hover:from-amber-500 hover:to-orange-500 active:scale-98 transition shadow-lg shadow-orange-600/30 flex items-center justify-center gap-2 cursor-pointer"
              >
                <ExternalLink className="w-4 h-4" />
                <span>PWABuilder-এ Workflow HR খুলুন (সরাসরি APK জেনারেট)</span>
              </a>

              {/* Step by step for PWA Builder */}
              <div className="space-y-2.5">
                <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  PWABuilder ব্যবহারের ৪টি সহজ ধাপ:
                </h4>

                <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700">
                  <div className="w-6 h-6 rounded-full bg-amber-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                    ১
                  </div>
                  <div className="text-xs">
                    <p className="font-semibold text-slate-800 dark:text-slate-200">
                      উপরের <strong>"PWABuilder-এ Workflow HR খুলুন"</strong> বাটনে ক্লিক করুন। PWABuilder আপনার লাইভ অ্যাপের ম্যানিফেস্ট ও সার্ভিস ওয়ার্কার স্বয়ংক্রিয়ভাবে অডিট করবে (রেজাল্ট: ১০০% PWA Compliant)।
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700">
                  <div className="w-6 h-6 rounded-full bg-amber-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                    ২
                  </div>
                  <div className="text-xs">
                    <p className="font-semibold text-slate-800 dark:text-slate-200">
                      অডিট সম্পন্ন হলে ডানদিকের <strong>"Package for Stores"</strong> বাটনে ক্লিক করুন।
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700">
                  <div className="w-6 h-6 rounded-full bg-amber-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                    ৩
                  </div>
                  <div className="text-xs">
                    <p className="font-semibold text-slate-800 dark:text-slate-200">
                      প্ল্যাটফর্ম লিস্ট থেকে <strong>"Android"</strong> সিলেক্ট করুন। প্যাকেজ আইডি হিসেবে <span className="font-mono bg-slate-200 dark:bg-slate-700 px-1 py-0.5 rounded text-emerald-600 font-bold">com.workflowhr.app</span> সেট থাকবে। এরপর <strong>"Generate"</strong> চাপুন।
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700">
                  <div className="w-6 h-6 rounded-full bg-amber-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                    ৪
                  </div>
                  <div className="text-xs">
                    <p className="font-semibold text-slate-800 dark:text-slate-200">
                      কয়েক সেকেন্ডের মধ্যে একটি জিপ ফাইল ডাউনলোড হবে। জিপটি আনজিপ করলে ভেতরে <strong>app-release.apk</strong> ফাইল পেয়ে যাবেন, যা ফোনে কপি করে সরাসরি ইনস্টল করা যায়!
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "bubblewrap" && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200/80 dark:border-blue-800/60 text-xs space-y-2">
                <div className="flex items-center gap-2 text-blue-900 dark:text-blue-200 font-bold text-sm">
                  <Terminal className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>Google-এর অফিশিয়াল Bubblewrap CLI দিয়ে টার্মিনালে APK তৈরি:</span>
                </div>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  গুগল ক্রোম টিমের <strong>Bubblewrap (Trusted Web Activity - TWA)</strong> কমান্ড লাইন টুল ব্যবহার করে আপনার কম্পিউটারে সরাসরি ফুল-পারফরম্যান্স সাইন করা APK এবং Play Store AAB তৈরি করতে পারেন।
                </p>
                <div className="flex flex-wrap gap-2 pt-1 font-mono text-[10px]">
                  <span className="px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 font-bold">
                    প্রয়োজন: Node.js 16+
                  </span>
                  <span className="px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 font-bold">
                    JDK 17 বা 11
                  </span>
                  <span className="px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 font-bold">
                    Android SDK
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                  <span className="font-semibold flex items-center gap-1">
                    <Terminal className="w-3.5 h-3.5 text-blue-500" />
                    Bubblewrap টার্মিনাল কমান্ডসমূহ:
                  </span>
                  <button
                    type="button"
                    onClick={copyBubblewrapScript}
                    className="text-blue-600 dark:text-blue-400 hover:underline font-bold cursor-pointer flex items-center gap-1"
                  >
                    {copiedBubblewrapCmd ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>কমান্ড কপি হয়েছে!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>কমান্ড কপি করুন</span>
                      </>
                    )}
                  </button>
                </div>
                <pre className="p-3.5 rounded-xl bg-slate-950 text-blue-400 font-mono text-[11px] overflow-x-auto leading-relaxed border border-slate-800">
                  {bubblewrapScript}
                </pre>
              </div>

              {/* Capacitor Alternative */}
              <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-800">
                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                  <span className="font-semibold flex items-center gap-1">
                    <Layers className="w-3.5 h-3.5 text-emerald-500" />
                    বিকল্প পদ্ধতি: Capacitor ও Android Studio দিয়ে APK:
                  </span>
                  <button
                    type="button"
                    onClick={copyBuildScript}
                    className="text-emerald-600 dark:text-emerald-400 hover:underline font-medium cursor-pointer"
                  >
                    {copiedCmd ? "কপি হয়েছে!" : "কপি করুন"}
                  </button>
                </div>
                <pre className="p-3 rounded-xl bg-slate-950 text-emerald-400 font-mono text-[10.5px] overflow-x-auto leading-relaxed border border-slate-800">
                  {capacitorScript}
                </pre>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end px-6 py-3.5 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition cursor-pointer"
          >
            বন্ধ করুন
          </button>
        </div>
      </div>
    </div>
  );
};
