import {Component, HostListener, OnInit} from '@angular/core';
import {AuthService, GoogleLoginProvider, SocialUser} from 'angularx-social-login';
import {CookieService} from "ngx-cookie-service";

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
    title = 'Slipmate';

    constructor(private authService: AuthService,
                private cookie: CookieService) {
    }

    private user: SocialUser;
    public loggedIn: boolean;
    public mobile = false;
    public welcome = 'Welcome to Slipmate! Please click below to sign in.';

    @HostListener('window:resize', ['$event'])
    onResize(event) {
        this.mobile = event.target.innerWidth < 768;
    }

    signIn(): void {
        this.authService.signIn(GoogleLoginProvider.PROVIDER_ID);
    }

    signOut() {
        this.authService.signOut();
    }

    ngOnInit() {
        this.authService.authState.subscribe((user) => {
            this.user = user;
            this.loggedIn = (user != null);
            if (this.loggedIn) {
                let email = this.user.email.split('@');
                if (email[1] === 'seq.org') {
                    console.log(this.user.idToken);

                    // let xhr = new XMLHttpRequest();
                    // xhr.open('POST', 'https://backend.slipmate.ml');
                    // xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
                    // xhr.onload = function() {
                    //     console.log('Signed in as: ' + xhr.responseText);
                    // };
                    // xhr.send('idtoken=' + this.user.idToken);

                    if (email[0].match(/[a-z]/i)) {
                        //TEACHER
                        // document.location.href = 'https://teacher.slipmate.ml';
                    } else {
                        //STUDENT
                        this.cookie.set('token', this.user.idToken)
                        // document.location.href = 'https://teacher.slipmate.ml';
                    }
                } else {
                    //NOT SEQ
                    this.signOut();
                    this.welcome = 'Please use your seq.org email address';
                }
            }
        });

        this.mobile = window.innerWidth < 768;
    }
}
