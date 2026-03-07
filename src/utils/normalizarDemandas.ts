import {
  resolverFase,
  resolverPrioridade,
  resolverTextoCurto,
  resolverTextoLongo,
} from '../config/regrasSlide';
import { DemandRecord } from '../types';

export function normalizarRegistroDemanda(registro: DemandRecord): DemandRecord {
  if (registro.type === 'image') {
    return registro;
  }

  return {
    ...registro,
    id: resolverTextoCurto(registro.id, ''),
    title: resolverTextoCurto(registro.title, ''),
    boardColumn: resolverFase(registro.boardColumn),
    assignedTo: resolverTextoCurto(registro.assignedTo),
    priority: resolverPrioridade(registro.priority),
    description: resolverTextoLongo(registro.description),
    status: resolverTextoCurto(registro.status),
    actions: resolverTextoLongo(registro.actions),
    nextActivities: resolverTextoLongo(registro.nextActivities),
    problems: resolverTextoLongo(registro.problems),
  };
}

export function normalizarDemandas(registros: DemandRecord[]): DemandRecord[] {
  return registros.map((registro) => normalizarRegistroDemanda(registro));
}
