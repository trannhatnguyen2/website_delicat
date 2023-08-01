import { Component, OnInit } from '@angular/core';
import { AccountService } from '../services/account.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css'],
})
export class SignUpComponent implements OnInit {
  email: string = '';
  password: string = '';
  confirmPassword: string = '';

  constructor(private service: AccountService, private router: Router) {}

  ngOnInit(): void {}

  register() {
    console.log(this.password);
    console.log(this.confirmPassword);

    if (this.email == '') {
      alert('Please enter email');
      return;
    }

    if (this.password == '') {
      alert('Please enter password');
      return;
    }

    if (this.password !== this.confirmPassword) {
      alert('Please enter confirmPassword again');
      return;
    }

    this.service.register(this.email, this.password);

    this.email = '';
    this.password = '';
    this.confirmPassword = '';
  }

  signUpWithGoogle() {
    this.service.googleSignIn().then((res) => {
      // localStorage.getItem('email', JSON.stringify(res.user?.email))
      this.router.navigate(['account-info']);
    });
  }

  viewLoginPage() {
    this.router.navigate(['login']);
  }
}
