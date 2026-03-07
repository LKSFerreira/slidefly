import React from 'react';
import { Responsive, WidthProvider } from 'react-grid-layout/legacy';
import { DemandRecord, LayoutItem, PaletteColors } from '../../types';
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
  canvasScale?: number;
}

export default function Personalizado({
  record,
  palette,
  layout,
  onLayoutChange,
  isEditable = false,
  titleFontSize = 12,
  contentFontSize = 14,
  canvasScale = 1,
}: PersonalizadoProps) {
  const tituloConfigurado = limitar(titleFontSize, 8, 30);
  const textoConfigurado = limitar(contentFontSize, 8, 30);
  const tamanhoTituloPrincipal = Math.max(24, tituloConfigurado * 1.6 * 1.1);
  const tamanhoTituloRotulo = tituloConfigurado * 1.1;

  function handleLayoutChange(currentLayout: any) {
    if (onLayoutChange && isEditable) {
      onLayoutChange(
        currentLayout.map((item: any) => ({
          i: item.i,
          x: item.x,
          y: item.y,
          w: item.w,
          h: item.h,
        })),
      );
    }
  }

  function renderContent(id: string) {
    switch (id) {
      case 'id':
        return (
          <div className="flex h-full flex-col justify-center">
            <div className="uppercase tracking-widest opacity-50" style={{ fontSize: `${tamanhoTituloRotulo}px` }}>ID</div>
            <div className="font-bold" style={{ color: palette.title || palette.accent, fontSize: `${textoConfigurado}px` }}>{record.id}</div>
          </div>
        );
      case 'title':
        return (
          <div className="flex h-full flex-col justify-center">
            <div className="uppercase tracking-widest opacity-50" style={{ fontSize: `${tamanhoTituloRotulo}px` }}>Título</div>
            <div className="font-bold leading-tight" style={{ fontSize: `${tamanhoTituloPrincipal}px` }}>{record.title}</div>
          </div>
        );
      case 'description':
        return (
          <div className="flex h-full flex-col">
            <div className="mb-1 uppercase tracking-widest opacity-50" style={{ fontSize: `${tamanhoTituloRotulo}px` }}>Descrição</div>
            <div className="custom-scrollbar flex-1 overflow-y-auto whitespace-pre-wrap opacity-80" style={{ fontSize: `${textoConfigurado}px` }}>
              {record.description}
            </div>
          </div>
        );
      case 'boardColumn':
        return (
          <div className="flex h-full flex-col justify-center">
            <div className="uppercase tracking-widest opacity-50" style={{ fontSize: `${tamanhoTituloRotulo}px` }}>Fase / Sprint</div>
            <div className="font-semibold" style={{ fontSize: `${textoConfigurado}px` }}>{record.boardColumn}</div>
          </div>
        );
      case 'assignedTo':
        return (
          <div className="flex h-full flex-col justify-center">
            <div className="uppercase tracking-widest opacity-50" style={{ fontSize: `${tamanhoTituloRotulo}px` }}>Responsável</div>
            <div className="font-semibold" style={{ fontSize: `${textoConfigurado}px` }}>{record.assignedTo}</div>
          </div>
        );
      case 'priority':
        return (
          <div className="flex h-full flex-col justify-center">
            <div className="uppercase tracking-widest opacity-50" style={{ fontSize: `${tamanhoTituloRotulo}px` }}>Prioridade</div>
            <div className="font-semibold" style={{ color: record.priority === 'Alta' ? '#ef4444' : palette.accent, fontSize: `${textoConfigurado}px` }}>
              {record.priority}
            </div>
          </div>
        );
      case 'status':
        return (
          <div className="flex h-full flex-col justify-center">
            <div className="uppercase tracking-widest opacity-50" style={{ fontSize: `${tamanhoTituloRotulo}px` }}>Status</div>
            <div className="font-semibold" style={{ fontSize: `${textoConfigurado}px` }}>{record.status}</div>
          </div>
        );
      case 'actions':
        return (
          <div className="flex h-full flex-col">
            <div className="mb-1 uppercase tracking-widest opacity-50" style={{ fontSize: `${tamanhoTituloRotulo}px` }}>Ações</div>
            <div className="custom-scrollbar flex-1 overflow-y-auto opacity-80" style={{ fontSize: `${textoConfigurado}px` }}>
              {record.actions}
            </div>
          </div>
        );
      case 'nextActivities':
        return (
          <div className="flex h-full flex-col">
            <div className="mb-1 uppercase tracking-widest opacity-50" style={{ fontSize: `${tamanhoTituloRotulo}px` }}>Próximas Atividades</div>
            <div className="custom-scrollbar flex-1 overflow-y-auto opacity-80" style={{ fontSize: `${textoConfigurado}px` }}>
              {record.nextActivities}
            </div>
          </div>
        );
      case 'problems':
        return (
          <div className="flex h-full flex-col">
            <div className="mb-1 uppercase tracking-widest opacity-50" style={{ fontSize: `${tamanhoTituloRotulo}px` }}>Problemas</div>
            <div className="custom-scrollbar flex-1 overflow-y-auto text-red-400" style={{ fontSize: `${textoConfigurado}px` }}>
              {record.problems}
            </div>
          </div>
        );
      default:
        return null;
    }
  }

  return (
    <div className="h-full w-full">
      <ResponsiveGridLayout
        className="layout"
        layouts={{ lg: layout }}
        breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
        cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
        rowHeight={40}
        transformScale={canvasScale}
        draggableHandle=".drag-handle"
        isDraggable={isEditable}
        isResizable={isEditable}
        onLayoutChange={handleLayoutChange}
        margin={[12, 12]}
      >
        {layout.map((item) => (
          <div
            key={item.i}
            className={`relative flex flex-col rounded-xl border p-4 group ${
              isEditable ? 'hover:ring-2 hover:ring-cyan-500/50' : ''
            }`}
            style={{
              backgroundColor: palette.surface,
              borderColor: `${palette.text}15`,
              color: palette.text,
            }}
          >
            {isEditable && (
              <div className="drag-handle absolute left-1 top-1 cursor-move p-1 text-slate-500 opacity-0 transition-opacity group-hover:opacity-100 hover:text-cyan-400">
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

function limitar(valor: number, minimo: number, maximo: number) {
  return Math.min(Math.max(valor, minimo), maximo);
}
