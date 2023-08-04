import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';

export interface Order {
  _id: string;
  user: string;
  cart: string;
  status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered';
  createdAt: Date;
  paymentMethod: string;
  address: string;
  phone: string;
}


@Component({
  selector: 'app-userorders',
  templateUrl: './userorders.component.html',
  styleUrls: ['./userorders.component.css']
})
export class UserordersComponent {
  userId!: string;
  orderId!: string;
  order: Order[];

  private _isLoggedIn: boolean = false; // private backing field for isLoggedIn

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router
  ) {
    const token = localStorage.getItem('token');
    if (token) {
      this._isLoggedIn = true;
    }
  }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.userId = params['userId'];
    });

    this.viewAllOrders();
  }

  viewAllOrders() {
    this.http.get<Order[]>(`http://localhost:3000/orders/user/${this.userId}`).subscribe(
      (orders) => {
        this.order = orders;
        // Process the retrieved orders
        console.log('Retrieved orders:', orders);
        // Handle the orders as needed, e.g., assign them to a property for display
      },
      (error) => {
        console.error('Error retrieving orders:', error);
      }
    );
  }
}
