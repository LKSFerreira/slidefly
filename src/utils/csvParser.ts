import Papa from 'papaparse';
import { normalizarDemandas } from './normalizarDemandas';
import { DemandRecord } from '../types';

export const parseCSV = (file: File): Promise<DemandRecord[]> => {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const data = results.data as any[];
        if (data.length === 0) {
          return reject(new Error('O arquivo CSV está vazio.'));
        }

        const headers = results.meta.fields || [];
        
        // Check mandatory columns
        const hasId = headers.some(h => h.trim().toLowerCase() === 'id');
        const hasTitle = headers.some(h => h.trim().toLowerCase() === 'title');

        if (!hasId || !hasTitle) {
          return reject(new Error('O CSV deve conter as colunas obrigatórias: "ID" e "Title".'));
        }

        // Map columns
        const mappedData: DemandRecord[] = data.map(row => {
          const getVal = (possibleNames: string[]) => {
            const key = Object.keys(row).find(k => possibleNames.includes(k.trim().toLowerCase()));
            return key ? row[key] : undefined;
          };

          return {
            id: getVal(['id']) || '',
            title: getVal(['title']) || '',
            boardColumn: getVal(['board column', 'fase', 'sprint']),
            assignedTo: getVal(['assigned to', 'responsável', 'responsavel']),
            priority: getVal(['priority', 'prioridade']),
            description: getVal(['description', 'descrição', 'descricao']),
            status: getVal(['status da demanda', 'status']),
            actions: getVal(['ações realizadas', 'acoes realizadas', 'ações', 'acoes']),
            nextActivities: getVal(['próximas atividades', 'proximas atividades']),
            problems: getVal(['problemas e pendências', 'problemas e pendencias', 'problemas']),
          };
        });

        resolve(normalizarDemandas(mappedData));
      },
      error: (error) => {
        reject(new Error(`Erro ao ler o CSV: ${error.message}`));
      }
    });
  });
};
