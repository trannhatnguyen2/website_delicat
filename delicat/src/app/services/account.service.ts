import { Injectable } from '@angular/core';
import { GoogleAuthProvider } from '@angular/fire/auth';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Router } from '@angular/router';
import firebase from 'firebase/compat/app';
import { User } from '../models/user';
import { sha256 } from 'js-sha256';
import { Account } from '../models/account';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  constructor(
    private fireauth: AngularFireAuth,
    private router: Router,
    private fireStore: AngularFirestore,
    private fireStorage: AngularFireStorage
  ) {}

  // login method
  login(email: string, password: string) {
    // Hash password
    const passwordHash = sha256(password).toString();

    // console.log('Vào hàm login');

    // sign in with email and password
    this.fireauth.signInWithEmailAndPassword(email, passwordHash).then(
      async (res) => {
        if (res.user?.emailVerified == true) {
          //đăng nhập thành công, kiểm tra xem customer này có trong collection customer chưa
          const docRefCustomer = firebase
            .firestore()
            .doc('Customer/' + res.user?.uid);
          docRefCustomer
            .get()
            .then(
              (
                docSnapshot: firebase.firestore.DocumentSnapshot<firebase.firestore.DocumentData>
              ) => {
                if (docSnapshot.exists) {
                  // Nếu có rồi thì thôi
                } else {
                  //Nếu chưa có thì tạo mới
                  const myDoc = this.fireStore
                    .collection('/Customer')
                    .doc(res.user?.uid);

                  // const subCollection = myDoc.collection('cart').ref;

                  const customer = new User(); //Tạo mới customer theo cấu trúc của Customer

                  const customerMeta = {
                    id: res.user?.uid,
                    userName: email,
                    fullName: customer.fullName,
                    phone: customer.phone,
                    address: customer.address,
                    wishlist: customer.wishlist,
                    order: customer.order,
                    // cart: customer.cart,
                  };

                  // subCollection.set()

                  myDoc
                    .set(customerMeta)
                    .then(() => {
                      console.log('Document successfully written!');
                    })
                    .catch((error) => {
                      console.error('Error writing document: ', error);
                    });
                }
              }
            )
            .catch((error: Error) => {
              // Handle errors
            });

          // next
          this.router.navigate(['']);

          // local storage token
          localStorage.setItem('token', JSON.stringify(res.user?.uid));
          localStorage.setItem('provider', 'Email');
        } else {
          alert('Please verify your email!');
          this.router.navigate(['login']);
        }
      },
      (err) => {
        alert(err.message);
        this.router.navigate(['login']);
      }
    );
  }

  // register method
  register(email: string, password: string) {
    // hash password
    const passwordHash = sha256(password);

    // create user with email and password
    this.fireauth.createUserWithEmailAndPassword(email, passwordHash).then(
      (res) => {
        alert('Registration Successful');
        this.sendEmailForVarification(res.user);
        this.router.navigate(['account-info']);
      },
      (err) => {
        alert(err.message);
        this.router.navigate(['register']);
      }
    );
  }

  // sign out
  logout() {
    this.fireauth.signOut().then(
      () => {
        localStorage.removeItem('token');
        localStorage.removeItem('provider');
      },
      (err) => {
        alert(err.message);
      }
    );
  }

  // forgot password
  forgotPassword(email: string) {
    this.fireauth.sendPasswordResetEmail(email).then(
      () => {
        this.router.navigate(['/varify-email']);
      },
      (err) => {
        alert('Something went wrong');
      }
    );
  }

  // email varification
  sendEmailForVarification(user: any) {
    console.log(user);
    user.sendEmailVerification().then(
      (res: any) => {
        this.router.navigate(['/varify-email']);
      },
      (err: any) => {
        alert('Something went wrong. Not able to send mail to your email.');
      }
    );
  }

  //sign in with google
  googleSignIn() {
    return this.fireauth.signInWithPopup(new GoogleAuthProvider()).then(
      async (res) => {
        if (res.user?.emailVerified == true) {
          //đăng nhập thành công, kiểm tra xem customer này có trong collection customer chưa
          const docRefCustomer = firebase
            .firestore()
            .doc('Customer/' + res.user?.uid);
          docRefCustomer
            .get()
            .then(
              (
                docSnapshot: firebase.firestore.DocumentSnapshot<firebase.firestore.DocumentData>
              ) => {
                if (docSnapshot.exists) {
                  // Nếu có rồi thì thôi
                } else {
                  //Nếu chưa có thì tạo mới
                  const myDoc = this.fireStore
                    .collection('/Customer')
                    .doc(res.user?.uid);

                  // const subCollection = myDoc.collection('cart').ref;

                  const customer = new User(); //Tạo mới customer theo cấu trúc của Customer

                  const customerMeta = {
                    id: res.user?.uid,
                    userName: res.user?.email,
                    fullName: customer.fullName,
                    phone: customer.phone,
                    address: customer.address,
                    wishlist: customer.wishlist,
                    order: customer.order,
                    // cart: customer.cart,
                  };

                  // subCollection.set()

                  myDoc
                    .set(customerMeta)
                    .then(() => {
                      console.log('Document successfully written!');
                    })
                    .catch((error) => {
                      console.error('Error writing document: ', error);
                    });

                  this.router.navigate(['account-info']);
                }
              }
            )
            .catch((error: Error) => {
              // Handle errors
            });

          // next
          this.router.navigate(['']);

          // local storage token
          localStorage.setItem('token', JSON.stringify(res.user?.uid));
          localStorage.setItem('provider', 'Google');
        } else {
          alert('Please verify your email!');
          this.router.navigate(['login']);
        }
      },
      (err) => {
        alert(err.message);
      }
    );
  }

  async changePassword(
    email: string,
    currentPassword: string,
    newPassword: string
  ) {
    try {
      const currentPasswordHash = sha256(currentPassword).toString();

      // Log in the user with their old password
      const userCredential = await this.fireauth.signInWithEmailAndPassword(
        email,
        currentPasswordHash
      );

      if (typeof userCredential === 'object') {
        const newPasswordHash = sha256(newPassword).toString();

        // Check if the user's email is verified
        const user = userCredential.user; // user is of type User | null
        if (user && user.emailVerified) {
          // Update the user's password
          await user.updatePassword(newPasswordHash);
          console.log('Password updated successfully');
          alert('Password updated successfully');
        } else {
          console.log('User email is not verified');
        }
      } else {
        alert('Current password is incorrect!');
      }
    } catch (error) {
      console.log('Error updating password:', error);
    }
  }
}
