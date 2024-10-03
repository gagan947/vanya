import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { AccountSettingComponent } from './account-setting/account-setting.component'
import { AllUsersComponent } from './all-users/all-users.component'
import { AddUserComponent } from './all-users/add-user/add-user.component'
import { ProjectsComponent } from './projects/projects.component'
import { AddProjectComponent } from './projects/add-project/add-project.component'
import { MainComponent } from './main/main.component'
import { TransactionHistoryComponent } from './transaction-history/transaction-history.component'

const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    component: MainComponent,
    children: [
      {
        path: 'account-setting',
        component: AccountSettingComponent
      },
      {
        path: 'users',
        component: AllUsersComponent
      },
      {
        path: 'users/add-user',
        component: AddUserComponent
      },
      {
        path: 'projects',
        component: ProjectsComponent
      },
      {
        path: 'projects/add-project',
        component: AddProjectComponent
      },
      {
        path: 'transaction-history',
        component: TransactionHistoryComponent
      },
    ]
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MainModuleRoutingModule {}
