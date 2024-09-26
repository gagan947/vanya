import { Component } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { Router } from '@angular/router'
import { ToastrService } from 'ngx-toastr'
import { AuthService } from 'src/app/services/auth.service'
import { SharedService } from 'src/app/services/shared.service'

@Component({
  selector: 'app-log-in',
  templateUrl: './log-in.component.html',
  styleUrls: ['./log-in.component.css']
})
export class LogInComponent {
  logInForm: FormGroup
  showPassword: boolean = false
  loading: boolean = false

  constructor (
    private fb: FormBuilder,
    private toastr: ToastrService,
    private service: AuthService,
    private router: Router,
    private shared: SharedService
  ) {
    this.logInForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    })
  }
  onSubmit (form: any) {
    this.loading = true
    form.markAllAsTouched()
    if (form.invalid) {
      this.loading = false
      return
    }

    let apiUrl = `login`
    let formData = new URLSearchParams()
    formData.set('email', form.value.email)
    formData.set('password', form.value.password)
    this.service.post(apiUrl, formData.toString()).subscribe(res => {
      if (res.success && res.token) {
        this.service.setToken(res.token)
        this.shared.get('getUserRoleDetails').subscribe(res2 => {
          this.router.navigate(['/main'])
          localStorage.setItem('user', res2.userRoles.id)
          this.service.setRole(res2.userRoles.role_type)
          this.toastr.success(res.message)

          this.loading = false
        })
      } else {
        this.toastr.error(res.message)
        this.loading = false
      }
    })
  }

  getErrorMessage (field: string) {
    const control = this.logInForm.controls[field]
    if (control.hasError('required')) {
      return 'This field cannot be empty'
    } else if (control.hasError('email')) {
      return 'Please enter a valid email address'
    }
    return ''
  }
}
