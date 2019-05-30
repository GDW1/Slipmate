import {AfterViewInit, Component, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {MatListItem, MatSidenavContainer, RippleGlobalOptions} from '@angular/material';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})

export class DashboardComponent implements AfterViewInit {

    title = 'Slipmate';

    @ViewChild(MatSidenavContainer) sidenavContainer: MatSidenavContainer;
    @ViewChild(MatListItem) sidenavLink: MatListItem;

    constructor(private router: Router) {}

    ngAfterViewInit() {
        this.sidenavContainer.scrollable.elementScrolled().subscribe(() => {}/* react to scrolling */);
    }

    getTitle() {
        return this.router.url.substring(9);
    }

    isActive(path: string): boolean {
        return this.router.url.substring(9) === path;
    }

}
