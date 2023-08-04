import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

export interface Cart {
  _id: string;
  user: string;
  items: CartItem[];
}

export interface CartItem {
  menuItem: {
    name: string;
    price: number;
  };
  quantity: number;
}

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
  selector: 'app-stripe-payment',
  templateUrl: './stripe-payment.component.html',
  styleUrls: ['./stripe-payment.component.css']
})
export class StripePaymentComponent implements OnInit {
  paymentForm: FormGroup;
  error: string;
  orderId!: string;

  userId!: string |any;


  address: string;
  phone: string;

  selectedPaymentMethod: 'online'|'cash-on-delivery' = 'online';


  constructor(private http: HttpClient, private formBuilder: FormBuilder,private router: Router,private authService: AuthService) { }

  ngOnInit() {
    this.userId = this.authService.getUserId();

    this.paymentForm = this.formBuilder.group({
      name: ['', Validators.required],
      cardNumber: ['', Validators.required],
      expirationMonth: ['', Validators.required],
      expirationYear: ['', Validators.required],
      cvc: ['', Validators.required],
      address: ['', Validators.required],
      phone: ['', Validators.required],

      selectedPaymentMethod: ['', Validators.required],
    });
  }

  get formControls() {
    return this.paymentForm.controls;
  }

  onSubmit() {
    if (this.paymentForm.invalid) {
      return;
    }

    const paymentData = {
      name: this.paymentForm.value.name,
      cardNumber: this.paymentForm.value.cardNumber,
      expirationMonth: this.paymentForm.value.expirationMonth,
      expirationYear: this.paymentForm.value.expirationYear,
      cvc: this.paymentForm.value.cvc,
      address: this.paymentForm.value.address, // Updated line
      phone: this.paymentForm.value.phone, // Updated line
      selectedPaymentMethod: this.paymentForm.value.selectedPaymentMethod, // Get the selected value from the form
    };

    this.http.post('http://localhost:3000/payment', paymentData)
      .subscribe(
        (response) => {
          // Handle success response
          console.log(response);
          alert('payment done');
          this.placeOrder();

        },
        (error) => {
          // Handle error response
          this.error = error.message;
        }
      );
  }

  placeOrder() {

      this.completeOrder();

  }

  completeOrder(): void {
    const orderData = this.getOrderData();

    this.http.post<Order>('http://localhost:3000/orders', orderData).subscribe(
      (response) => {
        console.log(response);
        console.log('Order placed successfully');
        alert('Order placed successfully');
        localStorage.setItem('orderId', response._id);
        this.orderId = response._id;
        this.router.navigate(['/orders', this.userId, this.orderId]);
      },
      (error) => {
        console.error('Error placing order:', error);
      }
    );
  }


  getOrderData(): Order {
    return {
      _id: '',
      user: this.userId, // Assign the value of the user ID
      cart: '', // Assign the value of the cart ID if necessary
      status: 'Pending',
      createdAt: new Date(),
      paymentMethod: this.selectedPaymentMethod,
      address: this.paymentForm.value.address, // Use the value from the form control
      phone: this.paymentForm.value.phone, // Use the value from the form control
    };
  }

}
