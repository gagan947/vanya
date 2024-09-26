import { Component } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { ToastrService } from 'ngx-toastr'
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog'
import { MessageDialogComponent } from 'src/app/marketplace/message-dialog/message-dialog.component'
import { ProjectOverviewComponent } from 'src/app/marketplace/project-overview/project-overview.component'
import { ProjectDataService } from 'src/app/services/project-data.service'
import { SharedService } from 'src/app/services/shared.service'
import { environment } from 'src/environments/environment'

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
  providers: [ProjectOverviewComponent]
})
export class CartComponent {
  loading: boolean = false
  baseUrl = environment.imgUrl
  cartItems: any
  sidebarVisible2: boolean = false
  ref: DynamicDialogRef | undefined

  constructor (
    private route: ActivatedRoute,
    private router: Router,
    private service: SharedService,
    private projectService: ProjectDataService,
    private toastr: ToastrService,
    private dialogService: DialogService
  ) {}

  ngOnInit () {
    this.service.aClickedEvent.subscribe((data: boolean) => {
      this.sidebarVisible2 = data
    })
    this.getCartItems()
  }

  getCartItems () {
    this.loading = true

    let formData = new URLSearchParams()
    // formData.set('id', '')

    this.service.postWithToken(`cart/getCartItems`, formData).subscribe({
      next: async res => {
        if (res.success == true) {
          this.cartItems = res.projectData.map((project: { id: any }) => {
            const matchingResult = res.result.find(
              (r: { project_id: any }) => r.project_id === project.id
            )
            return {
              ...project,
              ...matchingResult
            }
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

  increment (item: any) {
    if (Number(item.carbon_credits) <= item.remaining_credit) {
      item.carbon_credits = Number(item.carbon_credits) + 1

      let apiUrl = 'cart/updateCart'
      let formData = new URLSearchParams()
      formData.set('project_id', item.project_id)
      formData.set('carbon_credits', item.carbon_credits)
      formData.set('price_per_carbon_credit', '2000')
      formData.set('total_price_of_project', '1000')
      formData.set('cart_id', item.id)

      this.service.postWithToken(apiUrl, formData).subscribe({
        next: async res => {
          if (res.success === true) {
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
  }

  decrement (item: any) {
    if (Number(item.carbon_credits) > 0) {
      item.carbon_credits = Number(item.carbon_credits) - 1

      let apiUrl = 'cart/updateCart'
      let formData = new URLSearchParams()
      formData.set('project_id', item.project_id)
      formData.set('carbon_credits', item.carbon_credits)
      formData.set('price_per_carbon_credit', '2000')
      formData.set('total_price_of_project', '1000')
      formData.set('cart_id', item.id)

      this.service.postWithToken(apiUrl, formData).subscribe({
        next: async res => {
          if (res.success === true) {
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
  }

  deleteFromCart (pro_data: any) {
    let apiUrl = 'cart/deleteCartItemsByProject'
    let formData = new URLSearchParams()
    formData.set('project_id', pro_data.project_id)
    formData.set('cart_id', pro_data.id)

    this.service.postWithToken(apiUrl, formData).subscribe({
      next: async res => {
        if (res.success === true) {
          this.loading = false
          this.cartItems = []
          this.toastr.success(res.message)
          this.getCartItems()
        } else {
          this.loading = false
          this.toastr.error(res.message)
        }
      },
      error: err => {
        this.loading = false
        this.toastr.success(err)
      }
    })
  }

  checkOut (item: any) {
    this.loading = true
    let apiUrl = 'cart/checkOutOrderItems'

    for (const project of item) {
      if (project.carbon_credits > project.remaining_credit) {
        this.loading = false
        this.toastr.error(
          `Error: Carbon credits for project "${project.project_name}" exceed remaining credits.`
        )
        return
      }
    }

    const formattedData = {
      items: item
        .filter((project: { id: any }) => project.id)
        .map((project: any) => ({
          project_id: project.project_id,
          carbon_credits: Number(project.carbon_credits),
          price_per_carbon_credit: Number(project.price_per_carbon_credit),
          amount: Number(
            project.price_per_carbon_credit * project.carbon_credits
          ),
          cart_id: project.id
        }))
    }

    this.service.post(apiUrl, formattedData).subscribe({
      next: async res => {
        if (res.success === true) {
          this.loading = false
          this.router.navigate(['/marketplace/projects'])
          const msgData = {
            icon: 'success-circle-outline',
            title: 'Payment Done!',
            message: 'Thank you for completing your secure online payment.',
            message_1: 'Have a great day!',
            type: 'success'
          }
          this.showDialog(msgData)
        } else {
          this.loading = false
          const msgData = {
            icon: 'error-outline',
            title: "Oops somthing wen't wrong!",
            message_1: 'you may try again!',
            type: 'error'
          }
          this.showDialog(msgData)
        }
      },
      error: err => {
        this.loading = false
        const msgData = {
          icon: 'error-outline',
          title: "Oops somthing wen't wrong!",
          message_1: 'you may try again!',
          type: 'error'
        }
        this.showDialog(msgData)
      }
    })
  }

  getTotal (cartData: any) {
    const totalAmount = cartData.reduce(
      (sum: any, currentItem: any) =>
        sum + currentItem.price_per_carbon_credit * currentItem.carbon_credits,
      0
    )
    return totalAmount
  }

  showDialog (Data: any) {
    this.ref = this.dialogService.open(MessageDialogComponent, {
      data: Data,
      header: '',
      showHeader: false,
      width: '40%',
      styleClass: 'bg-white p-2 rounded-lg shadow-md',
      dismissableMask: true
    })
  }

  close () {
    this.sidebarVisible2 = !this.sidebarVisible2
  }
}
