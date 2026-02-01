// MaterialCategory interface matching MaterialCategoryDTO
export interface MaterialCategory {
  id: number;
  name: string;
  description: string | null;
  parentId: number | null;
  children?: MaterialCategory[];
}

export interface MaterialCategoryFormData {
  name: string;
  description: string | null;
  parentId: number | null;
}

