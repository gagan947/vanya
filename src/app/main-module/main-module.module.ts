import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { MainModuleRoutingModule } from './main-module-routing.module'
import { SidebarComponent } from './sidebar/sidebar.component'
import { AccountSettingComponent } from './account-setting/account-setting.component'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { SharedModule } from '../shared/shared.module'
import { AllUsersComponent } from './all-users/all-users.component'
import { DialogService } from 'primeng/dynamicdialog'
import { ConfirmationService } from 'primeng/api'
import { ViewUserComponent } from './all-users/view-user/view-user.component'
import { AddUserComponent } from './all-users/add-user/add-user.component'
import { ProjectsComponent } from './projects/projects.component'
import { MainHeaderComponent } from './main-header/main-header.component'
import { ViewProjectComponent } from './projects/view-project/view-project.component'
import { AddProjectComponent } from './projects/add-project/add-project.component'
import { MainComponent } from './main/main.component'
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input'

@NgModule({
  declarations: [
    SidebarComponent,
    AccountSettingComponent,
    AllUsersComponent,
    ViewUserComponent,
    AddUserComponent,
    ProjectsComponent,
    MainHeaderComponent,
    ViewProjectComponent,
    AddProjectComponent,
    MainComponent
  ],
  imports: [
    CommonModule,
    MainModuleRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    NgxIntlTelInputModule
  ],
  exports: [SidebarComponent],
  providers: [ConfirmationService, DialogService]
})
export class MainModuleModule {}
