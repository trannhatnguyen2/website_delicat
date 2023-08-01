import { SaleProducts } from './saleProduc';

export class Order {
  constructor(
    public id: string = '',
    public customerId: string = '',
    public dateCreated: string = '',
    public deliveryAddress: string = '',
    public paymentMethod: string = '',
    public status: string = '',
    public total: number = 0,
    public saleProducts: Array<SaleProducts> = []
  ) {}
}
