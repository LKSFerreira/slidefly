import React, { useState, useEffect, useRef } from 'react';
import { Maximize, Minimize, ChevronLeft, ChevronRight, Download, ArrowLeft } from 'lucide-react';
import { DemandRecord, TemplateType, PaletteType, LayoutItem } from '../types';
import { PALETTES } from './Configurator';
import Slide from './Slide';
import { motion, AnimatePresence } from 'motion/react';
import { exportToPdf } from '../utils/exportPdf';
import { exportToPptx } from '../utils/exportPptx';

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
  layout
}: PresentationProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);

  const currentPalette = PALETTES[palette];

  const totalSlides = isSinglePreview ? data.length : data.length + 1; // +1 for the export slide if not single preview

  const handleNext = () => {
    if (currentIndex < totalSlides - 1) {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
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
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, totalSlides]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable full-screen mode: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  };

  const handleExportPdf = async () => {
    setIsExporting(true);
    try {
      await exportToPdf(data, template, currentPalette, layout, titleFontSize, contentFontSize);
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
    } catch (error) {
      console.error('Error exporting PPTX:', error);
      alert('Erro ao exportar PPTX.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 bg-black flex flex-col items-center justify-center overflow-hidden"
      style={{ backgroundColor: currentPalette.bg }}
    >
      {/* Top Controls (visible on hover or not fullscreen) */}
      <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center z-50 opacity-0 hover:opacity-100 transition-opacity duration-300">
        <button 
          onClick={onBack}
          className="p-2 rounded-full bg-black/20 text-white hover:bg-black/40 backdrop-blur-sm transition-all"
          title="Voltar"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div className="text-white/50 text-sm font-medium tracking-widest">
          {currentIndex + 1} / {totalSlides}
        </div>
        <button 
          onClick={toggleFullscreen}
          className="p-2 rounded-full bg-black/20 text-white hover:bg-black/40 backdrop-blur-sm transition-all"
          title="Tela Cheia"
        >
          {isFullscreen ? <Minimize className="w-6 h-6" /> : <Maximize className="w-6 h-6" />}
        </button>
      </div>

      {/* Slide Content */}
      <div className="w-full h-full max-w-[1920px] max-h-[1080px] aspect-video relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0"
          >
            {currentIndex < data.length ? (
              <Slide 
                record={data[currentIndex]} 
                template={template} 
                palette={currentPalette} 
                layout={layout}
                titleFontSize={titleFontSize}
                contentFontSize={contentFontSize}
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-center p-12" style={{ color: currentPalette.text }}>
                <h2 className="text-5xl font-bold mb-4">Apresentação Concluída</h2>
                <p className="text-xl opacity-70 mb-12">Exporte seu relatório nos formatos abaixo.</p>
                
                <div className="flex space-x-6">
                  <button
                    onClick={handleExportPdf}
                    disabled={isExporting}
                    className="flex items-center space-x-3 px-8 py-4 rounded-2xl font-semibold text-lg transition-all hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
                    style={{ backgroundColor: currentPalette.accent, color: currentPalette.bg }}
                  >
                    <Download className="w-6 h-6" />
                    <span>Salvar como PDF</span>
                  </button>
                  <button
                    onClick={handleExportPptx}
                    disabled={isExporting}
                    className="flex items-center space-x-3 px-8 py-4 rounded-2xl font-semibold text-lg transition-all hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 border-2"
                    style={{ borderColor: currentPalette.accent, color: currentPalette.accent }}
                  >
                    <Download className="w-6 h-6" />
                    <span>Salvar como PPTX</span>
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Controls (visible on hover) */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex space-x-4 z-50 opacity-0 hover:opacity-100 transition-opacity duration-300">
        <button 
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className="p-3 rounded-full bg-black/20 text-white hover:bg-black/40 backdrop-blur-sm transition-all disabled:opacity-30"
        >
          <ChevronLeft className="w-8 h-8" />
        </button>
        <button 
          onClick={handleNext}
          disabled={currentIndex === totalSlides - 1}
          className="p-3 rounded-full bg-black/20 text-white hover:bg-black/40 backdrop-blur-sm transition-all disabled:opacity-30"
        >
          <ChevronRight className="w-8 h-8" />
        </button>
      </div>
    </div>
  );
}
