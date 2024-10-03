import { Component } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { ActivatedRoute, Router } from '@angular/router'
import { ToastrService } from 'ngx-toastr'
import { SharedService } from 'src/app/services/shared.service'
import { findFlagUrlByCountryName } from 'country-flags-svg'
import { AuthService } from 'src/app/services/auth.service'
import { ProjectDataService } from 'src/app/services/project-data.service'
import { environment } from 'src/environments/environment'
import * as CryptoJS from 'crypto-js'
import { Editor, Toolbar } from 'ngx-editor'
import { dateRangeValidator, NoWhitespaceDirective, whiteSpaceValidator } from 'src/app/auth/validator'

@Component({
  selector: 'app-add-project',
  templateUrl: './add-project.component.html',
  styleUrls: ['./add-project.component.css']
})
export class AddProjectComponent {
  activeIndex: number = 0
  items: any[]
  videoFile!: File
  images: any
  imageActiveIndex: number = 0
  responsiveOptions: any
  products: any
  selectedType: string = 'N'
  role: string | null | undefined
  loading: boolean = false
  projectTypes: any[] = []
  SDG: any[] = []
  project_id: any
  selectedProType: any
  selectedSdg: any[] = []
  selectedSpecificSdg: any[] = []
  selectedPhase: any
  landUnit: string = 'acre'
  originalProjectArea: number | undefined | null
  projectBasicInfoForm!: FormGroup
  projectDetailForm!: FormGroup
  impactBenefitsForm!: FormGroup
  sdgsByProjectType: any
  projectPhases: any[] = []
  allSelectedSdg: any
  allSelectedPdf: any[] = []
  lastInsertId: any
  ImageForUpload: any[] = []
  geoJson_or_kml: string = 'K'
  kml_link: any
  geoJsonFile: any
  videoForUpload: any
  projectInfo: any
  projectMedia: any
  pdfForUpload: any[] = []

