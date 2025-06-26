import { UntypedFormArray, UntypedFormGroup } from "@angular/forms";
import { isValidValue } from "src/app/shared-module/utilities/helper-utils";




export class EmployeeOthersClass{

    employeeOthersForm:UntypedFormGroup;
    employeeOtherTotals={
        subtotal:0.00,
        total:0.00,
        adjustmentAmount:0.00
      }


    onCalcuationsChanged(){
        let ExpenseTotal=0;
        const otherItems = this.employeeOthersForm.controls['employees'] as UntypedFormArray;
        otherItems.controls.forEach((item)=>{
          ExpenseTotal=ExpenseTotal+ Number(item.get('amount').value);
         })
         this.employeeOtherTotals.subtotal=ExpenseTotal;
         this.employeeOtherTotals.total=ExpenseTotal;
         this.calculateTotals();

      }

      calculateTotals(){
        const form=this.employeeOthersForm;

        const adjustmentAmount = form.get('adjustment').value;

        if (isValidValue(adjustmentAmount)) {
       this.employeeOtherTotals.adjustmentAmount =
        form.get('adjustment_choice').value == 0
         ? ((Number(this.employeeOtherTotals.subtotal)  *	Number(adjustmentAmount) / 100).toFixed(3)) : adjustmentAmount;
        }

       this.employeeOtherTotals.total = Number((this.employeeOtherTotals.total  + Number(this.employeeOtherTotals.adjustmentAmount)).toFixed(3));
       }
}
