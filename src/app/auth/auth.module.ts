import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { AuthRoutingModule } from './auth-routing.module'
import { AuthComponent } from './auth/auth.component'
import { LogInComponent } from './log-in/log-in.component'
import { SignUpComponent } from './sign-up/sign-up.component'
import { ForgetPasswordComponent } from './forget-password/forget-password.component'
import { MessageComponent } from './message/message.component'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { SharedModule } from '../shared/shared.module'
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input'

@NgModule({
  declarations: [
    AuthComponent,
    LogInComponent,
    SignUpComponent,
    ForgetPasswordComponent,
    MessageComponent
  ],
  imports: [
    CommonModule,
    AuthRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    NgxIntlTelInputModule
  ]
})
export class AuthModule { }
