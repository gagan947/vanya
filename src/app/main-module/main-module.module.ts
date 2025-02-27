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
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';
import { TransactionHistoryComponent } from './transaction-history/transaction-history.component'
import { CreditHistoryComponent } from './credit-history/credit-history.component';
import { CertificateComponent } from './certificate/certificate.component';
import { CertificateViewComponent } from './certificate/certificate-view/certificate-view.component';
import { HistoryInvoiceComponent } from './credit-history/history-invoice/history-invoice.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { BuyerDashboardComponent } from './buyer-dashboard/buyer-dashboard.component';
import { SellerDashboardComponent } from './seller-dashboard/seller-dashboard.component';
import { SalesReportComponent } from './sales-report/sales-report.component'
import { AddCertificateComponent } from './certificate/add-certificate/add-certificate.component'

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
    MainComponent,
    TransactionHistoryComponent,
    CreditHistoryComponent,
    CertificateComponent,
    CertificateViewComponent,
    HistoryInvoiceComponent,
    DashboardComponent,
    BuyerDashboardComponent,
    SellerDashboardComponent,
    SalesReportComponent,
    AddCertificateComponent,
  ],
  imports: [
    CommonModule,
    MainModuleRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    NgxIntlTelInputModule,
  ],
  exports: [SidebarComponent],
  providers: [ConfirmationService, DialogService]
})
export class MainModuleModule { }
