import React, { useEffect, useRef, useState } from 'react';
import { ArrowLeft, ChevronLeft, ChevronRight, Maximize, Minimize } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { DemandRecord, LayoutItem, PaletteType, TemplateType } from '../types';
import { exportToPdf } from '../utils/exportPdf';
import { exportToPptx } from '../utils/exportPptx';
import { PALETTES } from './Configurator';
import DownloadOptionsPanel from './DownloadOptionsPanel';
import PresentationFinalSlide from './PresentationFinalSlide';
import Slide from './Slide';
import SlideCanvas from './SlideCanvas';

interface PresentationProps {
  data: DemandRecord[];
  template: TemplateType;
  palette: PaletteType;
  titleFontSize: number;
  contentFontSize: number;
  onBack: () => void;
  isSinglePreview?: boolean;
  layout: LayoutItem[];
}

export default function Presentation({
  data,
  template,
  palette,
  titleFontSize,
  contentFontSize,
  onBack,
  isSinglePreview = false,
  layout,
}: PresentationProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [zoomApresentacao, setZoomApresentacao] = useState(100);
  const [isExporting, setIsExporting] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const currentPalette = PALETTES[palette];
  const totalSlides = isSinglePreview ? data.length : data.length + 1;

  function handleNext() {
    if (currentIndex < totalSlides - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  }

  function handlePrev() {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  }

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === 'Escape') {
        if (document.fullscreenElement) {
          document.exitFullscreen();
        } else {
          onBack();
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, totalSlides, onBack]);

  useEffect(() => {
    function handleFullscreenChange() {
      setIsFullscreen(!!document.fullscreenElement);
    }

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  function toggleFullscreen() {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen().catch((err) => {
        console.error(`Error attempting to enable full-screen mode: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  }

  async function handleExportPdf() {
    setIsExporting(true);
    try {
      await exportToPdf(data, template, currentPalette, layout, titleFontSize, contentFontSize);
    } catch (error) {
      console.error('Error exporting PDF:', error);
      alert('Erro ao exportar PDF.');
    } finally {
      setIsExporting(false);
    }
  }

  async function handleExportPptx() {
    setIsExporting(true);
    try {
      await exportToPptx(data, template, currentPalette, layout, titleFontSize, contentFontSize);
    } catch (error) {
      console.error('Error exporting PPTX:', error);
      alert('Erro ao exportar PPTX.');
    } finally {
      setIsExporting(false);
    }
  }

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 flex flex-col items-center justify-center overflow-hidden bg-black"
      style={{ backgroundColor: currentPalette.bg }}
    >
      <div className="absolute left-0 right-0 top-0 z-50 flex items-center justify-between p-4 opacity-0 transition-opacity duration-300 hover:opacity-100">
        <button
          onClick={onBack}
          className="rounded-full bg-black/20 p-2 text-white backdrop-blur-sm transition-all hover:bg-black/40"
          title="Voltar"
        >
          <ArrowLeft className="h-6 w-6" />
        </button>
        <div className="text-sm font-medium tracking-widest text-white/50">
          {currentIndex + 1} / {totalSlides}
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 rounded-full bg-black/20 px-3 py-1 text-white backdrop-blur-sm">
            <span className="text-[10px] uppercase tracking-[0.16em] text-white/60">Zoom</span>
            <button
              onClick={() => setZoomApresentacao((prev) => Math.max(100, prev - 5))}
              disabled={zoomApresentacao === 100}
              className="p-1 transition-all hover:text-white disabled:opacity-30"
              title="Reduzir zoom"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="min-w-12 text-center text-sm font-medium text-white/80">{zoomApresentacao}%</span>
            <button
              onClick={() => setZoomApresentacao((prev) => Math.min(160, prev + 5))}
              disabled={zoomApresentacao === 160}
              className="p-1 transition-all hover:text-white disabled:opacity-30"
              title="Aumentar zoom"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
          <button
            onClick={toggleFullscreen}
            className="rounded-full bg-black/20 p-2 text-white backdrop-blur-sm transition-all hover:bg-black/40"
            title="Tela Cheia"
          >
            {isFullscreen ? <Minimize className="h-6 w-6" /> : <Maximize className="h-6 w-6" />}
          </button>
        </div>
      </div>

      <div className="relative h-full w-full">
        <SlideCanvas containerClassName="overflow-auto" canvasClassName="shadow-2xl">
          {({ scale }) => (
            <div
              className="h-full w-full"
              style={{ transform: `scale(${zoomApresentacao / 100})`, transformOrigin: 'center center' }}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentIndex}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="h-full w-full"
                >
                  {currentIndex < data.length ? (
                    <Slide
                      record={data[currentIndex]}
                      template={template}
                      palette={currentPalette}
                      layout={layout}
                      titleFontSize={titleFontSize}
                      contentFontSize={contentFontSize}
                      canvasScale={scale}
                    />
                  ) : (
                    <PresentationFinalSlide
                      palette={currentPalette}
                      isExporting={isExporting}
                      onExportPdf={handleExportPdf}
                      onExportPptx={handleExportPptx}
                    />
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          )}
        </SlideCanvas>
      </div>

      <div className="absolute bottom-8 left-1/2 z-50 flex -translate-x-1/2 space-x-4 opacity-0 transition-opacity duration-300 hover:opacity-100">
        <button
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className="rounded-full bg-black/20 p-3 text-white backdrop-blur-sm transition-all disabled:opacity-30 hover:bg-black/40"
        >
          <ChevronLeft className="h-8 w-8" />
        </button>
        <button
          onClick={handleNext}
          disabled={currentIndex === totalSlides - 1}
          className="rounded-full bg-black/20 p-3 text-white backdrop-blur-sm transition-all disabled:opacity-30 hover:bg-black/40"
        >
          <ChevronRight className="h-8 w-8" />
        </button>
      </div>
    </div>
  );
}
