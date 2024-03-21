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

const routes: Routes = [
  {path: '', component: DashboardPageContainerComponent},
  {path: 'users', component: UsersPageContainerComponent},
  {path: 'report', component: ReportPageContainerComponent},
  {path: 'session', component: SessionPageContainerComponent},
  {path: 'session/create', component: CreateSessionComponent},
  {path: 'users/create/student', component: CreateStudentComponent},
  {path: 'users/create/admin', component: CreateAdminComponent},
  {path: 'users/create/office', component: CreateOfficeComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
