import { HttpClient } from "@angular/common/http";
import { EventEmitter, Injectable } from "@angular/core";
import { Observable, Subject, tap } from "rxjs";
import { Cart, CartItem } from "./Cart";
import { MenuItem } from "./MenuItem";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000';
  private token: string | null;
  private _isLoggedIn = false;
  private userId: string | null;

  private userIdSubject: Subject<string | null> = new Subject<string | null>();

  // authChange: Subject<boolean> = new Subject<boolean>();
  authChange: EventEmitter<boolean> = new EventEmitter<boolean>(); // Add EventEmitter

  constructor(private http: HttpClient) {
    this.token = localStorage.getItem('token');
    this._isLoggedIn = this.token !== null;
    this.userId = localStorage.getItem('userId');

  }
  getCartId(): string | null {
    return localStorage.getItem('cartId');
  }


    // Method to subscribe to userId changes
    subscribeToUserIdChanges(): Observable<string | null> {
      return this.userIdSubject.asObservable();
    }

  setUserId(userId: string): void {
    this.userId = userId;
    localStorage.setItem('userId', userId);
  }




  getUserId(): string | null {
    return this.userId;
  }


  isLoggedIn(): boolean {
    // Check if the user ID is set to determine the logged-in state
    return !!this.userId;
  }

  login(username: string, password: string, role: string): Observable<any> {
    this.authChange.emit(true); // Emit event when user logs in

    return this.http.post<{ token: string, userId: string }>(`${this.apiUrl}/login`, { username, password, role })
      .pipe(tap(res => {
        this.setToken(res.token);
        this.setUserId(res.userId);
        this.authChange.next(true);
      }));

  }

  logout(): void {
    this.authChange.emit(false); // Emit event when user logs out

    this.token = null;
    localStorage.removeItem('token');
    this._isLoggedIn = false;
    localStorage.removeItem('userId');
    this.userId = null;
    this.authChange.next(false);
  }

  getToken(): string | null {
    return this.token;
  }

  getRestaurants(): Observable<any> {
    return this.http.get(`${this.apiUrl}/restaurants`, { headers: { Authorization: `Bearer ${this.token}` } });
  }

  getUsers(): Observable<any> {
    return this.http.get(`${this.apiUrl}/users`, { headers: { Authorization: `Bearer ${this.token}` } });
  }

  getCartItems(){
    return this.http.get<CartItem[]>(`${this.apiUrl}/cart/${this.userId}`, { headers: { Authorization: `Bearer ${this.token}` } }) as Observable<CartItem[]>;
  }

  updateCart(cart: Cart): Observable<any> {
    return this.http.delete<Cart>(`http://localhost:3000/cart/${cart._id}`);
  }



  clearCartItem(cartId: string, itemId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/cart/${cartId}/item/${itemId}`);
  }



  setToken(token: string) {
    this.token = token;
    localStorage.setItem('token', token);
    this._isLoggedIn = true;
  }

  clearToken(): void {
    this.token = null;
    localStorage.removeItem('token');
    this._isLoggedIn = false;
  }
}
