import { ProductDetailModel } from './product-model';

export type BasketModel = {
  productDetails: ProductDetailModel[];
  total: number;
  totalToPay: number;
};
