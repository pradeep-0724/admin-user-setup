import { UntypedFormArray, UntypedFormGroup } from '@angular/forms';
export function   removeUnused(enable: boolean = false,addConsignForm:UntypedFormGroup){
  const estimates = addConsignForm.get('items') as UntypedFormArray;
  const battaClient = addConsignForm.get('batta_advance') as UntypedFormArray;
  const fuelClient = addConsignForm.get('fuel_advance') as UntypedFormArray;
  const advanceClient =addConsignForm.get('money_advance') as UntypedFormArray;
  const transporterAdvanceClient =addConsignForm.get('advance') as UntypedFormArray;
  estimates.controls.forEach(element => {
    if(Number(element.get('amount').value) == 0) {
      if (enable)
        element.enable();
      else
        element.disable();
    }
  });

  battaClient.controls.forEach(element => {
    if(Number(element.get('amount').value) == 0) {
      if (enable)
      element.enable();
    else
      element.disable();
    }
  });

  fuelClient.controls.forEach(element => {
    if(Number(element.get('amount').value) == 0) {
      if (enable)
      element.enable();
    else
      element.disable();
    }
  });

  advanceClient.controls.forEach(element => {
    if(Number(element.get('amount').value) == 0) {
      if (enable)
      element.enable();
    else
      element.disable();
    }
  });

  transporterAdvanceClient.controls.forEach(element => {
    if(Number(element.get('amount').value) == 0) {
      if (enable)
      element.enable();
    else
      element.disable();
    }
  });

}

export function  mandatoryRemarkFieldCheckbox(addConsignForm:UntypedFormGroup){
  const custom_field = addConsignForm.get('remark_details') as UntypedFormArray;
  custom_field.controls.forEach((item) => {
    if(item.get('field_type').value=="checkbox"){
      if(item.get('value').value ==""||item.get('value').value =="false"||item.get('value').value ==false){
        item.get('value').setValue('')
      }
    }
  });
}

export function  mandatoryOtherFieldCheckbox(addConsignForm:UntypedFormGroup){
  const custom_field = addConsignForm.get('other_details') as UntypedFormArray;
  custom_field.controls.forEach((item) => {
    if(item.get('field_type').value=="checkbox"){
      if(item.get('value').value ==""||item.get('value').value =="false"||item.get('value').value ==false){
        item.get('value').setValue('')
      }
    }
  });
}

export function  mandatoryOtherLorryFieldCheckbox(addConsignForm:UntypedFormGroup){
  const custom_field = addConsignForm.get('other_details_in_lorrychallan') as UntypedFormArray;
  custom_field.controls.forEach((item) => {
    if(item.get('field_type').value=="checkbox"){
      if(item.get('value').value ==""||item.get('value').value =="false"||item.get('value').value ==false){
        item.get('value').setValue('')
      }
    }
  });
}

export function  mandatoryMaterialFieldCheckbox(addConsignForm:UntypedFormGroup){
  const items = addConsignForm.get('items') as UntypedFormArray;
  items.controls.forEach((item,index)=>{
    let custom_field = item.get('custom_details') as UntypedFormArray;
    custom_field.controls.forEach((item) => {
      if(item.get('field_type').value=="checkbox"){
        if(item.get('value').value ==""||item.get('value').value =="false"||item.get('value').value ==false || item.get('value').value==null){
          item.get('value').setValue('')
        }else{
          item.get('value').setValue(item.get('value').value.toString())
        }
      }
      if(item.get('field_type').value=="checkbox"){
        if(item.get('value').value ==""|| item.get('value').value==null){
          item.get('value').setValue('')
        }
      }
      if(item.get('field_type').value=="string"){
        if(item.get('value').value ==""|| item.get('value').value==null){
          item.get('value').setValue('')
        }
      }
      if(item.get('field_type').value=="select_option"){
        if(item.get('value').value ==""|| item.get('value').value==null){
          item.get('value').setValue('')
        }
      }
    });
  })

}
