import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../services/product.service';
import { Product, ProductDetail } from '../models/product';
import { async } from 'rxjs';
import { CartItem } from '../models/cart';
import { CustomerService } from '../services/customer.service';
import { User } from '../models/user';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css'],
})
export class ProductDetailComponent implements OnInit {
  // sản phẩm chi tiết để hiện UI
  productDetail: Product = new Product();

  // sản phẩm bán được thêm vào cart
  productDetailBuy: ProductDetail = new ProductDetail();

  // get customerInfo --> cart
  customer: User = new User();

  mainImg: string = '';
  subImg_0: string = '';
  subImg_1: string = '';
  subImg_2: string = '';
  ratingStar: number[] = [];
  ratingStarGray: number[] = [];
  errMessage: any;

  selectSizeDefault: string = '';
  selectColorDefault: string = '';
  sizeChecked: string = '';
  colorChecked: string = '';

  constructor(
    private activateRoute: ActivatedRoute,
    private _router: Router,
    private service: ProductService,
    private _cService: CustomerService
  ) {
    activateRoute.paramMap.subscribe((param) => {
      let id = param.get('id');

      if (id != null) {
        this.getProductById(id);
      }
    });
  }

  ngOnInit() {}

  //=========================//
  // get customer by Id

  // get product detail by id in url
  getProductById(id: any) {
    this.service.getProduct(id).subscribe({
      next: (res: any) => {
        this.productDetail = res;

        this.mainImg = this.productDetail.imgURL[0];
        this.subImg_0 = this.productDetail.imgURL[0];
        this.subImg_1 = this.productDetail.imgURL[1];
        this.subImg_2 = this.productDetail.imgURL[2];
        this.selectSizeDefault = this.productDetail.size[0];
        this.selectColorDefault = this.productDetail.color[0];
        this.sizeChecked = this.productDetail.size[0];
        this.colorChecked = this.productDetail.color[0];

        this.setProductToBuy();
      },
      error: (err) => {
        this.errMessage = err;
        console.log('Error occured while fetching file meta data');
      },
    });
  }

  setProductToBuy() {
    this.productDetailBuy.id = this.productDetail.id;
    this.productDetailBuy.name = this.productDetail.name;
    this.productDetailBuy.type = this.productDetail.type;
    this.productDetailBuy.price = this.productDetail.price;
    this.productDetailBuy.imgURL = this.productDetail.imgURL;
    this.productDetailBuy.describe = this.productDetail.describe;
    this.productDetailBuy.tag = this.productDetail.tag;
    this.productDetailBuy.size = this.productDetail.size[0];
    this.productDetailBuy.color = this.productDetail.color[0];
    this.productDetailBuy.reviews = this.productDetail.reviews;
    this.productDetailBuy.quantity = 1;
  }

  // change img show
  changeImg(event: Event) {
    this.mainImg = (event.target as HTMLImageElement).src;
  }

  changeSize(event: Event, size: string) {
    if ((event.target as HTMLInputElement).checked) {
      this.productDetailBuy.size = size;
      this.selectSizeDefault = this.productDetailBuy.size;
      this.sizeChecked = this.selectSizeDefault;
    } else {
      this.productDetailBuy.size = ' ';
      this.selectSizeDefault = '';
      this.sizeChecked = '';
    }
  }

  // change color to buy
  changeColor(event: Event, color: string) {
    if ((event.target as HTMLInputElement).checked) {
      this.productDetailBuy.color = color;
      this.selectColorDefault = this.productDetailBuy.color;
      this.colorChecked = this.selectColorDefault;
    } else {
      this.productDetailBuy.color = ' ';
      this.selectColorDefault = '';
      this.colorChecked = '';
    }
  }

  // change quantity to buy
  changeQuantity(quantity: number) {
    if (this.productDetailBuy.quantity <= 0 && quantity < 0) {
      this.productDetailBuy.quantity == 0;
      return;
    }
    this.productDetailBuy.quantity += quantity;
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

  // add to Cart()
  addToCart(type: string) {
    const cartItem = new CartItem();
    cartItem.id = this.productDetailBuy.id;
    cartItem.productId = this.productDetailBuy.id;
    cartItem.quantity = this.productDetailBuy.quantity;
    cartItem.description =
      this.productDetailBuy.color + ',' + this.productDetailBuy.size;

    // get token
    const token = localStorage.getItem('token')?.toString();
    const customerId = token?.replace(/"/g, '');

    // Đã login
    if (typeof customerId !== 'undefined') {
      this._cService.saveCart(customerId, cartItem);
      // this.viewBasket();
    }
    // Chưa login
    else {
      const cartLocalStorage = localStorage.getItem('cart');
      let myArray: CartItem[] = [];

      if (cartLocalStorage) {
        // Đã có cart dưới localStorage
        myArray = JSON.parse(cartLocalStorage);

        const itemExists = myArray.some((item) => item.id === cartItem.id);

        if (!itemExists) {
          myArray.push(cartItem);

          localStorage.setItem('cart', JSON.stringify(myArray));
        } else {
          alert('Item already exits in cart!');
        }
      }
      // Chưa tổn tại cart dưới localStorage --> Tạo cart dưới localStorage
      else {
        myArray.push(cartItem);
        localStorage.setItem('cart', JSON.stringify(myArray));
      }
    }

    if (type === 'buy') {
      this.viewBasket();
    }
  }

  viewBasket() {
    this._router.navigate(['basket']);
  }

  viewPayment() {
    this._router.navigate(['payment']);
  }
}
