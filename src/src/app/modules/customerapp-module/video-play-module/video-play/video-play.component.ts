import { Component, Input, OnInit ,Output,EventEmitter} from '@angular/core';
import {  popupOverflowService } from 'src/app/modules/customerapp-module/api-services/auth-and-general-services/popup-overflow.service';

@Component({
  selector: 'app-video-play',
  templateUrl: './video-play.component.html',
  styleUrls: ['./video-play.component.scss']
})
export class VideoPlayComponent implements OnInit {

  @Input() showIcon = true;
  @Input() videoUrl='';
  popupvideo = false;
  @Output() closeVideo =  new EventEmitter<any>()
  constructor(private _popupBodyScrollService: popupOverflowService) { }

  ngOnInit() {
  }

  popupVideoClose(){
   this.closeVideo.emit(this.popupvideo);
   this._popupBodyScrollService.popupActive()
  }
  popupClose(){
    this._popupBodyScrollService.popupHide()
  }

}
