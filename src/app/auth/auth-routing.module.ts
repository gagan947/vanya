import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { AuthComponent } from './auth/auth.component'
import { LogInComponent } from './log-in/log-in.component'
import { SignUpComponent } from './sign-up/sign-up.component'
import { ForgetPasswordComponent } from './forget-password/forget-password.component'
import { MessageComponent } from './message/message.component'

const routes: Routes = [
  {
    path: '',
    redirectTo: 'auth',
    pathMatch: 'full'
  },
  {
    path: 'auth',
    component: AuthComponent,
    children: [
      {
        path: '',
        component: LogInComponent,
        pathMatch: 'full'
      },
      {
        path: 'sign-up',
        component: SignUpComponent
      },
      {
        path: 'forget-password',
        component: ForgetPasswordComponent
      }
    ]
  },
  {
    path: 'message',
    component: MessageComponent
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule {}
