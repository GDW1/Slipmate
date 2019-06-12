import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {AuthServiceConfig, GoogleLoginProvider, SocialLoginModule} from 'angularx-social-login';
import {
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatListModule,
    MatSidenavModule,
    MatToolbarModule
} from "@angular/material";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {CookieService} from "ngx-cookie-service";

const config = new AuthServiceConfig([
    {
        id: GoogleLoginProvider.PROVIDER_ID,
        provider: new GoogleLoginProvider('133453041482-q1f5t28tt0qf897sll1sel00minbm4m4.apps.googleusercontent.com')
    }
]);

export function provideConfig() {
    return config;
}

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        BrowserModule,
        SocialLoginModule,
        MatButtonModule,
        MatToolbarModule,
        MatSidenavModule,
        BrowserAnimationsModule,
        MatListModule,
        MatIconModule,
        MatCardModule
    ],
    providers: [
        {
            provide: AuthServiceConfig,
            useFactory: provideConfig
        },
        {
            provide: CookieService,
            useFactory: provideConfig
        }
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
