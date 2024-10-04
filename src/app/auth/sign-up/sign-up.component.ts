import { Component } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { Router } from '@angular/router'
import { ToastrService } from 'ngx-toastr'
import { AuthService } from 'src/app/services/auth.service'
import { Country, State, City } from 'country-state-city'
import { strongPasswordValidator } from '../../shared/validator'
import { SearchCountryField, CountryISO } from 'ngx-intl-tel-input'

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent {
  signUpForm: FormGroup
  showPassword: boolean = false
  countries: any
  states: any
  cities: any
  countryCode: any
  selectedRole: string

  constructor(
    private fb: FormBuilder,
    private toastr: ToastrService,
    private service: AuthService,
    private router: Router
  ) {
    this.selectedRole = '2'
    this.signUpForm = this.fb.group({
      roll_id: [''],
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phone_number: ['', [Validators.required]],
      companyName: ['', Validators.required],
      country: ['', [Validators.required]],
      state: [{ value: '', disabled: true }, [Validators.required]],
      address: ['', [Validators.required]],
      city: [{ value: '', disabled: true }, [Validators.required]],
      password: [
        '',
        [Validators.required, Validators.minLength(8), strongPasswordValidator]
      ]
    })
  }

  ngOnInit(): void {
    this.countries = Country.getAllCountries()
  }

  onSubmit(form: any) {
    form.markAllAsTouched()
    if (form.invalid) {
      return
    }

    let apiUrl = `signup`
    let formData = new URLSearchParams()
    formData.set('role_id', this.selectedRole)
    formData.set('first_name', form.value.firstName)
    formData.set('last_name', form.value.lastName)
    formData.set('email', form.value.email)
    formData.set('password', form.value.password)
    formData.set('company_name', form.value.companyName)
    formData.set('city', form.value.city)
    formData.set('state', form.value.state)
    formData.set('country', form.value.country)
    formData.set('address', form.value.address)
    formData.set('phone_number', form.value.phone_number.number)
    this.service.post(apiUrl, formData.toString()).subscribe(res => {
      if (res.success) {
        this.toastr.success(res.message)
        this.router.navigate(['/'])
      } else {
        this.toastr.error(res.message)
      }
    })
  }

  getErrorMessage(field: string) {
    const control = this.signUpForm.controls[field]
    if (control.hasError('required')) {
      return 'This field cannot be empty'
    } else if (control.hasError('email')) {
      return 'Please enter a valid email address'
    } else if (control.hasError('minlength')) {
      return `Password must be at least ${control.getError('minlength').requiredLength
        } characters long`
    } else if (control.hasError('validatePhoneNumber')) {
      const errors = control.getError('validatePhoneNumber')
      if (!errors.valid) return 'Please enter a valid phone number'
    } else if (control.hasError('strongPassword')) {
      const errors = control.getError('strongPassword')
      if (!errors.isValidLength)
        return 'Password must be at least 8 characters long'
      if (!errors.hasUpperCase)
        return 'Password must contain at least one uppercase letter'
      if (!errors.hasLowerCase)
        return 'Password must contain at least one lowercase letter'
      if (!errors.hasNumeric) return 'Password must contain at least one number'
      if (!errors.hasSpecialCharacter)
        return 'Password must contain at least one special character'
    }
    return ''
  }

  getStates(event: any) {
    this.countryCode = event.target.value
    this.states = State.getStatesOfCountry(event.target.value)
    if (this.states.length > 0) {
      this.signUpForm.get('state')?.enable()
    }
  }
  getCities(event: any) {
    this.cities = City.getCitiesOfState(this.countryCode, event.target.value)
    if (this.cities.length > 0) {
      this.signUpForm.get('city')?.enable()
    }
  }

  selectRole(role: string) {
    this.selectedRole = role
  }

  SearchCountryField = SearchCountryField
  CountryISO = CountryISO
  preferredCountries: CountryISO[] = [CountryISO.India]
}
