import { JsonPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { of } from 'rxjs';
import { ProductDetailModel } from 'src/models/product-model';
import { BasketModel } from '../../models/basket-model';
import { NavigationEnd, Router } from '@angular/router';
import { CustomerService } from '../services/customer.service';
import { User } from '../models/user';
import { CartItem } from '../models/cart';
import { ProductService } from '../services/product.service';
import { Product } from '../models/product';

@Component({
  selector: 'app-basket',
  templateUrl: './basket.component.html',
  styleUrls: ['./basket.component.css'],
})
export class BasketComponent implements OnInit {
  customerInfo: User = new User();
  errMessage: string = '';
  cartItems: CartItem[] = [];
  totalItems: number = 0;
  totalPrice: number = 0;

  // cartItemTemp!: CartItem;

  // productTemp: Product = new Product();

  constructor(
    private _router: Router,
    private _cService: CustomerService,
    private _pService: ProductService
  ) {
    this._router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        window.scrollTo(0, 0); // Scroll to top of page
      }
    });

    this.getCustomerById();
  }

  ngOnInit(): void {}

  // check login
  checkLogin() {
    const token = localStorage.getItem('token')?.toString();
    const customerId = token?.replace(/"/g, '');
  }

  // get customer by Id
  getCustomerById() {
    const token = localStorage.getItem('token')?.toString();
    const customerId = token?.replace(/"/g, '');

    // Đã login
    if (typeof customerId !== 'undefined') {
      this._cService.getCustomerById(customerId).subscribe({
        next: (res) => {
          this.customerInfo = res;
          this.cartItems = res.cart;
          this.totalItems = this.cartItems.length;

          this.totalPrice = 0;
          for (let item of this.cartItems) {
            this.getProductById(item.productId, item.quantity);
          }
        },
        error: (err) => {
          this.errMessage = err;
        },
      });
    }
    // Chưa login
    else {
      const cartLocalStorage = localStorage.getItem('cart');
      let myArray: CartItem[] = [];

      // Chưa login: kiểm tra đã tồn tại cart trong localStorage chưa
      if (cartLocalStorage) {
        myArray = JSON.parse(cartLocalStorage);
        this.cartItems = myArray;

        this.totalPrice = 0;
        for (let item of this.cartItems) {
          this.getProductById(item.productId, item.quantity);
        }

        this.totalItems = this.cartItems.length;
      }
    }
  }

  // get product detail by id in url
  getProductById(id: any, quantity: number) {
    this._pService.getProduct(id).subscribe({
      next: (res) => {
        // this.productDetail = res;
        this.totalPrice += res.price * quantity;
      },
      error: (err) => {
        this.errMessage = err;
        console.log('Error occured while fetching file meta data');
      },
    });
  }

  // payment
  payment() {
    const token = localStorage.getItem('token')?.toString();
    const customerId = token?.replace(/"/g, '');

    // Đã login
    if (typeof customerId !== 'undefined') {
      this._router.navigate(['payment']);
    } else {
      this._router.navigate(['login']);
    }
  }
}
