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
  users: any;

  constructor(private dialogConfig: DynamicDialogConfig, private dialogService: DialogService, private service: SharedService,) { }

  ngOnInit() {
    this.getUsersList()
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

  getUsersList() {
    this.loading = true
    let formData = new URLSearchParams()
    formData.set('page', '1')
    formData.set('page_size', '20')
    let apiUrl = `getAllUserList`
    this.service.postWithToken(apiUrl, formData.toString()).subscribe(res => {
      if (res.success) {
        this.users = res.finalList
        this.loading = false
      } else {
        this.loading = false
      }
    })
  }

  findImg(user_id: any) {
    return this.users.find((item: any) => item.id == user_id)?.profile_image
  }
}
