import { Header } from '../components/layout/Header';
import { useWinget } from '../hooks/useWinget';
import { useAppStore } from '../store/applicationStore';
import { Cpu, HelpCircle } from 'lucide-react';

export const AboutPage: React.FC = () => {
  const { wingetInfo } = useWinget();
  const { t } = useAppStore();

  return (
    <div className="space-y-6 max-w-4xl pb-12">
      <Header
        title={t.about.title}
        description={t.about.description}
      />

      {/* Hero Badge */}
      <div className="p-6 rounded-xl bg-gradient-to-br from-win-panel to-win-card border border-win-border shadow-md flex items-center gap-5">
        <div className="w-18 h-18 rounded-2xl bg-sky-500/10 border border-sky-500/30 p-1 flex items-center justify-center flex-shrink-0 shadow-lg shadow-sky-500/15 overflow-hidden">
          <img src="./icons/logo.png" alt="ReInstall Hub Logo" className="w-16 h-16 object-cover rounded-xl" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-win-text">ReInstall Hub</h2>
            <span className="px-2 py-0.5 rounded-full text-xs font-mono bg-win-primary/20 text-win-accent border border-win-primary/30">
              v1.0.0
            </span>
          </div>
          <p className="text-xs text-win-muted mt-1 leading-relaxed">
            {t.about.subtitle}
          </p>
          <div className="flex items-center gap-4 mt-3 text-[11px] text-win-muted font-mono">
            <span>Electron + React + TypeScript + WinGet</span>
            <span>•</span>
            <span>Windows 10/11 64-bit</span>
          </div>
        </div>
      </div>

      {/* System Diagnostics */}
      <section className="p-5 rounded-xl bg-win-panel border border-win-border space-y-3">
        <div className="flex items-center gap-2.5 pb-2 border-b border-win-border">
          <Cpu className="w-4 h-4 text-win-accent" />
          <h3 className="text-sm font-bold text-win-text">{t.about.systemDiag}</h3>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-2.5 rounded-lg bg-win-card border border-win-border/50">
            <span className="text-[10px] text-win-muted uppercase block">{t.about.wingetEngine}</span>
            <span className="font-mono font-semibold text-win-text">
              {wingetInfo?.version || 'Not Detected'}
            </span>
          </div>
          <div className="p-2.5 rounded-lg bg-win-card border border-win-border/50">
            <span className="text-[10px] text-win-muted uppercase block">{t.about.platform}</span>
            <span className="font-mono font-semibold text-win-text capitalize">
              {wingetInfo?.platform || 'Windows'}
            </span>
          </div>
          <div className="p-2.5 rounded-lg bg-win-card border border-win-border/50">
            <span className="text-[10px] text-win-muted uppercase block">{t.about.architecture}</span>
            <span className="font-mono font-semibold text-win-text uppercase">
              {wingetInfo?.architecture || 'x64'}
            </span>
          </div>
          <div className="p-2.5 rounded-lg bg-win-card border border-win-border/50">
            <span className="text-[10px] text-win-muted uppercase block">{t.about.status}</span>
            <span
              className={`font-mono font-semibold ${
                wingetInfo?.isAvailable ? 'text-emerald-400' : 'text-amber-400'
              }`}
            >
              {wingetInfo?.isAvailable ? t.sidebar.ready : t.about.cliMissing}
            </span>
          </div>
        </div>
      </section>

      {/* Troubleshooting Guide */}
      <section className="p-5 rounded-xl bg-win-panel border border-win-border space-y-4">
        <div className="flex items-center gap-2.5 pb-2 border-b border-win-border">
          <HelpCircle className="w-4 h-4 text-amber-400" />
          <h3 className="text-sm font-bold text-win-text">{t.about.troubleshooting}</h3>
        </div>

        <div className="space-y-3.5 text-xs text-win-muted">
          <div>
            <h4 className="font-semibold text-win-text flex items-center gap-1.5">
              <span>{t.about.faq1Title}</span>
            </h4>
            <p className="mt-1 leading-relaxed">
              {t.about.faq1Desc}
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-win-text flex items-center gap-1.5">
              <span>{t.about.faq2Title}</span>
            </h4>
            <p className="mt-1 leading-relaxed">
              {t.about.faq2Desc}
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-win-text flex items-center gap-1.5">
              <span>{t.about.faq3Title}</span>
            </h4>
            <p className="mt-1 leading-relaxed">
              {t.about.faq3Desc}
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-win-text flex items-center gap-1.5">
              <span>{t.about.faq4Title}</span>
            </h4>
            <p className="mt-1 leading-relaxed">
              {t.about.faq4Desc}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
