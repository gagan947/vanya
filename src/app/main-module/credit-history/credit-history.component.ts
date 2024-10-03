import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ConfirmationService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { AuthService } from 'src/app/services/auth.service';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-credit-history',
  templateUrl: './credit-history.component.html',
  styleUrls: ['./credit-history.component.css']
})
export class CreditHistoryComponent {
  creditData: any[] = []
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
    this.getHistory()
    this.authService.authState$.subscribe(res => {
      this.role = res.role
    })
  }

  showDialog(data: any) {
    // this.ref = this.dialogService.open(, {
    //   data: user,
    //   header: 'User Information',
    //   width: '50%',
    //   styleClass: 'bg-white p-2 rounded-lg shadow-md'
    // })
  }

  getHistory() {
    this.loading = true
    let formData = new URLSearchParams()
    // formData.set('page', (this.page + 1).toString() )
    const user_id: any = localStorage.getItem('user')
    formData.set('user_id', user_id)
    let apiUrl = `cart/orderHistory`
    this.service.postWithToken(apiUrl, formData.toString()).subscribe(res => {
      if (res.success) {
        this.loading = false
        this.creditData = res.historyRes
        this.totalCount = res.count[0].total
      } else {
        this.toastr.error(res.msg)
        this.loading = false
      }
    })
  }

  // Delete (user_id: number, event: Event) {
  //   this.confirmationService.confirm({
  //     message: 'Do you want to delete this ?',
  //     header: 'Delete Confirmation',
  //     acceptButtonStyleClass:
  //       'bg-primary-gradient rounded-md text-white border border-primary hover:bg-transparent hover:text-primary px-3 ms-2 outline-none',
  //     rejectButtonStyleClass:
  //       'bg-red-500 rounded-md text-white border border-red-500 hover:bg-transparent hover:text-red-500 px-3 ms-2 outline-none',
  //     acceptIcon: 'none',
  //     rejectIcon: 'none',

  //     accept: () => {
  //       this.loading = true
  //       let apiUrl = `deleteUser`
  //       let formData = new URLSearchParams()
  //       formData.set('id', user_id.toString())

  //       this.service
  //         .postWithToken(apiUrl, formData.toString())
  //         .subscribe(res => {
  //           if (res.success) {
  //             this.toastr.success(res.msg)
  //             this.getUsersList()
  //             this.loading = false
  //           } else {
  //             this.toastr.error(res.message)
  //             this.loading = false
  //           }
  //         })
  //     }
  //   })
  // }

  getStatusClass(status: any): string {
    switch (status) {
      case 'Rejected':
        return 'bg-red-500'
      case 'Approved':
        return 'bg-primary-gradient'
      default:
        return 'bg-yellow-500'
    }
  }


  first: number = 0
  rows: number = 10
  page: number = 0

  onPageChange(event: { first: number; rows: number; page: number }) {
    this.first = event.first
    this.rows = event.rows
    this.page = event.page
    this.getHistory()
  }
}
