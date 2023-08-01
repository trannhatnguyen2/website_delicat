import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OrderService } from '../services/order.service';
import { Order } from '../models/order';
import { CustomerService } from '../services/customer.service';
import { User } from '../models/user';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css'],
})
export class OrderComponent {
  customerInfo: User = new User();
  orderDetail: Order = new Order();
  errMessage: string = '';

  totalItems: number = 0;

  constructor(
    private activateRoute: ActivatedRoute,
    private _oService: OrderService,
    private _cService: CustomerService,
    private _router: Router
  ) {
    activateRoute.paramMap.subscribe((param) => {
      let id = param.get('id');

      if (id != null) {
        // this.getProductById(id);
        this.getOrderByIdShow(id);
      }
    });
  }

  ngOnInit() {
    this.getCustomerById();
  }

  // get product by id
  getOrderByIdShow(orderId: string) {
    this._oService.getOrderById(orderId).subscribe({
      next: (res) => {
        this.orderDetail = res;
        console.log(res);
        this.totalItems = this.orderDetail.saleProducts.length;
      },
      error: (err) => {
        this.errMessage = err;
      },
    });
  }

  // get customer by id
  getCustomerById() {
    // console.log('Vào get customer by id');
    const token = localStorage.getItem('token')?.toString();
    const customerId = token?.replace(/"/g, '');

    if (customerId == null) {
      this._router.navigate(['login']);
    } else {
      this._cService.getCustomerById(customerId).subscribe({
        next: (res) => {
          this.customerInfo = res;
        },
        error: (err) => {
          this.errMessage = err;
        },
      });
    }
  }
}
