import React from 'react';
import { Download } from 'lucide-react';
import { PaletteColors } from '../types';

interface DownloadOptionsPanelProps {
  palette: PaletteColors;
  isExporting: boolean;
  onExportPdf: () => void;
  onExportPptx: () => void;
  title?: string;
  description?: string;
}

export default function DownloadOptionsPanel({
  palette,
  isExporting,
  onExportPdf,
  onExportPptx,
  title = 'Exportar Apresentação',
  description = 'Escolha o formato ideal para compartilhar ou apresentar os seus dados.',
}: DownloadOptionsPanelProps) {
  return (
    <div className="flex flex-col items-center justify-center bg-slate-900/40 p-12 text-center backdrop-blur-xl h-full w-full">
      <div className="mb-2 p-4 rounded-full bg-cyan-500/10 text-cyan-400 ring-1 ring-cyan-500/20 shadow-[0_0_30px_rgba(6,182,212,0.15)]">
        <Download className="h-10 w-10" />
      </div>
      <h2 className="mb-3 text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">{title}</h2>
      <p className="mb-10 text-slate-400 max-w-md mx-auto">{description}</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl px-4">
        {/* Botão PDF */}
        <button
          onClick={onExportPdf}
          disabled={isExporting}
          className="group relative overflow-hidden rounded-2xl border border-rose-500/20 bg-gradient-to-br from-slate-900 to-slate-800 p-6 text-left transition-all duration-300 hover:-translate-y-1 hover:border-rose-500/40 hover:shadow-2xl hover:shadow-rose-500/20 disabled:pointer-events-none disabled:opacity-50"
        >
          <div className="absolute top-0 right-0 p-4 opacity-10 transition-opacity group-hover:opacity-20">
            <Download className="h-24 w-24 text-rose-500 blur-sm" />
          </div>
          <div className="relative z-10 flex flex-col items-start gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-rose-500/10 text-rose-400 ring-1 ring-rose-500/20 group-hover:scale-110 transition-transform">
              {isExporting ? (
                 <svg className="animate-spin h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <span className="font-bold text-lg">PDF</span>
              )}
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-200 group-hover:text-white transition-colors">Portable Document</h3>
              <p className="mt-1 text-sm text-slate-500">Ideal para leitura, envio por e-mail e exibição consistente em telas menores.</p>
            </div>
          </div>
        </button>

        {/* Botão PPTX */}
        <button
          onClick={onExportPptx}
          disabled={isExporting}
          className="group relative overflow-hidden rounded-2xl border border-cyan-500/20 bg-gradient-to-br from-slate-900 to-slate-800 p-6 text-left transition-all duration-300 hover:-translate-y-1 hover:border-cyan-500/40 hover:shadow-2xl hover:shadow-cyan-500/20 disabled:pointer-events-none disabled:opacity-50"
        >
          <div className="absolute top-0 right-0 p-4 opacity-10 transition-opacity group-hover:opacity-20">
            <Download className="h-24 w-24 text-cyan-500 blur-sm" />
          </div>
          <div className="relative z-10 flex flex-col items-start gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400 ring-1 ring-cyan-500/20 group-hover:scale-110 transition-transform">
               {isExporting ? (
                 <svg className="animate-spin h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <span className="font-bold text-lg">PPTX</span>
              )}
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-200 group-hover:text-white transition-colors">PowerPoint</h3>
              <p className="mt-1 text-sm text-slate-500">Formato original para apresentações. Requer software de visualização.</p>
            </div>
          </div>
        </button>
      </div>

      {isExporting && (
        <div className="mt-8 animate-pulse text-sm text-slate-400 bg-slate-800/50 px-4 py-2 rounded-full border border-slate-700/50">
          Processando exportação, aguarde...
        </div>
      )}
    </div>
  );
}
