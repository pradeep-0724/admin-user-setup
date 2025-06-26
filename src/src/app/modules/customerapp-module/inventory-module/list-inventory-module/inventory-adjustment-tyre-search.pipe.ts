import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'inventoryAdjustmentTyreSearch'
})
export class InventoryAdjustmentTyreSearchPipe implements PipeTransform {

  transform(value:any[],searchString:string ){
    if(!searchString){
      return value
    }

    return value.filter((it) => {

      let tyre =false;
      let uniqueNo=false;
      const tyre_detail= it.tyres.filter(item=>item.tyre_detail.toLowerCase().includes(searchString.toLowerCase()))
      if(tyre_detail.length>0){
        tyre = true;
      }
      const unique_no= it.tyres.filter(item=>item.unique_no.toLowerCase().includes(searchString.toLowerCase()))
      if(unique_no.length>0){
        uniqueNo = true;
      }
       return tyre|| uniqueNo ;
    })

  }


}
