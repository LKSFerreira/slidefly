import { jsPDF } from 'jspdf';
import { DemandRecord, TemplateType, PaletteColors, LayoutItem } from '../types';
import { gerarNomeArquivoExportacao } from './exportFileName';
import { capturarSlidesComoImagens } from './capturarSlidesComoImagens';

const PDF_SLIDE_WIDTH_IN = 13.333;
const PDF_SLIDE_HEIGHT_IN = 7.5;

export const exportToPdf = async (
  data: DemandRecord[],
  template: TemplateType,
  palette: PaletteColors,
  layout: LayoutItem[],
  titleFontSize: number = 12,
  contentFontSize: number = 14,
) => {
  const imagens = await capturarSlidesComoImagens(
    data,
    template,
    palette,
    layout,
    titleFontSize,
    contentFontSize,
    {
      mimeType: 'image/jpeg',
      qualidade: 0.98,
      escala: 2,
    },
  );

  const pdf = new jsPDF({
    unit: 'in',
    format: [PDF_SLIDE_WIDTH_IN, PDF_SLIDE_HEIGHT_IN],
    orientation: 'landscape',
  });

  for (const [index, imagem] of imagens.entries()) {
    if (index > 0) {
      pdf.addPage([PDF_SLIDE_WIDTH_IN, PDF_SLIDE_HEIGHT_IN], 'landscape');
    }

    pdf.addImage(imagem, 'JPEG', 0, 0, PDF_SLIDE_WIDTH_IN, PDF_SLIDE_HEIGHT_IN);
  }

  pdf.save(gerarNomeArquivoExportacao('pdf'));
};
