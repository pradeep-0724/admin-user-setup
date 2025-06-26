import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'purchaseOrderPipe'
})
export class PurchaseOrderPipePipe implements PipeTransform {
  transform(value:any[],searchString:string ){

    if(!searchString){
      return value
    }
    return value.filter(it=>{
        let approver =false;
        const po_number = it.po_number.toString().toLowerCase().includes(searchString.toLowerCase());
        const vendor = it.vendor.toString().toLowerCase().includes(searchString.toLowerCase());
        if(it.approval_user){
           approver = it.approval_user.toString().toLowerCase().includes(searchString.toLowerCase());
        }
        const status = it.status.label.toString().toLowerCase().includes(searchString.toLowerCase());

        return (po_number||vendor||approver||status);
    });
 }
}
