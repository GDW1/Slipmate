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
    public sign = 'Sign in with';
    public signImg = true;

    @HostListener('window:resize', ['$event'])
    onResize(event) {
        this.mobile = event.target.innerWidth < 768;
    }

    signIn(): void {
        this.authService.signIn(GoogleLoginProvider.PROVIDER_ID);
    }

    signOut() {
        this.authService.signOut();
        document.location.href = '';
    }

    ngOnInit() {
        this.authService.authState.subscribe((user) => {
            this.user = user;
            this.loggedIn = (user != null);
            if (this.loggedIn) {
                let email = this.user.email.split('@');
                if (email[1] === 'seq.org') {
                    console.log(this.user.idToken);

                    if (email[0].match(/[a-z]/i)) {
                        //TEACHER
                        document.location.href = 'https://teacher.slipmate.ml';
                    } else {
                        //STUDENT
                        document.location.href = 'https://teacher.slipmate.ml';
                    }
                } else {
                    //NOT SEQ
                    this.authService.signOut();
                    this.signImg = false;
                    this.sign = 'Please use seq.org account';
                }
            }
        });

        this.mobile = window.innerWidth < 768;
    }
}
