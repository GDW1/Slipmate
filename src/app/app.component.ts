import {Component, HostListener, OnInit} from '@angular/core';
import {AuthService, GoogleLoginProvider, SocialUser} from 'angularx-social-login';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
    title = 'Slipmate';

    constructor(private authService: AuthService) {
    }

    private user: SocialUser;
    public loggedIn: boolean;
    public mobile = false;
    public welcome = 'Welcome to Slipmate! Please click below to sign in.';

    @HostListener('window:resize', ['$event'])
    onResize(event) {
        this.mobile = event.target.innerWidth <= 600;
    }

    signIn(): void {
        this.authService.signIn(GoogleLoginProvider.PROVIDER_ID);
        let email = this.user.email.split('@');
        console.log(email);
        if (email[1] === 'seq.org') {
            if (email[0].match(/[a-z]/i)) {
                //TEACHER
            } else {
                //STUDENT
            }
        } else {
            this.signOut();
            this.welcome = 'Please use your @seq.org email address';
        }
    }

    signOut() {
        this.authService.signOut();
    }

    ngOnInit() {
        this.authService.authState.subscribe((user) => {
            this.user = user;
            this.loggedIn = (user != null);
        });

        this.mobile = window.innerWidth <= 600;
    }
}
