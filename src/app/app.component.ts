import {Component, HostListener, OnInit} from '@angular/core';
import {AuthService, SocialUser} from 'angularx-social-login';

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

    @HostListener('window:resize', ['$event'])
    onResize(event) {
        this.mobile = event.target.innerWidth <= 600;
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
