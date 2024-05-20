import {  LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import * as it from '@angular/common/locales/it'

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MainContainerComponent } from './main-container/main-container.component';
import { HorizontalHeaderComponent } from './commons/horizontal-header/horizontal-header.component';
import { VerticalNavbarComponent } from './commons/vertical-navbar/vertical-navbar.component';
import { HamburgerButtonComponent } from './commons/hamburger-button/hamburger-button.component';
import { SideNavbarComponent } from './commons/side-navbar/side-navbar.component';
import { LogoComponent } from './commons/logo/logo.component';
import { CoursePageContainerComponent } from './main-container/course-page-container/course-page-container.component';
import { UsersPageContainerComponent } from './main-container/users-page-container/users-page-container.component';
import { ReportPageContainerComponent } from './main-container/report-page-container/report-page-container.component';
import { SessionPageContainerComponent } from './main-container/session-page-container/session-page-container.component';
import { DashboardPageContainerComponent } from './main-container/dashboard-page-container/dashboard-page-container.component';
import { WelcomeContainerComponent } from './main-container/dashboard-page-container/welcome-container/welcome-container.component';
import { CourseContainerComponent } from './main-container/dashboard-page-container/course-container/course-container.component';
import { ActivityContainerComponent } from './main-container/dashboard-page-container/activity-container/activity-container.component';
import { SearchBarComponent } from './commons/search-bar/search-bar.component';
import { TableComponent } from './commons/table/table.component';
import { SearchDropdownBarComponent } from './commons/search-dropdown-bar/search-dropdown-bar.component';
import { HelpContainerComponent } from './main-container/users-page-container/help-container/help-container.component';
import { AddUserContainerComponent } from './main-container/users-page-container/add-user-container/add-user-container.component';
import { SearchUserContainerComponent } from './main-container/users-page-container/search-user-container/search-user-container.component';
import { AddButtonComponent } from './commons/add-button/add-button.component';
import { AnchorDirective } from './commons/directives/anchor.directive';
import { TableV2Component } from './commons/table-v2/table-v2.component';
import { UserTableRowComponent } from './main-container/users-page-container/search-user-container/user-table-row/user-table-row.component';
import { CheckboxV2Component } from './commons/checkbox-v2/checkbox-v2.component';
import { DetailButtonComponent } from './commons/detail-button/detail-button.component';
import { RemoveButtonComponent } from './commons/remove-button/remove-button.component';
import { PaginationComponent } from './commons/pagination/pagination.component';
import { SelectBarComponent } from './commons/select-bar/select-bar.component';
import { SearchButtonComponent } from './commons/search-button/search-button.component';
import { ResetFilterButtonComponent } from './commons/reset-filter-button/reset-filter-button.component';
import { ActivityTableRowComponent } from './main-container/dashboard-page-container/activity-container/activity-table-row/activity-table-row.component';
import { CourseRowTableComponent } from './main-container/dashboard-page-container/course-container/course-row-table/course-row-table.component';
import { ReportHelpContainerComponent } from './main-container/report-page-container/report-help-container/report-help-container.component';
import { ProgressContainerComponent } from './main-container/report-page-container/progress-container/progress-container.component';
import { ProgressTableRowComponent } from './main-container/report-page-container/progress-container/progress-table-row/progress-table-row.component';
import { DatepickerComponent } from './commons/datepicker/datepicker.component';
import { SessionHelpContainerComponent } from './main-container/session-page-container/session-help-container/session-help-container.component';
import { SearchSessionComponent } from './main-container/session-page-container/search-session/search-session.component';
import { AddSessionComponent } from './main-container/session-page-container/add-session/add-session.component';
import { SessionTableRowComponent } from './main-container/session-page-container/search-session/session-table-row/session-table-row.component';
import { SwitchButtonComponent } from './commons/switch-button/switch-button.component';
import { CreateSessionComponent } from './main-container/session-page-container/add-session/create-session/create-session.component';
import { CreateStudentComponent } from './main-container/users-page-container/add-user-container/create-student/create-student.component';
import { CreateAdminComponent } from './main-container/users-page-container/add-user-container/create-admin/create-admin.component';
import { CreateOfficeComponent } from './main-container/users-page-container/add-user-container/create-office/create-office.component';
import { UploadButtonComponent } from './commons/upload-button/upload-button.component';
import { HttpClientModule } from  '@angular/common/http';
import { MatIconModule } from '@angular/material/icon';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatStepperModule} from '@angular/material/stepper';
import {MatFormFieldModule, MatLabel} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {MatRadioModule} from '@angular/material/radio';
import { LoginComponent } from './main-container/login/login.component';
import {MatDatepickerModule} from '@angular/material/datepicker'
import {MAT_DATE_LOCALE, provideNativeDateAdapter} from '@angular/material/core';

