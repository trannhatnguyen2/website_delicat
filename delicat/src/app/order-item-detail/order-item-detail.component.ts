import { Component, Input } from '@angular/core';
import { SaleProducts } from '../models/saleProduc';
import { Order } from '../models/order';
import { OrderService } from '../services/order.service';
import { ProductService } from '../services/product.service';
import { Router } from '@angular/router';
import { Product } from '../models/product';

@Component({
  selector: 'app-order-item-detail',
  templateUrl: './order-item-detail.component.html',
  styleUrls: ['./order-item-detail.component.css'],
})
export class OrderItemDetailComponent {
  // @Input() orderId!: string;
  @Input() orderItem!: SaleProducts;

  // orderDetail: Order = new Order();

  orderItemShow: SaleProducts = new SaleProducts();
  imgItem: string = '';
  sizeChose: string = '';
  colorChose: string = '';
  productName: string = '';
  totalPrice: number = 0;

  errMessage: string = '';

  constructor(
    private _oService: OrderService,
    private _pService: ProductService,
    private _router: Router
  ) {}

  ngOnInit() {
    console.log(this.orderItem);
    this.orderItemShow = this.orderItem;
    const describe = this.splitDescribe(this.orderItemShow.description);
    this.sizeChose = describe[0];
    this.colorChose = describe[1];
    this.totalPrice =
      this.orderItemShow.quantity * this.orderItemShow.unitPrice;

    this.getProductById(this.orderItemShow.productId);
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

  splitDescribe(describe: string): [string, string] {
    var temp = describe.split(',');
    var color = temp[0];
    var size = temp[1];
    return [size, color];
  }

  // view order detail
  viewProductDetail(f: string) {
    this._router.navigate(['shop/product-detail', f]);
  }
}
