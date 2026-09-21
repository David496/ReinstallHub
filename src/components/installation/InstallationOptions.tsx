import React from 'react';
import { Checkbox } from '../common/Checkbox';
import { useAppStore } from '../../store/applicationStore';

export const InstallationOptions: React.FC = () => {
  const { settings, updateSettings, t } = useAppStore();
  const options = settings.installation;

  const handleOptionChange = (key: keyof typeof options, value: boolean) => {
    updateSettings({
      installation: {
        ...options,
        [key]: value,
      },
    });
  };

  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 py-1 px-0.5 text-[11px] text-win-muted select-none">
      <Checkbox
        checked={options.silent}
        onChange={(val) => handleOptionChange('silent', val)}
        label={<span className="text-[11px]">{t.catalog.installSilently} (<code className="text-win-accent font-mono text-[10px]">--silent</code>)</span>}
      />
      <Checkbox
        checked={options.acceptPackageAgreements}
        onChange={(val) => handleOptionChange('acceptPackageAgreements', val)}
        label={<span className="text-[11px]">{t.catalog.acceptPackageAgreements}</span>}
      />
      <Checkbox
        checked={options.acceptSourceAgreements}
        onChange={(val) => handleOptionChange('acceptSourceAgreements', val)}
        label={<span className="text-[11px]">{t.catalog.acceptSourceAgreements}</span>}
      />
      <Checkbox
        checked={options.stopOnError}
        onChange={(val) => handleOptionChange('stopOnError', val)}
        label={<span className="text-[11px]">{t.catalog.stopQueueOnError}</span>}
      />
    </div>
  );
};
