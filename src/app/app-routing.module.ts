import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AboutUsComponent } from './about-us/about-us.component';
import { BlogComponent } from './blog/blog.component';
import { BasketComponent } from './basket/basket.component';
import { ContactComponent } from './contact/contact.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { HomePageComponent } from './home-page/home-page.component';
import { LoginComponent } from './login/login.component';
import { PaymentComponent } from './payment/payment.component';
import { PolicyComponent } from './policy/policy.component';
import { ProductDetailComponent } from './product-detail/product-detail.component';
import { ProductItemComponent } from './product-item/product-item.component';
import { ShopComponent } from './shop/shop.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { AccountInfoComponent } from './account-info/account-info.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { BlogDetailComponent } from './blog-detail/blog-detail.component';
import { WishlistComponent } from './wishlist/wishlist.component';
import { MyAccountComponent } from './my-account/my-account.component';
import { OrderComponent } from './order/order.component';

const routes: Routes = [
  { path: 'shop', component: ShopComponent },
  { path: 'product', component: ProductItemComponent },
  { path: '', component: HomePageComponent },
  { path: 'login', component: LoginComponent },
  { path: 'sign-up', component: SignUpComponent },
  { path: 'policy', component: PolicyComponent },
  { path: 'about-us', component: AboutUsComponent },
  { path: 'blog', component: BlogComponent },
  { path: 'about', component: AboutUsComponent },
  { path: 'shop/product-detail/:id', component: ProductDetailComponent },
  { path: 'basket', component: BasketComponent },
  { path: 'blog', component: BlogComponent },
  { path: 'payment', component: PaymentComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'account-info', component: AccountInfoComponent },
  { path: 'reset-password', component: ResetPasswordComponent },
  { path: 'blog/blog-detail/:id', component: BlogDetailComponent },
  { path: 'wishlist', component: WishlistComponent },
  { path: 'user/profile', component: MyAccountComponent },
  { path: 'user/order/:id', component: OrderComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
