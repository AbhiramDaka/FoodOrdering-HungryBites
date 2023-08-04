import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { RestaurantsComponent } from './restaurants/restaurants.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { CartComponent } from './cart/cart.component';
import { MenuItemsComponent } from './menuitems/menuitems.component';
import { MyordersComponent } from './myorders/myorders.component';
import { UserordersComponent } from './userorders/userorders.component';
import { AboutComponent } from './about/about.component';
import { AddRestaurantComponent } from './add-restaurant/add-restaurant.component';
import { MenuItemFormComponent } from './menu-item-form/menu-item-form.component';
import { StripePaymentComponent } from './stripe-payment/stripe-payment.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'about', component: AboutComponent },
  { path: 'menuitem', component: MenuItemFormComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'payment', component: StripePaymentComponent },
    { path: '', component: LandingPageComponent },
    { path: 'cart/:userId', component: CartComponent },
     { path: 'restaurants', component: RestaurantsComponent },
     { path: 'add-restaurants', component: AddRestaurantComponent },
     { path: 'orders/:userId/:orderId', component: MyordersComponent },
     { path: 'orders/:userId', component: UserordersComponent },
     { path: 'menu-items/:restaurantName/:userId', component: MenuItemsComponent },

];

@NgModule({
  imports: [RouterModule.forRoot(routes , {
    anchorScrolling: 'enabled',
    scrollPositionRestoration: 'enabled',
    scrollOffset: [0, 64] // Optional: Adjust the scroll offset to account for any fixed headers or other elements
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
