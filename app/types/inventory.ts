export type InventoryProduct = {
  id: number;
  name: string;
  code: string;
  type: "ingredient" | "box";
  point_reorder?: number;      // for ingredients
  total_weight_grams?: number; // for boxes
  quantity: number;
  status: "low" | "medium" | "good" | "empty";
  updatedAt?: string;
};

export type InventoryItemPackaging = {
  box_id: number;
  required_quantity: number;
  is_default_packaging: boolean;
  note?: string;
};

export type InventoryItem = {
  id: number;
  name: string;
  code: string;
  description?: string;
  category?: string;
  subcategory?: string;
  target_sell_price?: number;
  actual_sell_price?: number;
  preparation_time?: number;
  serving_size?: number;
  serving_unit?: string;
  is_featured?: boolean;
  daily_stock_limit?: number;
  calories?: number;
  allergens?: string[];
  boxes?: InventoryItemPackaging[];
};

export type InventorySection = {
  ingredients: InventoryProduct[];
  boxes: InventoryProduct[];
  items: InventoryItem[];
};

export type InventoryViewerProps = {
  items: InventoryProduct[]
}
export type ColumnKey =
  | 'code'
  | 'name'
  | 'status'
  | 'quantity'
  | 'type'
  | 'point_reorder'
  | 'total_weight_grams'
  | 'updatedAt'

export type InventoryCardProps = {
  item: InventoryProduct
  mode: 'row' | 'detail'
  visibleColumns: ColumnKey[]
  onToggle: () => void
}