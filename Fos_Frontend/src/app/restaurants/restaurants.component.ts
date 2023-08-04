import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { Observable } from 'rxjs';
import { Restaurant } from '../Restaurant';
import { User } from '../User';

@Component({
  selector: 'app-restaurants',
  templateUrl: './restaurants.component.html',
  styleUrls: ['./restaurants.component.css']
})
export class RestaurantsComponent implements OnInit {
  username: string | any;
  password: string | any;
  role: string | any;

  restaurants: Restaurant[] = [];
  users: User[] = [];

  private _isLoggedIn: boolean = false; // private backing field for isLoggedIn
  userId!: string; // Change the type to string

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
      this.userId = this.authService.getUserId() || ''; // Fetch the user ID directly from the AuthService and assign an empty string as the default value
      console.log('User ID:', this.userId);
    }
  }

  ngOnInit() {
    this.role = localStorage.getItem('role');
    this.username = localStorage.getItem('username');
    this.password = localStorage.getItem('password');
    this.getUsers();
    this.getRestaurants();
  }

  getRestaurants() {
    this.http.get<Restaurant[]>('http://localhost:3000/restaurants').subscribe(
      (data) => {
        this.restaurants = data;
      },
      (error) => {
        console.log('Error retrieving restaurants:', error);
      }
    );
  }

  getUsers() {
    this.http.get<User[]>('http://localhost:3000/users').subscribe(
      (data) => {
        this.users = data;
      },
      (error) => {
        console.log('Error retrieving users:', error);
      }
    );
  }

  viewMenu(restaurantName: string) {
    console.log(this.userId); // Use this.userId to access the userId
    this.router.navigate(['/menu-items', restaurantName, this.userId]);
  }

  logout(): Observable<any> {
    this.authService.clearToken();
    this._isLoggedIn = false;
    window.location.replace('/');
    return new Observable((observer) => {
      observer.complete();
    });
  }

  get isLoggedIn() {
    return this._isLoggedIn; // return the private backing field
  }
}
