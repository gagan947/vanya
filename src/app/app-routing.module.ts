import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { AuthGuard } from './guards/auth.guard'

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule)
  },
  {
    path: 'marketplace',
    loadChildren: () =>
      import('./marketplace/marketplace.module').then(m => m.MarketplaceModule)
  },
  {
    path: 'main',
    loadChildren: () =>
      import('./main-module/main-module.module').then(m => m.MainModuleModule),
    canActivate: [AuthGuard]
  }
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
