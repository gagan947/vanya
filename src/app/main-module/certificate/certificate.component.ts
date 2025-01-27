import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ConfirmationService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { AuthService } from 'src/app/services/auth.service';
import { SharedService } from 'src/app/services/shared.service';
import { CertificateViewComponent } from './certificate-view/certificate-view.component';

@Component({
  selector: 'app-certificate',
  templateUrl: './certificate.component.html',
  styleUrls: ['./certificate.component.css']
})
export class CertificateComponent {
  visible: boolean = false
  ref: DynamicDialogRef | undefined
  role: string | null | undefined
  loading: boolean = false
  totalCount: any
  first: number = 0
  rows: number = 10
  page: number = 0
  certificates: any;
  ApprovedCertificates: any;

  constructor(
    private toastr: ToastrService,
    private service: SharedService,
    private confirmationService: ConfirmationService,
    private authService: AuthService,
    private dialogService: DialogService,
  ) { }

  ngOnInit() {
    this.authService.authState$.subscribe(res => {
      this.role = res.role
    })
    if (this.role === 'Approver') {
      this.activeTab = 'Requested'
    } else {
      this.activeTab = 'Approved'
      this.getApprovedList();
    }
    this.getList();
  }

  onPageChange(e: any) {

  }

  getList() {
    let ApiUrl = ''
    if (this.role === 'Approver') {
      ApiUrl = 'seller/getCertificates'
    } else if (this.role === 'Buyer') {
      ApiUrl = 'buyer/getCertificatesBuyer'
    } else {
      ApiUrl = 'seller/getCertificatesSeller'
    }

    this.loading = true
    let formData = new URLSearchParams()
    // formData.set('page', (this.page + 1).toString())
    // formData.set('page_size', this.rows.toString())
    this.service.get(ApiUrl).subscribe(res => {
      if (res.success) {
        this.certificates = res.certificateResult
        // this.totalCount = res.count[0].total
        this.loading = false
      } else {
        this.certificates = []
        // this.toastr.error(res.msg)
        this.loading = false
      }
    })
  }

  getApprovedList() {
    let ApiUrl = ''

    if (this.role === 'Buyer') {
      ApiUrl = 'buyer/getCertificatesBuyerApprove'
    } else {
      ApiUrl = 'seller/getCertificatesSellerApprove'
    }

    this.loading = true
    let formData = new URLSearchParams()
    // formData.set('page', (this.page + 1).toString())
    // formData.set('page_size', this.rows.toString())
    this.service.get(ApiUrl).subscribe(res => {
      if (res.success) {
        this.ApprovedCertificates = res.certificateResult
        // this.totalCount = res.count[0].total
        this.loading = false
      } else {
        // this.toastr.error(res.message)
        this.loading = false
      }
    })
  }

  showDialog(data: number) {
    this.ref = this.dialogService.open(CertificateViewComponent, {
      data: data,
      header: 'Certificate Information',
      width: '80%',
      styleClass: 'bg-white p-2 shadow-md',
      dismissableMask: true,
      maximizable: true
    })
    this.ref.onClose.subscribe(() => {
      this.getList()
    })
  }

  getStatusClass(status: any): string {
    switch (status) {
      case 'C':
        return 'bg-red-500'
      case 'A':
        return 'bg-primary'
      default:
        return 'bg-yellow-500'
    }
  }

  getStatusLabel(status: any): string {
    switch (status) {
      case 'C':
        return 'Canceled'
      case 'A':
        return 'Approved'
      default:
        return 'Requested'
    }
  }

  activeTab = '';
  setActiveTab(tabId: string): void {
    this.activeTab = tabId;
  }

  Approve(certificate_id: number) {
    this.confirmationService.confirm({
      message: 'Do you want to Approve this ?',
      header: 'Approve Confirmation',
      acceptButtonStyleClass:
        'bg-primary rounded-md text-white border border-primary hover:bg-transparent hover:text-primary px-3 ms-2 outline-none',
      rejectButtonStyleClass:
        'bg-red-500 rounded-md text-white border border-red-500 hover:bg-transparent hover:text-red-500 px-3 ms-2 outline-none',
      acceptIcon: 'none',
      rejectIcon: 'none',

      accept: () => {
        this.loading = true
        let apiUrl = `seller/updateCertificate`
        let formData = new URLSearchParams()
        formData.set('certificate_id', certificate_id.toString())

        this.service
          .postWithToken(apiUrl, formData.toString())
          .subscribe(res => {
            if (res.success) {
              this.toastr.success(res.message)
              this.getList()
              this.loading = false
            } else {
              this.toastr.error(res.message)
              this.loading = false
            }
          })
      }
    })
  }
}
