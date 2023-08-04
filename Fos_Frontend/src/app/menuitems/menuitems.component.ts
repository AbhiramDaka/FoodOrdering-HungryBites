import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { MenuItem } from '../MenuItem';
import { User } from '../User';
import { CartItem } from '../Cart';
import { CartService } from '../cart.service';

@Component({
  selector: 'app-menuitems',
  templateUrl: './menuitems.component.html',
  styleUrls: ['./menuitems.component.css']
})
export class MenuItemsComponent implements OnInit {
  menuItems: MenuItem[] = [];
  menuId: string = '';
  cartId: string = '';
  restaurantName: string;
  userId!: string;
  role: string | any;
  cartItems:CartItem[]=[];

  private _isLoggedIn: boolean = false; // private backing field for isLoggedIn

  constructor(private route: ActivatedRoute, private http: HttpClient,private cartService: CartService) {
    const token = localStorage.getItem('token');
    if (token) {
      this._isLoggedIn = true;
    }
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.restaurantName = params['restaurantName'];
      this.menuId = params['menuId'];
      this.userId = params['userId'];

      this.cartId = params['cartId'];

      this.fetchMenuItems();
    });
  }

  fetchMenuItems() {
    this.http.get<MenuItem[]>(`http://localhost:3000/restaurants/${this.restaurantName}/${this.userId}/menuitems`)
      .subscribe(data => {
        this.menuItems = data;
        console.log(this.menuItems)
      });
  }

  addToCart(menuItem: MenuItem) {

    const requestBody = {
      user:this.userId,
      cart:this.cartId,
      menuItem: menuItem._id,
      quantity: menuItem.quantity
    };

    this.http.post(`http://localhost:3000/cart`, requestBody)
      .subscribe(
        response => {
          console.log(this.userId);
          console.log(menuItem)
          alert('Item added to cart successfully')
          console.log('Item added to cart successfully', response);
        },
        error => {
          alert('Error Item added to cart ')
          console.error('Error adding item to cart', error);
        }
      );
  }

  get isLoggedIn() {
    return this._isLoggedIn; // return the private backing field
  }
}
