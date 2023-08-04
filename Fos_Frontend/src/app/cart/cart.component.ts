import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { Cart, CartItem } from '../Cart';
import { CartService } from '../cart.service';
import { AuthService } from '../auth.service';
import { MenuItem } from '../MenuItem';

export interface Order {
  _id: string;
  user: string;
  cart: string;
  status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered';
  createdAt: Date;
  paymentMethod: 'online' | 'cash-on-delivery';
  address: string;
  phone: string;
}

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
})
export class CartComponent implements OnInit {
  cart: Cart | any;
  item:MenuItem|any;
  cartItems: CartItem[];
  areCartItemsAvailable: boolean;

  userId!: string;
  orderId!: string;
  order: Order[] = [];
  address: string;
  phone: string;

  selectedPaymentMethod: 'online' | 'cash-on-delivery' = 'online';

  private _isLoggedIn: boolean = false;

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
    private cartService: CartService, // Inject the CartService
    private authService: AuthService // Inject the CartService
  ) {
    const token = localStorage.getItem('token');
    if (token) {
      this._isLoggedIn = true;
    }
  }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.userId = params['userId'];
      this.getCartItems(); // Move the call to getCartItems() here
    });
  }

  calculateTotalPrice(): number {
    let totalPrice = 0;

    if (this.cart) {
      for (let item of this.cart.items) {
        totalPrice += item.menuItem.price * item.quantity;
      }
    }

    return totalPrice;
  }

  getTotalItems(): number {
    let totalItems = 0;

    if (this.cart) {
      for (let item of this.cart.items) {
        totalItems += item.quantity;
      }
    }

    return totalItems;
  }

  decreaseQuantity(item: CartItem): void {
    if (item.quantity > 0) {

      item.quantity--;
    }




  }

  increaseQuantity(item: CartItem): void {
    item.quantity++;
  }
  removeFromCart(item: CartItem): void {
    if (this.cart) {
      const index = this.cart.items.indexOf(item);
      if (index !== -1) {
        this.cart.items.splice(index, 1);

        // Update the cart data in the backend
        this.authService.updateCart(this.cart).subscribe(
          () => {
            console.log('Cart updated successfully');
          },
          (error) => {
            console.error('Error updating cart:', error);
          }
        );

        this.updateCartData(); // Update cart data in the component
      }
    }
  }



  getCartItems() {
    this.authService.getCartItems().subscribe(
      (response: any) => {
        this.cart = response.cart; // Assign the response directly to the cart property
        this.cartItems = this.cart.items; // Access the items property of the cart object
        console.log(this.cartItems);
        this.areCartItemsAvailable = this.cartItems.length > 0;
        console.log('Are cart items available?', this.areCartItemsAvailable);
      },
      (error) => {
        console.error('An error occurred:', error);
      }
    );
  }

  updateCartData(): void {
    if (this.cart && Array.isArray(this.cart.items)) {
      this.cartItems = [...this.cart.items];
      this.areCartItemsAvailable = true;
    } else {
      this.cartItems = [];
      this.areCartItemsAvailable = false;
    }

    console.log(this.cartItems); // Update the console.log statement to check the cartItems
  }

  placeOrder() {
    if (this.selectedPaymentMethod === 'online') {
      this.router.navigate(['/payment'], {
        state: { orderData: this.getOrderData() },
      });
    } else {
      this.completeOrder();
    }
  }

  completeOrder(): void {
    const orderData = this.getOrderData();

    this.http.post<Order>('http://localhost:3000/orders', orderData).subscribe(
      (response) => {
        console.log('Order placed successfully');
        alert('Order placed successfully');
        console.log(response)
            // Update the cart data in the backend
        this.authService.updateCart(this.cart).subscribe(
          () => {
            console.log('Cart updated successfully');
          },
          (error) => {
            console.error('Error updating cart:', error);
          }
        );
        this.clearCart();
        localStorage.setItem('orderId', response._id);
        this.orderId = response._id;
        this.router.navigate(['/orders', this.userId, this.orderId]);
      },
      (error) => {
        console.error('Error placing order:', error);
      }
    );
  }

  clearCart(): void {
    if (this.cart) {
      this.cart.items = [];
    }
  }

  viewOrders() {
    const orderId = localStorage.getItem('orderId');
    if (orderId) {
      this.router.navigate(['/orders', this.userId, orderId]);
    } else {
      console.error('Order ID is undefined');
    }
  }

  viewAllOrders() {
    this.http
      .get<Order[]>(`http://localhost:3000/orders/user/${this.userId}`)
      .subscribe(
        (orders) => {
          this.order = orders;
          this.router.navigate(['/orders', this.userId]);
          console.log('Retrieved orders:', orders);
        },
        (error) => {
          console.error('Error retrieving orders:', error);
        }
      );
  }

  get isLoggedIn() {
    return this._isLoggedIn;
  }

  getOrderData(): Order {
    return {
      _id: '',
      user: this.userId,
      cart: '',
      status: 'Pending',
      createdAt: new Date(),
      paymentMethod: this.selectedPaymentMethod,
      address: this.address,
      phone: this.phone,
    };
  }
}
