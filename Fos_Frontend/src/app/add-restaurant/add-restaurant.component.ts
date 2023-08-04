import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Restaurant } from '../Restaurant';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { MenuItem } from '../MenuItem';

@Component({
  selector: 'app-add-restaurant',
  templateUrl: './add-restaurant.component.html',
  styleUrls: ['./add-restaurant.component.css']
})
export class AddRestaurantComponent {
  name: string;
  owner: string;
  restaurants: Restaurant[];
  menuItems:MenuItem[];
  private _isLoggedIn: boolean = false; // private backing field for isLoggedIn

  constructor(private http: HttpClient, private router: Router, private authService: AuthService) {
    if (this.authService.isLoggedIn()) {
      this._isLoggedIn = true;
      this.authService.getRestaurants().subscribe(
        (restaurants) => {
          this.restaurants = restaurants;
        },
        (error) => {
          console.log(error);
        }
      );
    }
  }

  addRestaurant() {
    const restaurantData = {
      name: this.name,
      owner: this.owner,
      menuItems: this.menuItems // Initialize an empty array for menuItems
    };

    this.http.post<Restaurant>('http://localhost:3000/restaurants', restaurantData)
      .subscribe(
        response => {
          console.log('Restaurant added:', response);
          // Handle success, e.g., show a success message
          // Optionally, you can add the newly added restaurant to the existing array
          this.restaurants.push(response);
        },
        error => {
          console.error('Error adding restaurant:', error);
          // Handle error, e.g., show an error message
        }
      );
  }

  get isLoggedIn() {
    return this._isLoggedIn; // return the private backing field
  }
}
