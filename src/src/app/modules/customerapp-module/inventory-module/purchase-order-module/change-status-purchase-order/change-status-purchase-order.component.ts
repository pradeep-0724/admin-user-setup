import { PurchaseOrderService } from '../../../api-services/inventory-purchase-order-service/purchase-order.service';
import { getBlankOption } from 'src/app/shared-module/utilities/helper-utils';
import { Component, Input, OnInit, Output ,EventEmitter} from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { popupOverflowService } from 'src/app/modules/customerapp-module/api-services/auth-and-general-services/popup-overflow.service';


@Component({
  selector: 'app-change-status-purchase-order',
  templateUrl: './change-status-purchase-order.component.html',
  styleUrls: ['./change-status-purchase-order.component.scss']
})
export class ChangeStatusPurchaseOrderComponent implements OnInit {

  @Input() allDataPurchase =new BehaviorSubject({});
  @Output() resultOut = new EventEmitter <any>()
  changeStatusOrder :UntypedFormGroup
  constructor( private _fb:UntypedFormBuilder,private _change_purchase_order:PurchaseOrderService, private _popupBodyScrollService:popupOverflowService ) { }
  show =false;
  initialDetails={
    status :getBlankOption()
  }

  purchaseStatus=[{
    label:'Approval Pending',
    value:1
  },
  {
    label:'Approved',
    value:2
  },{
    label:'Rejected',
    value:4
  }]
  purchaseData=[]
  temppurchaseStatus=[];

  ngOnInit() {
    this.allDataPurchase.subscribe(data=>{
      this.show = data['show'];
      this.purchaseData =[];
      this.purchaseData = data['data']
      if(this.purchaseData.length>0){
       this.patchForm(this.purchaseData[0])
      }
    })
    this.buildForm();
  }

  close(){

    this.purchaseData =[];
    this.show = false;
    this._popupBodyScrollService.popupHide();

  }

  buildForm() {

		this.changeStatusOrder = this._fb.group({
      po_status:[null]
    })

  }

  patchForm(data){

    let status =[]
    status = this.purchaseStatus.filter(item => item.value !==data.status.index)
    this.temppurchaseStatus =status;
    this.changeStatusOrder.patchValue({
      po_status:data.status.index
    })
    this.initialDetails.status ={label:data.status.label,value:data.status.index}

  }

  save(){
    this._popupBodyScrollService.popupHide();
    let form = 	this.changeStatusOrder ;

      this._change_purchase_order.changeStatusPurchaseOrder(this.purchaseData[0].id,form.value).subscribe( result=>{
       this.resultOut.emit(true)
       this.close()
      }
    )
  }
}
