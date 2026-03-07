import React from 'react';
import { DemandRecord, TemplateType, PaletteColors, LayoutItem } from '../types';
import Padrao from './templates/Padrao';
import Personalizado from './templates/Personalizado';

interface SlideProps {
  record: DemandRecord;
  template: TemplateType;
  palette: PaletteColors;
  isExporting?: boolean;
  layout?: LayoutItem[];
  onLayoutChange?: (newLayout: LayoutItem[]) => void;
  isEditable?: boolean;
  titleFontSize?: number;
  contentFontSize?: number;
  canvasScale?: number;
}

export default function Slide({ 
  record, 
  template, 
  palette, 
  isExporting = false, 
  layout = [], 
  onLayoutChange,
  isEditable = false,
  titleFontSize = 12,
  contentFontSize = 14,
  canvasScale = 1,
}: SlideProps) {
  const style = {
    backgroundColor: palette.bg,
    color: palette.text,
    '--accent': palette.accent,
    '--surface': palette.surface,
    '--success': palette.success,
    padding: '56px 64px',
  } as React.CSSProperties;

  return (
    <div 
      className="w-full h-full flex flex-col overflow-hidden"
      style={style}
    >
      {record.type === 'image' && record.imageUrl ? (
        <div className="w-full h-full flex items-center justify-center bg-black/5 rounded-lg overflow-hidden">
          <img src={record.imageUrl} alt={record.title} className="w-full h-full object-contain" referrerPolicy="no-referrer" />
        </div>
      ) : (
        <>
          {template === 'padrao' && (
            <Padrao
              record={record}
              palette={palette}
              titleFontSize={titleFontSize}
              contentFontSize={contentFontSize}
            />
          )}
          {template === 'personalizado' && (
            <Personalizado 
              record={record} 
              palette={palette} 
              layout={layout} 
              onLayoutChange={onLayoutChange}
              isEditable={isEditable}
              titleFontSize={titleFontSize}
              contentFontSize={contentFontSize}
              canvasScale={canvasScale}
            />
          )}
        </>
      )}
    </div>
  );
}
