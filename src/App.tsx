import React, { useState } from 'react';
import Landing from './components/Landing';
import Configurator from './components/Configurator';
import Presentation from './components/Presentation';
import { DemandRecord, TemplateType, PaletteType, LayoutItem } from './types';

const DEFAULT_LAYOUT: LayoutItem[] = [
  { i: 'id', x: 0, y: 0, w: 2, h: 2 },
  { i: 'title', x: 2, y: 0, w: 10, h: 2 },
  { i: 'description', x: 0, y: 2, w: 8, h: 6 },
  { i: 'boardColumn', x: 8, y: 2, w: 4, h: 2 },
  { i: 'assignedTo', x: 8, y: 4, w: 4, h: 2 },
  { i: 'priority', x: 8, y: 6, w: 4, h: 2 },
];

export default function App() {
  const [data, setData] = useState<DemandRecord[]>([]);
  const [template, setTemplate] = useState<TemplateType>('padrao');
  const [palette, setPalette] = useState<PaletteType>('clara');
  const [titleFontSize, setTitleFontSize] = useState<number>(24);
  const [contentFontSize, setContentFontSize] = useState<number>(22);
  const [currentStep, setCurrentStep] = useState<'landing' | 'config' | 'presentation'>('landing');
  const [previewSingleIndex, setPreviewSingleIndex] = useState<number | null>(null);
  const [layout, setLayout] = useState<LayoutItem[]>(DEFAULT_LAYOUT);

  const handleDataLoaded = (parsedData: DemandRecord[]) => {
    setData(parsedData);
    setCurrentStep('config');
  };

  const handleStartPresentation = () => {
    setPreviewSingleIndex(null);
    setCurrentStep('presentation');
  };

  const handlePreviewSingle = (index: number) => {
    setPreviewSingleIndex(index);
    setCurrentStep('presentation');
  };

  const handleBackToConfig = () => {
    setCurrentStep('config');
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-50 font-sans">
      {currentStep === 'landing' && <Landing onDataLoaded={handleDataLoaded} />}
      {currentStep === 'config' && (
        <Configurator
          data={data}
          setData={setData}
          template={template}
          setTemplate={setTemplate}
          palette={palette}
          setPalette={setPalette}
          titleFontSize={titleFontSize}
          setTitleFontSize={setTitleFontSize}
          contentFontSize={contentFontSize}
          setContentFontSize={setContentFontSize}
          onStart={handleStartPresentation}
          onPreviewSingle={handlePreviewSingle}
          layout={layout}
          setLayout={setLayout}
        />
      )}
      {currentStep === 'presentation' && (
        <Presentation
          data={previewSingleIndex !== null ? [data[previewSingleIndex]] : data}
          template={template}
          palette={palette}
          titleFontSize={titleFontSize}
          contentFontSize={contentFontSize}
          onBack={handleBackToConfig}
          isSinglePreview={previewSingleIndex !== null}
          layout={layout}
        />
      )}
    </div>
  );
}
