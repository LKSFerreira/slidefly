import React from 'react';
import { DemandRecord, PaletteColors } from '../../types';

export default function Padrao({ record, palette, titleFontSize, contentFontSize }: { record: DemandRecord, palette: PaletteColors, titleFontSize: number, contentFontSize: number }) {
  const headerBg = palette.accent;
  const titleColor = palette.title || palette.accent;
  const borderColor = `${palette.text}20`; // 12% opacity for subtle borders
  const bgColor = palette.surface;
  const textColor = palette.text;
  
  return (
    <div className="flex flex-col h-full w-full font-sans relative">
      {/* Title */}
      <div className="mb-4">
        <h1 className="text-2xl md:text-3xl font-bold uppercase tracking-tight" style={{ color: titleColor }}>
          {record.id} - {record.title}
        </h1>
      </div>

      <div className="flex flex-col flex-1 gap-3 min-h-0">
        {/* Top Row: 4 Columns */}
        <div className="grid grid-cols-4 gap-3">
          <Section title="FASE" value={record.boardColumn} headerBg={headerBg} borderColor={borderColor} bgColor={bgColor} textColor={textColor} titleFontSize={titleFontSize} contentFontSize={contentFontSize} />
          <Section title="DESIGNADO ESPECIALISTA" value={record.assignedTo} headerBg={headerBg} borderColor={borderColor} bgColor={bgColor} textColor={textColor} titleFontSize={titleFontSize} contentFontSize={contentFontSize} />
          <Section title="STATUS" value={record.status} headerBg={headerBg} borderColor={borderColor} bgColor={bgColor} textColor={textColor} titleFontSize={titleFontSize} contentFontSize={contentFontSize} />
          <Section title="PRIORIDADE" value={record.priority} headerBg={headerBg} borderColor={borderColor} bgColor={bgColor} textColor={textColor} titleFontSize={titleFontSize} contentFontSize={contentFontSize} />
        </div>

        {/* Middle Row: Full Width */}
        <div className="flex flex-col flex-1 min-h-0">
          <Section title="DESCRIÇÃO DO PEDIDO" value={record.description} headerBg={headerBg} borderColor={borderColor} bgColor={bgColor} textColor={textColor} titleFontSize={titleFontSize} contentFontSize={contentFontSize} />
        </div>

        {/* Bottom Row: 2 Columns */}
        <div className="grid grid-cols-2 gap-3 flex-[1.5] min-h-0">
          <Section title="AÇÕES REALIZADAS" value={record.actions} headerBg={headerBg} borderColor={borderColor} bgColor={bgColor} textColor={textColor} titleFontSize={titleFontSize} contentFontSize={contentFontSize} />
          <Section title="PRÓXIMAS ATIVIDADES" value={record.nextActivities} headerBg={headerBg} borderColor={borderColor} bgColor={bgColor} textColor={textColor} titleFontSize={titleFontSize} contentFontSize={contentFontSize} />
        </div>

        {/* Footer Row: Full Width */}
        <div className="flex flex-col flex-1 min-h-0">
          <Section title="PROBLEMAS E PENDÊNCIAS" value={record.problems} headerBg={headerBg} borderColor={borderColor} bgColor={bgColor} textColor={textColor} titleFontSize={titleFontSize} contentFontSize={contentFontSize} />
        </div>
      </div>

      {/* Page Number removed as requested */}
    </div>
  );
}

function Section({ 
  title, 
  value, 
  headerBg,
  borderColor,
  bgColor,
  textColor,
  titleFontSize,
  contentFontSize
}: { 
  title: string, 
  value?: string, 
  headerBg: string,
  borderColor: string,
  bgColor: string,
  textColor: string,
  titleFontSize: number,
  contentFontSize: number
}) {
  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div 
        className="text-white font-bold text-center py-1.5 px-2 uppercase tracking-wider"
        style={{ backgroundColor: headerBg, fontSize: `${titleFontSize}px` }}
      >
        {title}
      </div>
      <div 
        className="border-x border-b p-3 leading-relaxed flex-1 overflow-y-auto custom-scrollbar"
        style={{ borderColor: borderColor, backgroundColor: bgColor, color: textColor, fontSize: `${contentFontSize}px` }}
      >
        <div className="whitespace-pre-wrap">{value || ''}</div>
      </div>
    </div>
  );
}
