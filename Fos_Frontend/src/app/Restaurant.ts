
export interface MenuItem {
  _id: string;
  name: string;
  price: number;
  quantity: number;
}

export interface Restaurant {
  _id: string;
  name: string;
  owner: string;
  user: string;
  menuItems?: MenuItem[]; // Add the menuItems property as an optional array of MenuItem

}
