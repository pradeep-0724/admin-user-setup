import { UntypedFormGroup, UntypedFormArray } from '@angular/forms';
import * as _ from 'lodash';
import { ValidationConstants } from 'src/app/core/constants/constant';

export function getObjectFromList(id: String, list: any[]) {
  if ((id !== '' || id !== undefined ) && list !== undefined) {
    return list.filter((item) => item.id === id)[0];
  }
  return {};
}


export function getObjectFromListByKey(key: any, value: String, list: any[]) {
  if (key !== '' || key !== undefined) {
    return list.filter((item) => item[key] === value)[0];
  }
  return {};
}

export function isValidValue(value):boolean {
  if (value === null || value === undefined) return false; // Null or Undefined
  if (typeof value === 'string') return value.trim().length > 0; // Non-empty String
  if (typeof value === 'number') return !isNaN(value); // Valid Number (Not NaN)
  if (Array.isArray(value)) return value.length > 0; // Non-empty Array
  if (typeof value === 'object') return Object.keys(value).length > 0; // Non-empty Object
  return false; 
}

export function compare(a: number | string, b: number | string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}

export function toggleEstimatesFilled(form: UntypedFormGroup, enable: Boolean = false) {
  const estimates = form.controls['estimates'] as UntypedFormArray;
  if (enable) {
    estimates.enable();
  } else {
    estimates.controls.forEach(ele => {
      if (!isValidValue(ele.value.material_type)) {
        ele.disable();
      }
    });
  }
}


export function toggleAdvanceTripClientFilled(form: UntypedFormGroup, enable: Boolean = false) {
  const estimates = form.controls['advance_client'] as UntypedFormArray;
  if (enable) {
    estimates.enable();
  } else {
    estimates.controls.forEach(ele => {
      if (!isValidValue(ele.value.account)) {
        ele.disable();
      }
    });
  }
}

export function toggleFuelTripClientFilled(form: UntypedFormGroup, enable: Boolean = false) {
  const estimates = form.controls['fuel_client'] as UntypedFormArray;
  if (enable) {
    estimates.enable();
  } else {
    estimates.controls.forEach(ele => {
      if (Number(ele.value.amount) == 0) {
        ele.disable();
      }
    });
  }
}

export function toggleBattaTripClientFilled(form: UntypedFormGroup, enable: Boolean = false) {
  const estimates = form.controls['batta_client'] as UntypedFormArray;
  if (enable) {
    estimates.enable();
  } else {
    estimates.controls.forEach(ele => {
      if (Number(ele.value.amount) == 0) {
        ele.disable();
      }
    });
  }
}

export function toggleExpensesFilled(form: UntypedFormGroup, enable: Boolean = false) {
  const expenses = form.controls['expenses'] as UntypedFormArray;
  if (enable) {
    expenses.get("driver_helper").enable();
    expenses.get("fuel").enable();
    expenses.get("other").enable();
  } else {
    const dh = expenses.get("driver_helper") as UntypedFormArray;
    const ot = expenses.get("other") as UntypedFormArray;
    dh.controls.forEach(ele => {
      if (!isValidValue(ele.value.account)) {
        ele.disable();
      }
    });
    ot.controls.forEach(ele => {
      if (!isValidValue(ele.value.title)) {
        ele.disable();
      }
    });
  }
}

export function toggleTransportOtherExpenseFilled(form: UntypedFormGroup, enable: Boolean = false) {
  const expenses = form.controls['other_expenses'] as UntypedFormArray;
  if (enable) {
    expenses.enable();
  } else {
    expenses.controls.forEach(ele => {
      if (Number(ele.value.amount) == 0) {
        ele.disable();
      }
    });
  }
}

export function toggleVehicleProvider(form: UntypedFormGroup, enable: Boolean = false) {
   const vehicleProviders = form.controls['vehicle_providers'] as UntypedFormArray;
   if (enable) {
     vehicleProviders.controls.forEach(element => {
       element.get('vendor_advances').enable();
       element.get('vendor_fuels').enable();
       element.get('fleetowner_expenses').enable();
     });
   } else {
      vehicleProviders.controls.forEach(element => {
       element.get('vendor_advances')['controls'].forEach(element => {
          if (Number(element.value.amount) == 0)
              element.disable();

        });
        element.get('vendor_fuels')['controls'].forEach(element => {
          if (Number(element.value.amount) == 0)
              element.disable();
        });

        element.get('fleetowner_expenses')['controls'].forEach(element => {
          if (Number(element.value.amount) == 0)
              element.disable();
        });
   });
  }
}

export function toggleAdvanceTripVendorFilled(form: UntypedFormGroup, enable: Boolean = false) {
  const client_advance = form.controls['client_advance'] as UntypedFormArray;
  if (enable) {
    client_advance.enable();
  } else {
    client_advance.controls.forEach(ele => {
      if (!isValidValue(ele.value.account)) {
        ele.disable();
      }
    });
  }
}


export function toggleEstimatesVendorFilled(form: UntypedFormGroup, enable: Boolean = false) {
  const estimates = form.controls['estimates'] as UntypedFormArray;
  if (enable) {
    estimates.enable();
  } else {
    estimates.controls.forEach(ele => {
      if (!isValidValue(ele.value.material_type)) {
        ele.disable();
      }
    });
  }
}

export function percentageCalculation(totalAmount: number, percent: number) {
  if (totalAmount && Number(percent) >= 0) {
    let finalAmount = (Number(totalAmount) * Number(percent)) / 100
    return (Number(finalAmount.toFixed(3)) + Number(totalAmount)).toFixed(3)
  }
}
// trim extra spaces between words and trim spaces from both sides
export function trimExtraSpaceBtwWords(value: String) {
  return value.replace(/\s\s+/g, ' ').trim();
}

