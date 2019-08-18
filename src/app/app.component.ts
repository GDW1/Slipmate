import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {MatListItem, MatSidenavContainer} from "@angular/material";
import {Router} from "@angular/router";
import {LoginService} from "./login.service";
import {ApiService} from "./api.service";

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit, OnInit {
    title = 'Slipmate';
    private isEmailed: boolean;
    private checked: boolean = false;
    @ViewChild(MatSidenavContainer, {static: true})sidenavContainer: MatSidenavContainer;
    @ViewChild(MatListItem, {static: true}) sidenavLink: MatListItem;

    constructor(private router: Router,
                private api: ApiService,
                private loginService: LoginService) {
    }
    ngOnInit(){
    }

    ngAfterViewInit() {
        if (this.loginService.loggedIn) {
            this.sidenavContainer.scrollable.elementScrolled().subscribe(() => {});
            if(this.loginService.firsttime){
                this.router.navigate(['/help'])
            }
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

    private emailStatus(){
        return new Promise((resolve) => {
            setTimeout(() => {
                this.api.getEmailValue(this.loginService.smID).then(val => {
                    console.log("VAL: " + val);
                    resolve(val.toString());
                    return;
                }).catch(err=> {
                    resolve(err)
                })
            });
        });
    }
    setOtherEmail() {
        return new Promise((resolve) => {
            setTimeout(() => {
                this.api.getTeacher(this.loginService.smID).then((val) => {
                    console.log(val);
                    this.api.optInOrOut(JSON.parse(val).id, this.isEmailed.toString()).then(val => {
                        this.isEmailed = !this.isEmailed;
                        resolve(val.toString());
                        return
                    })

                })
            });
        });
    }

    initLogin() {
        if(this.checked){
        this.emailStatus().then(val => {
            this.isEmailed = (val === "true");
            console.log("EMAIL: "+ val)
            this.checked=true
        })}
    }
}
