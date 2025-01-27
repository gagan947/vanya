import { Component } from '@angular/core';
import * as html2pdf from 'html2pdf.js';
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-history-invoice',
  templateUrl: './history-invoice.component.html',
  styleUrls: ['./history-invoice.component.css']
})
export class HistoryInvoiceComponent {
  invoiceData: any;
  role: string | null | undefined

  constructor(
    private dialogConfig: DynamicDialogConfig,
    public dialogService: DialogService,
    public ref: DynamicDialogRef,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.authService.authState$.subscribe(res => {
      this.role = res.role
    })

    this.invoiceData = this.dialogConfig.data
  }

  exportAsPDF(): void {
    const invoiceElement = document.getElementById('invoice');

    const options = {
      useCORS: true,
      filename: 'invoice.pdf',
      image: { type: 'jpeg', quality: 0.5 },
      html2canvas: { scale: 2, useCORS: true, logging: true },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };

    html2pdf().from(invoiceElement).set(options).save();
  }
}
