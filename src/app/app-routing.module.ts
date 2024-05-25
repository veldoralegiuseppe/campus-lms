import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UsersPageContainerComponent } from './main-container/users-page-container/users-page-container.component';
import { ReportPageContainerComponent } from './main-container/report-page-container/report-page-container.component';
import { SessionPageContainerComponent } from './main-container/session-page-container/session-page-container.component';
import { DashboardPageContainerComponent } from './main-container/dashboard-page-container/dashboard-page-container.component';
import { CreateSessionComponent } from './main-container/session-page-container/add-session/create-session/create-session.component';
import { CreateStudentComponent } from './main-container/users-page-container/add-user-container/create-student/create-student.component';
import { CreateAdminComponent } from './main-container/users-page-container/add-user-container/create-admin/create-admin.component';
import { CreateOfficeComponent } from './main-container/users-page-container/add-user-container/create-office/create-office.component';
import { LoginComponent } from './main-container/login/login.component';
import { AuthService } from './commons/authentication/auth.service';
import { CourseContainerComponent } from './main-container/dashboard-page-container/course-container/course-container.component';
import { CoursePageContainerComponent } from './main-container/course-page-container/course-page-container.component';
import { DetailsSessionComponent } from './main-container/details-session-page-container/details-session-page-container.component';

const routes: Routes = [
  {path: 'login', component: LoginComponent},
  {path: 'dashboard', component: DashboardPageContainerComponent, canActivate: [AuthService]},
  {path: '', component: DashboardPageContainerComponent, canActivate: [AuthService]},
  {path: 'users', component: UsersPageContainerComponent, canActivate: [AuthService]},
  {path: 'report', component: ReportPageContainerComponent, canActivate: [AuthService]},
  {path: 'session', component: SessionPageContainerComponent, canActivate: [AuthService]},
  {path: 'session/create', component: CreateSessionComponent, canActivate: [AuthService]},
  {path: 'users/create/student', component: CreateStudentComponent, canActivate: [AuthService]},
  {path: 'users/create', component: CreateAdminComponent, canActivate: [AuthService]},
  {path: 'users/create/office', component: CreateOfficeComponent, canActivate: [AuthService]},
  {path: 'course/:id', component: CoursePageContainerComponent, canActivate: [AuthService]},
  {path: 'session/:id', component: DetailsSessionComponent, canActivate: [AuthService]},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