import { ErrorInterceptor } from './commons/interceptors/error-interceptor';
import { AuthInterceptor } from './commons/interceptors/auth-interceptor';
import { JWT_OPTIONS, JwtHelperService } from '@auth0/angular-jwt';
import { LoadingComponent } from './commons/loading/loading.component';
import { registerLocaleData } from '@angular/common';


export const httpInterceptorProviders = [
  { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
  { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
]

export const JwtServiceProvider = {provide: JWT_OPTIONS, useValue: JWT_OPTIONS, useClass: JwtHelperService, multi: true}

@NgModule({
    declarations: [
        AppComponent,
        LoginComponent,
        MainContainerComponent,
        HorizontalHeaderComponent,
        VerticalNavbarComponent,
        HamburgerButtonComponent,
        SideNavbarComponent,
        LogoComponent,
        CoursePageContainerComponent,
        UsersPageContainerComponent,
        ReportPageContainerComponent,
        SessionPageContainerComponent,
        DashboardPageContainerComponent,
        WelcomeContainerComponent,
        CourseContainerComponent,
        ActivityContainerComponent,
        SearchBarComponent,
        TableComponent,
        SearchDropdownBarComponent,
        HelpContainerComponent,
        AddUserContainerComponent,
        SearchUserContainerComponent,
        AddButtonComponent,
        AnchorDirective,
        TableV2Component,
        UserTableRowComponent,
        CheckboxV2Component,
        DetailButtonComponent,
        RemoveButtonComponent,
        PaginationComponent,
        SelectBarComponent,
        SearchButtonComponent,
        ResetFilterButtonComponent,
        ActivityTableRowComponent,
        CourseRowTableComponent,
        ReportHelpContainerComponent,
        ProgressContainerComponent,
        ProgressTableRowComponent,
        DatepickerComponent,
        SessionHelpContainerComponent,
        SearchSessionComponent,
        AddSessionComponent,
        SessionTableRowComponent,
        SwitchButtonComponent,
        CreateSessionComponent,
        CreateStudentComponent,
        CreateAdminComponent,
        CreateOfficeComponent,
        UploadButtonComponent,
    ],
    providers: [
        { provide: LOCALE_ID, useValue: 'it-IT' },
        httpInterceptorProviders,
        { provide: JWT_OPTIONS, useValue: JWT_OPTIONS },
        JwtHelperService,
        { provide: MAT_DATE_LOCALE, useValue: 'it-IT' },
        provideNativeDateAdapter(),
    ],
    bootstrap: [AppComponent],
    imports: [
        BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        ReactiveFormsModule,
        FormsModule,
        HttpClientModule,
        MatFormFieldModule,
        MatIconModule,
        MatProgressBarModule,
        MatProgressSpinnerModule,
        MatStepperModule,
        MatSelectModule,
        MatButtonModule,
        MatInputModule,
        MatRadioModule,
        MatDatepickerModule,
        LoadingComponent
    ]
})
export class AppModule {
    constructor() {
        registerLocaleData(it.default); //Then register the language
      }
 }
