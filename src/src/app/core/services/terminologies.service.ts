import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class TerminologiesService {

 protected terminologyObject;
 protected defaultTerminology=[
  {
      "key": "online_bilty",
      "value": "Online Bilty"
  },
  {
      "key": "invoice_bos",
      "value": "Invoice/BoS"
  },
  {
      "key": "delivery_note",
      "value": "Online Bilty"
  },
  {
      "key": "DN",
      "value": "Bilty"
  },
  {
      "key": "builty",
      "value": "Bilty"
  },
  {
      "key": "tax_no_type",
      "value": "GSTIN"
  },
  {
      "key": "tax_type",
      "value": "GST"
  }
]
  set terminologie(terminologies){
    if(terminologies.length){
      this.terminologyObject = this.getTerminology(terminologies)
    }else{
      this.terminologyObject = this.getTerminology(this.defaultTerminology)
    }

  }
  get terminologie(){
    return  this.terminologyObject
  }

  getTerminology(items=[]){
    let terminology={}
    items.forEach(element=>{
      terminology[element.key]=element.value
     });

     return terminology
  }
}
