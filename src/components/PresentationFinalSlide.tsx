import React from 'react';
import { Download, FileText, Presentation } from 'lucide-react';
import { PaletteColors } from '../types';

interface PresentationFinalSlideProps {
  palette: PaletteColors;
  isExporting: boolean;
  onExportPdf: () => void;
  onExportPptx: () => void;
}

export default function PresentationFinalSlide({
  palette,
  isExporting,
  onExportPdf,
  onExportPptx,
}: PresentationFinalSlideProps) {
  return (
    <div
      className="flex h-full w-full items-center justify-center px-16 py-14"
      style={{
        background: 'radial-gradient(circle at center, rgba(10, 22, 52, 0.35) 0%, rgba(3, 10, 26, 0.85) 100%)',
      }}
    >
      <div className="relative w-full max-w-5xl overflow-hidden rounded-[34px] border border-cyan-500/10 bg-[#06122d]/96 px-16 py-14 shadow-[0_25px_80px_rgba(0,0,0,0.45)]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.10),transparent_35%)]" />
        <div className="absolute left-24 top-72 h-28 w-28 rounded-full bg-fuchsia-500/10 blur-3xl" />
        <div className="absolute right-28 top-80 h-32 w-32 rounded-full bg-cyan-400/10 blur-3xl" />

        <div className="relative z-10 flex flex-col items-center text-center">
          <div className="mb-8 flex h-24 w-24 items-center justify-center rounded-full border border-cyan-400/20 bg-cyan-500/10 text-cyan-300 shadow-[0_0_30px_rgba(34,211,238,0.10)]">
            <Download className="h-11 w-11" strokeWidth={2.2} />
          </div>

          <h2 className="text-5xl font-black tracking-[-0.04em] text-white">
            Exportar Apresentação
          </h2>
          <p className="mt-5 max-w-2xl text-xl leading-relaxed text-slate-400">
            Escolha o formato ideal para compartilhar ou apresentar os seus dados.
          </p>

          <div className="mt-14 grid w-full max-w-4xl gap-6 md:grid-cols-2">
            <ExportCard
              title="Portable Document"
              badge="PDF"
              description="Ideal para leitura, envio por e-mail e exibição consistente em telas menores."
              icon={<FileText className="h-7 w-7" />}
              variant="pdf"
              isExporting={isExporting}
              onClick={onExportPdf}
            />
            <ExportCard
              title="PowerPoint"
              badge="PPTX"
              description="Formato original para apresentações. Requer software de visualização."
              icon={<Presentation className="h-7 w-7" />}
              variant="pptx"
              isExporting={isExporting}
              onClick={onExportPptx}
            />
          </div>

          {isExporting && (
            <div className="mt-10 rounded-full border border-cyan-400/20 bg-cyan-500/10 px-5 py-2 text-sm font-medium text-cyan-200">
              Processando exportação, aguarde...
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

interface ExportCardProps {
  title: string;
  badge: string;
  description: string;
  icon: React.ReactNode;
  variant: 'pdf' | 'pptx';
  isExporting: boolean;
  onClick: () => void;
}

function ExportCard({
  title,
  badge,
  description,
  icon,
  variant,
  isExporting,
  onClick,
}: ExportCardProps) {
  const isPdf = variant === 'pdf';

  return (
    <button
      onClick={onClick}
      disabled={isExporting}
      className="group relative overflow-hidden rounded-[24px] border px-7 py-7 text-left transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl disabled:pointer-events-none disabled:opacity-55"
      style={{
        borderColor: isPdf ? 'rgba(244,63,94,0.28)' : 'rgba(6,182,212,0.26)',
        background: 'linear-gradient(145deg, rgba(11, 24, 52, 0.96) 0%, rgba(18, 31, 61, 0.82) 100%)',
      }}
    >
      <div
        className="absolute inset-0 opacity-60"
        style={{
          background: isPdf
            ? 'radial-gradient(circle at 70% 30%, rgba(244,63,94,0.10), transparent 28%)'
            : 'radial-gradient(circle at 70% 30%, rgba(34,211,238,0.10), transparent 28%)',
        }}
      />

      <div className="relative z-10">
        <div
          className="mb-6 inline-flex h-14 min-w-14 items-center justify-center rounded-2xl border px-4 text-xl font-black"
          style={{
            borderColor: isPdf ? 'rgba(244,63,94,0.30)' : 'rgba(34,211,238,0.28)',
            backgroundColor: isPdf ? 'rgba(244,63,94,0.10)' : 'rgba(34,211,238,0.10)',
            color: isPdf ? '#ff5c86' : '#22d3ee',
          }}
        >
          {isExporting ? (
            <svg className="h-7 w-7 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            <div className="flex items-center gap-2">
              {icon}
              <span>{badge}</span>
            </div>
          )}
        </div>

        <div className="text-4xl font-black tracking-[-0.03em] text-white">{title}</div>
        <p className="mt-3 max-w-sm text-lg leading-relaxed text-slate-400">{description}</p>
      </div>
    </button>
  );
}
