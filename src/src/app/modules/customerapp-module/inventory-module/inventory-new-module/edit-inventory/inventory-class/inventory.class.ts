import { UntypedFormArray, UntypedFormGroup } from "@angular/forms";
import { isValidValue } from "src/app/shared-module/utilities/helper-utils";


export class InventoryClass{

    inventoryNewTotal: any = {
        subtotal: 0,
        subtotalspare:0.0,
        subtotaltyre:0.0,
       subtotal_challan: 0.0,
       subtotal_others: 0.0,
       discountTotal: 0,
       taxes: [],
       discountAfterTaxTotal: 0,
       tdsAmount: 0,
       adjustmentAmount: 0,
         total: 0,
         totalspare: 0,
         totaltyre: 0,
       balance: 0.0
       };

    editInventoryForm:UntypedFormGroup;
    isTransactionIncludesTax=false;


    onCalcuationsChanged() {
        let otherItems = this.editInventoryForm.controls['spares'] as UntypedFormArray;
        let tyreItems = this.editInventoryForm.controls['tyres'] as UntypedFormArray;
        this.inventoryNewTotal.subtotal = 0;
        this.inventoryNewTotal.total = 0;
        this.inventoryNewTotal.taxTotal = 0;
        this.inventoryNewTotal.totalspare=0;
        this.inventoryNewTotal.subtotalspare=0;
        this.inventoryNewTotal.totaltyre =0;
        this.inventoryNewTotal.subtotaltyre=0;
        this.inventoryNewTotal.taxes.forEach((tax) => {
          tax.total = 0;
          tax.taxAmount = 0;
          otherItems.controls.forEach((others) => {
            let amountWithoutTax = Number(others.get('total_before_tax').value);
            let rate = amountWithoutTax;
            let amountWithTax;
            if (others.get('tax').value == tax.id) {
              if (isValidValue(amountWithoutTax)) {
                if (this.isTransactionIncludesTax) {
                amountWithoutTax =  Number((amountWithoutTax * 100 / (100 + Number(tax.value))).toFixed(3));
                tax.total = Number((Number(tax.total) + Number(amountWithoutTax)).toFixed(3));
                tax.taxAmount = (Number(tax.taxAmount) + Number(((rate *  Number(tax.value)) / (100 + Number(tax.value))))).toFixed(3);
                amountWithTax = rate.toFixed(3);
                }
              else {
              tax.total = tax.total + amountWithoutTax;
              tax.taxAmount = (Number(tax.taxAmount) + Number(tax.value / 100 * amountWithoutTax)).toFixed(3);
              amountWithTax = (tax.value / 100 * amountWithoutTax + amountWithoutTax).toFixed(3);
              }
              others.get('total').setValue(Number(amountWithTax));
              this.inventoryNewTotal.taxTotal = (Number(this.inventoryNewTotal.taxTotal) + Number(tax.taxAmount)).toFixed(3);
              this.inventoryNewTotal.subtotalspare = (Number(this.inventoryNewTotal.subtotalspare) + Number(amountWithoutTax)).toFixed(3);
              this.inventoryNewTotal.totalspare = (Number(this.inventoryNewTotal.totalspare) + Number(amountWithTax)).toFixed(3);
              }
            }
          });
          tyreItems.controls.forEach((tyre) => {
            let amountWithoutTax = Number(tyre.get('amount').value);
            let rate = amountWithoutTax;
            let amountWithTax;
            if (this.editInventoryForm.get('tax').value == tax.id) {
              if (isValidValue(amountWithoutTax)) {
                if (this.isTransactionIncludesTax) {
                amountWithoutTax =  Number((amountWithoutTax * 100 / (100 + Number(tax.value))).toFixed(3));
                tax.total = Number((Number(tax.total) + Number(amountWithoutTax)).toFixed(3));
                tax.taxAmount = (Number(tax.taxAmount) + Number(((rate *  Number(tax.value)) / (100 + Number(tax.value))))).toFixed(3);
                amountWithTax = rate.toFixed(3);
                }
              else {
              tax.total = tax.total + amountWithoutTax;
              tax.taxAmount = (Number(tax.taxAmount) + Number(tax.value / 100 * amountWithoutTax)).toFixed(3);
              amountWithTax = (tax.value / 100 * amountWithoutTax + amountWithoutTax).toFixed(3);
              }
              tyre.get('total').setValue(Number(amountWithTax));
              this.inventoryNewTotal.taxTotal = (Number(this.inventoryNewTotal.taxTotal) + Number(tax.taxAmount)).toFixed(3);
              this.inventoryNewTotal.subtotaltyre = (Number(this.inventoryNewTotal.subtotaltyre) + Number(amountWithoutTax)).toFixed(3);
              this.inventoryNewTotal.totaltyre = (Number(this.inventoryNewTotal.totaltyre) + Number(amountWithTax)).toFixed(3);
              }
            }
          });
        });
        this.inventoryNewTotal.subtotal = (Number(this.inventoryNewTotal.subtotalspare) +  Number(this.inventoryNewTotal.subtotaltyre)).toFixed(3);
        this.inventoryNewTotal.total = (Number(this.inventoryNewTotal.totaltyre) + Number(this.inventoryNewTotal.totalspare)).toFixed(3);;
        this.calculateTotals();
      }
      
