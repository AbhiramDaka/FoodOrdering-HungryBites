import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../auth.service';
import { Restaurant } from '../Restaurant';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  username: string |any;
  password: string |any;
  role: string |any;
  restaurants:Restaurant[];

  private _isLoggedIn: boolean = false; // private backing field for isLoggedIn

  constructor(private http: HttpClient,private authService: AuthService, private router:Router) { }

  register() {
    const user = {
      username: this.username,
      password: this.password,
      role: this.role
    };

    this.http.post('http://localhost:3000/register', user)
      .subscribe(
        (response:any) => {
          console.log(response);
          alert('Registration Successful!');
          this.router.navigate(['/login']);

          // Handle success message or redirect to login page
        },
        error => {
          console.error(error);
          alert('Registration Failed!');
          // Handle error message
        }
      );
  }

  get isLoggedIn() {
    return this._isLoggedIn; // return the private backing field
  }
}
