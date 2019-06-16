import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {MatListItem, MatSidenavContainer} from "@angular/material";
import {Router} from "@angular/router";
import {AuthService, GoogleLoginProvider, SocialUser} from "angularx-social-login";
import {ApiService} from "./api.service";

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit, OnInit {
    title = 'Slipmate';

    @ViewChild(MatSidenavContainer, {static: true})sidenavContainer: MatSidenavContainer;
    @ViewChild(MatListItem, {static: true}) sidenavLink: MatListItem;

    constructor(private router: Router,
                private authService: AuthService,
                private backend: ApiService) {
    }

    signInWithGoogle(): void {
        this.authService.signIn(GoogleLoginProvider.PROVIDER_ID);
    }

    signOut(): void {
        this.authService.signOut();
        // document.location.href = 'https://slipmate.ml';
    }

    private user: SocialUser;
    public loggedIn: boolean;

    ngAfterViewInit() {
        if (this.loggedIn) {
            this.sidenavContainer.scrollable.elementScrolled().subscribe(() => {});
        }
    }

    testCreate() {
        this.backend.createPass(true, 'alu', 'blee', '796940', '08', '14');
        // this.backend.getTeacher('798932');
    }

    ngOnInit() {
        this.authService.authState.subscribe((user) => {
            this.user = user;
            this.loggedIn = (user != null);
            // if (!this.loggedIn) {
            //     //TODO: get this popup to not be blocked
            //     this.signInWithGoogle()
            // }
        });
    }

    getTitle() {
        return this.router.url.substring(9);
    }

    isActive(path: string): boolean {
        return this.router.url.substring(9) === path;
    }
}
