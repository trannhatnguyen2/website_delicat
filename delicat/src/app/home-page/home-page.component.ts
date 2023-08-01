import { keyframes } from '@angular/animations';
import { JsonPipe } from '@angular/common';
import { TagContentType } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { ProductModel } from 'src/models/product-model';
import { ApiService } from 'src/services/api.service';
import { ProductService } from '../services/product.service';
import { Router } from '@angular/router';
import { Product } from '../models/product';
import { User } from '../models/user';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css'],
})
export class HomePageComponent implements OnInit {
  itemBestSeller = ['S001', 'S002', 'S003', 'S004'];
  itemBestSellerShow: Product[] = [];

  itemNew = ['A002', 'A003', 'A004', 'S001', 'S002', 'S003', 'S004', 'S005'];
  itemNewShow: Product[] = [];

  checkSize!: boolean;

  //===================//
  customerInfo!: User;
  wishlishLocalStorage: string[] = [];

  constructor(
    private api: ApiService,
    private service: ProductService,
    private _router: Router
  ) {}

  async ngOnInit(): Promise<void> {
    if (window.innerWidth < 1024) {
      this.checkSize = false;
    } else {
      this.checkSize = true;
    }

    await this.getProductBestSeller();
    await this.getProductNew();
  }

  // getProducts() {
  //   this.service.getProductsByIds().subscribe({
  //     next: (res: any) => {
  //       this.products = res;

  //       this.listItems = res;
  //       this.templistItems = this.listItems;
  //       this.templistItemsFinal = this.listItems;
  //     },
  //     error: (err) => {
  //       this.errMessage = err;
  //       console.log('Error occured while fetching file meta data');
  //     },
  //   });
  // }

  getProductBestSeller() {
    for (let i = 0; i < this.itemBestSeller.length; i++) {
      this.service
        .getProduct(this.itemBestSeller[i])
        .subscribe((p) => this.itemBestSellerShow.push(p));
    }
  }

  getProductNew() {
    for (let i = 0; i < this.itemNew.length; i++) {
      this.service
        .getProduct(this.itemNew[i])
        .subscribe((p) => this.itemNewShow.push(p));
    }
  }

  viewShop() {
    this._router.navigate(['shop']);
  }

  //=============== OLD ===============//
  // listItems!: ProductModel[];

  // templistItems!: ProductModel[];

  // templistItemsFinal!: ProductModel[];

  // tempListItemsBestSeller: ProductModel[] = [];

  // tempListItemsNewProduct: ProductModel[] = [];

  // checkTag!: boolean;

  // async loadListItems() {
  //   let jsonItemsSuit = await this.api.loadDataJson(
  //     '../../assets/data/products_suit.json'
  //   );

  //   let jsonItemsAccessories = await this.api.loadDataJson(
  //     '../../assets/data/products_accessories.json'
  //   );

  //   this.listItems = jsonItemsSuit.concat(jsonItemsAccessories);

  //   // Gán mảng tạm để filter
  //   this.templistItems = this.listItems;
  //   // this.templistItemsFinal = this.listItems;
  // }

  // await this.loadListItems();
  // for (let i = 0; i < 4; i++) {
  //   this.tempListItemsBestSeller.push(this.templistItems[i]);
  // }

  // for (let i = this.templistItems.length - 1; i > 3; i--) {
  //   this.tempListItemsNewProduct.push(this.templistItems[i]);
  // }
}
