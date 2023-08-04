import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { User } from './User';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  userId: string | null = null; // Declare userId property with initial value null
  private userIdSubject: Subject<string | null> = new Subject<string | null>();

  private _isLoggedIn: boolean = false; // private backing field for isLoggedIn

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    if (this.authService.isLoggedIn()) {
      this.userId = this.authService.getUserId(); // Retrieve the userId from the service
    }

    this.authService.subscribeToUserIdChanges().subscribe(
      (userId: string | null) => {
        this.userId = userId;
      },
      (error: any) => {
        console.error('Error fetching user ID:', error);
      }
    );
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }
}
