export class CartItem {
  constructor(
    public id: string = '',
    public productId: string = '',
    public quantity: number = 0,
    public description: string = ''
  ) {}
}
