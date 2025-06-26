import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { UntypedFormGroup, UntypedFormBuilder} from '@angular/forms';

import { Observable } from 'rxjs';
import {  getBlankOption, getObjectFromList, isValidValue } from 'src/app/shared-module/utilities/helper-utils';


@Component({
  selector: 'app-tds-section-inputfield',
  templateUrl: './tds-section-inputfield.component.html',
  styleUrls: ['./tds-section-inputfield.component.scss']
})
export class TdsSectionInputfieldComponent implements OnInit {
  tdsForm: UntypedFormGroup;
  tdsOptions=[];
  @Input() tdsDetails :Observable<any>;
  @Output() tdsOutput = new EventEmitter<any>();
  @Input() tdsDetailsPatch :Observable<any>;
  tsdOption = getBlankOption();

	constructor(
		private _fb: UntypedFormBuilder,
	) { }

  ngOnInit() {
    this.buildForm();
    this.tdsDetails.subscribe(data=>{
      this.tdsOptions = data['data']
    })
    this.tdsForm.valueChanges.subscribe(data=>{
      this.tdsOutput.emit(this.tdsForm.value)
    })
    this.tdsDetailsPatch.subscribe(data=>{
      if(data['patchData']){
          this.tdsOptions = data['lastSectionData']
          this.tdsForm.patchValue(data['patchData']);
          if(isValidValue(data['patchData'].tds_type)){
            this.tsdOption = {label :data['patchData'].tds_type.label,value:data['patchData'].tds_type.id};
            this.tdsForm.get('tds_type').setValue(data['patchData'].tds_type.id);
          }else{
            this.tdsForm.get('tds_type').setValue(null);
          }
      }
    })

  }

  buildForm() {
		this.tdsForm = this._fb.group({
      tds_type:[null],
      tds:[0]
		});
    return this.tdsForm;
  }

  onSelectTds() {
    const form = this.tdsForm;
    const tds = form.get('tds_type').value;
    if(tds){
    const tdsObj = getObjectFromList(tds, this.tdsOptions);
    form.get('tds').setValue(Number(tdsObj.value));
    }
    else{
        form.get('tds').setValue(0);
    }
    }
}
