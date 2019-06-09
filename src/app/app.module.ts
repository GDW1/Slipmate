import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {
    MAT_CHECKBOX_CLICK_ACTION,
    MatButtonModule,
    MatCardModule, MatCheckboxModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatNativeDateModule,
    MatSidenavModule,
    MatStepperModule,
    MatToolbarModule
} from '@angular/material';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {RouterModule} from '@angular/router';
import {AppRoutingModule} from './app-routing.module';
import {TodayComponent} from './today/today.component';
import {RequestsComponent} from './requests/requests.component';
import {StudentsComponent} from './students/students.component';
import {CreateComponent} from './create/create.component';
import {CalendarComponent} from './calendar/calendar.component';
import {SettingsComponent} from './settings/settings.component';
import {HelpComponent} from './help/help.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {SocialLoginModule, AuthServiceConfig} from "angularx-social-login";
import {GoogleLoginProvider} from "angularx-social-login";

let config = new AuthServiceConfig([
    {
        id: GoogleLoginProvider.PROVIDER_ID,
        provider: new GoogleLoginProvider("133453041482-q1f5t28tt0qf897sll1sel00minbm4m4.apps.googleusercontent.com")
    }
]);

export function provideConfig() {
    return config;
}

@NgModule({
    declarations: [
        AppComponent,
        TodayComponent,
        RequestsComponent,
        StudentsComponent,
        CreateComponent,
        CalendarComponent,
        SettingsComponent,
        HelpComponent
    ],
    imports: [
        BrowserModule,
        MatToolbarModule,
        MatButtonModule,
        MatIconModule,
        MatInputModule,
        MatSidenavModule,
        BrowserAnimationsModule,
        MatListModule,
        RouterModule,
        AppRoutingModule,
        MatCardModule,
        MatMenuModule,
        MatFormFieldModule,
        MatStepperModule,
        MatDatepickerModule,
        MatNativeDateModule,
        ReactiveFormsModule,
        MatCheckboxModule,
        FormsModule,
        SocialLoginModule
    ],
    providers: [
        {
            provide: AuthServiceConfig,
            useFactory: provideConfig
        },
        {provide: MAT_CHECKBOX_CLICK_ACTION, useValue: 'check'}
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
