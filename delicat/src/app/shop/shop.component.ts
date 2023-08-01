import { keyframes } from '@angular/animations';
import { JsonPipe } from '@angular/common';
import { TagContentType } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { ProductModel } from 'src/models/product-model';
import { ApiService } from 'src/services/api.service';
import { ProductService } from '../services/product.service';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Product } from '../models/product';
import { CustomerService } from '../services/customer.service';
import { Router } from '@angular/router';
import { User } from '../models/user';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.css'],
})
export class ShopComponent implements OnInit {
  checkSize!: boolean;

  //Test
  templistItemsPrice: Product[] = [];

  checkFirstFilter: boolean = true;

  previousPriceFilter: number = 500;

  sortFlag: 'asc' | 'des' = 'asc';

  listItems: Product[] = [];

  templistItems: Product[] = [];

  templistItemsFinal: Product[] = [];

  arrayFilter: Map<string, string[]> = new Map<string, string[]>();

  //===================//
  products: Product[] = [];
  errMessage: string = '';

  searchProduct: string = '';

  //===================//
  customerInfo!: User;
  wishlishLocalStorage: string[] = [];

  constructor(
    // private api: ApiService,
    private _pService: ProductService,
    private fireStorage: AngularFireStorage,
    private _cService: CustomerService,
    private _router: Router
  ) {}

  ngOnInit(): void {
    if (window.innerWidth < 1024) {
      this.checkSize = false;
    } else {
      this.checkSize = true;
    }

    this.arrayFilter.set('size', []);
    this.arrayFilter.set('color', []);
    this.arrayFilter.set('tag', []);

    // this.loadListItems();

    //===================//
    this.getProducts();
    console.log(this.products);

    //===================//
    this.getCustomerById();
    console.log(this.products);
  }

  // get customer by Id
  getCustomerById() {
    // check login
    const token = localStorage.getItem('token')?.toString();
    const customerId = token?.replace(/"/g, '');

    // Đã login --> lưu vào customerInfo
    if (customerId !== 'undefined') {
      this._cService.getCustomerById(customerId).subscribe({
        next: (res) => {
          this.customerInfo = res;
        },
        error: (err) => {
          this.errMessage = err;
        },
      });
    }
    // Chưa login --> Lưu vào localStorage
    else {
      // const wishlishLocalStorage = localStorage.getItem('wishlist');
      // const cartLocalStorage = localStorage.getItem('cart');
      // localStorage.setItem(
      //   'wishlist',
      //   JSON.stringify(this.wishlishLocalStorage)
      // );
    }
  }

  // get all items in shop
  getProducts() {
    this._pService.getProducts().subscribe({
      next: (res: any) => {
        this.products = res;

        this.listItems = res;

        for (let item of this.listItems) {
          item.tag = item.tag.toLowerCase();
        }

        this.templistItems = this.listItems;
        this.templistItemsFinal = this.listItems;
      },
      error: (err) => {
        this.errMessage = err;
        console.log('Error occured while fetching file meta data');
      },
    });
  }

  // filter all items
  filter(event: Event, stringFilter: string, typeFilter: string) {
    let includeFilter: boolean = this.arrayFilter
      .get(typeFilter)!
      .includes(stringFilter);

    if ((event.target as HTMLInputElement).checked) {
      if (!includeFilter) {
        this.arrayFilter.get(typeFilter)!.push(stringFilter);
      }
    } else {
      this.arrayFilter
        .get(typeFilter)
        ?.splice(this.arrayFilter.get(typeFilter)!.indexOf(stringFilter), 1);
    }
    console.log('array filter: ', this.arrayFilter);

    this.templistItems = [];

    /* Mã giả
    foreach i in list:
      if filter: i == true then
        arr.push(i)
      return arr
    */
    // Xử lý filter

    this.templistItems = this.listItems.filter((product) => {
      let result: boolean = true;
      [...this.arrayFilter.keys()].forEach((k) => {
        if (this.arrayFilter.get(k)!.length > 0) {
          switch (typeof product[k as keyof Product]) {
            case 'string':
              if (
                !this.arrayFilter
                  .get(k)!
                  .includes(product[k as keyof Product] as string)
              ) {
                result = false;
                return;
              }
              //console.log('key string');
              break;
            case 'number':
              //console.log('key number');
              break;
            default:
              //console.log('key default');
              let valueProps = product[k as keyof Product] as string[];
              let matchCount: number = 0;
              this.arrayFilter.get(k)!.forEach((f) => {
                if (valueProps.includes(f)) {
                  matchCount++;
                }
              });
              if (matchCount <= 0) {
                result = false;
                return;
              }
              break;
          }
        }
      });
      this.checkFirstFilter = false;
      return result;
    });
    console.log(this.templistItems);
    this.filterPrice(this.previousPriceFilter.toString());
  }

  // filter price in range (0,500)
  filterPrice(price: string) {
    this.previousPriceFilter = Number(price);
    console.log(this.previousPriceFilter.toString());
    this.templistItemsFinal = this.templistItems.filter(
      (p) => p.price <= this.previousPriceFilter
    );
    switch (this.sortFlag) {
      case 'asc':
        this.orderByPrice();
        break;
      case 'des':
        this.orderDescByPrice();
        break;
    }
  }

  // oder by asc
  orderByPrice() {
    this.sortFlag = 'asc';
    this.templistItemsFinal = this.templistItemsFinal.sort(
      (a, b) => a.price - b.price
    );
  }

  // oder by desc
  orderDescByPrice() {
    this.sortFlag = 'des';
    this.templistItemsFinal = this.templistItemsFinal.sort(
      (a, b) => (a.price - b.price) * -1
    );
  }

  // search
  search() {
    this.templistItemsFinal = [];
    for (let i = 0; i < this.listItems.length; i++) {
      const product = this.listItems[i];
      if (
        product.name.toLowerCase().includes(this.searchProduct.toLowerCase())
      ) {
        this.templistItemsFinal.push(product);
      }
    }
  }

  resetItem() {
    this.searchProduct = '';
    this.templistItemsFinal = this.listItems;
  }
}
