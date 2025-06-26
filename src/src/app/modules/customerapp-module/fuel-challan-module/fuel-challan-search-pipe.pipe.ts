import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fuelChallanSearchPipe'
})
export class FuelChallanSearchPipePipe implements PipeTransform {

  transform(value:any[],searchString:string ){

    if(!searchString){
      return value
    }
    return value.filter(it=>{
        const date = it.date.toLowerCase().includes(searchString.trim().toLowerCase());
        const vendor = it.vendor.name.toLowerCase().includes(searchString.trim().toLowerCase());
        let vech = false;
        const isVehicle = it.unpaidfuelchallan.filter(val=>{
          const vehicle = val.vehicle.reg_number.toLowerCase().includes(searchString.trim().toLowerCase());
          const status = val.status.label.toLowerCase().includes(searchString.trim().toLowerCase());
          if(vehicle||status){
            return true
          }
          
        })
        if(isVehicle.length>0){
         vech = true
        }
        return ( date|| vendor||vech );
     
    });
 }
   
  }


