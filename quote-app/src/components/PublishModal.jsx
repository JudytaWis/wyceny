// src/components/PublishModal.jsx
import { useEffect, useState } from 'react';
import { DEPLOY_COMMAND } from '../lib/publish.js';

const Step = ({ n, children }) => (
  <div className="flex gap-3">
    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[#6366F1] text-white text-[12px] font-semibold flex items-center justify-center">{n}</div>
    <div className="flex-1 text-sm text-gray-700 pt-0.5">{children}</div>
  </div>
);

const CommandBox = ({ command }) => {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(command);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = command; document.body.appendChild(ta); ta.select();
      document.execCommand('copy'); document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    }
  };
  return (
    <div className="relative">
      <pre className="bg-gray-900 text-gray-100 text-[12.5px] font-mono rounded-lg px-4 py-3 pr-20 overflow-x-auto leading-relaxed">{command}</pre>
      <button
        onClick={copy}
        className={`absolute right-2 top-2 px-3 py-1 text-[11px] font-medium rounded-md transition ${
          copied ? 'bg-green-500 text-white' : 'bg-gray-700 hover:bg-gray-600 text-white'
        }`}
      >
        {copied ? 'Skopiowano!' : 'Kopiuj'}
      </button>
    </div>
  );
};

export const PublishModal = ({ open, mode, slug, url, onClose }) => {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  const isPublish = mode === 'publish';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-xl w-full overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className={`px-6 py-5 ${isPublish ? 'bg-gradient-to-r from-[#6366F1] to-[#4F46E5]' : 'bg-gradient-to-r from-amber-500 to-orange-500'} text-white`}>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-[12px] uppercase tracking-wider opacity-80 mb-1">
                {isPublish ? 'Wycena gotowa do publikacji' : 'Wycena oznaczona jako niepublikowana'}
              </div>
              <h2 className="text-xl font-bold">
                {isPublish ? 'Opublikuj na Vercelu' : 'Cofnij publikację na Vercelu'}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="text-white/70 hover:text-white text-xl leading-none p-2 -m-2"
              title="Zamknij"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="p-6 space-y-5">
          <div className="text-sm text-gray-600 leading-relaxed">
            {isPublish ? (
              <>
                HTML został zapisany lokalnie do <code className="bg-gray-100 px-1.5 py-0.5 rounded text-[12px]">quote-app/public/{slug}/index.html</code>.
                Żeby pojawił się w sieci, odpal komendę poniżej w terminalu — Vercel zbuduje i wypchnie projekt.
              </>
            ) : (
              <>
                Plik <code className="bg-gray-100 px-1.5 py-0.5 rounded text-[12px]">quote-app/public/{slug}/index.html</code> został usunięty lokalnie.
                Żeby zniknął ze świata, musisz wypchnąć aktualny stan na Vercela komendą poniżej.
              </>
            )}
          </div>

          <div className="space-y-3">
            <Step n={1}>Skopiuj komendę:</Step>
            <CommandBox command={DEPLOY_COMMAND} />
            <Step n={2}>Wklej w terminalu i wciśnij Enter. Vercel zapyta o potwierdzenie produkcji.</Step>
            {isPublish && (
              <Step n={3}>
                Po zakończeniu deployu wycena będzie pod adresem:{' '}
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#6366F1] hover:underline font-medium break-all"
                >
                  {url}
                </a>
              </Step>
            )}
          </div>

          <div className="border-t border-gray-100 pt-4 flex items-center justify-between">
            <div className="text-[11px] text-gray-400">
              Tylko opublikowane wyceny są widoczne w sieci. Nic innego z tego folderu nie wycieka.
            </div>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white text-sm rounded-lg font-medium"
            >
              OK
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
