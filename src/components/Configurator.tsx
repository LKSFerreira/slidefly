import React, { useState } from 'react';
import { DemandRecord, TemplateType, PaletteType, PaletteColors, LayoutItem } from '../types';
import Slide from './Slide';
import SlideCanvas from './SlideCanvas';
import DownloadOptionsPanel from './DownloadOptionsPanel';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { GripVertical, ChevronLeft, ChevronRight, Play, Settings2, ImagePlus, Move, Download, RotateCcw } from 'lucide-react';
import { exportToPdf } from '../utils/exportPdf';
import { exportToPptx } from '../utils/exportPptx';

interface ConfiguratorProps {
  data: DemandRecord[];
  setData: (data: DemandRecord[]) => void;
  template: TemplateType;
  setTemplate: (t: TemplateType) => void;
  palette: PaletteType;
  setPalette: (p: PaletteType) => void;
  titleFontSize: number;
  setTitleFontSize: (size: number | ((prev: number) => number)) => void;
  contentFontSize: number;
  setContentFontSize: (size: number | ((prev: number) => number)) => void;
  onStart: () => void;
  onPreviewSingle: (index: number) => void;
  layout: LayoutItem[];
  setLayout: (l: LayoutItem[]) => void;
  onResetApp: () => void;
}

export const PALETTES: Record<PaletteType, PaletteColors> = {
  clara: { bg: '#E1DDD6', surface: '#EFE9E1', text: '#111111', accent: '#046B3F', success: '#10B981', title: '#046B3F' },
  escura: { bg: '#111827', surface: '#1F2937', text: '#F9FAFB', accent: '#059669', success: '#10B981', title: '#F9FAFB' },
  verde: { bg: '#022C22', surface: '#064E3B', text: '#ECFDF5', accent: '#047857', success: '#10B981', title: '#6EE7B7' },
};

