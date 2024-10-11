import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { AccountSettingComponent } from './account-setting/account-setting.component'
import { AllUsersComponent } from './all-users/all-users.component'
import { AddUserComponent } from './all-users/add-user/add-user.component'
import { ProjectsComponent } from './projects/projects.component'
import { AddProjectComponent } from './projects/add-project/add-project.component'
import { MainComponent } from './main/main.component'
import { TransactionHistoryComponent } from './transaction-history/transaction-history.component'
import { CreditHistoryComponent } from './credit-history/credit-history.component'
import { CertificateComponent } from './certificate/certificate.component'
import { HistoryInvoiceComponent } from './credit-history/history-invoice/history-invoice.component'
import { DashboardComponent } from './dashboard/dashboard.component'

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
        path: 'all',
        component: DashboardComponent,
      },
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
      {
        path: 'credit-history',
        component: CreditHistoryComponent
      },
      {
        path: 'invoice',
        component: HistoryInvoiceComponent
      },
      {
        path: 'certificate',
        component: CertificateComponent
      },
    ]
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MainModuleRoutingModule { }
