import { Component } from '@angular/core'
import { ToastrService } from 'ngx-toastr'
import { ConfirmationService } from 'primeng/api'
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog'
import { AuthService } from 'src/app/services/auth.service'
import { SharedService } from 'src/app/services/shared.service'
import { ViewProjectComponent } from './view-project/view-project.component'
import { EthereumService } from 'src/app/services/ethereum.service'
import { Router } from '@angular/router'
import { ProjectDataService } from 'src/app/services/project-data.service'
import * as CryptoJS from 'crypto-js'

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css']
})
export class ProjectsComponent {
  role: string | null | undefined
  projectList: any
  totalCount: any
  visible: boolean = false
  ref: DynamicDialogRef | undefined
  loading: boolean = false

  constructor (
    private toastr: ToastrService,
    private service: SharedService,
    private confirmationService: ConfirmationService,
    private dialogService: DialogService,
    private authService: AuthService,
    private ethereumService: EthereumService,
    private router: Router,
    private projectData: ProjectDataService
  ) {}

  ngOnInit () {
    this.authService.authState$.subscribe(res => {
      this.role = res.role
    })
    this.getAllProjects()
  }

  getAllProjects () {
    let ApiUrl = ''

    if (this.role === 'Approver') {
      ApiUrl = 'getProjectsByLimit'
    } else {
      ApiUrl = 'getProjectsByLimitSeller'
    }

    this.loading = true
    this.service
      .get(
        `projects/${ApiUrl}?pageNo=${this.page + 1}&pageSize=${this.rows}&userid=${localStorage.getItem(
          'user'
        )}`
      )
      .subscribe({
        next: res => {
          if (res.status == 200) {
            this.loading = false
            this.projectList = res.projectinfo
            this.totalCount = res.totalCount[0].total
          } else {
            this.loading = false
            this.projectList = []
          }
        },
        error: err => {
          this.loading = false
        }
      })
      console.log(this.projectList);
      
  }

  showDialog (project_id: number) {
    this.ref = this.dialogService.open(ViewProjectComponent, {
      data: project_id,
      header: 'Project Information',
      width: '80%',
      styleClass: 'bg-white p-2 shadow-md',
      dismissableMask: true,
      maximizable: true
    })
    this.ref.onClose.subscribe(() => {
      this.getAllProjects()
    })
  }

  Delete (pro_id: number, event: Event) {
    this.confirmationService.confirm({
      message: 'Do you want to delete this ?',
      header: 'Delete Confirmation',
      acceptButtonStyleClass:
        'bg-primary-gradient rounded-md text-white border border-primary hover:bg-transparent hover:text-primary px-3 ms-2 outline-none',
      rejectButtonStyleClass:
        'bg-red-500 rounded-md text-white border border-red-500 hover:bg-transparent hover:text-red-500 px-3 ms-2 outline-none',
      acceptIcon: 'none',
      rejectIcon: 'none',

      accept: () => {
        let apiUrl = `projects/deleteProjectById`
        let formData = new URLSearchParams()
        formData.set('id', pro_id.toString())

        this.service
          .postWithToken(apiUrl, formData.toString())
          .subscribe(res => {
            if (res.success) {
              this.toastr.success(res.message)
              this.getAllProjects()
            } else {
              this.toastr.error(res.message)
            }
          })
      }
    })
  }

  getStatusClass (status: any): string {
    switch (status) {
      case 'Rejected':
        return 'bg-red-500'
      case 'Approved':
        return 'bg-primary-gradient'
      default:
        return 'bg-yellow-500'
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

  createProject () {
    // const address = localStorage.getItem('address')
    this.loading = true
    // if (!address) {
    //   this.loading = false
    //   this.toastr.warning('Connect to wallet first.')
    //   return
    // }
    // this.ethereumService
    //   .createProject()
    //   .then(() => {
    //     this.router.navigateByUrl('/main/dashboard/add-project')
    //     const cAddress = localStorage.getItem('contract address')
    //     this.loading = false
    //     if (address && cAddress) {
    //       this.ethereumService.sendDet(address, cAddress).subscribe({
    //         next: resp => {
    //           this.loading = false
    //         },
    //         error: err => {
    //           this.loading = false
    //           console.error(err)
    //         }
    //       })
    //     } else {
    //      console.error('Address or Contract Address is missing')
    //     }  this.loading = false
    //       this.toastr.warning('Address or Contract Address is missing.')
    //
    //   })
    //   .catch(error => {
    //     this.loading = false
    //     //this.toastr.error('An error occurred while creating the project.');
    //     console.error('Error creating project:', error)
    //   })

    this.service
      .createProject('api/v1/storageContract/createProject', null)
      .subscribe({
        next: resp => {
          this.loading = false
          localStorage.setItem('contract address', resp.data.contract)
          this.router.navigate(['/main/dashboard/projects/add-project'])
        },
        error: err => {
          this.loading = false
          console.error(err)
        }
      })
  }

  getProjectType (TypeId: number) {
    const projectType = this.projectData
      .projectTypes()
      .find((item: { id: number; type: string }) => item.id == TypeId)
    return projectType ? projectType.type : null
  }

  getProjectPhase (phase: number) {
    const projectPhase = this.projectData
      .projectPhase()
      .find((item: { id: number; name: string }) => item.id == phase)
    return projectPhase ? projectPhase.name : null
  }

  encryptId (id: number): string {
    const secretKey = 'Vanya@321'
    return CryptoJS.AES.encrypt(id.toString(), secretKey).toString()
  }

  first: number = 0
  rows: number = 10
  page:number = 0

  onPageChange (event: { first: number; rows: number;page:number }) {
    this.first = event.first
    this.rows = event.rows
    this.page = event.page    

    this.getAllProjects()
  }
}
