import { Component, OnInit } from '@angular/core';
import { getPrefix } from 'src/app/core/services/prefixurl.service';
import { NewBdpService } from '../../../../api-services/trip-module-services/bdp-service/bdp-service.service';

@Component({
  selector: 'app-bdp-list',
  templateUrl: './bdp-list.component.html',
  styleUrls: ['./bdp-list.component.scss'],
  host: {
		'(document:click)': 'outSideClick($event)'
	}
})
export class BdpListComponent implements OnInit {
  constructor(private newBdpService:NewBdpService){}
  prefixUrl = getPrefix();
  bdpList=[];
  showOptions: string = '';

  ngOnInit(): void {
    this.getBdpList();
  }

  getBdpList(){
    this.newBdpService.getBDPList().subscribe((data)=>{
      this.bdpList=data.result
    })
  }

  optionsList(event, list_index) {
		return (this.showOptions = list_index);
	}

  outSideClick(env) {
    try {
      if ((env.target.className).indexOf('more-icon') == -1){
        this.showOptions = ''
      }
    } catch (error) {
      console.log(error)
    }
  }

  isAcceptTender(data,isAccept:boolean){
    let body={
      tender_number:data.tenderRequestNumber,
      is_accepted:isAccept
    }
    this.newBdpService.isAcceptTender(body).subscribe((data)=>{
      this.getBdpList();
    });
  }


}
