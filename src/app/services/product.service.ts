import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Product } from '../models/product';
import { Observable, combineLatest, map, switchMap, forkJoin } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  constructor(
    private fireStore: AngularFirestore,
    private fireStorage: AngularFireStorage
  ) {}

  // get all items
  getProducts() {
    return this.fireStore
      .collection('/ProductTemp')
      .snapshotChanges()
      .pipe(
        map((products) => {
          return products.map((product) => {
            const data = product.payload.doc.data() as Product;
            const id = product.payload.doc.id;
            return this.fireStore
              .collection('/ProductTemp')
              .doc(id)
              .collection('reviews')
              .get()
              .pipe(
                map((reviews) => {
                  const reviewsArray = reviews.docs.map((review) =>
                    review.data()
                  );
                  return { ...data, reviews: reviewsArray };
                })
              );
          });
        }),
        switchMap((productObservables) => combineLatest(productObservables))
      );
  }

  // get item by id
  getProduct(productId: any): Observable<Product> {
    const productDoc = this.fireStore.collection('/ProductTemp').doc(productId);
    const product = productDoc.valueChanges() as Observable<Product>;
    const reviews = productDoc.collection<any>('reviews').valueChanges();
    return combineLatest([product, reviews]).pipe(
      map(([productData, reviewsData]) => ({
        ...productData,
        reviews: reviewsData,
      }))
    );
  }

  //get list items by ids
  getProductsByIds(productIds: string[]) {
    return this.fireStore
      .collection('/ProductTemp', (ref) => ref.where('id', 'in', productIds))
      .snapshotChanges()
      .pipe(
        map((products) =>
          products.map((product) => {
            const data = product.payload.doc.data() as Product;
            const id = product.payload.doc.id;
            return this.fireStore
              .collection('/ProductTemp')
              .doc(id)
              .collection('reviews')
              .get()
              .pipe(
                map((reviews) => {
                  const reviewsArray = reviews.docs.map((review) =>
                    review.data()
                  );
                  return { ...data, reviews: reviewsArray };
                })
              );
          })
        ),
        switchMap((productObservables) => combineLatest(productObservables))
      );
  }

  // post and put item
  saveMetaDataOfFile(product: Product) {
    // create new or put item parameter
    const myDoc = this.fireStore.collection('/ProductTemp').doc(product.id);

    // create sub-collection review
    const subCollection = myDoc
      .collection('reviews')
      .doc(product.reviews[0].id).ref;

    // create json product
    const productMeta = {
      id: product.id,
      name: product.name,
      type: product.type,
      price: product.price,
      imgURL: product.imgURL,
      describe: product.describe,
      tag: product.tag,
      size: product.size,
      color: product.color,
    };

    // push data to firebase
    myDoc
      .set(productMeta)
      .then(() => {
        console.log('Document successfully written!');
      })
      .catch((error) => {
        console.error('Error writing document: ', error);
      });

    // push data to subCollection (firebase)
    subCollection
      .set({
        id: product.reviews[0].id,
        ratingComment: product.reviews[0].ratingComment,
        userName: product.reviews[0].userName,
        dateCreate: product.reviews[0].dateCreate,
        review: product.reviews[0].review,
      })
      .then(() => {
        console.log('Document successfully written!');
      })
      .catch((error) => {
        console.error('Error writing document: ', error);
      });
  }

  // // delete item
  // async deleteProduct(product: Product) {
  //   const productDocRef = this.fireStore
  //     .collection('/ProductTemp')
  //     .doc(product.id).ref;
  //   const reviewsCollectionRef = this.fireStore
  //     .collection('/ProductTemp')
  //     .doc(product.id)
  //     .collection('reviews').ref;

  //   const batch = this.fireStore.firestore.batch();
  //   batch.delete(productDocRef);
  //   const deleteReviewsQuery = await reviewsCollectionRef.limit(500).get();
  //   deleteReviewsQuery.forEach((doc) => batch.delete(doc.ref));

  //   batch
  //     .commit()
  //     .then(() => {
  //       console.log('Product and reviews successfully deleted');
  //     })
  //     .catch((error) => {
  //       console.error('Error deleting product and reviews: ', error);
  //     });
  // }

  selectedProduct!: Product;

  setSelectedProduct(product: Product) {
    this.selectedProduct = product;
  }

  getSelectedProduct(): Product {
    return this.selectedProduct;
  }
}
