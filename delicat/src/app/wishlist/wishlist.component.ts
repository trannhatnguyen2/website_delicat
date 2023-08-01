import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ProductService } from '../services/product.service';
import { Product } from '../models/product';
import { CustomerService } from '../services/customer.service';
import { User } from '../models/user';

@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.css'],
})
export class WishlistComponent {
  products: Product[] = [];
  wishlistProductIds: string[] = [];
  errMessage: string = '';

  isHaveProduct: boolean = true;

  sortFlag: 'asc' | 'des' = 'asc';

  customerInfo!: User;

  constructor(
    private _router: Router,
    private service: ProductService,
    private _cService: CustomerService
  ) {
    this.getCustomerById();
  }

  // get customer by Id
  getCustomerById() {
    // console.log('Vào get customer by id');
    const token = localStorage.getItem('token')?.toString();
    const customerId = token?.replace(/"/g, '');

    // Đã login
    if (typeof customerId !== 'undefined') {
      this._cService.getCustomerById(customerId).subscribe({
        next: (res) => {
          this.customerInfo = res;
          this.wishlistProductIds = res.wishlist;
          this.getProductsWishList();
        },
        error: (err) => {
          this.errMessage = err;
        },
      });
    }
    // Chưa login
    else {
      const wishlishLocalStorage = localStorage.getItem('wishlist');
      let myArray = [];

      // Chưa login: kiểm tra đã tồn tại wishlist trong localStorage chưa
      if (wishlishLocalStorage) {
        myArray = JSON.parse(wishlishLocalStorage);

        this.wishlistProductIds = myArray;

        if (this.wishlistProductIds.length != 0) {
          // this.isHaveProduct = true
          this.getProductsWishList();
        }
      }
    }
  }

  // check login
  getProductsWishList() {
    this.service.getProductsByIds(this.wishlistProductIds).subscribe({
      next: (res: any) => {
        this.products = res;

        if (this.products.length > 0) {
          this.isHaveProduct = false;
        }
      },
      error: (err) => {
        this.errMessage = err;
      },
    });
  }

  // oder by asc
  orderByPrice() {
    this.sortFlag = 'asc';
    this.products = this.products.sort((a, b) => a.price - b.price);
  }

  // oder by desc
  orderDescByPrice() {
    this.sortFlag = 'des';
    this.products = this.products.sort((a, b) => (a.price - b.price) * -1);
  }

  viewShop() {
    this._router.navigate(['shop']);
  }

  // get all items in shop
  getProducts() {
    this.service.getProducts().subscribe({
      next: (res: any) => {
        this.products = res;

        if (this.products.length > 0) {
          this.isHaveProduct = false;
        }
      },
      error: (err) => {
        this.errMessage = err;
        console.log('Error occured while fetching file meta data');
      },
    });
  }
}
