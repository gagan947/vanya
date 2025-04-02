import { Component } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { City, Country, State } from 'country-state-city'
import { NzMessageService } from 'ng-zorro-antd/message';
import { SharedService } from 'src/app/services/shared.service'
import { Location } from '@angular/common'
import { ImageCroppedEvent } from 'ngx-image-cropper'
import { SidebarComponent } from '../sidebar/sidebar.component'
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog'
import { ImagePreviewComponent } from 'src/app/shared/image-preview/image-preview.component'
import { gstValidator, NoWhitespaceDirective } from 'src/app/shared/validator'
import { CountryISO } from 'ngx-intl-tel-input';
import { environment } from 'src/environments/environment'

@Component({
  selector: 'app-account-setting',
  templateUrl: './account-setting.component.html',
  styleUrls: ['./account-setting.component.css']
})
export class AccountSettingComponent {
  userInfo: any
  visible: boolean = false
  profile_img: any
  imageChangedEvent: any = ''
  croppedImage: any = ''
  isEditable: boolean = false
  isEditable2: boolean = false
  countries: any
  states: any
  cities: any
  countryCode: any
  updateInfoForm!: FormGroup
  croppedImageBlob: any
  loading: boolean = false
  file: any
  ref: DynamicDialogRef | undefined
  type: string = 'I';
  selectedCountry = CountryISO.India
  baseUrl = environment.imgUrl

  constructor(
    private _location: Location,
    private fb: FormBuilder,
    private toastr: NzMessageService,
    private service: SharedService,
    private sidebar: SidebarComponent,
    private dialogService: DialogService
  ) {
    this.createForm()
  }

  ngOnInit() {
    this.countries = Country.getAllCountries()
    this.getUserInfo()
    if (this.type === 'C') {
      this.setCompanyValidators(this.type)
    }
    this.updateInfoForm.get('country')?.valueChanges.subscribe((isoCode) => {
      let countryName = this.countries.find((country: { isoCode: any; }) => country.isoCode === isoCode).name
      this.selectedCountry = CountryISO[countryName as keyof typeof CountryISO]
    });
  }

