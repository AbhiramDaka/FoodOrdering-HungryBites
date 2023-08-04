import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-menu-item-form',
  template: `
  <div class="alert alert-primary" role="alert" *ngIf="!isLoggedIn">
  <i class="fas fa-info-circle mr-2"></i> Please login to view available restaurants.
</div>
<div *ngIf="isLoggedIn">
    <h2>Add Menu Item</h2>
    <form (submit)="addMenuItem()">
      <div>
        <label for="name">Name:</label>
        <input type="text" id="name" [(ngModel)]="menuItem.name" name="name" required>
      </div>
      <div>
        <label for="price">Price:</label>
        <input type="number" id="price" [(ngModel)]="menuItem.price" name="price" required>
      </div>
      <div>
        <label for="price">Restaurant Name:</label>
        <input type="text" id="restaurantName" [(ngModel)]="menuItem.restaurantName" name="restaurantName" required>
      </div>
      <button type="submit">Add Menu Item</button>
    </form>
    </div>
  `,
})
export class MenuItemFormComponent {
  menuItem = {
    name: '',
    price: 0,
    restaurantName: ''
  };
  restaurantName : string;
  restaurantId!: string;
  userId!: string;
  private _isLoggedIn: boolean = false; // private backing field for isLoggedIn



  constructor(private route: ActivatedRoute, private http: HttpClient) {
    const token = localStorage.getItem('token');
    if (token) {
      this._isLoggedIn = true;
    }
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.restaurantId = params['restaurantId'];
      this.restaurantName = params['restaurantName'];
      this.userId = params['userId'];


    });
  }

  addMenuItem() {
    const userId = this.userId; // Replace with the actual user ID
    const restaurantId = this.restaurantId; // Replace with the actual restaurant ID

    const newMenuItem = {
      name: this.menuItem.name,
      price: this.menuItem.price,
      restaurantName : this.menuItem.restaurantName,
      // restaurantId : this.restaurantId,
    };


    console.log(this.restaurantName);

    this.http.post(`http://localhost:3000/menuitem`, newMenuItem).subscribe(
      (response) => {
        console.log('Menu item added successfully:', response);
        // Reset form values
        this.menuItem.name = '';
        this.menuItem.price = 0;
        this.menuItem.restaurantName='';
      },
      (error) => {
        console.error('Error adding menu item:', error);
      }
    );
  }

  get isLoggedIn() {
    return this._isLoggedIn; // return the private backing field
  }
}
