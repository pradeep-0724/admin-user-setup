import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'inventoryAdjustmentSpareSearch'
})
export class InventoryAdjustmentSpareSearchPipe implements PipeTransform {

  transform(value:any[],searchString:string ){
    if(!searchString){
      return value
    }

    return value.filter((it) => {
      const item_name= it.spares.filter(item=>item.item.toLowerCase().includes(searchString.toLowerCase()))
      if(item_name.length>0){
        return true;
      }else{
        return false
      }
    })
  }

}
