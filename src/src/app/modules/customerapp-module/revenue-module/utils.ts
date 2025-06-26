  export function showPopUpMsgForWorkOrderQuantity(workOrderBalance, totalUnits){
    let popupWorkOrderInputData: any = null;
    if(workOrderBalance - totalUnits < 0){
        popupWorkOrderInputData = {
            'msg': 'The Quantity mentioned in the Trip '+ totalUnits +' is greater than the Remaining Quantity '+ workOrderBalance +' of the Work order, Do you still want to Continue to Create the Trip?',
            'type': 'warning-work-order',
          'show': true,
        }
    }
    return popupWorkOrderInputData
  }
