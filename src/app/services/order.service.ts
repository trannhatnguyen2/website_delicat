import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Observable, combineLatest, map } from 'rxjs';
import { Order } from '../models/order';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  constructor(
    private fireStore: AngularFirestore,
    private fireStorage: AngularFireStorage
  ) {}

  //get order by id
  getOrderById(id: string): Observable<Order> {
    const orderDoc = this.fireStore.collection('/Order').doc(id);
    const order = orderDoc.valueChanges() as Observable<Order>;
    const saleProducts = orderDoc
      .collection<any>('saleProducts')
      .valueChanges();
    return combineLatest([order, saleProducts]).pipe(
      map(([orderData, saleProducts]) => ({
        ...orderData,
        saleProducts: saleProducts,
      }))
    );
  }

  // post - put
  saveMetaDataOfFile(order: Order) {
    order.id = this.fireStore.createId();

    const myDoc = this.fireStore.collection('/Order').doc(order.id);

    const saleProductsRef = myDoc.collection('saleProducts');

    const orderMeta = {
      deliveryAddress: order.deliveryAddress,
      id: order.id,
      customerId: order.customerId,
      total: order.total,
      dateCreated: order.dateCreated,
      paymentMethod: order.paymentMethod,
      status: order.status,
    };

    order.saleProducts.forEach((saleProduct) => {
      console.log(saleProduct);
      // const cartItemId = this.fireStore.createId()
      const temp = saleProduct.description.split(',');
      const saleProductId = saleProduct.productId + temp[0] + temp[1];

      const subCollection = saleProductsRef.doc(saleProductId).ref;
      subCollection.set({
        description: saleProduct.description,
        productId: saleProduct.productId,
        quantity: saleProduct.quantity,
        unitPrice: saleProduct.unitPrice,
      });
    });

    //đẩy data lên
    myDoc
      .set(orderMeta)
      .then(() => {
        console.log('Document successfully written!');
      })
      .catch((error) => {
        console.error('Error writing document: ', error);
      });
  }
}
