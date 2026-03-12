export const VALOR_NAO_DEFINIDO = 'Sem definição';
export const PRIORIDADE_PADRAO = 'A definir';

// Expanda este mapa quando a operação adotar novos códigos de prioridade.
export const MAPA_PRIORIDADE: Record<string, string> = {
  // '1': '1 - Alta',
  // '2': '2 - Média',
  // '3': '3 - Baixa',
  // '4': '4 - Crítica',
  // '5': '5 - Ultra Urgente',
};

const PREFIXO_FASE_REGEX = /^\s*\d+\s*-\s*/;

function compactarEspacos(valor: string): string {
  return valor.replace(/\s+/g, ' ').trim();
}

function limparTextoCurto(valor?: string): string {
  if (!valor) {
    return '';
  }

  return compactarEspacos(valor.replace(/\r?\n/g, ' '));
}

function limparTextoLongo(valor?: string): string {
  if (!valor) {
    return '';
  }

  return valor
    .replace(/\r\n/g, '\n')
    .split('\n')
    .map((linha) => compactarEspacos(linha))
    .join('\n')
    .trim();
}

export function resolverTextoCurto(valor?: string, fallback = VALOR_NAO_DEFINIDO): string {
  const texto = limparTextoCurto(valor);
  return texto || fallback;
}

export function resolverTextoLongo(valor?: string): string {
  return limparTextoLongo(valor);
}

export function resolverFase(valor?: string): string {
  const fase = limparTextoCurto(valor);

  if (!fase) {
    return VALOR_NAO_DEFINIDO;
  }

  return fase.replace(PREFIXO_FASE_REGEX, '').trim() || VALOR_NAO_DEFINIDO;
}

export function resolverPrioridade(valor?: string): string {
  const prioridade = limparTextoCurto(valor);

  if (!prioridade) {
    return PRIORIDADE_PADRAO;
  }

  return MAPA_PRIORIDADE[prioridade] ?? prioridade;
}