export default function Configurator({
  data,
  setData,
  template,
  setTemplate,
  palette,
  setPalette,
  titleFontSize,
  setTitleFontSize,
  contentFontSize,
  setContentFontSize,
  onStart,
  onPreviewSingle,
  layout,
  setLayout,
  onResetApp,
}: ConfiguratorProps) {
  const [previewIndex, setPreviewIndex] = useState(0);
  const [movingIndex, setMovingIndex] = useState<number | null>(null);
  const [moveTarget, setMoveTarget] = useState<string>('');
  const [downloadModalOpen, setDownloadModalOpen] = useState(false);
  const [resetModalOpen, setResetModalOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const currentPalette = PALETTES[palette];

  const previewRecord = data[previewIndex] || data[0] || {
    id: 'DEMO-123',
    title: 'Exemplo de Demanda para Preview',
    boardColumn: 'Sprint 5',
    assignedTo: 'João Silva',
    priority: 'Alta',
    description: 'Esta é uma descrição de exemplo para mostrar como o slide ficará formatado.',
    status: 'Em Andamento',
    actions: 'Levantamento de requisitos concluído.',
    nextActivities: 'Desenvolvimento da interface.',
    problems: 'Nenhum problema identificado.',
  };

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(data);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setData(items);

    // Update preview index if the dragged item was the one being previewed
    if (previewIndex === result.source.index) {
      setPreviewIndex(result.destination.index);
    } else if (
      previewIndex > result.source.index &&
      previewIndex <= result.destination.index
    ) {
      setPreviewIndex(previewIndex - 1);
    } else if (
      previewIndex < result.source.index &&
      previewIndex >= result.destination.index
    ) {
      setPreviewIndex(previewIndex + 1);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const fileName = file.name.replace(/\.[^/.]+$/, ""); // Remove extension
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target?.result as string;
        const newRecord: DemandRecord = {
          id: `IMG-${Date.now()}`,
          title: fileName || 'Imagem de Capa',
          type: 'image',
          imageUrl: base64,
        };
        setData([...data, newRecord]);
        setPreviewIndex(data.length);
      };
      reader.readAsDataURL(file);
      // Reset input
      e.target.value = '';
    }
  };

  const handleMoveSlide = () => {
    if (movingIndex === null) return;

    const targetIndex = parseInt(moveTarget, 10) - 1; // Convert to 0-based index
    if (isNaN(targetIndex) || targetIndex < 0 || targetIndex >= data.length) {
      alert(`Por favor, digite um número válido entre 1 e ${data.length}`);
      return;
    }

    const items = Array.from(data);
    const [reorderedItem] = items.splice(movingIndex, 1);
    items.splice(targetIndex, 0, reorderedItem);

    setData(items);

    // Update preview index
    if (previewIndex === movingIndex) {
      setPreviewIndex(targetIndex);
    } else if (
      previewIndex > movingIndex &&
      previewIndex <= targetIndex
    ) {
      setPreviewIndex(previewIndex - 1);
    } else if (
      previewIndex < movingIndex &&
      previewIndex >= targetIndex
    ) {
      setPreviewIndex(previewIndex + 1);
    }

    setMovingIndex(null);
    setMoveTarget('');
  };

  const handleExportPdf = async () => {
    setIsExporting(true);
    try {
      await exportToPdf(data, template, currentPalette, layout, titleFontSize, contentFontSize);
      setDownloadModalOpen(false);
    } catch (error) {
      console.error('Error exporting PDF:', error);
      alert('Erro ao exportar PDF.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportPptx = async () => {
    setIsExporting(true);
    try {
      await exportToPptx(data, template, currentPalette, layout, titleFontSize, contentFontSize);
      setDownloadModalOpen(false);
    } catch (error) {
      console.error('Error exporting PPTX:', error);
      alert('Erro ao exportar PPTX.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleCancelReset = () => {
    setResetModalOpen(false);
  };

  const handleConfirmReset = () => {
    setResetModalOpen(false);
    onResetApp();
  };

  const handleResetClick = () => {
    setResetModalOpen(true);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-slate-900 text-slate-200">
      {/* Sidebar */}
      <div className="w-80 border-r border-slate-800 bg-slate-900/50 p-5 flex flex-col overflow-y-auto custom-scrollbar">
        <div className="space-y-6 flex-1 flex flex-col min-h-0">
          {/* Templates */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-slate-400 uppercase tracking-wider">Layout</h3>
            <div className="grid grid-cols-2 gap-3">
              {(['padrao', 'personalizado'] as TemplateType[]).map((t) => (
                <button
                  key={t}
                  onClick={() => setTemplate(t)}
                  className={`p-3 rounded-xl border text-xs font-medium transition-all flex flex-col items-start gap-2 ${
                    template === t
                      ? 'border-cyan-500 bg-cyan-500/10 text-cyan-400 shadow-lg shadow-cyan-500/10'
                      : 'border-slate-700 bg-slate-800/50 text-slate-300 hover:border-slate-600'
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="capitalize font-bold tracking-wide truncate">
                      {t === 'padrao' ? 'Padrão' : 'Personalizado'}
                    </span>
                    {t === 'personalizado' && <Settings2 className="w-3 h-3 opacity-50" />}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Palettes and Font Sizes */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-slate-400 uppercase tracking-wider">Aparência</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-xs text-slate-500 block mb-2">Cores</span>
                <div className="flex flex-wrap gap-2">
                  {(Object.keys(PALETTES) as PaletteType[]).map((p) => (
                    <button
                      key={p}
                      onClick={() => setPalette(p)}
                      className={`w-8 h-8 rounded-full border-2 transition-all flex items-center justify-center ${
                        palette === p ? 'border-white scale-110' : 'border-slate-700 hover:scale-105'
                      }`}
                      style={{ backgroundColor: PALETTES[p].bg }}
                      title={p}
                    >
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-xs text-slate-500 block mb-2">Tamanho da Fonte</span>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-300">Títulos</span>
                    <div className="flex items-center gap-2 bg-slate-800 rounded-lg p-1">
                      <button onClick={() => setTitleFontSize(prev => Math.max(8, prev - 1))} className="w-5 h-5 flex items-center justify-center hover:bg-slate-700 rounded text-slate-300">-</button>
                      <span className="text-xs w-4 text-center">{titleFontSize}</span>
                      <button onClick={() => setTitleFontSize(prev => Math.min(40, prev + 1))} className="w-5 h-5 flex items-center justify-center hover:bg-slate-700 rounded text-slate-300">+</button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-300">Textos</span>
                    <div className="flex items-center gap-2 bg-slate-800 rounded-lg p-1">
                      <button onClick={() => setContentFontSize(prev => Math.max(8, prev - 1))} className="w-5 h-5 flex items-center justify-center hover:bg-slate-700 rounded text-slate-300">-</button>
                      <span className="text-xs w-4 text-center">{contentFontSize}</span>
                      <button onClick={() => setContentFontSize(prev => Math.min(40, prev + 1))} className="w-5 h-5 flex items-center justify-center hover:bg-slate-700 rounded text-slate-300">+</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Image Upload */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-slate-400 uppercase tracking-wider">Adicionar Capa / Transição</h3>
            <label className="flex items-center justify-center gap-2 w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl cursor-pointer transition-colors border border-slate-700 border-dashed">
              <ImagePlus className="w-5 h-5" />
              <span className="text-sm font-medium">Fazer upload de imagem</span>
              <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
            </label>
          </div>

          {/* Slides Reordering */}
          {data.length > 0 && (
            <div className="space-y-2 flex-1 flex flex-col min-h-0">
              <h3 className="text-sm font-medium text-slate-400 uppercase tracking-wider">Ordem dos Slides</h3>
              <p className="text-xs text-slate-500 mb-1">Arraste para reordenar. Clique para visualizar.</p>
              <p className="text-xs font-medium text-slate-500">
                {data.length} slide{data.length !== 1 ? 's' : ''} gerado{data.length !== 1 ? 's' : ''}
              </p>
              <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="slides-list">
                  {(provided) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className="space-y-2 flex-1 overflow-y-auto custom-scrollbar pr-2 pb-2"
                    >
                      {data.map((record, index) => (
                        // @ts-ignore
                        <Draggable key={record.id} draggableId={record.id} index={index}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              className={`flex items-center p-2 rounded-lg border transition-colors ${
                                snapshot.isDragging
                                  ? 'bg-slate-800 border-cyan-500/50 shadow-lg'
                                  : previewIndex === index
                                    ? 'bg-slate-800/80 border-slate-600'
                                    : 'bg-slate-800/30 border-slate-700/50 hover:bg-slate-800/50'
                              }`}
                            >
                              <div
                                {...provided.dragHandleProps}
                                className="p-1 text-slate-500 hover:text-slate-300 cursor-grab active:cursor-grabbing"
                              >
                                <GripVertical className="w-4 h-4" />
                              </div>
                              <div
                                className="ml-2 overflow-hidden cursor-pointer flex-1"
                                onClick={() => setPreviewIndex(index)}
                              >
                                {record.type === 'image' ? (
                                  <div className="text-xs font-bold text-emerald-400 truncate uppercase tracking-tight">
                                    IMAGEM: {record.title}
                                  </div>
                                ) : (
                                  <>
                                    <div className="text-xs font-bold text-cyan-400 truncate">{record.id}</div>
                                    <div className="text-xs text-slate-300 truncate">{record.title}</div>
                                  </>
                                )}
                              </div>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setMovingIndex(index);
                                  setMoveTarget((index + 1).toString());
                                }}
                                className="p-1.5 ml-2 text-slate-400 hover:text-cyan-400 hover:bg-slate-700/50 rounded transition-colors flex items-center gap-1"
                                title="Mover slide"
                              >
                                <Move className="w-3.5 h-3.5" />
                                <span className="text-[10px] font-medium uppercase">Mover</span>
                              </button>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
            </div>
          )}
        </div>

        <div className="pt-4 border-t border-slate-800 mt-4">
          <button
            onClick={onStart}
            className="w-full py-2.5 btn-rainbow text-white rounded-xl font-semibold transition-all shadow-lg shadow-blue-500/30 hover:shadow-blue-400/50 hover:-translate-y-0.5"
          >
            Gerar Apresentação
          </button>
          <button
            onClick={() => setDownloadModalOpen(true)}
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-800/80 py-2.5 font-semibold text-slate-200 transition-colors hover:border-slate-600 hover:bg-slate-800"
          >
            <Download className="h-4 w-4" />
            <span>Download</span>
          </button>
        </div>
      </div>

      {/* Main Preview Area */}
      <div className="flex-1 bg-slate-950 p-6 flex flex-col items-center overflow-hidden">
        {template === 'personalizado' && (
          <div className="mb-4 text-xs text-slate-500 bg-slate-900/50 px-4 py-2 rounded-full border border-slate-800 flex items-center gap-2">
            <Settings2 className="w-3 h-3 text-cyan-400" />
            <span>Modo de Edição Ativo: Arraste e redimensione os blocos abaixo para personalizar seu layout.</span>
          </div>
        )}
        <div className="mb-4 flex w-full items-center justify-between gap-3">
          <button
            onClick={handleResetClick}
            className="flex h-9 items-center gap-2 rounded-full border border-white/10 bg-black/55 px-5 text-xs font-semibold text-white/85 shadow-lg shadow-black/20 backdrop-blur-md transition-all hover:border-white/20 hover:text-white"
            title="Reiniciar aplicação"
          >
            <RotateCcw className="h-4 w-4" />
            <span>Reiniciar</span>
          </button>
          <div className="flex h-9 items-center gap-2 bg-black/50 backdrop-blur-md px-3 rounded-full text-xs font-semibold text-white/80 border border-white/10">
            <button
              onClick={() => setPreviewIndex(Math.max(0, previewIndex - 1))}
              disabled={previewIndex === 0}
              className="hover:text-white disabled:opacity-50 transition-colors p-1"
              title="Slide Anterior"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => onPreviewSingle(previewIndex)}
              className="flex items-center gap-2 hover:text-cyan-400 transition-colors px-1 border-x border-white/10"
              title="Ver em Tela Cheia"
            >
              <Play className="w-3 h-3 fill-current" />
              <span>Preview: Slide {previewIndex + 1} de {Math.max(1, data.length)}</span>
            </button>
            <button
              onClick={() => setPreviewIndex(Math.min(data.length - 1, previewIndex + 1))}
              disabled={previewIndex === data.length - 1 || data.length === 0}
              className="hover:text-white disabled:opacity-50 transition-colors p-1"
              title="Próximo Slide"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
        <div className="w-full max-w-6xl flex-1 min-h-0">
          <SlideCanvas canvasClassName="overflow-hidden rounded-[24px] shadow-2xl ring-1 ring-white/10">
            {({ scale }) => (
              <Slide
                record={previewRecord}
                template={template}
                palette={currentPalette}
                isExporting={false}
                layout={layout}
                onLayoutChange={setLayout}
                isEditable={template === 'personalizado'}
                titleFontSize={titleFontSize}
                contentFontSize={contentFontSize}
                canvasScale={scale}
              />
            )}
          </SlideCanvas>
        </div>
      </div>
      {resetModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-md"
          onClick={handleCancelReset}
        >
          <div
            className="w-full max-w-md overflow-hidden rounded-[1.75rem] border border-white/10 bg-slate-900/95 shadow-2xl shadow-cyan-950/20 ring-1 ring-white/5"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="border-b border-white/10 px-6 py-5">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan-500/10 text-cyan-400 ring-1 ring-cyan-500/20">
                  <RotateCcw className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">Reiniciar aplicação</h3>
                  <p className="text-sm text-slate-400">A apresentação atual será removida da memória.</p>
                </div>
              </div>
            </div>
            <div className="px-6 py-5">
              <p className="text-sm leading-6 text-slate-300">
                Use esta ação para começar uma nova importação sem recarregar a página.
              </p>
            </div>
            <div className="flex items-center justify-end gap-3 border-t border-white/10 px-6 py-5">
              <button
                onClick={handleCancelReset}
                className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-slate-300 transition-colors hover:bg-white/10 hover:text-white"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmReset}
                className="rounded-xl bg-cyan-500 px-4 py-2 text-sm font-semibold text-slate-950 transition-colors hover:bg-cyan-400"
              >
                Reiniciar agora
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Move Slide Modal */}
      {movingIndex !== null && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-2xl max-w-sm w-full mx-4">
            <h3 className="text-lg font-semibold text-white mb-2">Mover Slide</h3>
            <p className="text-sm text-slate-400 mb-4">
              Digite a posição exata (1 a {data.length}) para onde deseja mover o slide <strong className="text-cyan-400">{data[movingIndex].type === 'image' ? 'IMAGEM' : data[movingIndex].id}</strong>.
            </p>
            <input
              type="number"
              min="1"
              max={data.length}
              value={moveTarget}
              onChange={(e) => setMoveTarget(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 text-white rounded-lg px-4 py-2 mb-6 focus:outline-none focus:border-cyan-500"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleMoveSlide();
                if (e.key === 'Escape') setMovingIndex(null);
              }}
            />
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setMovingIndex(null)}
                className="px-4 py-2 text-sm font-medium text-slate-400 hover:text-white transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleMoveSlide}
                className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white text-sm font-medium rounded-lg transition-colors"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
      {downloadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="relative w-full max-w-3xl overflow-hidden rounded-[2rem] border border-white/10 bg-slate-900/90 shadow-2xl shadow-cyan-900/20 ring-1 ring-white/5">
            <button
              onClick={() => !isExporting && setDownloadModalOpen(false)}
              className="absolute right-5 top-5 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-white/5 text-slate-400 transition-colors hover:bg-white/10 hover:text-white"
              title="Fechar"
            >
              ✕
            </button>
            <DownloadOptionsPanel
              palette={currentPalette}
              isExporting={isExporting}
              onExportPdf={handleExportPdf}
              onExportPptx={handleExportPptx}
            />
          </div>
        </div>
      )}
    </div>
  );
}
