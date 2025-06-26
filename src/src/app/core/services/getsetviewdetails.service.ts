import { Injectable } from '@angular/core';
export interface viewDetails{
  id:string,
  screen:string,
  sub_screen:string
}

@Injectable({
    providedIn: 'root'
})

export class getSetViewDetails {

private viewDetails :viewDetails

  public get viewInfo() {
    return this.viewDetails;
  }

  public set viewInfo(object:viewDetails) {
    this.viewDetails =object
  }

}

