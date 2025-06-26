import { Component, Input, OnInit } from '@angular/core';
import { ToolTip } from '../new-trip-v2-utils/new-trip-v2-utils';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-tool-tip',
  templateUrl: './tool-tip.component.html',
  styleUrls: ['./tool-tip.component.scss']
})
export class ToolTipComponent implements OnInit {


  @Input() toolTipContent:ToolTip
  @Input() totalSlides:number=0;
  @Input() position:string='';
  @Input() customIcon='<i  class="bi bi-info-circle"></i>';
  slidesId=[];
  activeSlide: number = 0;
  safeHtml=[];
  hide=false;
  selectedTab:number=0
  tooltipId= Math.floor(Math.random() * (100 - 1 + 1)) + 1;
  constructor(private sanitizer: DomSanitizer) { }

  ngOnInit(): void {
    this.toolTipContent.content.forEach(item=>{
      this.safeHtml.push(this.sanitizer.bypassSecurityTrustHtml(item))
    })
   
    if(this.totalSlides>=2){
     this.slidesId=[];
     for (let index = 0; index <this.totalSlides; index++) {
        this.slidesId.push(index)
     }
    }
  }

}
