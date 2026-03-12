import Papa from 'papaparse';
import { normalizarDemandas } from './normalizarDemandas';
import { DemandRecord } from '../types';

/**
 * Procura a linha de cabeçalho válida no conteúdo do CSV.
 * Retorna o índice da linha e o delimitador detectado.
 */
function findHeaderInfo(lines: string[]): { startIndex: number; delimiter: string } {
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    // Tenta identificar o delimitador e as colunas obrigatórias
    const delimiters = [',', ';'];
    for (const delimiter of delimiters) {
      const parts = line.split(delimiter).map(p => p.trim().toLowerCase());
      const hasId = parts.includes('id');
      const hasTitle = parts.includes('title');

      if (hasId && hasTitle) {
        return { startIndex: i, delimiter };
      }
    }
  }
  return { startIndex: -1, delimiter: ',' };
}

export const parseCSV = (file: File): Promise<DemandRecord[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (!content) {
        return reject(new Error('O arquivo está vazio ou não pôde ser lido.'));
      }

      const lines = content.split(/\r?\n/);
      const { startIndex, delimiter } = findHeaderInfo(lines);

      if (startIndex === -1) {
        return reject(
          new Error(
            'Não foi possível encontrar um cabeçalho válido. O CSV deve conter as colunas "ID" e "Title".'
          )
        );
      }

      // Reconstrói o CSV a partir da linha de cabeçalho encontrada
      const validContent = lines.slice(startIndex).join('\n');

      Papa.parse(validContent, {
        header: true,
        skipEmptyLines: true,
        delimiter: delimiter,
        complete: (results) => {
          const data = results.data as any[];
          if (data.length === 0) {
            return resolve([]);
          }

          // Map columns (usando case-insensitive matching para flexibilidade)
          const mappedData: DemandRecord[] = data.map((row) => {
            const getVal = (possibleNames: string[]) => {
              const key = Object.keys(row).find((k) =>
                possibleNames.includes(k.trim().toLowerCase())
              );
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
              actions:
                getVal(['ações realizadas', 'acoes realizadas', 'ações', 'acoes']) ||
                getVal(['ações realizadas']),
              nextActivities:
                getVal(['próximas atividades', 'proximas atividades']) ||
                getVal(['próximas atividades']),
              problems:
                getVal(['problemas e pendências', 'problemas e pendencias', 'problemas']) ||
                getVal(['problemas e pendências']),
            };
          });

          resolve(normalizarDemandas(mappedData));
        },
        error: (error) => {
          reject(new Error(`Erro ao processar o conteúdo do CSV: ${error.message}`));
        },
      });
    };

    reader.onerror = () => {
      reject(new Error('Erro ao ler o arquivo físico.'));
    };

    reader.readAsText(file, 'UTF-8');
  });
};
