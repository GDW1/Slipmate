import {AfterViewInit, Component, ViewChild} from '@angular/core';
import {MatListItem, MatSidenavContainer} from "@angular/material";
import {NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router, RouterEvent} from "@angular/router";
import {LoginService} from "./login.service";
import {ApiService} from "./api.service";

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit {
    title = 'Slipmate';
    loading = true;

    @ViewChild(MatSidenavContainer, {static: true})sidenavContainer: MatSidenavContainer;
    @ViewChild(MatListItem, {static: true}) sidenavLink: MatListItem;

    constructor(private router: Router,
                private api: ApiService,
                private loginService: LoginService) {

        router.events.subscribe((event: RouterEvent) => {
            this.navigationInterceptor(event)
        })
    }

    navigationInterceptor(event: RouterEvent): void {
        if (event instanceof NavigationStart) {
            this.loading = true
        }
        if (event instanceof NavigationEnd) {
            this.loading = false
        }

        // Set loading state to false in both of the below events to hide the spinner in case a request fails
        if (event instanceof NavigationCancel) {
            this.loading = false
        }
        if (event instanceof NavigationError) {
            this.loading = false
        }
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
        return this.router.url.substring(1);
    }

    test() {
        console.log(this.api.isBlockedDay('798932', "08:05"));
    }

    isActive(path: string): boolean {
        return this.router.url.substring(1) === path;
    }
}
