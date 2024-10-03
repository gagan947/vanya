import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { MarketplaceRoutingModule } from './marketplace-routing.module'
import { AllProjectsComponent } from './all-projects/all-projects.component'
import { MarketplaceComponent } from './marketplace/marketplace.component'
import { SharedModule } from '../shared/shared.module'
import { ProjectDetailComponent } from './project-detail/project-detail.component'
import { MainModuleModule } from '../main-module/main-module.module'
import { ProjectOverviewComponent } from './project-overview/project-overview.component'
import { FormsModule } from '@angular/forms';
import { MessageDialogComponent } from './message-dialog/message-dialog.component';
import { ContactUsComponent } from './contact-us/contact-us.component';

@NgModule({
  declarations: [
    AllProjectsComponent,
    MarketplaceComponent,
    ProjectDetailComponent,
    ProjectOverviewComponent,
    MessageDialogComponent,
    ContactUsComponent,
  ],
  imports: [
    FormsModule,
    CommonModule,
    MarketplaceRoutingModule,
    SharedModule,
    MainModuleModule
  ]
})
export class MarketplaceModule {}
