import { Component } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { AuthService } from 'src/app/services/auth.service';
import { SharedService } from 'src/app/services/shared.service';
import { HistoryInvoiceComponent } from './history-invoice/history-invoice.component';
import { AddCertificateComponent } from '../certificate/add-certificate/add-certificate.component';

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
    private toastr: NzMessageService,
    private service: SharedService,
    public dialogService: DialogService,
    private authService: AuthService,
  ) { }

  ngOnInit() {
    this.authService.authState$.subscribe(res => {
      this.role = res.role
    })
    this.getHistory()

    if (this.role == 'Seller') {
      this.headingText = 'Sale'

      this.columns = [
        // { key: 'order_id', label: 'Order Id' },
        { key: 'project_name', label: 'Project Name' },
        { key: 'carbon_credits', label: 'Total Credits' },
        { key: 'price_per_carbon_credit', label: 'Price/Credits', type: 'price' },
        { key: 'amount', label: 'Amount', type: 'price' },
        { key: 'buyer_name', label: 'Order By' },
        // { key: 'status', label: 'Status', type: 'status' },
        // { key: 'created_at', label: 'Date', type: 'date' },
        { key: 'action', label: 'Action', type: 'action' }
      ];

    } else if (this.role == 'Buyer') {
      this.columns = [
        { key: 'order_id', label: 'Order Id' },
        { key: 'project_name', label: 'Project Name' },
        { key: 'seller_name', label: 'Seller Name' },
        { key: 'carbon_credits', label: 'Total Credits' },
        { key: 'price_per_carbon_credit', label: 'Price/Credits', type: 'price' },
        { key: 'amount', label: 'Amount', type: 'price' },
        { key: 'created_at', label: 'Date', type: 'date' },
        { key: 'action', label: 'Action', type: 'action' }
      ];

    } else {
      this.columns = [
        { key: 'order_id', label: 'Order Id' },
        { key: 'project_name', label: 'Project Name' },
        { key: 'carbon_credits', label: 'Total Credits' },
        { key: 'price_per_carbon_credit', label: 'Price/Credits', type: 'price' },
        { key: 'amount', label: 'Amount', type: 'price' },
        { key: 'buyer_name', label: 'Order By' },
        { key: 'seller_name', label: 'Order To' },
        // { key: 'status', label: 'Status', type: 'status' },
        { key: 'created_at', label: 'Date', type: 'date' },
        { key: 'action', label: 'Action', type: 'action' }
      ];
    }
  }

  showDialog(data: any) {
    // this.router.navigate(['/main/dashboard/invoice'])
    this.ref = this.dialogService.open(HistoryInvoiceComponent, {
      data: data,
      header: '',
      width: '60rem',
      styleClass: 'bg-white p-2 shadow-md',
      dismissableMask: true,
      maximizable: true
    })
  }

  requestDialog(data: any) {
    this.ref = this.dialogService.open(AddCertificateComponent, {
      data: data,
      header: 'Request For Certificate',
      styleClass: 'bg-white p-2 shadow-md w-[22rem] md:w-[40rem] lg:w-[60rem]',
      dismissableMask: true,
      maximizable: true
    })
  }

  getHistory() {
    this.loading = true
    let formData = new URLSearchParams()
    // formData.set('page', (this.page + 1).toString() )
    const user_id: any = localStorage.getItem('user')
    formData.set('user_id', user_id)
    formData.set('page', (this.page + 1).toString())
    formData.set('page_size', this.rows.toString())

    let apiUrl = ''
    if (this.role == 'Buyer') {
      apiUrl = `cart/orderHistory`
    } else if (this.role == 'Seller') {
      apiUrl = `cart/orderHistorySeller`
    } else {
      apiUrl = `cart/orderHistoryAdmin`
    }

    this.service.postWithToken(apiUrl, formData.toString()).subscribe(res => {
      if (res.success) {
        this.loading = false
        this.HistoryData = res.sellerDetails ? res.sellerDetails : res.historyRes
        this.totalCount = res.count
      } else {
        this.toastr.error(res.message)
        this.loading = false
      }
    })
  }

  // Delete (user_id: number, event: Event) {
  //   this.confirmationService.confirm({
  //     message: 'Do you want to delete this ?',
  //     header: 'Delete Confirmation',
  //     acceptButtonStyleClass:
  //       'bg-primary rounded-md text-white border border-primary hover:bg-transparent hover:text-primary px-3 ms-2 outline-none',
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
        return 'bg-primary'
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
