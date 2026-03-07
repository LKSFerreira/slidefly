import { DemandRecord, TemplateType, PaletteColors, LayoutItem } from '../types';
import { createRoot } from 'react-dom/client';
import React from 'react';
import { flushSync } from 'react-dom';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import Slide from '../components/Slide';
import { SLIDE_CANVAS_HEIGHT, SLIDE_CANVAS_WIDTH } from '../config/slideCanvas';
import { gerarNomeArquivoExportacao } from './exportFileName';

const PDF_SLIDE_WIDTH_IN = 13.333;
const PDF_SLIDE_HEIGHT_IN = 7.5;

function aguardarFrame() {
  return new Promise<void>((resolve) => {
    window.requestAnimationFrame(() => resolve());
  });
}

async function aguardarFontes() {
  const documentComFontes = document as Document & {
    fonts?: {
      ready: Promise<unknown>;
    };
  };

  if (documentComFontes.fonts?.ready) {
    await documentComFontes.fonts.ready;
  }
}

async function aguardarLayoutEstavel(slide: HTMLDivElement) {
  let ultimaAltura = 0;
  let ultimaLargura = 0;
  let framesEstaveis = 0;

  while (framesEstaveis < 4) {
    await aguardarFrame();
    const alturaAtual = slide.scrollHeight;
    const larguraAtual = slide.scrollWidth;

    if (alturaAtual === ultimaAltura && larguraAtual === ultimaLargura) {
      framesEstaveis += 1;
    } else {
      framesEstaveis = 0;
      ultimaAltura = alturaAtual;
      ultimaLargura = larguraAtual;
    }
  }
}

export const exportToPdf = async (data: DemandRecord[], template: TemplateType, palette: PaletteColors, layout: LayoutItem[], titleFontSize: number = 12, contentFontSize: number = 14) => {
  // Create a hidden container
  const container = document.createElement('div');
  container.style.position = 'fixed';
  container.style.left = '0';
  container.style.top = '0';
  container.style.width = `${SLIDE_CANVAS_WIDTH}px`;
  container.style.height = `${SLIDE_CANVAS_HEIGHT}px`;
  container.style.overflow = 'hidden';
  container.style.pointerEvents = 'none';
  container.style.zIndex = '-1';
  document.body.appendChild(container);

  const root = createRoot(container);

  // Render all slides
  flushSync(() => {
    root.render(
      <div id="pdf-container">
        {data.map((record, index) => (
          <div
            key={index}
            className="pdf-slide"
            style={{
              width: `${SLIDE_CANVAS_WIDTH}px`,
              height: `${SLIDE_CANVAS_HEIGHT}px`,
              pageBreakAfter: 'always',
            }}
          >
            <Slide
              record={record}
              template={template}
              palette={palette}
              isExporting={true}
              layout={layout}
              titleFontSize={titleFontSize}
              contentFontSize={contentFontSize}
            />
          </div>
        ))}
      </div>
    );
  });

  await aguardarFontes();
  await aguardarFrame();

  const slides = Array.from(container.querySelectorAll('.pdf-slide')) as HTMLDivElement[];
  const pdf = new jsPDF({
    unit: 'in',
    format: [PDF_SLIDE_WIDTH_IN, PDF_SLIDE_HEIGHT_IN],
    orientation: 'landscape',
  });

  for (const [index, slide] of slides.entries()) {
    await aguardarLayoutEstavel(slide);

    const canvas = await html2canvas(slide, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: palette.bg,
      width: SLIDE_CANVAS_WIDTH,
      height: SLIDE_CANVAS_HEIGHT,
      windowWidth: SLIDE_CANVAS_WIDTH,
      windowHeight: SLIDE_CANVAS_HEIGHT,
    });

    const imagem = canvas.toDataURL('image/jpeg', 0.98);

    if (index > 0) {
      pdf.addPage([PDF_SLIDE_WIDTH_IN, PDF_SLIDE_HEIGHT_IN], 'landscape');
    }

    pdf.addImage(imagem, 'JPEG', 0, 0, PDF_SLIDE_WIDTH_IN, PDF_SLIDE_HEIGHT_IN);
  }

  pdf.save(gerarNomeArquivoExportacao('pdf'));

  // Cleanup
  root.unmount();
  document.body.removeChild(container);
};
