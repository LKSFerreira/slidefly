import React, { useState, useCallback } from 'react';
import { UploadCloud, FileText, AlertCircle } from 'lucide-react';
import { parseCSV } from '../utils/csvParser';
import { DemandRecord } from '../types';

interface LandingProps {
  onDataLoaded: (data: DemandRecord[]) => void;
}

export default function Landing({ onDataLoaded }: LandingProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const processFile = async (file: File) => {
    setError(null);
    if (!file.name.endsWith('.csv')) {
      setError('Por favor, envie um arquivo .csv válido.');
      return;
    }

    try {
      const data = await parseCSV(file);
      onDataLoaded(data);
    } catch (err: any) {
      setError(err.message || 'Erro ao processar o arquivo.');
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-slate-900">
      <div className="max-w-3xl w-full text-center space-y-8">
        <div className="space-y-4">
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-white">
            AutoReport Web
          </h1>
          <p className="text-xl text-slate-400">
            CSV → Apresentação em segundos
          </p>
          <p className="text-sm text-slate-500">
            Seus dados nunca saem do navegador.
          </p>
        </div>

        <div
          className={`relative border-2 border-dashed rounded-2xl p-12 transition-all duration-200 ease-in-out ${
            isDragging
              ? 'border-cyan-500 bg-cyan-500/10'
              : 'border-slate-700 bg-slate-800/50 hover:border-slate-600 hover:bg-slate-800'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <input
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            aria-label="Upload CSV"
          />
          <div className="flex flex-col items-center justify-center space-y-4 pointer-events-none">
            <div className="p-4 bg-slate-700/50 rounded-full">
              <UploadCloud className="w-10 h-10 text-cyan-400" />
            </div>
            <div className="space-y-1">
              <p className="text-lg font-medium text-slate-200">
                Arraste seu CSV aqui ou clique para selecionar
              </p>
              <p className="text-sm text-slate-400">
                Máximo de 10 colunas. UTF-8. Separador vírgula ou ponto-e-vírgula.
              </p>
            </div>
          </div>
        </div>

        {error && (
          <div className="flex items-center justify-center space-x-2 text-red-400 bg-red-400/10 p-4 rounded-lg">
            <AlertCircle className="w-5 h-5" />
            <span>{error}</span>
          </div>
        )}

        <div className="pt-12 flex items-center justify-center space-x-4 text-sm text-slate-500">
          <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-slate-300 transition-colors">
            GitHub
          </a>
          <span>•</span>
          <span className="flex items-center space-x-1">
            <FileText className="w-4 h-4" />
            <span>100% Client-Side Privacy</span>
          </span>
        </div>
      </div>
    </div>
  );
}
