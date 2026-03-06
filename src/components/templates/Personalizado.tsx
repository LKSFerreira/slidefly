import React from 'react';
import { Responsive, WidthProvider } from 'react-grid-layout/legacy';
import { DemandRecord, PaletteColors, LayoutItem } from '../../types';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

const ResponsiveGridLayout = WidthProvider(Responsive);

interface PersonalizadoProps {
  record: DemandRecord;
  palette: PaletteColors;
  layout: LayoutItem[];
  onLayoutChange?: (newLayout: LayoutItem[]) => void;
  isEditable?: boolean;
  titleFontSize?: number;
  contentFontSize?: number;
}

export default function Personalizado({ record, palette, layout, onLayoutChange, isEditable = false, titleFontSize = 12, contentFontSize = 14 }: PersonalizadoProps) {
  const handleLayoutChange = (currentLayout: any) => {
    if (onLayoutChange && isEditable) {
      onLayoutChange(currentLayout.map((item: any) => ({
        i: item.i,
        x: item.x,
        y: item.y,
        w: item.w,
        h: item.h,
      })));
    }
  };

  const renderContent = (id: string) => {
    switch (id) {
      case 'id':
        return (
          <div className="h-full flex flex-col justify-center">
            <div className="uppercase tracking-widest opacity-50" style={{ fontSize: `${titleFontSize}px` }}>ID</div>
            <div className="font-bold" style={{ color: palette.title || palette.accent, fontSize: `${contentFontSize + 6}px` }}>{record.id}</div>
          </div>
        );
      case 'title':
        return (
          <div className="h-full flex flex-col justify-center">
            <div className="uppercase tracking-widest opacity-50" style={{ fontSize: `${titleFontSize}px` }}>Título</div>
            <div className="font-bold leading-tight" style={{ fontSize: `${contentFontSize + 10}px` }}>{record.title}</div>
          </div>
        );
      case 'description':
        return (
          <div className="h-full flex flex-col">
            <div className="uppercase tracking-widest opacity-50 mb-1" style={{ fontSize: `${titleFontSize}px` }}>Descrição</div>
            <div className="opacity-80 overflow-y-auto custom-scrollbar flex-1 whitespace-pre-wrap" style={{ fontSize: `${contentFontSize}px` }}>
              {record.description}
            </div>
          </div>
        );
      case 'boardColumn':
        return (
          <div className="h-full flex flex-col justify-center">
            <div className="uppercase tracking-widest opacity-50" style={{ fontSize: `${titleFontSize}px` }}>Fase / Sprint</div>
            <div className="font-semibold" style={{ fontSize: `${contentFontSize}px` }}>{record.boardColumn}</div>
          </div>
        );
      case 'assignedTo':
        return (
          <div className="h-full flex flex-col justify-center">
            <div className="uppercase tracking-widest opacity-50" style={{ fontSize: `${titleFontSize}px` }}>Responsável</div>
            <div className="font-semibold" style={{ fontSize: `${contentFontSize}px` }}>{record.assignedTo}</div>
          </div>
        );
      case 'priority':
        return (
          <div className="h-full flex flex-col justify-center">
            <div className="uppercase tracking-widest opacity-50" style={{ fontSize: `${titleFontSize}px` }}>Prioridade</div>
            <div className="font-semibold" style={{ color: record.priority === 'Alta' ? '#ef4444' : palette.accent, fontSize: `${contentFontSize}px` }}>
              {record.priority}
            </div>
          </div>
        );
      case 'status':
        return (
          <div className="h-full flex flex-col justify-center">
            <div className="uppercase tracking-widest opacity-50" style={{ fontSize: `${titleFontSize}px` }}>Status</div>
            <div className="font-semibold" style={{ fontSize: `${contentFontSize}px` }}>{record.status}</div>
          </div>
        );
      case 'actions':
        return (
          <div className="h-full flex flex-col">
            <div className="uppercase tracking-widest opacity-50 mb-1" style={{ fontSize: `${titleFontSize}px` }}>Ações</div>
            <div className="opacity-80 overflow-y-auto custom-scrollbar flex-1" style={{ fontSize: `${contentFontSize}px` }}>
              {record.actions}
            </div>
          </div>
        );
      case 'nextActivities':
        return (
          <div className="h-full flex flex-col">
            <div className="uppercase tracking-widest opacity-50 mb-1" style={{ fontSize: `${titleFontSize}px` }}>Próximas Atividades</div>
            <div className="opacity-80 overflow-y-auto custom-scrollbar flex-1" style={{ fontSize: `${contentFontSize}px` }}>
              {record.nextActivities}
            </div>
          </div>
        );
      case 'problems':
        return (
          <div className="h-full flex flex-col">
            <div className="uppercase tracking-widest opacity-50 mb-1" style={{ fontSize: `${titleFontSize}px` }}>Problemas</div>
            <div className="text-red-400 overflow-y-auto custom-scrollbar flex-1" style={{ fontSize: `${contentFontSize}px` }}>
              {record.problems}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="h-full w-full">
      <ResponsiveGridLayout
        className="layout"
        layouts={{ lg: layout }}
        breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
        cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
        rowHeight={40}
        draggableHandle=".drag-handle"
        isDraggable={isEditable}
        isResizable={isEditable}
        onLayoutChange={handleLayoutChange}
        margin={[12, 12]}
      >
        {layout.map((item) => (
          <div
            key={item.i}
            className={`rounded-xl p-4 border flex flex-col relative group ${
              isEditable ? 'hover:ring-2 hover:ring-cyan-500/50' : ''
            }`}
            style={{ 
              backgroundColor: palette.surface, 
              borderColor: `${palette.text}15`,
              color: palette.text
            }}
          >
            {isEditable && (
              <div className="drag-handle absolute top-1 left-1 opacity-0 group-hover:opacity-100 cursor-move p-1 text-slate-500 hover:text-cyan-400 transition-opacity">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="12" r="1"/><circle cx="9" cy="5" r="1"/><circle cx="9" cy="19" r="1"/><circle cx="15" cy="12" r="1"/><circle cx="15" cy="5" r="1"/><circle cx="15" cy="19" r="1"/></svg>
              </div>
            )}
            {renderContent(item.i)}
          </div>
        ))}
      </ResponsiveGridLayout>
    </div>
  );
}
