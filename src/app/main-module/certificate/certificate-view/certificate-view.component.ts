import { Component } from '@angular/core';
import { DialogService, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { AuthService } from 'src/app/services/auth.service';
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
    public dialogService: DialogService,
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
