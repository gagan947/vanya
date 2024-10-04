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
  HistoryData: any[] = []
  visible: boolean = false
  ref: DynamicDialogRef | undefined
  role: string | null | undefined
  loading: boolean = false
  totalCount: any
  headingText: string = 'Order'

  columns: any = []

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

    if (this.role == 'Seller') {
      this.headingText = 'Sale'

      this.columns = [
        { key: 'order_id', label: 'Order Id' },
        { key: 'project_id', label: 'Project Name' },
        { key: 'carbon_credits', label: 'Total Credits' },
        { key: 'price_per_carbon_credit', label: 'Price/Credits', type: 'price' },
        { key: 'amount', label: 'Amount', type: 'price' },
        { key: '', label: 'Order By' },
        { key: 'status', label: 'Status', type: 'status' },
        { key: 'created_at', label: 'Date', type: 'date' }
      ];

    } else if (this.role == 'Buyer') {

      this.columns = [
        { key: 'order_id', label: 'Order Id' },
        { key: 'project_id', label: 'Project Name' },
        { key: 'carbon_credits', label: 'Total Credits' },
        { key: 'price_per_carbon_credit', label: 'Price/Credits', type: 'price' },
        { key: 'amount', label: 'Amount', type: 'price' },
        { key: 'status', label: 'Status', type: 'status' },
        { key: 'created_at', label: 'Date', type: 'date' }
      ];
    } else {

      this.columns = [
        { key: 'order_id', label: 'Order Id' },
        { key: 'project_id', label: 'Project Name' },
        { key: 'carbon_credits', label: 'Total Credits' },
        { key: 'price_per_carbon_credit', label: 'Price/Credits', type: 'price' },
        { key: 'amount', label: 'Amount', type: 'price' },
        { key: '', label: 'Order By' },
        { key: '', label: 'Order To' },
        { key: 'status', label: 'Status', type: 'status' },
        { key: 'created_at', label: 'Date', type: 'date' }
      ];
    }
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
        this.HistoryData = res.historyRes
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
