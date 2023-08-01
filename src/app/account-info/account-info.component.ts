import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CustomerService } from '../services/customer.service';
import { User } from '../models/user';
import { retry } from 'rxjs';

@Component({
  selector: 'app-account-info',
  templateUrl: './account-info.component.html',
  styleUrls: ['./account-info.component.css'],
})
export class AccountInfoComponent implements OnInit {
  customerInfo: User = new User();
  errMessage: string = '';

  constructor(private _router: Router, private _cService: CustomerService) {
    this.getCustomerById();
  }

  ngOnInit(): void {}

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

  saveCustomerInfo() {
    const token = localStorage.getItem('token')?.toString();
    const customerId = token?.replace(/"/g, '');

    if (customerId == null) {
      this._router.navigate(['login']);
    } else {
      console.log(this.customerInfo);
      this._cService.saveMetaDataOfFile(this.customerInfo);
    }
    this.navigateShop();
  }

  navigateShop() {
    alert('Save successfully!');
    this._router.navigate(['']);
  }
}
