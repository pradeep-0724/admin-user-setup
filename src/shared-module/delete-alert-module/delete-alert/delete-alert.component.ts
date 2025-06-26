import { DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';
import { Component, Inject, OnInit } from '@angular/core';
import { TokenExpireService } from 'src/app/core/services/token-expire.service';
type DeletePopupData={
  message:string
}
@Component({
  selector: 'app-delete-alert',
  templateUrl: './delete-alert.component.html',
  styleUrls: ['./delete-alert.component.scss']
})
export class DeleteAlertComponent implements OnInit {

  constructor(private dialogRef: DialogRef<boolean>, @Inject(DIALOG_DATA) private data: DeletePopupData, private _tokenExpireService:TokenExpireService
  ) { }
  message=''
  ngOnInit(): void {
   this.message = this.data['message']
   this._tokenExpireService.observeTokenExpire.subscribe(isExpired=>{
    if(isExpired){
      this.dialogRef.close(false)
    }
  })
  }

  cancel(){
    this.dialogRef.close(false)
  }

  confirm(){
    this.dialogRef.close(true)

  }

}
