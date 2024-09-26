import { Component } from '@angular/core'
import { Location } from '@angular/common'
import { ActivatedRoute, Router } from '@angular/router'
import { SharedService } from 'src/app/services/shared.service'
import { ProjectDataService } from 'src/app/services/project-data.service'
import { environment } from 'src/environments/environment'
import { findFlagUrlByCountryName } from 'country-flags-svg'
import * as CryptoJS from 'crypto-js'

@Component({
  selector: 'app-project-detail',
  templateUrl: './project-detail.component.html',
  styleUrls: ['./project-detail.component.css']
})
export class ProjectDetailComponent {
  images: any
  activeIndex: number = 0
  responsiveOptions: any
  products: any
  project_id: any
  loading: boolean = false
  selectedPhase: any[] = []
  projectInfo: any
  projectTypes: any
  allSelectedSdg: any
  projectPhases: any[] = []
  SDG: any
  selectedProType: any
  sdgsByProjectType: any
  projectMedia: any
  flagUrl: any
  allSelectedPdf: any
  docsUrl = environment.docUrl

  constructor (
    private route: ActivatedRoute,
    private router: Router,
    private _location: Location,
    private service: SharedService,
    private projectService: ProjectDataService
  ) {}

  ngOnInit (): void {
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

    this.route.fragment.subscribe(fragment => {
      if (fragment) {
        document
          .getElementById(fragment)
          ?.scrollIntoView({ behavior: 'smooth' })
      }
    })

    this.images = [
      {
        itemImageSrc: 'assets/images/project_1.jpg',
        alt: 'Description for Image 1',
        title: 'One of the project’s forest inventory plots in Mitchell Hill.'
      },
      {
        itemImageSrc: 'assets/images/project_2.jpg',
        alt: 'Description for Image 1',
        title:
          'The Rural King County project aims to improve outdoor recreation in the project area, including through hiking trails such as this. (Photo credit: King County Parks)'
      },
      {
        itemImageSrc: 'assets/images/project_3.jpg',
        alt: 'Description for Image 1',
        title:
          'The understory of a parcel that was added to the northeast end of Cougar Mountain Regional Wildland Park.'
      },
      {
        itemImageSrc: 'assets/images/project_4.jpg',
        alt: 'Description for Image 1',
        title:
          'This parcel, near Sammamish, was added to continue expansion on the north end of Soaring Eagle Regional Park. (Photo credit: King County Parks)'
      },
      {
        itemImageSrc: 'assets/images/project_5.jpg',
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

  getProjectsByID () {
    this.loading = true
    this.service
      .get(`projects/getProjectsByIdSuperAdmin?id=${this.project_id}`)
      .subscribe({
        next: async res => {
          if (res.success == true) {
            this.projectInfo = res.projectInfo
            this.getProjectMedia()
            this.getProjectDocs()

            this.selectedPhase = this.projectPhases.filter(
              phase => phase.id == this.projectInfo.current_phase
            )
            this.flagUrl = findFlagUrlByCountryName(this.projectInfo.country)
            this.selectedProType = this.projectTypes.filter(
              (type: { id: any }) => type.id == this.projectInfo.project_type
            )
            this.allSelectedSdg =
              this.sdgsByProjectType =
              this.allSelectedSdg =
                this.selectedProType[0].sdgs
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
              itemImageSrc: this.projectMedia.image_1URL,
              alt: 'project image',
              title: this.projectMedia.image1_text
            },
            {
              itemImageSrc: this.projectMedia.image_2URL,
              alt: 'project image',
              title: this.projectMedia.image2_text
            },
            {
              itemImageSrc: this.projectMedia.image_3URL,
              alt: 'project image',
              title: this.projectMedia.image3_text
            },
            {
              itemImageSrc: this.projectMedia.image_4URL,
              alt: 'project image',
              title: this.projectMedia.image4_text
            },
            {
              itemImageSrc: this.projectMedia.image_5URL,
              alt: 'project image',
              title: this.projectMedia.image5_text
            },
            {
              itemImageSrc: this.projectMedia.image_6URL,
              alt: 'project image',
              title: this.projectMedia.image6_text
            }
          ]

          this.images = imageArray
            .filter(item => item.title !== null)
            .map(item => ({
              ...item,
              itemImageSrc: environment.imgUrl + item.itemImageSrc
            }))

          if (this.projectMedia.video_URL) {
            const videoElement = document.getElementById(
              'videoPreview'
            ) as HTMLVideoElement

            const fileURL = environment.videoUrl + this.projectMedia.video_URL
            videoElement.src = fileURL
            videoElement.classList.remove('hidden')
          }

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

  getProjectDocs () {
    this.loading = true
    let formData = new URLSearchParams()
    formData.set('project_id', this.project_id)

    this.service
      .postWithToken(`projects/getProjectDocument`, formData)
      .subscribe({
        next: res => {
          if (res.success == true) {
            const docArray = [
              res.projectDetails[0].doc_1,
              res.projectDetails[0].doc_2,
              res.projectDetails[0].doc_3,
              res.projectDetails[0].doc_4
            ]

            this.allSelectedPdf = docArray.filter(
              item => item !== '' && item !== null
            )
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

  encryptId (id: number): string {
    const secretKey = 'Vanya@321'
    return CryptoJS.AES.encrypt(id?.toString(), secretKey).toString()
  }

  decryptId (encryptedId: string): number {
    const secretKey = 'Vanya@321'
    const bytes = CryptoJS.AES.decrypt(encryptedId, secretKey)
    const decryptedId = bytes.toString(CryptoJS.enc.Utf8)
    return +decryptedId
  }

  back () {
    this._location.back()
  }
}
