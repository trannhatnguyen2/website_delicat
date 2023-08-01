import { Component, Input, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { OrderService } from '../services/order.service';
import { CustomerService } from '../services/customer.service';
import { User } from '../models/user';
import { Order } from '../models/order';
import { ProductService } from '../services/product.service';
import { CartItem } from '../models/cart';
import { SaleProducts } from '../models/saleProduc';
import { Product } from '../models/product';
import { Observable, map, forkJoin } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css'],
})
export class PaymentComponent implements OnInit {
  orderDetail: Order = new Order();
  customerInfo: User = new User();
  cartItems: CartItem[] = [];
  totalItems: number = 0;
  totalPrice: number = 0;

  fullName: string = '';
  phone: string = '';
  address: string = '';
  currentDate: string = '';

  errMessage: string = '';

  orderToSave: Order = new Order();
  saleProductToSave: SaleProducts[] = [];
  unitPriceTemp: number = 0;

  constructor(
    private _router: Router,
    private _oService: OrderService,
    private _cService: CustomerService,
    private _pService: ProductService
  ) {
    this._router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        window.scrollTo(0, 0); // Scroll to top of page
      }
    });
    this.getProducts();

    this.getCustomerById();
    this.convertCurrentDate();
  }

  ngOnInit(): void {
    for (let item of this.cartItems) {
      // tính totalPrice
      this.unitPriceTemp = 0;
      this.getProductById(item.productId, item.quantity);

      const saleProductTemp = new SaleProducts();
      saleProductTemp.productId = item.productId;
      saleProductTemp.quantity = item.quantity;
      saleProductTemp.description = item.description;
      saleProductTemp.unitPrice = 0;

      this.saleProductToSave.push(saleProductTemp);
      console.log(this.saleProductToSave);
    }
  }

  // get customer by Id
  getCustomerById() {
    // console.log('Vào get customer by id');
    const token = localStorage.getItem('token')?.toString();
    const customerId = token?.replace(/"/g, '');

    if (typeof customerId !== 'undefined') {
      this._cService.getCustomerById(customerId).subscribe({
        next: (res) => {
          this.customerInfo = res;

          this.fullName = this.customerInfo.fullName;
          this.phone = this.customerInfo.phone;
          this.address = this.customerInfo.address;

          this.cartItems = res.cart;
          this.totalItems = this.cartItems.length;

          this.totalPrice = 0;
          for (let item of this.cartItems) {
            // tính totalPrice
            this.unitPriceTemp = 0;
            this.getProductById(item.productId, item.quantity);

            const saleProductTemp = new SaleProducts();
            saleProductTemp.productId = item.productId;
            saleProductTemp.quantity = item.quantity;
            saleProductTemp.description = item.description;
            saleProductTemp.unitPrice = 0;

            this.saleProductToSave.push(saleProductTemp);
          }
        },
        error: (err) => {
          this.errMessage = err;
        },
      });
    }
  }

  // check login
  getProductById(productId: string, quantity: number) {
    this._pService.getProduct(productId).subscribe({
      next: (res: any) => {
        this.totalPrice += res.price * quantity;
        this.unitPriceTemp = res.price;
      },
      error: (err) => {
        this.errMessage = err;
      },
    });
  }

  products: Product[] = [];

  // get all items in shop
  getProducts() {
    this._pService.getProducts().subscribe({
      next: (res: any) => {
        this.products = res;
        for (let item of this.saleProductToSave) {
          item.unitPrice =
            this.products.find((p) => p.id === item.productId)?.price || 0;
        }
      },
      error: (err) => {
        this.errMessage = err;
        console.log('Error occured while fetching file meta data');
      },
    });
  }

  setOrderToSave(paymentMethod: string) {
    // this.orderToSave.id = 'SO004';
    this.orderToSave.customerId = this.customerInfo.id;
    this.orderToSave.dateCreated = this.currentDate;
    // this.orderToSave.dateCreated = '2023-05-11';
    this.orderToSave.deliveryAddress = this.address;

    this.orderToSave.saleProducts = this.saleProductToSave;
    this.orderToSave.status = 'pending';

    for (let item of this.saleProductToSave) {
      this.orderToSave.total += item.unitPrice * item.quantity;
    }
    this.orderToSave.paymentMethod = paymentMethod;

    console.log(this.orderToSave);
    this.saveOrder();

    // save changes
    this.customerInfo.order.push(this.orderToSave.id);
    this.saveOrderToCustomer();
    this.removeCartItem();
  }

  convertCurrentDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = ('0' + (today.getMonth() + 1)).slice(-2);
    const day = ('0' + today.getDate()).slice(-2);

    this.currentDate = year + '-' + month + '-' + day;
  }

  saveOrder() {
    this._oService.saveMetaDataOfFile(this.orderToSave);
  }

  viewOrder(orderId: string) {
    this._router.navigate(['user/order', orderId]);
  }

  // save customer Info by Id
  saveOrderToCustomer() {
    this._cService.saveMetaDataOfFile(this.customerInfo);
  }

  removeCartItem() {
    this._cService.deleteCart(this.orderToSave.customerId);
  }
}
