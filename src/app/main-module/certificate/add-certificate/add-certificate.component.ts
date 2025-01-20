import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { ToastrService } from 'ngx-toastr';
import { DialogService } from 'primeng/dynamicdialog';
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
  projectList: any;
  remaining_credits: any;
  visible: boolean = false;
  file: any;
  croppedImageBlob: any;
  croppedImage: string | null | undefined;
  imageChangedEvent: any = ''

  constructor(
    private fb: FormBuilder,
    private toastr: ToastrService,
    private service: SharedService,
    private router: Router,
    private route: ActivatedRoute,
    private dialogService: DialogService
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
    this.getAllProjects()
  }

  getAllProjects() {
    let ApiUrl = 'getProjectsByLimitSeller'
    this.loading = true
    this.service
      .get(
        `projects/${ApiUrl}?pageNo=${1}&pageSize=${20}&userid=${localStorage.getItem(
          'user'
        )}`
      )
      .subscribe({
        next: res => {
          if (res.status == 200) {
            this.loading = false
            this.projectList = res.projectinfo
          } else {
            this.loading = false
            this.projectList = []
          }
        },
        error: err => {
          this.loading = false
        }
      })
  }

  onProjectChange(event: any) {
    let project = this.projectList.find((item: { id: any; }) => item.id == event.target.value)
    this.remaining_credits = project.remaining_credit
    this.Form.patchValue({
      carbon_credits: project.remaining_credit
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
    this.file = new File([this.croppedImageBlob], 'profile_image.png', {
      type: 'image/png'
    })
  }

  onSubmit(form: any) {
    let formData = new FormData()

    formData.append('project_id', form.value.project_id)
    formData.append('carbon_credits', form.value.carbon_credits)
    formData.append('standard', form.value.standard)
    formData.append('issued_on_name', form.value.issued_on_name)
    formData.append('certificate', this.file)

    this.service
      .upload('seller/createCertificate', formData)
      .subscribe((res: any) => {
        if (res.success) {
          this.toastr.success(res.message)
          this.router.navigate(['/main/dashboard/certificate'])
        } else {
          this.toastr.error(res.message)
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