      calculateTotals() {
        const form = this.editInventoryForm;
        const discountAmount =Number(form.get('discount').value);
        const discountAfterTaxAmount =Number(form.get('discount_after_tax').value);
        const adjustmentAmount =Number( form.get('adjustment').value);
        const tds = Number(form.get('tds').value);
      
        if (isValidValue(discountAmount)) {
          this.inventoryNewTotal.discountTotal =
            form.get('discount_type').value == 0
              ? (discountAmount / 100 * this.inventoryNewTotal.subtotal).toFixed(3)
              :Number(discountAmount);
        } else {
          this.inventoryNewTotal.discountTotal = 0;
        }
        this.editInventoryForm.controls.sub_total_without_tax.setValue(this.inventoryNewTotal.subtotal);
        if (isValidValue(discountAfterTaxAmount)) {
          this.inventoryNewTotal.discountAfterTaxTotal =
            form.get('discount_after_tax_type').value == 0
              ? (Number(discountAfterTaxAmount) /
                100 *
                (Number(this.inventoryNewTotal.total) -
                  Number(this.inventoryNewTotal.discountTotal))).toFixed(3)
              : discountAfterTaxAmount;
        } else {
          this.inventoryNewTotal.discountAfterTaxTotal = 0;
        }
      
        if (isValidValue(adjustmentAmount)) {
          this.inventoryNewTotal.adjustmentAmount =
            form.get('adjustment_choice').value == 0
              ? ((Number(this.inventoryNewTotal.subtotal) -
                Number(this.inventoryNewTotal.discountTotal) +
                Number(this.inventoryNewTotal.taxTotal) -
                Number(this.inventoryNewTotal.discountAfterTaxTotal)) *
                Number(adjustmentAmount) /
                100).toFixed(3)
              : adjustmentAmount;
        }
      
        this.inventoryNewTotal.total = (this.inventoryNewTotal.total -
          Number(this.inventoryNewTotal.discountTotal) -
          Number(this.inventoryNewTotal.discountAfterTaxTotal) +
          Number(this.inventoryNewTotal.adjustmentAmount)).toFixed(3);
      
        const deductTdsAmount = Number(this.inventoryNewTotal.subtotal) - Number(this.inventoryNewTotal.discountTotal);
        this.inventoryNewTotal.tdsAmount = (deductTdsAmount * tds / 100).toFixed(3);
        this.inventoryNewTotal.balance = (Number(this.inventoryNewTotal.total) -
                          Number(this.inventoryNewTotal.tdsAmount)).toFixed(3);
      }

      calculateItemAmount(index){
        const newSpareItems = this.editInventoryForm.controls['spares']  as UntypedFormArray;
        let quantity = newSpareItems.at(index).get('quantity').value;
        let unit_cost = newSpareItems.at(index).get('unit_cost').value;
        let setamount = newSpareItems.at(index).get('total_before_tax');
        const  total_before_tax  =(quantity * unit_cost).toFixed(3);
        setamount.setValue(total_before_tax);
        this.onCalcuationsChanged();
      }

      populateTotal(i){
        const otherItems = this.editInventoryForm.controls['tyres'] as UntypedFormArray;
        let total = otherItems.at(i).get('amount').value;
        otherItems.at(i).get('total').setValue(total);
        this.onCalcuationsChanged();
    
      }

      clearData(i){
        this.editInventoryForm.controls['spares']['controls'][i].get('note').setValue('')
      }

      lastSectionOutPut(data){
        const form = this.editInventoryForm;
        form.get('tds_type').setValue(data['tds_type']);
        form.get('tds').setValue(data['tds']);
        this.onCalcuationsChanged();
      }


}