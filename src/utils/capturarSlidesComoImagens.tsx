import html2canvas from 'html2canvas';
import { flushSync } from 'react-dom';
import { createRoot } from 'react-dom/client';
import Slide from '../components/Slide';
import { SLIDE_CANVAS_HEIGHT, SLIDE_CANVAS_WIDTH } from '../config/slideCanvas';
import { DemandRecord, LayoutItem, PaletteColors, TemplateType } from '../types';

const CLASSE_SLIDE_EXPORTACAO = 'slide-exportacao';

interface OpcoesCapturaSlides {
  escala?: number;
  mimeType?: 'image/jpeg' | 'image/png';
  qualidade?: number;
}

function aguardarFrame() {
  return new Promise<void>((resolve) => {
    let resolvido = false;
    const finalizar = () => {
      if (!resolvido) {
        resolvido = true;
        resolve();
      }
    };
    window.requestAnimationFrame(finalizar);
    setTimeout(finalizar, 50);
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
  let tentativas = 0;
  const maxTentativas = 40;

  while (framesEstaveis < 4 && tentativas < maxTentativas) {
    tentativas += 1;
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

export async function capturarSlidesComoImagens(
  data: DemandRecord[],
  template: TemplateType,
  palette: PaletteColors,
  layout: LayoutItem[],
  titleFontSize: number = 12,
  contentFontSize: number = 14,
  opcoes: OpcoesCapturaSlides = {},
) {
  const { escala = 2, mimeType = 'image/png', qualidade = 1 } = opcoes;

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

  try {
    flushSync(() => {
      root.render(
        <div id="container-exportacao-slides">
          {data.map((record, index) => (
            <div
              key={`${record.id}-${index}`}
              className={CLASSE_SLIDE_EXPORTACAO}
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
        </div>,
      );
    });

    await aguardarFontes();
    await aguardarFrame();

    const slides = Array.from(container.querySelectorAll(`.${CLASSE_SLIDE_EXPORTACAO}`)) as HTMLDivElement[];
    const imagens: string[] = [];

    for (const slide of slides) {
      await aguardarLayoutEstavel(slide);

      const canvas = await html2canvas(slide, {
        scale: escala,
        useCORS: true,
        logging: false,
        backgroundColor: palette.bg,
        width: SLIDE_CANVAS_WIDTH,
        height: SLIDE_CANVAS_HEIGHT,
        windowWidth: SLIDE_CANVAS_WIDTH,
        windowHeight: SLIDE_CANVAS_HEIGHT,
      });

      imagens.push(canvas.toDataURL(mimeType, qualidade));
    }

    return imagens;
  } finally {
    root.unmount();
    document.body.removeChild(container);
  }
}
