import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

interface Order {
  _id: string;
  user: string;
  cart: string;
  status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered';
  createdAt: Date;
  paymentMethod: 'online' | 'cash-on-delivery';
}

@Component({
  selector: 'app-myorders',
  templateUrl: './myorders.component.html',
  styleUrls: ['./myorders.component.css']
})
export class MyordersComponent implements OnInit {

  orderId: string;
  order: Order;

  constructor(private route: ActivatedRoute, private http: HttpClient) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.orderId = params['orderId'];
      this.getOrderDetails();
    });
  }

  getOrderDetails(): void {
    this.http.get<Order>(`http://localhost:3000/orders/${this.orderId}`)
      .subscribe(
        (response) => {
          this.order = response;
        },
        (error) => {
          console.error('Error retrieving order details:', error);
        }
      );
  }
}
