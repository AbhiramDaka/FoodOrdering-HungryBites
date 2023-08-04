import { Component } from '@angular/core';
import { MenuItem } from '../MenuItem';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css']
})
export class LandingPageComponent {
  role: string | any;
  private _isLoggedIn: boolean = false; // private backing field for isLoggedIn
  menus: MenuItem[] = []; // array to store fetched menus
    userId!:string;

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {
    const token = localStorage.getItem('token');
    if (token) {
      this._isLoggedIn = true;
    }
  }

  ngOnInit(): void {
    // Check if the user is logged in
    if (this.authService.isLoggedIn()) {
      const userId = this.authService.getUserId(); // Retrieve the userId from the service

      // Navigate to the restaurant component only if it's the initial navigation after login
      if (!this.route.snapshot.queryParams['userId']) {
        this.router.navigate(['/'], { queryParams: { userId } });
        return; // Return early to prevent executing the code below
      }
    } else {
      // If the user is not logged in, fetch menus
      this.fetchMenus();
    }
  }




  fetchMenus(): void {
    this.http.get<MenuItem[]>('http://localhost:3000/menus').subscribe(
      (menus: MenuItem[]) => {
        this.menus = menus;
      },
      (error: any) => {
        console.error('Error fetching menus', error);
      }
    );
  }
}
