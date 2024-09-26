import { Component } from '@angular/core'
import {
  DialogService,
  DynamicDialogConfig,
  DynamicDialogRef
} from 'primeng/dynamicdialog'

@Component({
  selector: 'app-image-preview',
  templateUrl: './image-preview.component.html',
  styleUrls: ['./image-preview.component.css']
})
export class ImagePreviewComponent {
  imgName: any

  constructor (
    private dialogConfig: DynamicDialogConfig,
    public dialogService: DialogService,
    public ref: DynamicDialogRef
  ) {}

  ngOnInit () {
    this.imgName = this.dialogConfig.data
  }
}
