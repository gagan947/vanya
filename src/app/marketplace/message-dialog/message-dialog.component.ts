import { Component } from '@angular/core'
import {
  DialogService,
  DynamicDialogConfig,
  DynamicDialogRef
} from 'primeng/dynamicdialog'

@Component({
  selector: 'app-message-dialog',
  templateUrl: './message-dialog.component.html',
  styleUrls: ['./message-dialog.component.css']
})
export class MessageDialogComponent {
  data: any

  constructor (
    private dialogConfig: DynamicDialogConfig,
    public dialogService: DialogService,
    public ref: DynamicDialogRef
  ) {}

  ngOnInit () {
    this.data = this.dialogConfig.data
  }
}
