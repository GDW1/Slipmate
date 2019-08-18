import { Injectable } from '@angular/core';
import {AuthService, GoogleLoginProvider, SocialUser} from "angularx-social-login";
import {AppRoutingModule} from "./app-routing.module";

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(public authService: AuthService) {
      authService.authState.subscribe((user) => {
          this.user = user;
          this.loggedIn = (user != null);

          if (this.loggedIn) {
              this.smID = user.email.split('@')[0];
              this.name = user.name;
              this.checkIfCorrectLogin();
              let req = new XMLHttpRequest;
              req.open('GET', 'https://cors-anywhere.herokuapp.com/https://us-central1-tutorial-pass-automator.cloudfunctions.net/initializeTeacher', false);
              req.setRequestHeader('id', this.smID);
              req.setRequestHeader('teacher', this.name);
              req.send();
              if(req.response !== "ERROR: 1: Account was already created"){
                this.firsttime = true
              }
              window.location.href = "localhost:4200"
              console.log('done')
          }
      });
  }

    signInWithGoogle(): void {
        this.authService.signIn(GoogleLoginProvider.PROVIDER_ID);
    }

    signOut(): void {
        this.authService.signOut();
        // document.location.href = 'https://slipmate.ml';
    }

    checkIfCorrectLogin(){
       if((/^[a-zA-Z]/.test(this.smID) /*&& this.user.email.split('@')[1] === 'seq.org'*/) || this.smID === '798932' || this.smID === '796940'){
            console.log("REGEXMATCHES")
       }else{
            window.location.href = 'slipmate.ml'
       };


    }
    public firsttime = false;
    public user: SocialUser;
    public loggedIn: boolean;
    public name: string;
    public smID: string;
}