  setCompanyValidators(type: string) {
    const companyName = this.updateInfoForm.get('companyName');
    const gst = this.updateInfoForm.get('gst');
    const vat = this.updateInfoForm.get('vat');
    if (type === 'C') {
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

  back() {
    this._location.back()
  }

  createForm() {
    this.updateInfoForm = this.fb.group({
      user_id: [''],
      first_name: ['', [Validators.required, Validators.maxLength(30), NoWhitespaceDirective.validate]],
      last_name: ['', [Validators.required, Validators.maxLength(30), NoWhitespaceDirective.validate]],
      address: ['', [Validators.required, Validators.maxLength(100)]],
      city: ['', [Validators.maxLength(20)]],
      state: ['', [Validators.maxLength(20)]],
      country: ['', [Validators.maxLength(20)]],
      profile_img: [''],
      companyName: ['', Validators.required],
      gst: [''],
      vat: [''],
      licence: [''],
      type: [''],
    })
  }

  fileChangeEvent(event: any): void {
    this.imageChangedEvent = event
    this.visible = !this.visible
  }
  imageCropped(event: ImageCroppedEvent) {
    this.croppedImageBlob = event.blob
    this.croppedImage = event.objectUrl
  }

  onDone() {
    this.visible = !this.visible
    this.profile_img = this.croppedImage

    this.file = new File([this.croppedImageBlob], 'profile_image.png', {
      type: 'image/png'
    })
    this.uploadProfile()
  }

  uploadProfile() {
    this.loading = true
    let apiUrl = `updateUserProfileImageC`
    let formData = new FormData()
    formData.append('profile_image', this.file)

    this.service.upload(apiUrl, formData).subscribe(res => {
      if (res.success) {
        this.toastr.success(res.msg)
        this.sidebar.getUserInfo()
        this.loading = false
        this.isEditable = false
        setTimeout(() => {
          this.getUserInfo()
        }, 1000);
      } else {
        // this.toastr.error(res.message)
        this.loading = false
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

  updateInfo() {
    this.loading = true
    let formData = new URLSearchParams()
    formData.set(
      'user_id',
      this.updateInfoForm.get('user_id')!.value
        ? this.updateInfoForm.get('user_id')!.value
        : localStorage.getItem('user')
    )
    formData.set('first_name', this.updateInfoForm.get('first_name')!.value)
    formData.set('last_name', this.updateInfoForm.get('last_name')!.value)
    formData.set('address', this.updateInfoForm.get('address')!.value)
    formData.set('city', this.updateInfoForm.get('city')!.value)
    formData.set('state', this.updateInfoForm.get('state')!.value)
    formData.set('country', this.updateInfoForm.get('country')!.value)

    let apiUrl = ''
    if (this.userInfo) {
      apiUrl = `updateUserProfileC`
    } else {
      apiUrl = `insertUserProfileC`
    }

    this.service.postWithToken(apiUrl, formData.toString()).subscribe(res => {
      if (res.success) {
        // this.uploadProfile()
        this.sidebar.getUserInfo()
        this.isEditable = false
        this.loading = false
        // this.toastr.success(res.message)
      } else {
        this.loading = false
        // this.toastr.error(res.message)
      }
    })
  }

  updateCompanyInfo() {
    // advanceIndividualToCorporate
    this.loading = true
    let formData = new URLSearchParams()

    if (this.updateInfoForm.get('gst')!.value) {
      formData.set('gst_number', this.updateInfoForm.get('gst')!.value)
    }

    if (this.updateInfoForm.get('licence')!.value) {
      formData.set('license_number', this.updateInfoForm.get('licence')!.value)
    }
    if (this.updateInfoForm.get('vat')!.value) {
      formData.set('vat_number', this.updateInfoForm.get('vat')!.value)
    }
    formData.set('user_type', this.type)
    formData.set('company_name', this.updateInfoForm.get('companyName')!.value)

    let apiUrl = 'advanceIndividualToCorporate'

    this.service.postWithToken(apiUrl, formData.toString()).subscribe(res => {
      if (res.success) {
        // this.uploadProfile()
        this.sidebar.getUserInfo()
        this.isEditable2 = false
        this.loading = false
        this.toastr.success(res.message)
      } else {
        this.loading = false
        this.toastr.error(res.message)
      }
    })
  }

  getUserInfo() {
    let data: any = localStorage.getItem('userInfo')
    this.userInfo = JSON.parse(data)
    if (this.userInfo) {
      this.type = this.userInfo.user_type
      this.countryCode = this.userInfo.country
      this.getStates({ target: { value: this.userInfo.country } })
      this.getCities({ target: { value: this.userInfo.state } })
      this.updateInfoForm.patchValue({
        user_id: this.userInfo.user_id,
        first_name: this.userInfo.first_name,
        last_name: this.userInfo.last_name,
        address: this.userInfo.address,
        state: this.userInfo.state,
        city: this.userInfo.city,
        country: this.userInfo.country,
        companyName: this.userInfo.company_name !== 'undefined' ? this.userInfo.company_name : '',
        gst: this.userInfo.gst_number !== 'undefined' ? this.userInfo.gst_number : '',
        vat: this.userInfo.vat_number !== 'undefined' ? this.userInfo.vat_number : '',
        licence: this.userInfo.license_number !== 'undefined' ? this.userInfo.license_number : '',
      })
    }
  }

  vievImage(imgName: any) {
    this.ref = this.dialogService.open(ImagePreviewComponent, {
      data: imgName,
      width: '',
      styleClass: 'bg-white shadow-md rounded',
      dismissableMask: true,
      showHeader: false
    })
  }

  getErrorMessage(field: string) {
    const control = this.updateInfoForm.controls[field]
    if (control.hasError('required')) {
      return 'This field cannot be empty'
    } else if (control.hasError('maxlength')) {
      return `this field must be only ${control.getError('maxlength').requiredLength
        } characters long`
    } else if (control.hasError('invalidGST')) {
      return `Invalid GST number format.`
    }
    return ''
  }
}
