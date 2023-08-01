import { Component, Input } from '@angular/core';
import { OrderService } from '../services/order.service';
import { Router } from '@angular/router';
import { Order } from '../models/order';
import { SaleProducts } from '../models/saleProduc';
import { ProductService } from '../services/product.service';

@Component({
  selector: 'app-order-item',
  templateUrl: './order-item.component.html',
  styleUrls: ['./order-item.component.css'],
})
export class OrderItemComponent {
  @Input() orderId!: string;

  orderDetail: Order = new Order();

  orderItemShow: SaleProducts = new SaleProducts();
  imgItem: string = '';
  sizeChose: string = '';
  colorChose: string = '';
  productName: string = '';
  lengthItem: number = 0;

  errMessage: string = '';

  constructor(
    private _oService: OrderService,
    private _pService: ProductService,
    private _router: Router
  ) {}

  ngOnInit() {
    this.getOrderByIdShow();
  }

  // get product detail by id in url
  getProductById(id: any) {
    this._pService.getProduct(id).subscribe({
      next: (res) => {
        this.productName = res.name;
        this.imgItem = res.imgURL[0];
      },
      error: (err) => {
        this.errMessage = err;
        console.log('Error occured while fetching file meta data');
      },
    });
  }

  // get product by id
  getOrderByIdShow() {
    this._oService.getOrderById(this.orderId).subscribe({
      next: (res) => {
        this.orderDetail = res;
        this.lengthItem = res.saleProducts.length;
        this.orderItemShow = res.saleProducts[0];
        var describeSplit = this.splitDescribe(this.orderItemShow.description);
        this.sizeChose = describeSplit[0];
        this.colorChose = describeSplit[1];

        console.log(this.orderItemShow);
        this.getProductById(this.orderItemShow.productId);
      },
    });
  }

  splitDescribe(describe: string): [string, string] {
    var temp = describe.split(',');
    var color = temp[0];
    var size = temp[1];
    return [size, color];
  }

  // view orderDetail
  viewOrderDetail(orderId: string) {
    this._router.navigate(['user/order', orderId]);
  }
}
