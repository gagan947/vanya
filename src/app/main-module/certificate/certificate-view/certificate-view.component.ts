import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { AuthService } from 'src/app/services/auth.service';
import { ProjectDataService } from 'src/app/services/project-data.service';
import { SharedService } from 'src/app/services/shared.service';
import { environment } from 'src/environments/environment';
import * as html2pdf from 'html2pdf.js';

@Component({
  selector: 'app-certificate-view',
  templateUrl: './certificate-view.component.html',
  styleUrls: ['./certificate-view.component.css']
})
export class CertificateViewComponent {
  role: string | null | undefined
  data: any;
  imgUrl = environment.imgUrl

  constructor(
    private dialogConfig: DynamicDialogConfig,
    private service: SharedService,
    private toastr: ToastrService,
    public dialogService: DialogService,
    public ref: DynamicDialogRef,
    private projectDataService: ProjectDataService,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.authService.authState$.subscribe(res => {
      this.role = res.role
    })

    this.data = this.dialogConfig.data
  }

  exportAsPDF(): void {
    const invoiceElement = document.getElementById('certificate');

    const options = {
      margin: 1,
      filename: 'certificate.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      // jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };

    html2pdf().from(invoiceElement).set(options).save();
  }
}
