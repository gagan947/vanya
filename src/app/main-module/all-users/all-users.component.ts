import { Component } from '@angular/core'
import { ToastrService } from 'ngx-toastr'
import { ConfirmationService } from 'primeng/api'
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog'
import { SharedService } from 'src/app/services/shared.service'
import { ViewUserComponent } from './view-user/view-user.component'
import { AuthService } from 'src/app/services/auth.service'

@Component({
  selector: 'app-all-users',
  templateUrl: './all-users.component.html',
  styleUrls: ['./all-users.component.css']
})
export class AllUsersComponent {
  users: any[] = []
  visible: boolean = false
  ref: DynamicDialogRef | undefined
  role: string | null | undefined
  loading: boolean = false
  totalCount: any

  constructor(
    private toastr: ToastrService,
    private service: SharedService,
    private confirmationService: ConfirmationService,
    public dialogService: DialogService,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.getUsersList()
    this.authService.authState$.subscribe(res => {
      this.role = res.role
    })
  }

  showDialog(user: any) {
    this.ref = this.dialogService.open(ViewUserComponent, {
      data: user,
      header: 'User Information',
      width: '50%',
      maximizable: true,
      dismissableMask: true,
      styleClass: 'bg-white p-2 px-4 shadow-md'
    })
  }

  getUsersList() {
    this.loading = true
    let formData = new URLSearchParams()
    formData.set('page', (this.page + 1).toString())
    formData.set('page_size', this.rows.toString())
    let apiUrl = `getAllUserList`
    this.service.postWithToken(apiUrl, formData.toString()).subscribe(res => {
      if (res.success) {
        this.users = res.finalList
        this.totalCount = res.count[0].total
        this.loading = false
      } else {
        this.toastr.error(res.msg)
        this.loading = false
      }
    })
  }

  Delete(user_id: number, event: Event) {
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
        this.loading = true
        let apiUrl = `deleteUser`
        let formData = new URLSearchParams()
        formData.set('id', user_id.toString())

        this.service
          .postWithToken(apiUrl, formData.toString())
          .subscribe(res => {
            if (res.success) {
              this.toastr.success(res.msg)
              this.getUsersList()
              this.loading = false
            } else {
              this.toastr.error(res.message)
              this.loading = false
            }
          })
      }
    })
  }

  getStatusClass(status: any): string {
    switch (status) {
      case '0':
        return 'bg-red-500'
      case '1':
        return 'bg-primary-gradient'
      default:
        return ''
    }
  }

  getStatusLabel(status: any): string {
    switch (status) {
      case '0':
        return 'Inactive'
      case '1':
        return 'Active'
      default:
        return 'Unknown'
    }
  }

  first: number = 0
  rows: number = 10
  page: number = 0

  onPageChange(event: { first: number; rows: number; page: number }) {
    this.first = event.first
    this.rows = event.rows
    this.page = event.page

    this.getUsersList()
  }
}
