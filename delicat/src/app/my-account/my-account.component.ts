import { Component } from '@angular/core';
import { CustomerService } from '../services/customer.service';
import { NavigationEnd, Router } from '@angular/router';
import { OrderService } from '../services/order.service';
import { AccountService } from '../services/account.service';
import { User } from '../models/user';

@Component({
  selector: 'app-my-account',
  templateUrl: './my-account.component.html',
  styleUrls: ['./my-account.component.css'],
})
export class MyAccountComponent {
  customerInfo: User = new User();
  errMessage: string = '';

  currentPassword: string = '';
  newPassword: string = '';
  confirmPassword: string = '';

  isGoogleUser: boolean = false;

  constructor(
    private _cService: CustomerService,
    private _oService: OrderService,
    private _aService: AccountService,
    private _router: Router
  ) {
    this._router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        window.scrollTo(0, 0); // Scroll to top of page
      }
    });

    const providerLocalStorage = localStorage.getItem('provider')?.toString();
    let checkProvider = '';

    if (providerLocalStorage) {
      checkProvider = providerLocalStorage;
      console.log(checkProvider);
      if (checkProvider === 'Google') {
        console.log(1);
        this.isGoogleUser = true;
      }

      if (checkProvider === 'Email') {
        console.log(2);

        this.isGoogleUser = false;
      }
    }

    this.getCustomerById();
  }

  // get customer by Id
  getCustomerById() {
    // console.log('Vào get customer by id');
    const token = localStorage.getItem('token')?.toString();
    const customerId = token?.replace(/"/g, '');

    if (customerId == null) {
      this._router.navigate(['login']);
    } else {
      this._cService.getCustomerById(customerId).subscribe({
        next: (res) => {
          this.customerInfo = res;
        },
        error: (err) => {
          this.errMessage = err;
        },
      });
    }
  }

  // save customer Info by Id
  saveProfile() {
    const token = localStorage.getItem('token')?.toString();
    const customerId = token?.replace(/"/g, '');

    if (customerId == null) {
      this._router.navigate(['login']);
    } else {
      console.log(this.customerInfo);
      this._cService.saveMetaDataOfFile(this.customerInfo);
    }
  }

  // change password
  changePassword() {
    if (this.newPassword !== this.confirmPassword) {
      alert('Password do not match!');
    } else {
      this._aService.changePassword(
        this.customerInfo.userName,
        this.currentPassword,
        this.newPassword
      );

      this.currentPassword = '';
      this.newPassword = '';
      this.confirmPassword = '';
    }
  }

  // log out account
  logout() {
    this._aService.logout();
    this._router.navigate(['login']);
  }
}
