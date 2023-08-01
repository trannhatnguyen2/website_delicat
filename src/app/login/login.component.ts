import { Component, OnInit } from '@angular/core';
import { AccountService } from '../services/account.service';
import { NavigationEnd, Router } from '@angular/router';
import { Account } from '../models/account';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  email: string = '';
  password: string = '';
  errMessage: string = '';

  constructor(private service: AccountService, private router: Router) {}

  ngOnInit(): void {
    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
        return;
      }
      window.scrollTo(0, 0);
    });
  }

  // login account
  login() {
    console.log(this.email);
    console.log(this.password);
    if (this.email == '') {
      alert('Please enter email!');
      return;
    }

    if (this.password == '') {
      alert('Please enter password!');
      return;
    }

    this.service.login(this.email, this.password);
  }

  // sign in with Google
  signInWithGoogle() {
    this.service.googleSignIn();
  }
}
