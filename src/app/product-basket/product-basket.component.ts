import { Component, Input, OnInit } from '@angular/core';
import { BasketModel } from 'src/models/basket-model';
import { ProductDetailModel, ProductModel } from 'src/models/product-model';
import { ApiService } from 'src/services/api.service';
import { Product } from '../models/product';
import { CustomerService } from '../services/customer.service';
import { Router } from '@angular/router';
import { CartItem } from '../models/cart';
import { ProductService } from '../services/product.service';

@Component({
  selector: 'app-product-basket',
  templateUrl: './product-basket.component.html',
  styleUrls: ['./product-basket.component.css'],
})
export class ProductBasketComponent implements OnInit {
  @Input() cartItem!: CartItem;

  productDetail: Product = new Product();

  sizeChose: string = '';
  colorChose: string = '';

  errMessage: string = '';

  constructor(
    private _cService: CustomerService,
    private _pService: ProductService,
    private _router: Router
  ) {}

  ngOnInit(): void {
    this.getProductById(this.cartItem.productId);
    const describe = this.splitDescribe(this.cartItem.description);
    this.sizeChose = describe[0];
    this.colorChose = describe[1];
  }

  // get product detail by id in url
  getProductById(id: any) {
    this._pService.getProduct(id).subscribe({
      next: (res) => {
        this.productDetail = res;
      },
      error: (err) => {
        this.errMessage = err;
        console.log('Error occured while fetching file meta data');
      },
    });
  }

  splitDescribe(describe: string): [string, string] {
    var temp = describe.split(',');
    var color = temp[0];
    var size = temp[1];
    return [size, color];
  }

  // change quantity
  changeQuantity(quantity: number) {
    if (this.cartItem.quantity <= 1 && quantity < 0) {
      this.cartItem.quantity == 0;
      this.removeFromBasket();
      return;
    }
    this.cartItem.quantity += quantity;

    this.updateQuantity(this.cartItem);
  }

  // remove item
  removeFromBasket() {
    const token = localStorage.getItem('token')?.toString();
    const customerId = token?.replace(/"/g, '');

    // Đã login
    if (typeof customerId !== 'undefined') {
      // this._cService.saveCart(customerId, cartItem);
      this._cService.deleteCartItem(customerId, this.cartItem);
    }
    // Chưa login --> Lưu localStorage
    else {
      const cartLocalStorage = localStorage.getItem('cart');
      let myArray: CartItem[] = [];

      // Chưa login: kiểm tra đã tồn tại cart trong localStorage chưa
      if (cartLocalStorage) {
        myArray = JSON.parse(cartLocalStorage);

        const itemExists = myArray.some((item) => item.id === this.cartItem.id);

        if (itemExists) {
          myArray = myArray.filter((item) => item.id !== this.cartItem.id);

          localStorage.setItem('cart', JSON.stringify(myArray));
          window.location.reload();
        } else {
          alert('Item not already exits in cart!');
        }
      }
    }
  }

  // update quantity
  updateQuantity(cartItem: CartItem) {
    const token = localStorage.getItem('token')?.toString();
    const customerId = token?.replace(/"/g, '');

    // Đã login
    if (typeof customerId !== 'undefined') {
      this._cService.saveCart(customerId, cartItem);
    }
    // Chưa login --> Check localStorage
    else {
      const cartLocalStorage = localStorage.getItem('cart');
      let myArray: CartItem[] = [];

      // Chưa login: kiểm tra đã tồn tại cart trong localStorage chưa
      if (cartLocalStorage) {
        myArray = JSON.parse(cartLocalStorage);

        const itemExists = myArray.some((item) => item.id === cartItem.id);

        if (itemExists) {
          let itemToUpdate = myArray.find((item) => item.id === cartItem.id);

          if (itemToUpdate) {
            itemToUpdate.quantity = cartItem.quantity;
            localStorage.setItem('cart', JSON.stringify(myArray));
          }
          // myArray.push(cartItem);

          localStorage.setItem('cart', JSON.stringify(myArray));
          window.location.reload();
        } else {
          alert('Item not already exits in cart!');
        }
      }
    }
  }

  // view productDetail
  viewProductDetail(productId: string) {
    this._router.navigate(['shop/product-detail', productId]);
  }
}
