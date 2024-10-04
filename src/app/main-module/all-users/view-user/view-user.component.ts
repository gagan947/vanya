import { Component } from '@angular/core'
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog'
import { SharedService } from 'src/app/services/shared.service';
import { ImagePreviewComponent } from 'src/app/shared/image-preview/image-preview.component';

@Component({
  selector: 'app-view-user',
  templateUrl: './view-user.component.html',
  styleUrls: ['./view-user.component.css']
})
export class ViewUserComponent {
  userData: any;
  ref: DynamicDialogRef | undefined
  loading: boolean = false

  constructor(private dialogConfig: DynamicDialogConfig, private dialogService: DialogService, private service: SharedService,) { }

  ngOnInit() {
    this.loading = true;
    let id = this.dialogConfig.data
    let apiUrl = 'selectUser';
    const formData = new URLSearchParams()
    formData.set('id', id)
    this.service
      .postWithToken(apiUrl, formData.toString())
      .subscribe((res: any) => {
        if (res.success) {
          this.loading = false;
          this.userData = res.selectDetails[0]
        }
      })
  }

  vievImage(imgName: any) {
    this.ref = this.dialogService.open(ImagePreviewComponent, {
      data: imgName,
      width: '',
      styleClass: 'bg-white shadow-md rounded',
      dismissableMask: true,
      showHeader: false
    })
  }
}
