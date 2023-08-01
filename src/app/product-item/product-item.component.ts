import { Component, Input, OnInit } from '@angular/core';
import { ProductModel } from 'src/models/product-model';
import { Product } from '../models/product';
import { Router } from '@angular/router';
import { User } from '../models/user';
import { CustomerService } from '../services/customer.service';

@Component({
  selector: 'app-product-item',
  templateUrl: './product-item.component.html',
  styleUrls: ['./product-item.component.css'],
})
export class ProductItemComponent implements OnInit {
  @Input() productDetail!: Product;
  @Input() customerInfo!: User;

  ratingStar: number[] = [];
  ratingStarGray: number[] = [];
  countReviews: number = 0;

  constructor(private _router: Router, private _cService: CustomerService) {}

  ngOnInit(): void {
    console.log(this.productDetail.id);

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

  // add item in wishlist
  addWishlist(productId: string) {
    const token = localStorage.getItem('token')?.toString();
    const customerId = token?.replace(/"/g, '');

    // Chưa login --> Lưu vào localStorage
    if (typeof token === 'undefined') {
      const wishlishLocalStorage = localStorage.getItem('wishlist');
      let myArray: string[] = [];

      // Chưa login: kiểm tra đã tồn tại wishlist trong localStorage chưa
      if (wishlishLocalStorage) {
        // Đã có
        myArray = JSON.parse(wishlishLocalStorage);

        if (!myArray.includes(productId)) {
          myArray.push(productId);

          // lưu lại localStorage
          localStorage.setItem('wishlist', JSON.stringify(myArray));
        } else {
          alert('Item already exists in wishlist!');
        }
      }
      // Chưa tổn tại wishlist dưới localStorage --> Tạo wishlist dưới localStorage
      else {
        myArray.push(productId);
        localStorage.setItem('wishlist', JSON.stringify(myArray));
      }
    }

    // Đã login
    if (typeof customerId !== 'undefined') {
      // Check item already in wishlist

      // Not include --> Add to wishlist
      if (!this.customerInfo.wishlist.includes(productId)) {
        this.customerInfo.wishlist.push(productId);

        // save changes
        this.saveCustomerInfo(customerId);
      }
      // Included --> Not add to wishlist
      else {
        alert('Item already exists in wishlist!');
        // console.log('Item đã tổn tại trong wishlist');
      }
    }
  }

  // save customer Info by Id
  saveCustomerInfo(customerId: string) {
    if (customerId == null) {
      this._router.navigate(['login']);
    } else {
      this._cService.saveMetaDataOfFile(this.customerInfo);
    }
  }

  // virew item detail
  viewProductDetail(f: any) {
    this._router.navigate(['shop/product-detail', f.id]);
  }
}
