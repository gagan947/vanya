import { Component } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { Router } from '@angular/router'
import { ToastrService } from 'ngx-toastr'
import { AuthService } from 'src/app/services/auth.service'

@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.css']
})
export class ForgetPasswordComponent {
  forgetPasswordForm: FormGroup

  constructor (
    private fb: FormBuilder,
    private toastr: ToastrService,
    private service: AuthService,
    private router: Router
  ) {
    this.forgetPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    })
  }
  onSubmit (form: any) {
    form.markAllAsTouched()
    if (form.invalid) {
      return
    }

    let apiUrl = `forgetPassword`
    let formData = new URLSearchParams()
    formData.set('email', form.value.email)
    this.service.post(apiUrl, formData.toString()).subscribe(res => {
      if (res.success && res.token !== '') {
        this.router.navigate(['/message'])
      } else {
        this.toastr.error(res.message)
      }
    })
  }

  getErrorMessage (field: string) {
    const control = this.forgetPasswordForm.controls[field]
    if (control.hasError('required')) {
      return 'This field cannot be empty'
    } else if (control.hasError('email')) {
      return 'Please enter a valid email address'
    } else if (control.hasError('minlength')) {
      return `Password must be at least ${
        control.getError('minlength').requiredLength
      } characters long`
    }
    return ''
  }
}
