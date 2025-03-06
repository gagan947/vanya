import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { NzMessageService } from 'ng-zorro-antd/message';
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { AuthService } from 'src/app/services/auth.service';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-add-certificate',
  standalone: false,
  templateUrl: './add-certificate.component.html',
  styleUrl: './add-certificate.component.css'
})
export class AddCertificateComponent {
  certificate_id: any;
  Form!: FormGroup;
  loading: boolean = false;
  data: any;
  visible: boolean = false;
  file: any;
  croppedImageBlob: any;
  croppedImage: string | null | undefined;
  imageChangedEvent: any = ''
  role: string | null | undefined;

  constructor(
    private fb: FormBuilder,
    private toastr: NzMessageService,
    private service: SharedService,
    private router: Router,
    private route: ActivatedRoute,
    private dialogConfig: DynamicDialogConfig,
    public dialogService: DialogService,
    public ref: DynamicDialogRef,
    private authService: AuthService
  ) {
    this.route.queryParams.subscribe(params => {
      if (params['id']) {
        this.certificate_id = params['id']
        // this.getUsersList()
      }
    })

    this.Form = this.fb.group({
      project_id: ['', [Validators.required]],
      carbon_credits: ['', [Validators.required]],
      standard: ['', [Validators.required]],
      issued_on_name: ['', [Validators.required]],
      certificate: ['', [Validators.required]],
    })
  }

  ngOnInit() {
    this.authService.authState$.subscribe(res => {
      this.role = res.role
    })
    this.data = this.dialogConfig.data

  }

  fileChangeEvent(event: any): void {
    this.imageChangedEvent = event
    if (event.target.files.length > 0) {
      this.visible = !this.visible
    }
  }
  imageCropped(event: ImageCroppedEvent) {
    this.croppedImageBlob = event.blob
    this.croppedImage = event.objectUrl
  }

  onDone() {
    this.visible = !this.visible
    this.file = new File([this.croppedImageBlob], 'profile_image.png', {
      type: 'image/png'
    })
  }

  onSubmit(form: any) {
    this.loading = true
    let ApiUrl = ''

    if (this.role == 'Buyer') {
      ApiUrl = 'buyer/createCertificate'
    } else {
      ApiUrl = 'seller/createCertificate'
    }

    let formData = new FormData()
    formData.append('project_id', form.value.project_id)
    formData.append('carbon_credits', form.value.carbon_credits)
    formData.append('standard', form.value.standard)
    formData.append('issued_on_name', form.value.issued_on_name)
    formData.append('certificate', this.file)

    this.service.upload(ApiUrl, formData).subscribe({
      next: res => {
        if (res.success == true) {
          this.loading = false
          this.toastr.success(res.message)
          this.router.navigate(['/main/dashboard/certificate'])
        } else {
          this.loading = false
          this.toastr.error(res.message)
        }
      },
      error: err => {
        this.loading = false
      }
    })

  }

  getErrorMessage(field: string) {
    const control = this.Form.controls[field]
    if (control.hasError('required')) {
      return 'This field cannot be empty'
    } else if (control.hasError('max')) {
      return `Value should not be gratter than ${control.getError('max').max}`
    } else if (control.hasError('min')) {
      return `Value should not be less than 0`
    }
    return ''
  }
}
