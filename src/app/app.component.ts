import {AfterViewInit, Component, ViewChild} from '@angular/core';
import {MatListItem, MatSidenavContainer} from "@angular/material";
import {Router} from "@angular/router";
import {LoginService} from "./login.service";
import {ApiService} from "./api.service";

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit {
    title = 'Slipmate';

    @ViewChild(MatSidenavContainer, {static: true})sidenavContainer: MatSidenavContainer;
    @ViewChild(MatListItem, {static: true}) sidenavLink: MatListItem;

    constructor(private router: Router,
                private api: ApiService,
                private loginService: LoginService) {
    }

    ngAfterViewInit() {
        if (this.loginService.loggedIn) {
            this.sidenavContainer.scrollable.elementScrolled().subscribe(() => {});
        } else {
            this.tryLogin()
        }
    }

    async tryLogin() {
        setTimeout(() => !this.loginService.loggedIn ? this.loginService.signInWithGoogle() : null, 5000);
    }

    getTitle() {
        if (this.router.url.substring(1) === 'blockeddays') return 'blocked days';
        else return this.router.url.substring(1);
    }

    isActive(path: string): boolean {
        return this.router.url.substring(1) === path;
    }
}
