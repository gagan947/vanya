import { Component } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { ActivatedRoute, Router } from '@angular/router'
import { ToastrService } from 'ngx-toastr'
import { Country, State, City } from 'country-state-city'
import { SharedService } from 'src/app/services/shared.service'
import { strongPasswordValidator } from 'src/app/shared/validator'
import { SearchCountryField, CountryISO } from 'ngx-intl-tel-input'

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css']
})
export class AddUserComponent {
  userForm: FormGroup
  showPassword: boolean = false
  countries: any
  states: any
  cities: any
  countryCode: any
  user_id: string | null | undefined
  SearchCountryField = SearchCountryField
  CountryISO = CountryISO
  preferredCountries: CountryISO[] = [CountryISO.India]

  constructor(
    private fb: FormBuilder,
    private toastr: ToastrService,
    private service: SharedService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.route.queryParams.subscribe(params => {
      if (params['id']) {
        this.user_id = params['id']
        this.getUsersList()
      }
    })

    this.userForm = this.fb.group({
      id: [''],
      role_id: ['', [Validators.required]],
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phone_number: ['', [Validators.required]],
      company_name: ['', Validators.required],
      status: [''],
      country: ['', [Validators.required]],
      state: ['', [Validators.required]],
      address: ['', [Validators.required]],
      city: ['', [Validators.required]],
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
    // if (form.invalid) {
    //   return
    // }

    if (this.user_id) {
      this.updateUser(form)
    } else {
      this.createUser(form)
    }
  }

  createUser(form: any) {
    let apiUrl = `addUser`
    let formData = new URLSearchParams()
    formData.append('role_id', form.value.role_id)
    formData.append('first_name', form.value.firstName)
    formData.append('last_name', form.value.lastName)
    formData.append('email', form.value.email)
    formData.append('phone_number', form.value.phone_number)
    formData.append('company_name', form.value.company_name)
    formData.append('country', form.value.country)
    formData.append('state', form.value.state)
    formData.append('address', form.value.address)
    formData.append('city', form.value.city)
    formData.append('password', form.value.password)

    this.service
      .postWithToken(apiUrl, formData.toString())
      .subscribe((res: any) => {
        if (res.success) {
          this.toastr.success(res.message)
          this.router.navigate(['main/dashboard/users'])
        } else {
          this.toastr.error(res.message)
        }
      })
  }

  updateUser(form: any) {
    let apiUrl = `updateUser`
    let formData = new URLSearchParams()
    // formData.append('role_id', form.value.role_id)
    formData.append('first_name', form.value.firstName)
    formData.append('last_name', form.value.lastName)
    formData.append('email', form.value.email)
    formData.append('status', form.value.status)
    formData.append('id', form.value.id)

    this.service
      .postWithToken(apiUrl, formData.toString())
      .subscribe((res: any) => {
        if (res.success) {
          this.toastr.success(res.msg)
          this.router.navigate(['/main/dashboard/users'])
        } else {
          this.toastr.error(res.message)
        }
      })
  }

  getErrorMessage(field: string) {
    const control = this.userForm.controls[field]
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

  getUsersList() {
    let formData = new URLSearchParams()
    formData.set('page', '1')
    formData.set('page_size', '10')

    let apiUrl = `getAllUserList`
    this.service.postWithToken(apiUrl, formData.toString()).subscribe(res => {
      if (res.success) {
        const userInfo = res.finalList.find(
          (item: any) => item.id == this.user_id
        )
        if (userInfo) {
          const nameParts = userInfo.name.split(' ')
          let firstName = nameParts[0]
          let lastName = nameParts.slice(1).join(' ')
          this.userForm.patchValue({
            firstName: firstName,
            lastName: lastName,
            email: userInfo.email,
            status: userInfo.status,
            role_id: userInfo.role_id,
            id: userInfo.id
          })
        }
      } else {
        this.toastr.error(res.message)
      }
    })
  }

  getStates(event: any) {
    this.countryCode = event.target.value
    this.states = State.getStatesOfCountry(event.target.value)
  }
  getCities(event: any) {
    this.cities = City.getCitiesOfState(this.countryCode, event.target.value)
  }
}
