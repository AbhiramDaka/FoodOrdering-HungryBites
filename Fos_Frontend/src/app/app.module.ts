import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { RestaurantsComponent } from './restaurants/restaurants.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CartComponent } from './cart/cart.component';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { MenuItemsComponent } from './menuitems/menuitems.component';
import { MyordersComponent } from './myorders/myorders.component';
import { UserordersComponent } from './userorders/userorders.component';
import { AboutComponent } from './about/about.component';
import { AddRestaurantComponent } from './add-restaurant/add-restaurant.component';
import { MenuItemFormComponent } from './menu-item-form/menu-item-form.component';
import { StripePaymentComponent } from './stripe-payment/stripe-payment.component';

@NgModule({
  declarations: [
    AppComponent,
    LandingPageComponent,
    RestaurantsComponent,

    CartComponent,
    RegisterComponent,
    LoginComponent,
    MenuItemsComponent,
    MyordersComponent,
    UserordersComponent,
    AboutComponent,
    AddRestaurantComponent,
    MenuItemFormComponent,
    StripePaymentComponent

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
