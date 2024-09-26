import { Component } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { Router } from '@angular/router'
import { City, Country, State } from 'country-state-city'
import { ToastrService } from 'ngx-toastr'
import { SharedService } from 'src/app/services/shared.service'
import { Location } from '@angular/common'
import { ImageCroppedEvent } from 'ngx-image-cropper'
import { SidebarComponent } from '../sidebar/sidebar.component'
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog'
import { ImagePreviewComponent } from 'src/app/shared/image-preview/image-preview.component'

@Component({
  selector: 'app-account-setting',
  templateUrl: './account-setting.component.html',
  styleUrls: ['./account-setting.component.css']
})
export class AccountSettingComponent {
  userInfo: any
  visible: boolean = false
  profile_img = 'assets/images/profile_logo.jpg'
  imageChangedEvent: any = ''
  croppedImage: any = ''
  isEditable: boolean = false
  countries: any
  states: any
  cities: any
  countryCode: any
  updateInfoForm!: FormGroup
  croppedImageBlob: any
  loading: boolean = false
  file: any
  ref: DynamicDialogRef | undefined

  constructor (
    private _location: Location,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private service: SharedService,
    private sidebar: SidebarComponent,
    private dialogService: DialogService
  ) {
    this.getUserInfo()
  }

  ngOnInit () {
    this.countries = Country.getAllCountries()
    this.createForm()
  }

  back () {
    this._location.back()
  }

  createForm () {
    this.updateInfoForm = this.fb.group({
      user_id: [''],
      profile_name: ['', Validators.required],
      address: [''],
      city: [''],
      state: [''],
      country: [''],
      profile_img: ['']
    })
  }

  fileChangeEvent (event: any): void {
    this.imageChangedEvent = event
    this.visible = !this.visible
  }
  imageCropped (event: ImageCroppedEvent) {
    this.croppedImageBlob = event.blob
    this.croppedImage = event.objectUrl
  }

  onDone () {
    this.visible = !this.visible
    this.profile_img = this.croppedImage

    this.file = new File([this.croppedImageBlob], 'profile_image.png', {
      type: 'image/png'
    })
  }

  uploadProfile () {
    this.loading = true
    let apiUrl = `updateUserProfileImageC`
    let formData = new FormData()
    formData.append('profile_image', this.file)

    this.service.upload(apiUrl, formData).subscribe(res => {
      if (res.success) {
        this.toastr.success(res.msg)
        this.getUserInfo()
        this.loading = false
        this.isEditable = false
        this.sidebar.getUserInfo()
      } else {
        // this.toastr.error(res.message)
        this.loading = false
      }
    })
  }

  getStates (event: any) {
    this.countryCode = event.target.value
    this.states = State.getStatesOfCountry(event.target.value)
  }
  getCities (event: any) {
    this.cities = City.getCitiesOfState(this.countryCode, event.target.value)
  }

  updateInfo () {
    this.loading = true
    let formData = new URLSearchParams()
    formData.set(
      'user_id',
      this.updateInfoForm.get('user_id')!.value
        ? this.updateInfoForm.get('user_id')!.value
        : localStorage.getItem('user')
    )
    formData.set('profile_name', this.updateInfoForm.get('profile_name')!.value)
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
        this.uploadProfile()
        this.getUserInfo()
        this.isEditable = false
        this.loading = false

        // this.toastr.success(res.message)
      } else {
        this.loading = false
        // this.toastr.error(res.message)
      }
    })
  }

  getUserInfo () {
    this.loading = true
    let apiUrl = `getUserRoleProfile`
    this.service.get(apiUrl).subscribe(res => {
      if (res.success) {
        this.userInfo = res.userDetails[0]
        this.loading = false
        this.updateInfoForm.patchValue({
          user_id: this.userInfo.user_id,
          profile_name: this.userInfo.profile_name,
          address: this.userInfo.address,
          state: this.userInfo.state,
          city: this.userInfo.city,
          country: this.userInfo.country
        })
      } else {
        // this.toastr.error(res.msg)
        this.loading = false
      }
    })
  }

  vievImage (imgName: any) {
    this.ref = this.dialogService.open(ImagePreviewComponent, {
      data: imgName,
      width: '',
      styleClass: 'bg-white shadow-md rounded',
      dismissableMask: true,
      showHeader: false
    })
  }
}
