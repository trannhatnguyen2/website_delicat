import { Component, Input, OnInit } from '@angular/core';
import { Product } from '../models/product';
import { Router } from '@angular/router';
import { CustomerService } from '../services/customer.service';
import { User } from '../models/user';

@Component({
  selector: 'app-product-item-wishlist',
  templateUrl: './product-item-wishlist.component.html',
  styleUrls: ['./product-item-wishlist.component.css'],
})
export class ProductItemWishlistComponent {
  @Input() productDetail!: Product;
  @Input() customerInfo!: User;

  ratingStar: number[] = [];
  ratingStarGray: number[] = [];
  countReviews: number = 0;
  errMessage: string = '';

  constructor(private _router: Router, private _cService: CustomerService) {}

  ngOnInit(): void {
    // get count reviews of item
    this.countReviews = this.productDetail.reviews.length;

    // get rating star avg
    this.ratingStar = Array(this.getRatingStar()).fill(0);
    this.ratingStarGray = Array(5 - this.ratingStar.length).fill(0);
  }

  // get rating star of item
  getRatingStar() {
    var totalStar: number[] = [];
    var ratingStar = 0;

    for (let i = 0; i < this.productDetail.reviews.length; i++) {
      totalStar.push(this.productDetail.reviews[i].ratingComment);
    }

    ratingStar = Math.round(
      totalStar.reduce((acc, val) => acc + val, 0) / totalStar.length
    );

    return ratingStar;
  }

  // virew item detail
  viewProductDetail(f: any) {
    this._router.navigate(['shop/product-detail', f.id]);
  }

  // remove item in wishlist
  removeWishlist(productId: string) {
    const token = localStorage.getItem('token')?.toString();
    const customerId = token?.replace(/"/g, '');

    // Chưa login --> Lưu vào localStorage
    if (typeof token === 'undefined') {
      const wishlishLocalStorage = localStorage.getItem('wishlist');
      let myArray = [];

      if (wishlishLocalStorage) {
        // Đã có
        myArray = JSON.parse(wishlishLocalStorage);

        myArray = myArray.filter(
          (element: any) => !productId.includes(element)
        );

        // lưu lại localStorages
        localStorage.setItem('wishlist', JSON.stringify(myArray));
        window.location.reload();
      }
    }

    // Đã login
    if (typeof customerId !== 'undefined') {
      this.customerInfo.wishlist = this.customerInfo.wishlist.filter(
        (element) => !productId.includes(element)
      );

      // save changes
      this.saveCustomerInfo();
    }
  }

  // save customer Info by Id
  saveCustomerInfo() {
    const token = localStorage.getItem('token')?.toString();
    const customerId = token?.replace(/"/g, '');

    if (customerId == null) {
      this._router.navigate(['login']);
    } else {
      this._cService.saveMetaDataOfFile(this.customerInfo);
    }
  }
}
