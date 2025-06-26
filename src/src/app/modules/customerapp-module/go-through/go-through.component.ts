import { Component, Input, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';


@Component({
  selector: 'app-go-through',
  templateUrl: './go-through.component.html',
  styleUrls: ['./go-through.component.scss']
})
export class GoThroughComponent implements OnInit {

  constructor(private sanitizer: DomSanitizer) { }
  goThroughurl;
  @Input() goThroughDetais: { show: boolean, url: string }
  ngOnInit(): void {
    this.goThroughurl = this.sanitizer.bypassSecurityTrustResourceUrl(this.goThroughDetais.url);
  }
  close() {
    this.goThroughDetais.show=false;
  }

  ngOnChanges(){
    this.goThroughurl = this.sanitizer.bypassSecurityTrustResourceUrl(this.goThroughDetais.url);
  }
}
