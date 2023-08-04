import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface User {
  id: string;
  address: string;
  phone: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private http: HttpClient) { }

  getUser(): Observable<User> {
    // Make an HTTP request to fetch the user's information from the backend
    return this.http.get<User>('http://localhost:3000/user');
  }
}
