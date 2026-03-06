import html2pdf from 'html2pdf.js';
import { DemandRecord, TemplateType, PaletteColors, LayoutItem } from '../types';
import { createRoot } from 'react-dom/client';
import React from 'react';
import Slide from '../components/Slide';

export const exportToPdf = async (data: DemandRecord[], template: TemplateType, palette: PaletteColors, layout: LayoutItem[], titleFontSize: number = 12, contentFontSize: number = 14) => {
  // Create a hidden container
  const container = document.createElement('div');
  container.style.position = 'absolute';
  container.style.left = '-9999px';
  container.style.top = '0';
  container.style.width = '1920px'; // 16:9 aspect ratio
  document.body.appendChild(container);

  const root = createRoot(container);

  // Render all slides
  root.render(
    <div id="pdf-container">
      {data.map((record, index) => (
        <div key={index} className="pdf-slide" style={{ width: '1920px', height: '1080px', pageBreakAfter: 'always' }}>
          <Slide record={record} template={template} palette={palette} isExporting={true} layout={layout} titleFontSize={titleFontSize} contentFontSize={contentFontSize} />
        </div>
      ))}
    </div>
  );

  // Wait for render
  await new Promise(resolve => setTimeout(resolve, 1000));

  const element = document.getElementById('pdf-container');
  
  const opt = {
    margin:       0,
    filename:     'AutoReport.pdf',
    image:        { type: 'jpeg' as const, quality: 0.98 },
    html2canvas:  { scale: 2, useCORS: true, logging: false },
    jsPDF:        { unit: 'px', format: [1920, 1080] as [number, number], orientation: 'landscape' as const }
  };

  await html2pdf().set(opt).from(element).save();

  // Cleanup
  root.unmount();
  document.body.removeChild(container);
};
