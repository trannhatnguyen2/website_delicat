import { CartItem } from './cart';

export class User {
  constructor(
    public id: string = '',
    public userName: string = '',
    public fullName: string = '',
    public phone: string = '',
    public address: string = '',
    public wishlist: string[] = [],
    public order: string[] = [],
    public cart: Array<CartItem> = []
  ) {}
}
