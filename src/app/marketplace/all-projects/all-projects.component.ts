import { Component } from '@angular/core'
import { ToastrService } from 'ngx-toastr'
import { AuthService } from 'src/app/services/auth.service'
import { ProjectDataService } from 'src/app/services/project-data.service'
import { SharedService } from 'src/app/services/shared.service'
import { environment } from 'src/environments/environment'
import * as CryptoJS from 'crypto-js'

@Component({
  selector: 'app-all-projects',
  templateUrl: './all-projects.component.html',
  styleUrls: ['./all-projects.component.css']
})
export class AllProjectsComponent {
  role: string | null | undefined
  loading: boolean = false
  projectList: any
  totalCount: any
  imageurl = environment.imgUrl

  constructor (
    private toastr: ToastrService,
    private service: SharedService,
    private authService: AuthService,
    private projectData: ProjectDataService
  ) {}

  ngOnInit () {
    this.authService.authState$.subscribe(res => {
      this.role = res.role
    })
    this.getAllProjects()
  }

  getAllProjects () {
    let ApiUrl = 'projects/getProjectsByPaginationBuyer?pageNo=1&pageSize=10'
    this.loading = true
    this.service.get(ApiUrl).subscribe({
      next: res => {
        if (res.status == 200) {
          this.projectList = res.projectinfo
          this.totalCount = res.totalCount
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
}
