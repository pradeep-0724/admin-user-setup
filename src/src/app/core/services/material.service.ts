import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})

export class MaterialService {
  material:boolean = true;
  setMaterial(material:boolean){
    this.material = material
  }
  getMaterial():boolean{
    return this.material
  }
}
