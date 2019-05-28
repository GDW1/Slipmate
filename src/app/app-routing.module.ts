import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {TodayComponent} from './today/today.component';
import {RequestsComponent} from './requests/requests.component';
import {StudentsComponent} from './students/students.component';
import {CalendarComponent} from './calendar/calendar.component';
import {CreateComponent} from './create/create.component';
import {SettingsComponent} from './settings/settings.component';
import {HelpComponent} from './help/help.component';
import {DashboardComponent} from './dashboard/dashboard.component';
import {LoginComponent} from './login/login.component';

const routes: Routes = [
    {path: '', redirectTo: 'login', pathMatch: 'full'},
    {path: 'console', component: DashboardComponent,
        children: [
            {path: '', redirectTo: 'today', pathMatch: 'full'},
            {path: 'today', component: TodayComponent},
            {path: 'requests', component: RequestsComponent},
            {path: 'students', component: StudentsComponent},
            {path: 'calendar', component: CalendarComponent},
            {path: 'create', component: CreateComponent},
            {path: 'settings', component: SettingsComponent},
            {path: 'help', component: HelpComponent}
        ]
    },
    {path: 'login', component: LoginComponent},
    {path: '**', redirectTo: ''}
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
