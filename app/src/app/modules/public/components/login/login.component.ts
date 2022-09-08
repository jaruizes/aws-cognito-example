import { Component, OnInit } from '@angular/core';
import { Amplify, Auth } from 'aws-amplify';
import { FormControl } from "@angular/forms";

Amplify.configure({
  Auth: {

    // REQUIRED - Amazon Cognito Region
    region: 'eu-west-2',

    // OPTIONAL - Amazon Cognito User Pool ID
    userPoolId: 'eu-west-2_UcXezgaAW',

    // OPTIONAL - Amazon Cognito Web Client ID (26-char alphanumeric string)
    userPoolWebClientId: '2lgl129tpm577fo0bgmrr4hh7l',

    // OPTIONAL - Enforce user authentication prior to accessing AWS resources or not
    mandatorySignIn: false,

    // OPTIONAL - Manually set the authentication flow type. Default is 'USER_SRP_AUTH'
    authenticationFlowType: 'USER_PASSWORD_AUTH',
  }
});

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  username = new FormControl(' ');
  password = new FormControl(' ');

  constructor() { }

  ngOnInit(): void {
  }

  doLogin() {
    console.log('user: ' + this.username.value + ' // pass: ' + this.password.value);
    if (this.username.value && this.password.value) {
      const user = this.signIn(this.username.value, this.password.value);
    }
  }

  async signIn(username: string, password: string) {
    try {
      const user = await Auth.signIn(username, password);
      return user;
    } catch (error) {
      console.log('error signing in', error);
    }
  }
}
