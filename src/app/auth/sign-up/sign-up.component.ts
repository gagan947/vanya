import { Component } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { Router } from '@angular/router'
import { NzMessageService } from 'ng-zorro-antd/message';
import { AuthService } from 'src/app/services/auth.service'
import { Country, State, City } from 'country-state-city'
import { gstValidator, NoWhitespaceDirective, strongPasswordValidator } from '../../shared/validator'
import { CountryISO, SearchCountryField } from 'ngx-intl-tel-input'

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
  type: number = 1
  role: string | null | undefined;
  SearchCountryField = SearchCountryField
  CountryISO = CountryISO;
  selectedCountry = CountryISO.India
  constructor(
    private fb: FormBuilder,
    private toastr: NzMessageService,
    private service: AuthService,
    private router: Router
  ) {
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

    this.selectedRole = '2'
    this.signUpForm = this.fb.group({
      type: [1],
      roll_id: [''],
      firstName: ['', [Validators.required, NoWhitespaceDirective.validate]],
      lastName: ['', [Validators.required, NoWhitespaceDirective.validate]],
      email: ['', [Validators.required, Validators.email]],
      phone_number: ['', [Validators.required]],
      country: ['', [Validators.required]],
      state: [{ value: '', disabled: true }, [Validators.required]],
      address: ['', [Validators.required]],
      city: [{ value: '', disabled: true }, [Validators.required]],
      password: [
        '',
        [Validators.required, Validators.minLength(8), strongPasswordValidator]
      ],
      companyName: [''],
      gst: [''],
      vat: [''],
      licence: [''],
    })
  }

  ngOnInit(): void {
    this.countries = Country.getAllCountries()
    this.signUpForm.get('type')?.valueChanges.subscribe((value) => {
      this.type = value
      this.setCompanyValidators(value);
    });
    this.signUpForm.get('country')?.valueChanges.subscribe((isoCode) => {
      let countryName = this.countries.find((country: { isoCode: any; }) => country.isoCode === isoCode).name
      this.selectedCountry = CountryISO[countryName as keyof typeof CountryISO]
    });
  }

  setCompanyValidators(type: string) {
    const companyName = this.signUpForm.get('companyName');
    const gst = this.signUpForm.get('gst');
    const vat = this.signUpForm.get('vat');
    if (type === 'company') {
      companyName?.setValidators([Validators.required, NoWhitespaceDirective.validate]);
      gst?.setValidators(gstValidator());
      // vat?.setValidators();
    } else {
      companyName?.clearValidators();
      gst?.clearValidators();
      // vat?.clearValidators();
    }
    companyName?.updateValueAndValidity();
    gst?.updateValueAndValidity();
    // vat?.updateValueAndValidity();
  }

  onSubmit(form: any) {
    form.markAllAsTouched()
    if (form.invalid) {
      return
    }

    let apiUrl = `signup`
    let formData = new URLSearchParams()
    formData.set('role_id', this.selectedRole)
    formData.set('first_name', this.toTitleCase(form.value.firstName))
    formData.set('last_name', this.toTitleCase(form.value.lastName))
    formData.set('email', form.value.email)
    formData.set('password', form.value.password)
    formData.set('company_name', form.value.companyName ? form.value.companyName : '')
    formData.set('city', form.value.city)
    formData.set('state', form.value.state)
    formData.set('country', form.value.country)
    formData.set('address', form.value.address)
    formData.set('phone_number', form.value.phone_number.number)
    if (form.value.gst) {
      formData.set('gst_number', form.value.gst)
    }
    if (form.value.licence) {
      formData.set('license_number', form.value.licence)
    }
    if (form.value.vat) {
      formData.set('vat_number', form.value.vat)
    }
    formData.set('user_type', form.value.type)
    this.service.post(apiUrl, formData.toString()).subscribe(res => {
      if (res.success) {
        this.toastr.success(res.message)
        this.router.navigate(['/'])
      } else {
        this.toastr.error(res.message)
      }
    })
  }

  toTitleCase(str: string) {
    return str.replace(/\w\S*/g, function (txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
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
    } else if (control.hasError('invalidGST')) {
      return `Invalid GST number format.`
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
}
