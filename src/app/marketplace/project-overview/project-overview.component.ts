import { ChangeDetectorRef, Component, computed, effect } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { NzMessageService } from 'ng-zorro-antd/message';
import { SharedService } from 'src/app/services/shared.service'
import { environment } from 'src/environments/environment'
import * as CryptoJS from 'crypto-js'
import { AuthService } from 'src/app/services/auth.service'

@Component({
  selector: 'app-project-overview',
  templateUrl: './project-overview.component.html',
  styleUrls: ['./project-overview.component.css']
})
export class ProjectOverviewComponent {
  value: any = 1
  project_id: any
  projectInfo: any
  loading: boolean = false
  projectMedia: any
  baseUrl = environment.imgUrl
  cartItems: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private service: SharedService,
    private toastr: NzMessageService,
    private auth: AuthService,
    private router: Router,
  ) {
    effect(() => {
      this.cartItems = this.service._cartItems();
    })
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const encryptedId = params['id']
      if (encryptedId) {
        this.project_id = this.decryptId(encryptedId)
        this.getProjectsByID()
      }
    })
  }

  decrement() {
    this.value = this.value !== 1 ? this.value - 1 : this.value
  }

  increment() {
    this.value =
      this.value < this.projectInfo.remaining_credit
        ? this.value + 1
        : this.projectInfo.remaining_credit
  }

  checkValue() {
    if (this.value < 0) {
      this.value = 1
    } else if (this.value > this.projectInfo.remaining_credit) {
      this.value = this.projectInfo.remaining_credit
    } else {
      this.value = this.value
    }
  }

  getProjectsByID() {
    this.loading = true
    this.service
      .get(`projects/getProjectsByIdSuperAdmin?id=${this.project_id}`)
      .subscribe({
        next: async res => {
          if (res.success == true) {
            this.projectInfo = res.projectInfo
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

  getProjectMedia() {
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

  // public getCartItems() {
  //   this.loading = true
  //   let formData = new URLSearchParams()

  //   this.service.postWithToken(`cart/getCartItems`, formData).subscribe({
  //     next: async res => {
  //       if (res.success == true) {
  //         this.cartItems = res.projectData.map((project: { id: any }) => {
  //           const matchingResult = res.result.find(
  //             (r: { project_id: any }) => r.project_id === project.id
  //           )
  //           return {
  //             ...project,
  //             ...matchingResult
  //           }
  //         })
  //         this.cartItems = [...this.cartItems]
  //         this.loading = false
  //       } else {
  //         this.loading = false
  //       }
  //     },
  //     error: err => {
  //       this.loading = false
  //     }
  //   })
  // }

  addToCart(pro_data: any) {
    const isProjectIdAvailable = (pro_data: { id: number }): boolean => {
      const exists = this.cartItems?.some(
        (project: { project_id: number }) => project.project_id === pro_data.id
      )
      return !exists
    }

    if (!this.auth.isLogedIn()) {
      this.router.navigate(['/auth'])
      return
    }

    if (isProjectIdAvailable(pro_data)) {
      let apiUrl = 'cart/addToCart'
      let formData = new URLSearchParams()
      formData.set('project_id', pro_data.id)
      formData.set('carbon_credits', this.value)
      formData.set('price_per_carbon_credit', '2000')
      formData.set('total_price_of_project', '1000')

      this.service.postWithToken(apiUrl, formData).subscribe({
        next: async res => {
          if (res.success === true) {
            this.loading = false
            this.service.AClicked(true)
          } else {
            this.loading = false
          }
        },
        error: err => {
          this.loading = false
        }
      })
    } else {
      this.toastr.error('Project is already in your cart')
    }
  }

  decryptId(encryptedId: string): number {
    const secretKey = 'Vanya@321'
    const bytes = CryptoJS.AES.decrypt(encryptedId, secretKey)
    const decryptedId = bytes.toString(CryptoJS.enc.Utf8)
    return +decryptedId
  }
}
