import { Component } from '@angular/core'
import { findFlagUrlByCountryName } from 'country-flags-svg'
import { ToastrService } from 'ngx-toastr'
import {
  DialogService,
  DynamicDialogConfig,
  DynamicDialogRef
} from 'primeng/dynamicdialog'
import { AuthService } from 'src/app/services/auth.service'
import { ProjectDataService } from 'src/app/services/project-data.service'
import { SharedService } from 'src/app/services/shared.service'
import { environment } from 'src/environments/environment'

@Component({
  selector: 'app-view-project',
  templateUrl: './view-project.component.html',
  styleUrls: ['./view-project.component.css']
})
export class ViewProjectComponent {
  project_id: any
  projectData: any
  role: string | null | undefined
  selectedStatus: number | undefined
  projectMedia: any
  loading: boolean = false
  flagUrl: string | undefined
  imgUrl = environment.imgUrl

  constructor (
    private dialogConfig: DynamicDialogConfig,
    private service: SharedService,
    private toastr: ToastrService,
    public dialogService: DialogService,
    public ref: DynamicDialogRef,
    private projectDataService: ProjectDataService,
    private authService: AuthService
  ) {}

  ngOnInit () {
    this.authService.authState$.subscribe(res => {
      this.role = res.role
    })

    this.project_id = this.dialogConfig.data
    this.getProjectsByID()
  }

  getProjectsByID () {
    this.loading = true
    this.service
      .get(`projects/getProjectsByIdSuperAdmin?id=${this.project_id}`)
      .subscribe({
        next: res => {
          if (res.success == true) {
            this.projectData = res.projectInfo
            this.flagUrl = findFlagUrlByCountryName(this.projectData.country)
            this.getProjectMedia()
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

  getStatusClass (status: any): string {
    switch (status) {
      case 'Rejected':
        return 'text-red-500'
      case 'Approved':
        return 'text-primary'
      default:
        return 'text-yellow-500'
    }
  }

  getStatusLabel (status: any): string {
    switch (status) {
      case 'Rejected':
        return 'Rejected'
      case 'Approved':
        return 'Approved'
      default:
        return 'Pending'
    }
  }

  getProjectPhase (phase: number) {
    const projectPhase = this.projectDataService
      .projectPhase()
      .find((item: { id: number; name: string }) => item.id == phase)
    return projectPhase ? projectPhase.name : null
  }

  changeProjectStatus (status: string) {
    this.loading = true
    let formData = new URLSearchParams()
    formData.set('project_id', this.projectData.id),
      formData.set('status', status.toString())

    this.service
      .postWithToken(`projects/updateProjectStatus`, formData)
      .subscribe({
        next: res => {
          if (res.success == true && status == 'Approved') {
            this.addProjectData()
          } else {
            this.toastr.success('Project Status Changed Successfully')
            this.ref.close()
            this.loading = false
          }
        },
        error: err => {
          this.loading = false
        }
      })
  }

  addProjectData () {
    this.loading = true

    let formData: any = {
      id: this.projectData.id.toString(),
      location: this.projectData.location,
      projectAddress: 'NA',
      area: this.projectData.area_in_acres.toString(),
      ndvi: this.projectData.ndvi,
      carbon: this.projectData.carbon,
      npar: this.projectData.npar,
      par: this.projectData.par,
      kmlLink: this.projectMedia.kml_link ? this.projectMedia.kml_link : 'NA',
      geoJsonLink: this.projectMedia.geo_json
        ? this.projectMedia.geo_json
        : 'NA',
      projectType: this.projectData.project_type,
      carbonCredits: this.projectData.credits.toString(),
      amountWorth: '$4,200,000',
      address: this.projectData.address,
      privateKey:
        'fe2d1b12f7cb4f6aaf2953b8d1528bf9ee0329eb1d89f9b380cc595c05475a9d'
    }

    this.service
      .upload(`api/v1/projectContract/AddProjectData`, formData)
      .subscribe({
        next: res => {
          if (res.success == true) {
            delete formData.privateKey
            delete formData.id
            delete formData.address
            formData.hash = 'Qmcf7f8HBYA3nW5QNRGAUrLx7SnoDyHM111HAvPGSXDGLc'
            let formData2 = {
              data: {
                ...formData
              }
            }
            this.service
              .upload(`api/v1/storageContract/uploadMetadata`, formData2)
              .subscribe({
                next: res => {
                  if (res.success == true) {
                    this.loading = false
                    this.issueCertificate(res.data)
                  } else {
                    this.loading = false
                  }
                },
                error: err => {
                  this.loading = false
                }
              })
          } else {
            this.loading = false
          }
        },
        error: err => {
          this.loading = false
        }
      })
  }

  issueCertificate (Url: any) {
    this.loading = true
    let formData = {
      uri: Url
    }

    this.service.upload(`api/v1/projectContract/nft`, formData).subscribe({
      next: res => {
        if (res.success == true) {
          this.loading = false
          this.toastr.success('Project Status Changed Successfully')
          this.ref.close()
        } else {
          this.loading = false
        }
      },
      error: err => {
        this.loading = false
      }
    })
  }

  getProjectType (TypeId: number) {
    const projectType = this.projectDataService
      .projectTypes()
      .find((item: { id: number; type: string }) => item.id == TypeId)
    return projectType ? projectType.type : null
  }
}
