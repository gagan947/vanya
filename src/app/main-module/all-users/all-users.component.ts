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

  constructor (
    private toastr: ToastrService,
    private service: SharedService,
    private confirmationService: ConfirmationService,
    public dialogService: DialogService,
    private authService: AuthService
  ) {}

  ngOnInit () {
    this.getUsersList()
    this.authService.authState$.subscribe(res => {
      this.role = res.role
    })
  }

  showDialog (user: any) {
    this.ref = this.dialogService.open(ViewUserComponent, {
      data: user,
      header: 'User Information',
      width: '50%',
      styleClass: 'bg-white p-2 rounded-lg shadow-md'
    })
  }

  getUsersList () {
    let formData = new URLSearchParams()
    formData.set('page', '1')
    formData.set('page_size', '10')
    let apiUrl = `getAllUserList`
    this.service.postWithToken(apiUrl, formData.toString()).subscribe(res => {
      if (res.success) {
        this.users = res.finalList
      } else {
        this.toastr.error(res.msg)
      }
    })
  }

  Delete (user_id: number, event: Event) {
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
        let apiUrl = `deleteUser`
        let formData = new URLSearchParams()
        formData.set('id', user_id.toString())

        this.service
          .postWithToken(apiUrl, formData.toString())
          .subscribe(res => {
            if (res.success) {
              this.toastr.success(res.msg)
              this.getUsersList()
            } else {
              this.toastr.error(res.message)
            }
          })
      }
    })
  }

  getStatusClass (status: any): string {
    switch (status) {
      case '0':
        return 'bg-red-500'
      case '1':
        return 'bg-primary-gradient'
      default:
        return ''
    }
  }

  getStatusLabel (status: any): string {
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

  onPageChange (event: { first: number; rows: number }) {
    this.first = event.first
    this.rows = event.rows
  }
}
