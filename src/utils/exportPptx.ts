import pptxgen from 'pptxgenjs';
import { DemandRecord, TemplateType, PaletteColors, LayoutItem } from '../types';

export const exportToPptx = async (data: DemandRecord[], template: TemplateType, palette: PaletteColors, layout: LayoutItem[], titleFontSize: number = 12, contentFontSize: number = 14) => {
  const pres = new pptxgen();
  pres.layout = 'LAYOUT_16x9';

  data.forEach(record => {
    const slide = pres.addSlide();
    slide.background = { color: palette.bg.replace('#', '') };

    if (record.type === 'image' && record.imageUrl) {
      slide.addImage({ data: record.imageUrl, x: 0, y: 0, w: '100%', h: '100%', sizing: { type: 'contain', w: '100%', h: '100%' } });
      return;
    }

    // Simple generic layout for PPTX since rendering complex HTML to PPTX is hard
    // We'll just put the data in a structured way

    // ID & Title
    slide.addText(`${record.id} - ${record.title}`, {
      x: 0.5, y: 0.5, w: '90%', h: 1,
      fontSize: 32, bold: true, color: palette.text.replace('#', '')
    });

    // Status & Priority
    let metaText = '';
    if (record.status) metaText += `Status: ${record.status}   `;
    if (record.priority) metaText += `Prioridade: ${record.priority}   `;
    if (record.boardColumn) metaText += `Fase: ${record.boardColumn}   `;
    if (record.assignedTo) metaText += `Resp: ${record.assignedTo}`;

    if (metaText) {
      slide.addText(metaText, {
        x: 0.5, y: 1.5, w: '90%', h: 0.5,
        fontSize: contentFontSize, color: palette.accent.replace('#', '')
      });
    }

    // Description
    if (record.description) {
      slide.addText('Descrição', {
        x: 0.5, y: 2.2, w: '45%', h: 0.3,
        fontSize: titleFontSize + 2, bold: true, color: palette.text.replace('#', '')
      });
      slide.addText(record.description, {
        x: 0.5, y: 2.5, w: '45%', h: 1.5,
        fontSize: contentFontSize, color: palette.text.replace('#', ''), valign: 'top'
      });
    }

    // Actions
    if (record.actions) {
      slide.addText('Ações Realizadas', {
        x: 5.2, y: 2.2, w: '45%', h: 0.3,
        fontSize: titleFontSize + 2, bold: true, color: palette.text.replace('#', '')
      });
      slide.addText(record.actions, {
        x: 5.2, y: 2.5, w: '45%', h: 1.5,
        fontSize: contentFontSize, color: palette.text.replace('#', ''), valign: 'top'
      });
    }

    // Next Activities
    if (record.nextActivities) {
      slide.addText('Próximas Atividades', {
        x: 0.5, y: 4.2, w: '45%', h: 0.3,
        fontSize: titleFontSize + 2, bold: true, color: palette.text.replace('#', '')
      });
      slide.addText(record.nextActivities, {
        x: 0.5, y: 4.5, w: '45%', h: 1.5,
        fontSize: contentFontSize, color: palette.text.replace('#', ''), valign: 'top'
      });
    }

    // Problems
    if (record.problems) {
      slide.addText('Problemas e Pendências', {
        x: 5.2, y: 4.2, w: '45%', h: 0.3,
        fontSize: titleFontSize + 2, bold: true, color: 'ef4444'
      });
      slide.addText(record.problems, {
        x: 5.2, y: 4.5, w: '45%', h: 1.5,
        fontSize: contentFontSize, color: palette.text.replace('#', ''), valign: 'top'
      });
    }
  });

  await pres.writeFile({ fileName: 'AutoReport.pptx' });
};
