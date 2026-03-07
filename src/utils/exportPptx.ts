import pptxgen from 'pptxgenjs';
import { DemandRecord, LayoutItem, PaletteColors, TemplateType } from '../types';
import { gerarNomeArquivoExportacao } from './exportFileName';

const LIMITE_FONTE_PPTX = 18;

export async function exportToPptx(
  data: DemandRecord[],
  template: TemplateType,
  palette: PaletteColors,
  layout: LayoutItem[],
  titleFontSize: number = 12,
  contentFontSize: number = 14,
) {
  void template;
  void layout;

  const apresentacao = new pptxgen();
  apresentacao.layout = 'LAYOUT_16x9';

  const tituloSeguro = Math.min(titleFontSize, LIMITE_FONTE_PPTX);
  const textoSeguro = Math.min(contentFontSize, LIMITE_FONTE_PPTX);
  const tituloPrincipalSeguro = Math.min(18, tituloSeguro + 2);

  data.forEach((record) => {
    const slide = apresentacao.addSlide();
    slide.background = { color: palette.bg.replace('#', '') };

    if (record.type === 'image' && record.imageUrl) {
      slide.addImage({
        data: record.imageUrl,
        x: 0,
        y: 0,
        w: '100%',
        h: '100%',
        sizing: { type: 'contain', w: '100%', h: '100%' },
      });
      return;
    }

    slide.addText(`${record.id} - ${record.title}`, {
      x: 0.5,
      y: 0.5,
      w: '90%',
      h: 1,
      fontSize: tituloPrincipalSeguro,
      bold: true,
      color: palette.text.replace('#', ''),
    });

    let metadados = '';
    if (record.status) metadados += `Status: ${record.status}   `;
    if (record.priority) metadados += `Prioridade: ${record.priority}   `;
    if (record.boardColumn) metadados += `Fase: ${record.boardColumn}   `;
    if (record.assignedTo) metadados += `Resp: ${record.assignedTo}`;

    if (metadados) {
      slide.addText(metadados, {
        x: 0.5,
        y: 1.5,
        w: '90%',
        h: 0.5,
        fontSize: textoSeguro,
        color: palette.accent.replace('#', ''),
      });
    }

    if (record.description) {
      slide.addText('Descrição', {
        x: 0.5,
        y: 2.2,
        w: '45%',
        h: 0.3,
        fontSize: tituloSeguro,
        bold: true,
        color: palette.text.replace('#', ''),
      });
      slide.addText(record.description, {
        x: 0.5,
        y: 2.5,
        w: '45%',
        h: 1.5,
        fontSize: textoSeguro,
        color: palette.text.replace('#', ''),
        valign: 'top',
      });
    }

    if (record.actions) {
      slide.addText('Ações Realizadas', {
        x: 5.2,
        y: 2.2,
        w: '45%',
        h: 0.3,
        fontSize: tituloSeguro,
        bold: true,
        color: palette.text.replace('#', ''),
      });
      slide.addText(record.actions, {
        x: 5.2,
        y: 2.5,
        w: '45%',
        h: 1.5,
        fontSize: textoSeguro,
        color: palette.text.replace('#', ''),
        valign: 'top',
      });
    }

    if (record.nextActivities) {
      slide.addText('Próximas Atividades', {
        x: 0.5,
        y: 4.2,
        w: '45%',
        h: 0.3,
        fontSize: tituloSeguro,
        bold: true,
        color: palette.text.replace('#', ''),
      });
      slide.addText(record.nextActivities, {
        x: 0.5,
        y: 4.5,
        w: '45%',
        h: 1.5,
        fontSize: textoSeguro,
        color: palette.text.replace('#', ''),
        valign: 'top',
      });
    }

    if (record.problems) {
      slide.addText('Problemas e Pendências', {
        x: 5.2,
        y: 4.2,
        w: '45%',
        h: 0.3,
        fontSize: tituloSeguro,
        bold: true,
        color: 'ef4444',
      });
      slide.addText(record.problems, {
        x: 5.2,
        y: 4.5,
        w: '45%',
        h: 1.5,
        fontSize: textoSeguro,
        color: palette.text.replace('#', ''),
        valign: 'top',
      });
    }
  });

  await apresentacao.writeFile({ fileName: gerarNomeArquivoExportacao('pptx') });
}
