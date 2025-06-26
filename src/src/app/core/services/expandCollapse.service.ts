import { Injectable} from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class ExpandCollapse {

getexpandCollapse(data){
          let show=[],
              show2=[];

        for (const key in data['first']) {
            console.log(key)
            show.push(data['type'])
        }
        for (const key in data['second']) {
            console.log(key)
            show2.push(data['type'])
        }
        let finaldata={
          first:show,
          second:show2
        }
        return finaldata
  }

}
