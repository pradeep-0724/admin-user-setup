import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: "routeSummarySearch"
})

export class RouteSummarySearch implements PipeTransform {

    transform(value:any[],searchString:string ){

       if(!searchString){
         return value  
       }
       return value.filter(it=>{   
           const vehicle = it.vehicle.toString().toLowerCase().includes(searchString.toLowerCase());
           const loop_id = it.loop_id ? it.loop_id.toLowerCase().includes(searchString.toLowerCase()): false;
           const route_status = it.route_status ? it.route_status.toLowerCase().includes(searchString.toLowerCase()): false;
           let trips=[];
           if(it.trips.length){
            trips= it.trips.filter(trip=>{
              const trip_id = trip.trip_id.toString().toLowerCase().includes(searchString.toLowerCase());
              const builty_no = trip.builty_no.toString().toLowerCase().includes(searchString.toLowerCase());
              const customer = trip.customer?trip.customer.company_name.toString().toLowerCase().includes(searchString.toLowerCase()):false;
              const from_loc = trip.from_loc?trip.from_loc.name.toString().toLowerCase().includes(searchString.toLowerCase()):false;
              const to_loc = trip.to_loc?trip.to_loc.name.toString().toLowerCase().includes(searchString.toLowerCase()):false;
              const status = trip.status.toString().toLowerCase().includes(searchString.toLowerCase());
              return (trip_id||builty_no||customer||from_loc||to_loc||status)

            })
           }
          let isTrip = false;
          if(trips.length){
            isTrip = true;
          }
          
           return ( vehicle || loop_id||route_status||isTrip);      
       });
    }
}