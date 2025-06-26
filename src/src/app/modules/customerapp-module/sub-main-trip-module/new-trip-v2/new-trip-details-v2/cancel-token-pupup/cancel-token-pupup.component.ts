import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-cancel-token-pupup',
  templateUrl: './cancel-token-pupup.component.html',
  styleUrls: ['./cancel-token-pupup.component.scss']
})
export class CancelTokenPupupComponent implements OnInit {
  cancelToken:FormGroup;
  constructor(private _fb:FormBuilder,@Inject(DIALOG_DATA) private data: any,private dialogRef: DialogRef<boolean>,) { }

  ngOnInit(): void {
    console.log(this.data);
    this.cancelToken = this._fb.group({
      reason: [''],
      cancel_charge:'0',
      is_editable: true,
    })
  }

  cancel(){
  this.dialogRef.close(false);
  }
  save(){
    this.dialogRef.close(this.cancelToken.value);
  }

}
