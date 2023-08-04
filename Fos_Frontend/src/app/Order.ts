import { MenuItem } from "./MenuItem";

export interface Order {
  _id: string;
  user: string;
  cart: string;
  status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered';
  createdAt: Date;
  paymentMethod: 'online' | 'cash-on-delivery';
  address: string;
  phone: string;
  menuItems: MenuItem[]; // Update the type to MenuItem[]
}
