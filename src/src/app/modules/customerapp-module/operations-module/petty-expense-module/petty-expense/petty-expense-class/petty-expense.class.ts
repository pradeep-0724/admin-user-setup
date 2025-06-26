import { UntypedFormArray, UntypedFormGroup } from "@angular/forms";
import {  isValidValue } from 'src/app/shared-module/utilities/helper-utils';




export class PettyExpenseClass{

    editPettyExpense:UntypedFormGroup;
    itemExpenseTotals={
        subtotal:0.00,
        total:0.00,
        discountTotal:0.00,
        adjustmentAmount:0.00
      }


      /* For deleting the item expense section at a given index */
      calculateItemExpenseAmount(index) {
        const otherItems = this.editPettyExpense.controls['expense_items']  as UntypedFormArray;
        let quantity = otherItems.at(index).get('quantity').value;
        let unit_cost = otherItems.at(index).get('unit_cost').value;
        let setamount = otherItems.at(index).get('total');
        const  amount = (quantity * unit_cost).toFixed(3);
        setamount.setValue(amount);
        this.onCalcuationsChanged();
        }

        onCalcuationsChanged(){
            let ExpenseTotal=0;
            const otherItems = this.editPettyExpense.controls['expense_items'] as UntypedFormArray;
            otherItems.controls.forEach((item)=>{
              ExpenseTotal=ExpenseTotal+ Number(item.get('total').value);
            })
      
            this.itemExpenseTotals.subtotal=ExpenseTotal;
            this.itemExpenseTotals.total=ExpenseTotal;
            this.calculateTotals();
      
             }
      
          /* To calculate the totals */
          calculateTotals(){
           const form=this.editPettyExpense;
           const discountAmount = form.get('discount').value;
           const adjustmentAmount = form.get('adjustment').value;
      
      
         if (isValidValue(discountAmount)) {
           this.itemExpenseTotals.discountTotal =
             form.get('discount_type').value == 0
               ? (discountAmount / 100 * this.itemExpenseTotals.subtotal).toFixed(3)
               : discountAmount;
         } else {
           this.itemExpenseTotals.discountTotal = 0;
         }
      
         if (isValidValue(adjustmentAmount)) {
           this.itemExpenseTotals.adjustmentAmount =
             form.get('adjustment_type').value == 0
               ? ((Number(this.itemExpenseTotals.subtotal) -
                 Number(this.itemExpenseTotals.discountTotal))  *	Number(adjustmentAmount) / 100).toFixed(3)
               : adjustmentAmount;
         }
      
          this.itemExpenseTotals.total = Number((this.itemExpenseTotals.total - Number(this.itemExpenseTotals.discountTotal) + Number(this.itemExpenseTotals.adjustmentAmount)).toFixed(3));
         }
      

        

}