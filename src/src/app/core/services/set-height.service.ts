import {   Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SetHeightService {

  constructor() { 
    
  }
  setTableHeight(heightClass:string,tableClass:string,extra:number){
    
    let navHeight:any=document.querySelector("header .nav__primary");
    navHeight=navHeight.offsetHeight;
    let footerHeight :any=document.querySelector("footer.footer");
    footerHeight=footerHeight.offsetHeight;
    let heightElements :any=document.querySelectorAll("."+heightClass)
    let DeductableHeight=0;
    heightElements.forEach((e )=>{DeductableHeight+=e.offsetHeight;});
    let totalDeductableHeight=navHeight + footerHeight + DeductableHeight + extra + "px"
    let tableEle :any=document.querySelector("#"+tableClass);
    tableEle.style.setProperty("height",`calc(100vh - ${ totalDeductableHeight}) `, "important")
    tableEle.style.minHeight="220px";
    tableEle.style.maxHeight="unset";
    

  }
  setTableHeight2(heightClass:Array<string>,tableId:string,extra:number){
    
    let navHeight:any=document.querySelector("header .nav__primary");
    navHeight=navHeight.offsetHeight;
    let footerHeight :any=document.querySelector("footer.footer");
    footerHeight=footerHeight.offsetHeight;

    let heightElements :any=document.querySelectorAll(heightClass.join(","))
    let DeductableHeight=0;
    heightElements.forEach((e )=>{DeductableHeight+=e.offsetHeight;});
    
    let totalDeductableHeight=navHeight + footerHeight + DeductableHeight + extra + "px"
    let tableEle :any=document.querySelector("#"+tableId);
    tableEle.style.setProperty("height",`calc(100vh - ${ totalDeductableHeight}) `, "important")
    tableEle.style.minHeight="220px";
    tableEle.style.maxHeight="unset";
    
  }


}