/* get selected employee object from the vendor list array
 objectList => array of objects
 id => id of the selected
 */
export function getSelectedObject(objectList, id) {
  if (objectList.length > 0 && id) {
    for (const obj of objectList) {
      if (obj.id === id) {
        return obj;
      }
    }
  }
}

/* round off 2 digit after decimal place i.e. for amount
formControl => formcontrolName
*/
export function roundOffAmount(formControl) {
  return formControl.setValue(Number(formControl.value).toFixed(3))
}

/* round off 3 digit after decimal place i.e. for weigth and quantity
formControl => formcontrolName
*/
export function roundOffQuantity(formControl) {
  return formControl.setValue(Number(formControl.value).toFixed(3))
}

/* compare billing and shipping address and return the boolean value
*/
export function isBillingAndShippingAddressSame(billingAddress, shippingAddress): boolean {
  let isAddressSame: boolean;
  const billAddress = {
    state: billingAddress.state,
    address_line_1: billingAddress.address_line_1,
    city: billingAddress.city,
    district: billingAddress.district,
    street: billingAddress.street,
    pincode: billingAddress.pincode
  };
  const shipAddress = {
    state: shippingAddress.state,
    address_line_1: shippingAddress.address_line_1,
    city: shippingAddress.city,
    district: shippingAddress.district,
    street: shippingAddress.street,
    pincode: shippingAddress.pincode
  };
  isAddressSame = JSON.stringify(billAddress)==JSON.stringify(shipAddress)
  return isAddressSame;
}

export function isReverseMechanism(status: boolean): string {
  if (status === true) {
    return 'Yes';
  } else {
    return 'No';
  }
}

export function taxInclusive(isInclusive: boolean): string {
  if (isInclusive)
    return 'Yes';
  else
    return 'No';
}

export function getMinOrMaxDate(date) {
  date = new Date(date);
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function getBlankOption(){
  return {label: '', value: null}
}

export function getNonTaxableOption(){
  return {label: new ValidationConstants().nonTaxableLabel , value: new ValidationConstants().defaultTax}
}

export function checkObjectEmpty(obj,keys,number=false){
            if(obj==null || obj== undefined || obj==''){
              return ''
            }
            else{
              return obj[keys];
            }
}

export function checkContentEmpty(obj,data){
  if(obj==null || obj== undefined  || obj== ''){
    return ''
  }
  else{
    return data;
  }

}

export function checkEmpty(obj, keys, number = false) {
  var object = null;
  keys.forEach((key, index) => {
    if (index === 0) {
      if (obj) {
        if (!obj.hasOwnProperty(key)) {
          if (number) {
            object = '0';
          } else {
            object = '-';
          }
        }
      } else {
        if (number) {
          object = '0';
        } else {
          object = '-';
        }
      }
      object = obj[key]
    } else {
      if (object) {
        if (!object.hasOwnProperty(key)) {
          if (number) {
            object = '0';
          } else {
            object = '-';
          }
        }
      } else {
        if (number) {
          object = '0';
        } else {
          object = '-';
        }
      }
      object = object[key]
    }
  })
  if (object){
    return object
  } else{
    if (number) {
      object = '0';
    } else {
      object = '-';
    }
    return object
  }
}

export function checkEmptyDataKey(dataArray, keyName) {
  let isEmpty: boolean = true;
  dataArray.forEach(element => {
      if (element.hasOwnProperty(keyName) && element[keyName] != "") {
        isEmpty = false;
      }
  });
  return isEmpty;
}

export function doChunk( list: any[],size) {

  return list.reduce((r, v) =>
    (!r.length || r[r.length - 1].length === size ?
      r.push([v]) : r[r.length - 1].push(v)) && r
  , []);

}


export function convertStringToFixedArrayLength(address:string){
  let addressArray =[];
      addressArray = address.split(" ");
  let addressWords :Array<any> = [];
      if(addressArray.length>0){
         addressArray.forEach(word=>{
            if(word){
               addressWords.push(word)
            }
         })
      }
        let joinWordsWithOneSpace = addressWords.join("")
        let senetenceLengthCount = Math.ceil(joinWordsWithOneSpace.length/2)
        let newAddressArray :Array<any>=[];
             for(let index = 0;index<senetenceLengthCount;index++){
                   newAddressArray.push([])
             }
       let newAddressIndex=0;
       let addresses :Array<any>=[]
       addressWords.forEach(word=>{
         let stringLengthCount=newAddressArray[newAddressIndex].join('').length;
             if(stringLengthCount<=14){
               newAddressArray[newAddressIndex].push(word);
               if(newAddressArray[newAddressIndex].join('').length>=15){
                  newAddressArray[newAddressIndex].pop();
                   newAddressIndex ++;
                    newAddressArray[newAddressIndex].push(word);
               }
             }else{
               newAddressIndex ++;
               newAddressArray[newAddressIndex].push(word);
             }
       })
        newAddressArray.forEach(address=>{
           if(address.length>0){
              addresses.push(address.join(' '))
           }
        })
 return addresses
}


export function getBase64FromUrl(url) {
  return new Promise((resolve, reject) => {
    var img = new Image();
    img.setAttribute("crossOrigin", "anonymous");

    img.onload = () => {
      var canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;

      var ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);

      var dataURL = canvas.toDataURL("image/png");

      resolve(dataURL);
    };

    img.onerror = error => {
      reject(error);
    };

    img.src = url;
  });
}
