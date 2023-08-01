import { Comment } from './comment';
export class Product {
  constructor(
    public id: string = '',
    public name: string = '',
    public type: string = '',
    public price: number = 0,
    public imgURL: Array<string> = [],
    public describe: string = '',
    public tag: string = '',
    public size: string[] = [],
    public color: string[] = [],
    public reviews: Array<Comment> = []
  ) {}
}

export class ProductDetail {
  constructor(
    public id: string = '',
    public name: string = '',
    public type: string = '',
    public price: number = 0,
    public imgURL: Array<string> = [],
    public describe: string = '',
    public tag: string = '',
    public size: string = '',
    public color: string = '',
    public reviews: Array<Comment> = [],
    public quantity: number = 1
  ) {}
}
