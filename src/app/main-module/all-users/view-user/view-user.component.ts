import { Component } from '@angular/core'
import { DynamicDialogConfig } from 'primeng/dynamicdialog'

@Component({
  selector: 'app-view-user',
  templateUrl: './view-user.component.html',
  styleUrls: ['./view-user.component.css']
})
export class ViewUserComponent {
  userData: any;

  constructor (private dialogConfig: DynamicDialogConfig) {}
  
  ngOnInit () {
    this.userData = this.dialogConfig.data
  }
}
