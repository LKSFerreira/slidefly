export interface DemandRecord {
  id: string;
  title: string;
  boardColumn?: string;
  assignedTo?: string;
  priority?: string;
  description?: string;
  status?: string;
  actions?: string;
  nextActivities?: string;
  problems?: string;
  type?: 'data' | 'image';
  imageUrl?: string;
}

export type TemplateType = 'padrao' | 'personalizado';
export type PaletteType = 'clara' | 'escura' | 'verde';

export interface LayoutItem {
  i: string;
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface AppState {
  data: DemandRecord[];
  template: TemplateType;
  palette: PaletteType;
  currentStep: 'landing' | 'config' | 'presentation';
  layout: LayoutItem[];
}

export interface PaletteColors {
  bg: string;
  surface: string;
  text: string;
  accent: string;
  success: string;
  title?: string;
}
