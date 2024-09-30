import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { AllProjectsComponent } from './all-projects/all-projects.component'
import { MarketplaceComponent } from './marketplace/marketplace.component'
import { ProjectDetailComponent } from './project-detail/project-detail.component'
import { ProjectOverviewComponent } from './project-overview/project-overview.component'
import { ContactUsComponent } from './contact-us/contact-us.component'

const routes: Routes = [
  {
    path: '',
    redirectTo: 'projects',
    pathMatch: 'full'
  },
  {
    path: 'projects',
    component: MarketplaceComponent,
    children: [
      {
        path: '',
        component: AllProjectsComponent,
        pathMatch: 'full'
      },
      {
        path: 'project-detail',
        component: ProjectDetailComponent
      },
      {
        path: 'project-overview',
        component: ProjectOverviewComponent
      },
      {
        path: 'contact-us',
        component: ContactUsComponent
      },
    ]
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MarketplaceRoutingModule {}
