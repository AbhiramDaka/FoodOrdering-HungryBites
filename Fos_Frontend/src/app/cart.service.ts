import { Injectable } from '@angular/core';
import { MenuItem } from './MenuItem';
import { Cart, CartItem } from './Cart';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  cartItems: MenuItem[] = [];

  constructor(private http: HttpClient) {}

  addToCart(menuItem: MenuItem) {
    const existingItem = this.cartItems.find(item => item._id === menuItem._id);
    if (existingItem) {
      // Item already exists in the cart, update the quantity
      existingItem.quantity += menuItem.quantity;
    } else {
      // Item does not exist in the cart, add it
      this.cartItems.push(menuItem);
    }
  }
  // addToCart(item: CartItem): void {
  //   // Make the HTTP request to add the item to the cart on the server
  //   this.http.post('http://localhost:3000/cart', item).subscribe(
  //     (response) => {
  //       console.log('Item added to cart:', response);
  //     },
  //     (error) => {
  //       console.error('Error adding item to cart:', error);
  //     }
  //   );
  // }
  // getCartItems(userId: string): Promise<Cart> {
  //   // Make the HTTP request to retrieve the cart items for the user from the server
  //   return this.http.get<Cart>(`http://localhost:3000/cart/${userId}`).toPromise();
  // }

  getCartItems(): MenuItem[] {
    return this.cartItems;
  }


  getCart(): Observable<Cart> {
    // Replace 'userId' with the actual user ID
    const userId = localStorage.getItem('userId');
    return this.http.get<Cart>(`http://localhost:3000/cart/${userId}`);
  }


  clearCart() {
    this.cartItems = [];
  }
}
