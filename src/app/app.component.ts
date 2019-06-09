import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {MatListItem, MatSidenavContainer} from "@angular/material";
import {Router} from "@angular/router";
import {AuthService, GoogleLoginProvider, SocialUser} from "angularx-social-login";

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit, OnInit {
    title = 'Slipmate';

    @ViewChild(MatSidenavContainer) sidenavContainer: MatSidenavContainer;
    @ViewChild(MatListItem) sidenavLink: MatListItem;

    constructor(private router: Router,
                private authService: AuthService) {
    }

    signInWithGoogle(): void {
        this.authService.signIn(GoogleLoginProvider.PROVIDER_ID);
    }

    signOut(): void {
        this.authService.signOut();
    }

    private user: SocialUser;
    private loggedIn: boolean;

    ngAfterViewInit() {
        this.sidenavContainer.scrollable.elementScrolled().subscribe(() => {
        });
    }

    ngOnInit() {
        this.authService.authState.subscribe((user) => {
            this.user = user;
            this.loggedIn = (user != null);
        });
    }

    getTitle() {
        return this.router.url.substring(9);
    }

    isActive(path: string): boolean {
        return this.router.url.substring(9) === path;
    }
}
