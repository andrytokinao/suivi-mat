export interface MaterialCategory {
  id: number;
  name: string;
  description: string;
  parent: number | null;
  children?: MaterialCategory[];
}
