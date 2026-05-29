export type OrderStatus = 'draft' | 'confirmed' | 'paid' | 'completed' | 'cancelled' | 'refunded';

export interface OrderItem {
  id: number;          // Identity in orderItems table
  order_id: number;
  item_id: number;     // Original item ID[cite: 1]
  item_name: string;
  item_code: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  notes?: string;
}

export interface Order {
  id: number;
  notes?: string;
  status: OrderStatus;
  items: OrderItem[];
  total_amount: number;
  tax_amount?: number;
  discount_amount?: number;
  delivery_fee?: number;
  created_at: string;
  updated_at: string;
}