  editor!: Editor
  editor2!: Editor
  toolbar: Toolbar = [
    ['bold', 'italic'],
    ['underline', 'strike'],
    ['code', 'blockquote'],
    ['ordered_list', 'bullet_list'],
    [{ heading: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] }],
    ['link', 'image'],
    ['text_color', 'background_color'],
    ['align_left', 'align_center', 'align_right', 'align_justify']
  ]

  constructor (
    private fb: FormBuilder,
    private toastr: ToastrService,
    private service: SharedService,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    private projectService: ProjectDataService
  ) {
    this.items = [
      { label: 'Basic Project Information' },
      { label: 'Project Details' },
      { label: 'Impact and Benefits' },
      { label: 'Media and Visuals' },
      { label: 'Documentation' }
    ]
  }

  nextPage () {
    if (this.activeIndex === 2) {
      const formData = {
        ...this.projectBasicInfoForm.value,
        ...this.projectDetailForm.value,
        ...this.impactBenefitsForm.value
      }
      this.submitBasicForm(formData)
      this.activeIndex++
    } else {
      this.activeIndex++
    }
  }

  prevPage () {
    this.activeIndex--
  }

  ngOnInit () {
    this.editor = new Editor()
    this.editor2 = new Editor()
    this.inItForm()
    this.projectTypes = this.projectService.projectTypes()
    this.allSelectedSdg = this.SDG = this.projectService.sdg()
    this.projectPhases = this.projectService.projectPhase()
    this.route.queryParams.subscribe(params => {
      const encryptedId = params['id']
      if (encryptedId) {
        this.project_id = this.decryptId(encryptedId)
        this.getProjectsByID()
      }
    })

    this.authService.authState$.subscribe(res => {
      this.role = res.role
    })

    this.images = [
      {
        url: 'assets/images/project_1.jpg',
        alt: 'Description for Image 1',
        title: 'One of the project’s forest inventory plots in Mitchell Hill.'
      },
      {
        url: 'assets/images/project_2.jpg',
        alt: 'Description for Image 1',
        title:
          'The Rural King County project aims to improve outdoor recreation in the project area, including through hiking trails such as this. (Photo credit: King County Parks)'
      },
      {
        url: 'assets/images/project_3.jpg',
        alt: 'Description for Image 1',
        title:
          'The understory of a parcel that was added to the northeast end of Cougar Mountain Regional Wildland Park.'
      },
      {
        url: 'assets/images/project_4.jpg',
        alt: 'Description for Image 1',
        title:
          'This parcel, near Sammamish, was added to continue expansion on the north end of Soaring Eagle Regional Park. (Photo credit: King County Parks)'
      },
      {
        url: 'assets/images/project_5.jpg',
        alt: 'Description for Image 1',
        title: 'One of the project’s forest inventory plots in Mitchell Hill.'
      }
    ]

    this.responsiveOptions = [
      {
        breakpoint: '1199px',
        numVisible: 1,
        numScroll: 1
      },
      {
        breakpoint: '991px',
        numVisible: 2,
        numScroll: 1
      },
      {
        breakpoint: '767px',
        numVisible: 1,
        numScroll: 1
      }
    ]

    this.products = [
      {
        id: '01',
        heading: 'Additional',
        description: 'Does the project have a net additional climate benefit?',
        src: 'https://ik.imagekit.io/pachama/videos/science-evaluation/additional.mp4',
        options: ['Net additional climate benefit']
      },
      {
        id: '02',
        heading: 'Conservative',
        description:
          'Is the climate benefit based on sound and conservative claims?',
        src: 'https://ik.imagekit.io/pachama/videos/science-evaluation/accurate.mp4',
        options: ['Baseline claims', 'Project claims', 'Leakage claims']
      },
      {
        id: '03',
        heading: 'Durable',
        description: 'Is the climate benefit long-lasting?',
        src: 'https://ik.imagekit.io/pachama/videos/science-evaluation/durable.mp4',
        options: ['Ongoing monitoring', 'Project risks']
      },
      {
        id: '04',
        heading: 'Beyond Carbon',
        description: 'Does the project deliver benefits beyond carbon?',
        src: 'https://ik.imagekit.io/pachama/videos/science-evaluation/beyond-carbon.mp4',
        options: ['Social impacts', 'Ecological impacts', 'Certifications']
      }
    ]
  }

  inItForm () {
    this.projectBasicInfoForm = this.fb.group({
      project_name: ['', [Validators.required, Validators.minLength(3), NoWhitespaceDirective.validate]],
      project_subtitle: ['', Validators.required],
      project_subtitle_2: [''],
      project_short_desc: [
        '',
        [Validators.required, Validators.maxLength(800)]
      ],
      project_brief_detail: [
        '',
        [Validators.required, Validators.maxLength(1800)]
      ],
      project_type: ['', Validators.required],
      sustainableDevelopmentGoals: ['', Validators.required],
      specificSDGTargets: [''],
      country: ['', [Validators.required,whiteSpaceValidator.cannotContainSpace]],
      projectArea: ['', [Validators.required, Validators.min(0)]],
      location: ['', Validators.required],
      address: [''],
      verification_status: ['Pending']
    })

    this.projectDetailForm = this.fb.group({
      new_or_existing_project: [''],
      start_date: [''],
      end_date: [''],
      credits: ['', Validators.required],
      remaining_credit: ['', Validators.required],
      ndvi: ['', Validators.required],
      registry_details: ['', Validators.required],
      methodology: ['', Validators.required],
      carbon: ['', Validators.required],
      npar: ['', Validators.required],
      par: ['', Validators.required],
      current_phase: ['', Validators.required]
    },{ validator: dateRangeValidator() })

    this.impactBenefitsForm = this.fb.group({
      impact_metrics: [''],
      local_benefits: [''],
      funding_invstmnt_details: [''],
      stakeholder_information: [''],
      risk_assessment: ['']
    })
  }

  submitBasicForm (data: any) {
    let apiUrl = ''
    let formData = new URLSearchParams()

    formData.set('project_name', data.project_name)
    formData.set('project_subtitle', data.project_subtitle)
    formData.set('project_subtitle_2', data.project_subtitle_2)
    formData.set('project_short_desc', data.project_short_desc)
    formData.set('project_brief_detail', data.project_brief_detail)
    formData.set('country', data.country)
    formData.set('registry_details', data.registry_details)
    formData.set('project_type', data.project_type[0].id)
    formData.set(
      'area_in_acres',
      this.originalProjectArea
        ? this.originalProjectArea!.toString()
        : this.project_area!.toString()
    )
    formData.set('area_in_hectars', this.project_area!.toString())
    formData.set('location', data.location)
    formData.set('new_or_existing_project', this.selectedType)
    formData.set('methodology', data.methodology)
    formData.set('credits', data.credits)
    formData.set('remaining_credit', data.remaining_credit)
    formData.set('current_phase', data.current_phase[0].id)
    formData.set('verification_status', data.verification_status)
    formData.set('impact_metrics', data.impact_metrics)
    formData.set('local_benefits', data.local_benefits)
    formData.set('funding_invstmnt_details', data.funding_invstmnt_details)
    formData.set('stakeholder_information', data.stakeholder_information)
    formData.set('risk_assessment', data.risk_assessment)
    formData.set('address', localStorage.getItem('contract address')!)
    formData.set('ndvi', data.ndvi)
    formData.set('carbon', data.carbon ? data.carbon : '')
    formData.set('npar', data.npar)
    formData.set('par', data.par)
    formData.set('projectId', '0')
    if (data.start_date) {
      formData.set('start_date', data.start_date.split('T')[0])
    }
    if (data.end_date) {
      formData.set('end_date', data.end_date)
    }

    if (this.project_id) {
      apiUrl = `projects/editProject`
      formData.set('project_id', this.project_id)
    } else {
      apiUrl = `projects/insertProject`
    }

    this.service.postWithToken(apiUrl, formData).subscribe(res => {
      if (res.success == true) {
        this.lastInsertId = res.project_id
      }
    })
  }

  finalize () {
    this.loading = true
    let apiUrl = ''
    let formData = new FormData()

    this.ImageForUpload.forEach((_value: any, _index: any) => {
      formData.append(`image_${_index + 1}`, _value)
    })

    this.images.forEach((_value: any, _index: number) => {
      formData.append(`image${_index + 1}_text`, _value.title)
    })

    if (this.geoJson_or_kml == 'G') {
      formData.append('geoJson', this.geoJsonFile)
    } else {
      formData.append('kml_link', this.kml_link)
    }

    if (this.videoForUpload) {
      formData.append('video', this.videoForUpload)
    }
    formData.append(
      'project_id',
      this.lastInsertId ? this.lastInsertId : this.project_id
    )

    if (this.project_id) {
      apiUrl = `projects/editProjectMedias`
    } else {
      apiUrl = `projects/addProjectMedias`
    }

    this.service.upload(apiUrl, formData).subscribe(res => {
      if (res.success == true) {
        this.uploadProjectDocument()
        this.loading = false
      } else {
        this.toastr.error(res.message)
        this.loading = false
      }
    })
  }

  uploadProjectDocument () {
    this.loading = true
    let apiUrl = 'projects/addProjectDocumentation'
    let formData = new FormData()

    this.pdfForUpload.forEach((_value: any, _index: any) => {
      formData.append(`doc_${_index + 1}`, _value)
    })
    formData.append(
      'project_id',
      this.lastInsertId ? this.lastInsertId : this.project_id
    )

    this.service.upload(apiUrl, formData).subscribe(res => {
      if (res.success == true) {
        this.toastr.success(res.message)
        this.loading = false
        this.router.navigate(['/main/dashboard/projects'])
      } else {
        this.toastr.error(res.message)
        this.loading = false
      }
    })
  }

  getProjectsByID () {
    this.loading = true
    this.service
      .get(`projects/getProjectsByIdSuperAdmin?id=${this.project_id}`)
      .subscribe({
        next: async res => {
          if (res.success == true) {
            this.projectInfo = res.projectInfo
            this.getProjectMedia()
            this.projectBasicInfoForm.patchValue({
              project_name: this.projectInfo.project_name,
              project_subtitle: this.projectInfo.project_subtitle,
              project_subtitle_2: this.projectInfo.project_subtitle_2,
              project_short_desc: this.projectInfo.project_short_desc,
              project_brief_detail: this.projectInfo.project_brief_detail,
              specificSDGTargets: '',
              verification_status: this.projectInfo.verification_status,
              country: this.projectInfo.country,
              projectArea:
                this.projectInfo.area_in_acres ||
                this.projectInfo.area_in_hectars,
              location: this.projectInfo.location,
              address: this.projectInfo.address
            })

            this.country = this.projectInfo.country
            this.flagUrl = findFlagUrlByCountryName(this.country)

            this.projectDetailForm.patchValue({
              new_or_existing_project: this.projectInfo.new_or_existing_project,
              start_date: this.projectInfo.start_date,
              end_date: this.projectInfo.end_date,
              credits: this.projectInfo.credits,
              remaining_credit: this.projectInfo.remaining_credit,
              ndvi: this.projectInfo.ndvi,
              registry_details: this.projectInfo.registry_details,
              methodology: this.projectInfo.methodology,
              carbon: this.projectInfo.carbon,
              npar: this.projectInfo.npar,
              par: this.projectInfo.par
            })

            this.total_credits = this.projectInfo.credits

            this.selectedPhase = this.projectPhases.filter(
              phase => phase.id == this.projectInfo.current_phase
            )

            this.selectedProType = this.projectTypes.filter(
              type => type.id == this.projectInfo.project_type
            )
            this.allSelectedSdg =
              this.sdgsByProjectType =
              this.selectedSdg =
                this.selectedProType[0].sdgs

            this.impactBenefitsForm.patchValue({
              impact_metrics: this.projectInfo.impact_metrics,
              local_benefits: this.projectInfo.local_benefits,
              funding_invstmnt_details:
                this.projectInfo.funding_invstmnt_details,
              stakeholder_information: this.projectInfo.stakeholder_information,
              risk_assessment: this.projectInfo.risk_assessment
            })
            this.loading = false
          } else {
            this.loading = false
          }
        },
        error: err => {
          this.loading = false
        }
      })
  }

  getProjectMedia () {
    this.loading = true
    let formData = new URLSearchParams()
    formData.set('project_id', this.project_id)

    this.service.postWithToken(`projects/getProjectMedia`, formData).subscribe({
      next: res => {
        if (res.success == true) {
          this.projectMedia = res.projectDetails[0]

          const imageArray = [
            {
              url: this.projectMedia.image_1URL,
              alt: 'project image',
              title: this.projectMedia.image1_text
            },
            {
              url: this.projectMedia.image_2URL,
              alt: 'project image',
              title: this.projectMedia.image2_text
            },
            {
              url: this.projectMedia.image_3URL,
              alt: 'project image',
              title: this.projectMedia.image3_text
            },
            {
              url: this.projectMedia.image_4URL,
              alt: 'project image',
              title: this.projectMedia.image4_text
            },
            {
              url: this.projectMedia.image_5URL,
              alt: 'project image',
              title: this.projectMedia.image5_text
            },
            {
              url: this.projectMedia.image_6URL,
              alt: 'project image',
              title: this.projectMedia.image6_text
            }
          ]

          const filteredImageArray = imageArray
            .filter(item => item.url !== null)
            .map(item => item.url)

          this.ImageForUpload = filteredImageArray

          this.images = this.sliderImages = imageArray
            .filter(item => item.title !== null)
            .map(item => ({
              ...item,
              url: environment.imgUrl + item.url
            }))

          if (this.projectMedia.geo_json) {
            this.geoJson_or_kml = 'G'
            this.geoJsonFile = this.projectMedia.geo_json
          } else {
            this.geoJson_or_kml = 'K'
            this.kml_link = this.projectMedia.kml_link
          }

          const videoElement = document.getElementById(
            'videoPreview'
          ) as HTMLVideoElement

          const fileURL = environment.videoUrl + this.projectMedia.video_URL
          videoElement.src = fileURL
          videoElement.classList.remove('hidden')

          this.loading = false
        } else {
          this.loading = false
        }
      },
      error: err => {
        this.loading = false
      }
    })
  }

  async urlToFile (url: string, filename: string): Promise<File> {
    const response = await fetch(url)
    const blob = await response.blob()
    return new File([blob], filename, { type: blob.type })
  }

  selectProjectType (type: string) {
    this.selectedType = type
  }

  sliderImages: { url: string; alt: string; title: string }[] = []
  selectedPdf: any[] = []
  maxImages = 6
  maxPdfs = 4
  selectedImageIndex: number | null = null

  onFileSelected (event: any, index: number | null = null): void {
    const file = event.target.files[0]

    if (file && this.sliderImages.length < this.maxImages) {
      const reader = new FileReader()

      reader.onload = (e: any) => {
        const imageObject = {
          url: e.target.result,
          alt:
            'Image ' +
            (index !== null ? index + 1 : this.sliderImages.length + 1),
          title: ''
        }

        if (index !== null) {
          this.sliderImages[index] = imageObject
          this.ImageForUpload[index] = file
        } else {
          this.sliderImages.push(imageObject)
          this.ImageForUpload.push(file)
        }

        this.images = this.sliderImages
      }

      reader.readAsDataURL(file)
    }

    this.imageActiveIndex = this.images.length
  }

  removeImage (index: number): void {
    this.sliderImages.splice(index, 1)
    this.ImageForUpload.splice(index, 1)
    this.images = this.sliderImages
    this.imageActiveIndex = this.images.length
    this.selectedImageIndex = null
  }

  onTitleChange (index: number, event: any) {
    this.images[index].title = event.target.value
  }

  onVideoFileSelected (event: Event) {
    const input = event.target as HTMLInputElement
    if (input.files && input.files[0]) {
      const file = input.files[0]
      this.videoForUpload = file
      const videoElement = document.getElementById(
        'videoPreview'
      ) as HTMLVideoElement

      // Create a URL for the file
      const fileURL = URL.createObjectURL(file)
      videoElement.src = fileURL
      videoElement.classList.remove('hidden')
    }
  }

  onPdfFileSelected (event: any): void {
    const file = event.target.files[0]
    this.pdfForUpload.push(file)
    this.allSelectedPdf.push(file.name)

    if (file && this.selectedPdf.length < this.maxPdfs) {
      const reader = new FileReader()
      reader.onload = (e: any) => {
        this.selectedPdf.push(e.target.result)
      }
      reader.readAsDataURL(file)
    }
  }

  getFlag (event: any) {
    this.flagUrl = findFlagUrlByCountryName(event.target.value)
    this.country = event.target.value
  }

  onAreaUnitChecked (event: any) {
    if (event.target.checked) {
      if (this.originalProjectArea === undefined) {
        this.originalProjectArea = this.project_area
      }
      this.landUnit = 'hectares'
      this.project_area = this.originalProjectArea! * 0.404686
      console.log(this.project_area)
    } else {
      if (this.originalProjectArea !== undefined) {
        this.project_area = this.originalProjectArea
      }
      this.landUnit = 'acre'
    }
  }

  geoJsonOrKmlChange (event: any) {
    this.geoJson_or_kml = event.target.value
  }
  onGeoJsonFileSelected (event: any) {
    const file = event.target.files[0]
    this.geoJsonFile = file
  }

  onProjectTypeSelect (event: any) {
    this.allSelectedSdg =
      this.sdgsByProjectType =
      this.selectedSdg =
        event.itemValue.sdgs
  }
  onSdgSelect (_event: any) {
    this.allSelectedSdg = [...this.selectedSdg, ...this.selectedSpecificSdg]
  }

  getErrorMessage (field: string): string {
    let control = this.projectBasicInfoForm.get(field)
    if (!control) {
      control = this.projectDetailForm.get(field)
    }

    if (control?.hasError('required')) {
      return 'This field cannot be empty'
    } else if (control?.hasError('minlength')) {
      return `It must be at least ${
        control.getError('minlength').requiredLength
      } characters long`
    } else if (control?.hasError('maxlength')) {
      return `It must be only ${
        control.getError('maxlength').requiredLength
      } characters long`
    } else if (control?.hasError('min')) {
      return `It must be a positive number`
    } else if (control?.hasError('max')) {
      return `this can not be grater than Total credits`
    } else if (control?.hasError('cannotContainSpace')) {
      return `this field can not contain space`
    }
    return ''
  }

  decryptId (encryptedId: string): number {
    const secretKey = 'Vanya@321'
    const bytes = CryptoJS.AES.decrypt(encryptedId, secretKey)
    const decryptedId = bytes.toString(CryptoJS.enc.Utf8)
    return +decryptedId
  }

  ////////////////////////////// Preview Variables ///////////////////////////////////

  project_name: any
  project_subtitle: any
  project_subtitle_2: any
  flagUrl: string | undefined
  country: string = 'United States'
  project_area: number | null | undefined
  project_short_desc: any
  project_brief_detail: any
  total_credits: any
}
