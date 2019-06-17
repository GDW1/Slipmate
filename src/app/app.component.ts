import {AfterViewInit, Component, ViewChild} from '@angular/core';
import {MatListItem, MatSidenavContainer} from "@angular/material";
import {Router} from "@angular/router";
import {LoginService} from "./login.service";

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
                private loginService: LoginService) {
    }

    ngAfterViewInit() {
        if (this.loginService.loggedIn) {
            this.sidenavContainer.scrollable.elementScrolled().subscribe(() => {});
        }
    }

    getTitle() {
        return this.router.url.substring(9);
    }

    isActive(path: string): boolean {
        return this.router.url.substring(1) === path;
    }
}
