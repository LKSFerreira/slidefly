import pptxgen from 'pptxgenjs';
import { DemandRecord, LayoutItem, PaletteColors, TemplateType } from '../types';
import { gerarNomeArquivoExportacao } from './exportFileName';
import { capturarSlidesComoImagens } from './capturarSlidesComoImagens';

const PPTX_SLIDE_WIDTH_IN = 13.333;
const PPTX_SLIDE_HEIGHT_IN = 7.5;

export async function exportToPptx(
  data: DemandRecord[],
  template: TemplateType,
  palette: PaletteColors,
  layout: LayoutItem[],
  titleFontSize: number = 12,
  contentFontSize: number = 14,
) {
  const apresentacao = new pptxgen();
  apresentacao.layout = 'LAYOUT_16x9';

  const imagens = await capturarSlidesComoImagens(
    data,
    template,
    palette,
    layout,
    titleFontSize,
    contentFontSize,
    {
      mimeType: 'image/png',
      qualidade: 1,
      escala: 2,
    },
  );

  imagens.forEach((imagem) => {
    const slide = apresentacao.addSlide();
    slide.addImage({
      data: imagem,
      x: 0,
      y: 0,
      w: PPTX_SLIDE_WIDTH_IN,
      h: PPTX_SLIDE_HEIGHT_IN,
    });
  });

  await apresentacao.writeFile({ fileName: gerarNomeArquivoExportacao('pptx') });
}
