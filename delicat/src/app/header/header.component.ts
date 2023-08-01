import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CustomerService } from '../services/customer.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  countWishlist: string = '0';
  countCart: string = '0';
  errMessage: string = '';

  constructor(private _router: Router, private _cService: CustomerService) {}

  ngOnInit(): void {
    this.getCustomerById();
  }

  isSearchOpen: boolean = false;

  toggleSearch() {
    this.isSearchOpen = !this.isSearchOpen;
  }

  checkLogin() {
    if (localStorage.getItem('token') == null) {
      this._router.navigate(['login']);
    } else {
      this._router.navigate(['user/profile']);
    }
  }

  // get customer by Id
  getCustomerById() {
    // console.log('Vào get customer by id');
    const token = localStorage.getItem('token')?.toString();
    const customerId = token?.replace(/"/g, '');

    // Chưa login
    if (typeof token === 'undefined') {
      const wishlishLocalStorage = localStorage.getItem('wishlist');
      const cartLocalStorage = localStorage.getItem('cart');

      // check wishlist in localStorage
      if (wishlishLocalStorage) {
        this.countWishlist = JSON.parse(wishlishLocalStorage).length;
      }

      // check cart in localStorage
      if (cartLocalStorage) {
        this.countCart = JSON.parse(cartLocalStorage).length;
      }
    }

    // Đã login
    if (customerId != null) {
      this._cService.getCustomerById(customerId).subscribe({
        next: (res) => {
          this.countWishlist = res.wishlist.length.toString();
          this.countCart = res.cart.length.toString();
        },
        error: (err) => {
          this.errMessage = err;
        },
      });
    }
  }
}
