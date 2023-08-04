export interface Cart {
  _id: string;
  user: string;
  items: CartItem[];
}

export interface CartItem {
  menuItem: {
    _id:string;
    name: string;
    price: number;
  };
  quantity: number;
}
