import { Component } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { Router } from '@angular/router'
import { NzMessageService } from 'ng-zorro-antd/message';
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
  role: string | null | undefined
  selectedRole: string
  constructor(
    private fb: FormBuilder,
    private toastr: NzMessageService,
    private service: AuthService,
    private router: Router,
    private shared: SharedService
  ) {
    this.selectedRole = '2'
    this.logInForm = this.fb.group({
      email: [localStorage.getItem('savedEmail') || '', [Validators.required, Validators.email]],
      password: [localStorage.getItem('savedPassword') || '', [Validators.required]],
      rememberMe: [localStorage.getItem('rememberMe') === 'true', false]
    })
    this.service.authState$.subscribe(res => {
      this.role = res.role
    })
    if (this.service.isLogedIn() && this.role == 'Approver') {
      this.router.navigate(['/main/dashboard/admin']);
    } else if (this.service.isLogedIn() && this.role == 'Seller') {
      this.router.navigate(['/main/dashboard/seller']);
    } else if (this.service.isLogedIn() && this.role == 'Buyer') {
      this.router.navigate(['/main/dashboard/buyer']);
    } else {
      this.router.navigate([this.router.url]);
    }
  }
  onSubmit(form: any) {
    this.loading = true;
    form.markAllAsTouched();

    if (form.invalid) {
      this.loading = false;
      return;
    }

    let apiUrl = `login`;
    let formData = new URLSearchParams();
    formData.set('email', form.value.email);
    formData.set('password', form.value.password);
    this.service.post(apiUrl, formData.toString()).subscribe((res: any) => {
      if (res.success && res.token) {
        this.service.setToken(res.token);
        localStorage.setItem('user', res.userinfo.id);
        switch (res.userinfo.role_id) {
          case 3:
            this.service.setRole('Approver');
            this.router.navigate(['/main/dashboard/admin']);
            break;
          case 1:
            this.service.setRole('Seller');
            this.router.navigate(['/main/dashboard/seller']);
            break;
          default:
            this.service.setRole('Buyer');
            this.router.navigate(['/main/dashboard/buyer']);
        }
        if (form.value.rememberMe) {
          localStorage.setItem('savedEmail', form.value.email);
          localStorage.setItem('savedPassword', form.value.password);
          localStorage.setItem('rememberMe', 'true');
        } else {
          localStorage.removeItem('savedEmail');
          localStorage.removeItem('savedPassword');
          localStorage.removeItem('rememberMe');
        }
        this.toastr.success(res.message);
        this.loading = false;
      } else {
        this.toastr.error(res.message);
        this.loading = false;
      }
    });
  }

  getErrorMessage(field: string) {
    const control = this.logInForm.controls[field]
    if (control.hasError('required')) {
      return 'This field cannot be empty'
    } else if (control.hasError('email')) {
      return 'Please enter a valid email address'
    }
    return ''
  }

  selectRole(role: string) {
    this.selectedRole = role
  }
}


// this.service.post(apiUrl, formData.toString()).subscribe(res => {
//   if (res.success && res.token) {
//     this.service.setToken(res.token);
//     this.shared.get('getUserRoleDetails').subscribe(res2 => {
//       const roleType = res2.userRoles.role_type;
//       const userId = res2.userRoles.id;

//       // Store user ID and role
//       localStorage.setItem('user', userId);
//       this.service.setRole(roleType);

//       // Navigate based on user role
//       switch (roleType) {
//         case 'Approver':
//           this.router.navigate(['/main/dashboard/admin']);
//           break;
//         case 'Seller':
//           this.router.navigate(['/main/dashboard/seller']);
//           break;
//         default:
//           this.router.navigate(['/main/dashboard/buyer']);
//       }

//       // **Remember Me Functionality**
//       if (form.value.rememberMe) {
//         localStorage.setItem('savedEmail', form.value.email);
//         localStorage.setItem('savedPassword', form.value.password);
//         localStorage.setItem('rememberMe', 'true');
//       } else {
//         localStorage.removeItem('savedEmail');
//         localStorage.removeItem('savedPassword');
//         localStorage.removeItem('rememberMe');
//       }

//       this.toastr.success(res.message);
//       this.loading = false;
//     });
//   } else {
//     this.toastr.error(res.message);
//     this.loading = false;
//   }
// });