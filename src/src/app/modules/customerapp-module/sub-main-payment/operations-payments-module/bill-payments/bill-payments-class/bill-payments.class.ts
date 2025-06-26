import { UntypedFormArray, UntypedFormGroup } from "@angular/forms";
import { defaultZero } from "src/app/shared-module/utilities/currency-utils";





export class BillPaymentClass{

    billPaymentsTotals = {
		amountPaid: 0,
		creditAvailed: 0,
		advanceAvailed: 0,
		total: 0,
		discountAmount: 0,
    withheldAmount:0,
    amountPayable:0
	};
    outStandingBills  ={
      amountPaid: 0,
      creditAvailed: 0,
      advanceAvailed: 0,
      total: 0,
      discountAmount: 0,
      withheldAmount:0,
      amountPayable:0
    }
    outStandingLabourBills  ={
      amountPaid: 0,
      creditAvailed: 0,
      advanceAvailed: 0,
      total: 0,
      discountAmount: 0,
      withheldAmount:0,
      amountPayable:0
    }

    outStandingForemanSalary  ={
      amountPaid: 0,
      creditAvailed: 0,
      advanceAvailed: 0,
      total: 0,
      discountAmount: 0,
      withheldAmount:0,
      amountPayable:0
    }
    doAutoFill: boolean = true;
    billList: any = [];
    labourList :any = [];
    foremanList :any = [];
    doAutoFillLabour: boolean = true;
    doAutoFillForeman: boolean = true;
    editBillPaymentForm:UntypedFormGroup

    calculateTotal() {
		this.billPaymentsTotals.amountPayable = (Number(this.editBillPaymentForm.value["amount_paid"]) +
		 defaultZero(Number(this.billPaymentsTotals.creditAvailed)) +
		 defaultZero(Number(this.billPaymentsTotals.advanceAvailed)) +
		 defaultZero(Number(this.billPaymentsTotals.discountAmount))).toFixed(3);
		this.editBillPaymentForm.controls['credit_availed'].setValue(this.billPaymentsTotals.creditAvailed);
		this.editBillPaymentForm.controls['advance_availed'].setValue(this.billPaymentsTotals.advanceAvailed);
    this.editBillPaymentForm.controls['withheld_amount'].setValue(this.billPaymentsTotals.withheldAmount);
	}

	calculateCreditAvail() {
		this.billPaymentsTotals.creditAvailed = 0;
		const creditNotes = this.editBillPaymentForm.controls['vendor_credit'] as UntypedFormArray;
		creditNotes.controls.filter((controls) => {
			if (controls.get('selected').value == true) {
				this.billPaymentsTotals.creditAvailed = this.billPaymentsTotals.creditAvailed + defaultZero(controls.get("availing").value);

				let amount = defaultZero(controls.get('availing').value);
				let balance = defaultZero(controls.get('balance').value);
				let total_balance = (Number(balance) - Number(amount)).toFixed(3);
				controls.get('total_balance').setValue(total_balance);
			}
		});
		// this.autoFillOutStandingBalances();
	}

    autoFillOutStandingBalances() {
		this.calculateTotal();
		if (!this.doAutoFill) {
			return;
		  }
		let amountToAutoFill = Number(this.billPaymentsTotals.amountPayable);

    // bill outstanding autofill
		const outstandingBills = this.editBillPaymentForm.controls['outstanding_bills'] as UntypedFormArray;
		const numOutstandingBills = outstandingBills.length;
   for(let i=0;i<numOutstandingBills;i++){
    outstandingBills.at(i).get('amount_paid').setValue(0);
    outstandingBills.at(i).get('selected').setValue(false);
   }
		for( let index = 0; index < numOutstandingBills; index++) {
		  if (amountToAutoFill <= 0) {
			break
		  }
		  let balance = Number(outstandingBills.at(index).get('balance').value);
		  if (amountToAutoFill > 0 && amountToAutoFill < balance) {
			balance = amountToAutoFill;
		  }
		  amountToAutoFill -= balance;
		  outstandingBills.at(index).get('amount_paid').setValue(balance.toFixed(3));
		  this.selectBillOnAutoFill(index, this.billList[index].id);
		}

    // labour outstanding autofill
		const outstandingBillsLabour = this.editBillPaymentForm.controls['outstanding_labour_bills'] as UntypedFormArray;
		const numOutstandingBillsLabour = outstandingBillsLabour.length;
		for( let index = 0; index < numOutstandingBillsLabour; index++) {
		  if (amountToAutoFill <= 0) {
			break
		  }
		  let balance = Number(outstandingBillsLabour.at(index).get('labour_balance').value);
		  if (amountToAutoFill > 0 && amountToAutoFill < balance) {
			balance = amountToAutoFill;
		  }
		  amountToAutoFill -= balance;
		  outstandingBillsLabour.at(index).get('amount_paid').setValue(balance.toFixed(3));
		  this.selectBillOnAutoFillLabour(index, this.labourList[index].id);
		}


    // foreman outstanding autofill
		const outstandingBillsForeman = this.editBillPaymentForm.controls['outstanding_foreman_bills'] as UntypedFormArray;
		const numOutstandingBillsForeman = outstandingBillsForeman.length;
		for( let index = 0; index < numOutstandingBillsForeman; index++) {
		  if (amountToAutoFill <= 0) {
			break
		  }
		  let balance = Number(outstandingBillsForeman.at(index).get('foreman_balance').value);
		  if (amountToAutoFill > 0 && amountToAutoFill < balance) {
			balance = amountToAutoFill;
		  }
		  amountToAutoFill -= balance;
		  outstandingBillsForeman.at(index).get('amount_paid').setValue(balance.toFixed(3));
		  this.selectBillOnAutoFillForeman(index, this.foremanList[index].id);
		}


		  this.calculateAmountPaid(true);
      this.calculateLabourAmountPaid(true);
      this.calculateForemanAmountPaid(true);
	  }

    selectBillOnAutoFill(index, id){
		const amount = this.editBillPaymentForm.get('outstanding_bills')['controls'][index].controls.amount_paid.value;
		const selected = this.editBillPaymentForm.get('outstanding_bills')['controls'][index].controls.selected;
		this.editBillPaymentForm.get('outstanding_bills')['controls'][index].controls.bill.setValue(id);
		amount > 0 ? selected.setValue(true) : '';

	  }

    // labour autofill
    selectBillOnAutoFillLabour(index, id){
      const amount = this.editBillPaymentForm.get('outstanding_labour_bills')['controls'][index].controls.amount_paid.value;
      const selected = this.editBillPaymentForm.get('outstanding_labour_bills')['controls'][index].controls.selected;
      this.editBillPaymentForm.get('outstanding_labour_bills')['controls'][index].controls.labour_bill.setValue(id);
      amount > 0 ? selected.setValue(true) : '';
      }

       // foreman autofill
    selectBillOnAutoFillForeman(index, id){
      const amount = this.editBillPaymentForm.get('outstanding_foreman_bills')['controls'][index].controls.amount_paid.value;
      const selected = this.editBillPaymentForm.get('outstanding_foreman_bills')['controls'][index].controls.selected;
      this.editBillPaymentForm.get('outstanding_foreman_bills')['controls'][index].controls.foreman_bill.setValue(id);
      amount > 0 ? selected.setValue(true) : '';
      }




      calculateAmountPaid (calledByAutoFill: boolean = false) {

        if (!calledByAutoFill) {
          this.doAutoFill = false;
          }
          this.outStandingBills.withheldAmount=0;
          this.outStandingBills.amountPaid=0;
          this.outStandingBills.discountAmount=0;
          this.billPaymentsTotals.withheldAmount=0;
          this.billPaymentsTotals.amountPaid=0;
          this.billPaymentsTotals.discountAmount=0;

          const bills = this.editBillPaymentForm.controls['outstanding_bills'] as UntypedFormArray;
          bills.controls.filter((controls) => {
            if(controls.get('selected').value == true) {
              this.outStandingBills.withheldAmount = this.outStandingBills.withheldAmount + defaultZero(controls.get("withheld").value);
          this.outStandingBills.amountPaid = this.outStandingBills.amountPaid + defaultZero(controls.get("amount_paid").value) +
                                                  defaultZero(controls.get("adjustment").value);
          this.outStandingBills.discountAmount = this.outStandingBills.discountAmount + defaultZero(controls.get("adjustment").value);
          this.billPaymentsTotals.withheldAmount = this.outStandingBills.withheldAmount + this.outStandingLabourBills.withheldAmount;
          this.billPaymentsTotals.amountPaid = this.outStandingBills.amountPaid + this.outStandingLabourBills.amountPaid;
          this.billPaymentsTotals.discountAmount = this.outStandingBills.discountAmount + this.outStandingLabourBills.discountAmount;
          let balance = controls.get('balance').value
          let adjustment = controls.get('adjustment').value
          let withheld = controls.get('withheld').value
          let amount_paid = controls.get('amount_paid').value
          let total_balance = defaultZero(balance) - defaultZero(adjustment) - defaultZero(withheld) - defaultZero(amount_paid);
          controls.get('total_balance').setValue((total_balance).toFixed(3));
            }
          });
          this.billPaymentsTotals.withheldAmount = this.outStandingBills.withheldAmount + this.outStandingLabourBills.withheldAmount + this.outStandingForemanSalary.withheldAmount;
          this.billPaymentsTotals.amountPaid = this.outStandingBills.amountPaid + this.outStandingLabourBills.amountPaid + this.outStandingForemanSalary.amountPaid;
          this.billPaymentsTotals.discountAmount = this.outStandingBills.discountAmount + this.outStandingLabourBills.discountAmount + this.outStandingForemanSalary.discountAmount;
          this.calculateTotal();
        }

        calculateLabourAmountPaid (calledByAutoFill: boolean = false) {

          if (!calledByAutoFill) {
            this.doAutoFillLabour = false;
            }
            this.outStandingLabourBills.withheldAmount=0;
            this.outStandingLabourBills.amountPaid=0;
            this.outStandingLabourBills.discountAmount=0;
            this.billPaymentsTotals.withheldAmount=0;
            this.billPaymentsTotals.amountPaid=0;
            this.billPaymentsTotals.discountAmount=0;
            const bills = this.editBillPaymentForm.controls['outstanding_labour_bills'] as UntypedFormArray;
            bills.controls.filter((controls) => {
              if(controls.get('selected').value == true) {
                this.outStandingLabourBills.withheldAmount = this.outStandingLabourBills.withheldAmount + defaultZero(controls.get("withheld").value);
            this.outStandingLabourBills.amountPaid = this.outStandingLabourBills.amountPaid + defaultZero(controls.get("amount_paid").value) +
                                                    defaultZero(controls.get("adjustment").value);
            this.outStandingLabourBills.discountAmount = this.outStandingLabourBills.discountAmount + defaultZero(controls.get("adjustment").value);
            let balance = controls.get('labour_balance').value
            let adjustment = controls.get('adjustment').value
            let withheld = controls.get('withheld').value
            let amount_paid = controls.get('amount_paid').value
            let total_balance = defaultZero(balance) - defaultZero(adjustment) - defaultZero(withheld) - defaultZero(amount_paid);
            controls.get('total_balance').setValue((total_balance).toFixed(3));
              }
            });
            this.billPaymentsTotals.withheldAmount = this.outStandingBills.withheldAmount + this.outStandingLabourBills.withheldAmount + this.outStandingForemanSalary.withheldAmount;
            this.billPaymentsTotals.amountPaid = this.outStandingBills.amountPaid + this.outStandingLabourBills.amountPaid + this.outStandingForemanSalary.amountPaid;
            this.billPaymentsTotals.discountAmount = this.outStandingBills.discountAmount + this.outStandingLabourBills.discountAmount + this.outStandingForemanSalary.discountAmount;
            this.calculateTotal();
          }

          calculateForemanAmountPaid (calledByAutoFill: boolean = false) {

            if (!calledByAutoFill) {
              this.doAutoFillForeman = false;
              }
              this.outStandingForemanSalary.withheldAmount=0;
              this.outStandingForemanSalary.amountPaid=0;
              this.outStandingForemanSalary.discountAmount=0;
              this.billPaymentsTotals.withheldAmount=0;
              this.billPaymentsTotals.amountPaid=0;
              this.billPaymentsTotals.discountAmount=0;
              const bills = this.editBillPaymentForm.controls['outstanding_foreman_bills'] as UntypedFormArray;
              bills.controls.filter((controls) => {
                if(controls.get('selected').value == true) {
                  this.outStandingForemanSalary.withheldAmount = this.outStandingForemanSalary.withheldAmount + defaultZero(controls.get("withheld").value);
              this.outStandingForemanSalary.amountPaid = this.outStandingForemanSalary.amountPaid + defaultZero(controls.get("amount_paid").value) +
                                                      defaultZero(controls.get("adjustment").value);
              this.outStandingForemanSalary.discountAmount = this.outStandingForemanSalary.discountAmount + defaultZero(controls.get("adjustment").value);
              let balance = controls.get('foreman_balance').value
              let adjustment = controls.get('adjustment').value
              let withheld = controls.get('withheld').value
              let amount_paid = controls.get('amount_paid').value
              let total_balance = defaultZero(balance) - defaultZero(adjustment) - defaultZero(withheld) - defaultZero(amount_paid);
              controls.get('total_balance').setValue((total_balance).toFixed(3));
                }
              });
              this.billPaymentsTotals.withheldAmount = this.outStandingBills.withheldAmount + this.outStandingLabourBills.withheldAmount + this.outStandingForemanSalary.withheldAmount;
              this.billPaymentsTotals.amountPaid = this.outStandingBills.amountPaid + this.outStandingLabourBills.amountPaid + this.outStandingForemanSalary.amountPaid;
              this.billPaymentsTotals.discountAmount = this.outStandingBills.discountAmount + this.outStandingLabourBills.discountAmount + this.outStandingForemanSalary.discountAmount;
              this.calculateTotal();
            }

        calculateAdvanceAvail() {
            this.billPaymentsTotals.advanceAvailed = 0;            
            const advance = this.editBillPaymentForm.controls['vendor_advances'] as UntypedFormArray;
            advance.controls.filter((controls) => {
                if (controls.get('selected').value == true) {
                    this.billPaymentsTotals.advanceAvailed = this.billPaymentsTotals.advanceAvailed + defaultZero(controls.get("availing").value);

                    let amount = defaultZero(controls.get('availing').value);
                    let balance = defaultZero(controls.get('balance').value);
                    let total_balance = (Number(balance) - Number(amount)).toFixed(3);
                    controls.get('total_balance').setValue(total_balance);
                }
            });
            // this.autoFillOutStandingBalances();
        }

        onChangeCreditAvail(index, data){
            const amount = this.editBillPaymentForm.get('vendor_credit')['controls'][index].controls.availing.value;
            const selected = this.editBillPaymentForm.get('vendor_credit')['controls'][index].controls.selected;
            this.editBillPaymentForm.get('vendor_credit')['controls'][index].controls.vendor_credits.setValue(data.vendor_credits ? data.vendor_credits : data.id);
            this.editBillPaymentForm.get('vendor_credit')['controls'][index].controls.id.setValue(data.vendor_credits ? data.id : null);
            amount > 0 ? selected.setValue(true) : '';
            this.calculateCreditAvail()
            }

            onChangeAdvanceAvail(index, data){
                const amount = this.editBillPaymentForm.get('vendor_advances')['controls'][index].controls.availing.value;
                const selected = this.editBillPaymentForm.get('vendor_advances')['controls'][index].controls.selected;
                this.editBillPaymentForm.get('vendor_advances')['controls'][index].controls.vendor_advance.setValue(data.vendor_advance ? data.vendor_advance : data.id);
                this.editBillPaymentForm.get('vendor_advances')['controls'][index].controls.id.setValue(data.vendor_advance ? data.id : null);
                amount > 0 ? selected.setValue(true) : '';
                this.calculateAdvanceAvail()
            }

            onChangeBillAmount(index, data){
                const amount = this.editBillPaymentForm.get('outstanding_bills')['controls'][index].controls.amount_paid.value;
                const selected = this.editBillPaymentForm.get('outstanding_bills')['controls'][index].controls.selected;
                this.editBillPaymentForm.get('outstanding_bills')['controls'][index].controls.bill.setValue(data.bill ? data.bill : data.id);
                this.editBillPaymentForm.get('outstanding_bills')['controls'][index].controls.id.setValue(data.bill ? data.id : null);
                amount > 0 ? selected.setValue(true) : '';
                this.calculateAmountPaid();
              }

            onChangeBillAdjustment(index, data){
                const amount = this.editBillPaymentForm.get('outstanding_bills')['controls'][index].controls.adjustment.value;
                const selected = this.editBillPaymentForm.get('outstanding_bills')['controls'][index].controls.selected;
                this.editBillPaymentForm.get('outstanding_bills')['controls'][index].controls.bill.setValue(data.bill ? data.bill : data.id);
                this.editBillPaymentForm.get('outstanding_bills')['controls'][index].controls.id.setValue(data.bill ? data.id : null);
                amount > 0 ? selected.setValue(true) : '';
                this.calculateAmountPaid();
            }

            onChangeBillLabourAdjustment(index, data){
              const amount = this.editBillPaymentForm.get('outstanding_labour_bills')['controls'][index].controls.adjustment.value;
              const selected = this.editBillPaymentForm.get('outstanding_labour_bills')['controls'][index].controls.selected;
              this.editBillPaymentForm.get('outstanding_labour_bills')['controls'][index].controls.labour_bill.setValue(data.labour_bill ? data.labour_bill : data.id);
              this.editBillPaymentForm.get('outstanding_labour_bills')['controls'][index].controls.id.setValue(data.labour_bill ? data.id : null);
              amount > 0 ? selected.setValue(true) : '';
              this.calculateLabourAmountPaid();
          }

          onChangeBillForemanAdjustment(index, data){
            const amount = this.editBillPaymentForm.get('outstanding_foreman_bills')['controls'][index].controls.adjustment.value;
            const selected = this.editBillPaymentForm.get('outstanding_foreman_bills')['controls'][index].controls.selected;
            this.editBillPaymentForm.get('outstanding_foreman_bills')['controls'][index].controls.foreman_bill.setValue(data.foreman_bill ? data.foreman_bill : data.id);
            this.editBillPaymentForm.get('outstanding_foreman_bills')['controls'][index].controls.id.setValue(data.foreman_bill ? data.id : null);
            amount > 0 ? selected.setValue(true) : '';
            this.calculateForemanAmountPaid();
        }

          onChangeBillLabourAmount(index, data){
            const amount = this.editBillPaymentForm.get('outstanding_labour_bills')['controls'][index].controls.amount_paid.value;
            const selected = this.editBillPaymentForm.get('outstanding_labour_bills')['controls'][index].controls.selected;
            this.editBillPaymentForm.get('outstanding_labour_bills')['controls'][index].controls.labour_bill.setValue(data.labour_bill ? data.labour_bill : data.id);
            this.editBillPaymentForm.get('outstanding_labour_bills')['controls'][index].controls.id.setValue(data.labour_bill ? data.id : null);
            amount > 0 ? selected.setValue(true) : '';
            this.calculateLabourAmountPaid();
          }

          onChangeBillForemanAmount(index, data){
            const amount = this.editBillPaymentForm.get('outstanding_foreman_bills')['controls'][index].controls.amount_paid.value;
            const selected = this.editBillPaymentForm.get('outstanding_foreman_bills')['controls'][index].controls.selected;
            this.editBillPaymentForm.get('outstanding_foreman_bills')['controls'][index].controls.foreman_bill.setValue(data.foreman_bill ? data.foreman_bill : data.id);
            this.editBillPaymentForm.get('outstanding_foreman_bills')['controls'][index].controls.id.setValue(data.foreman_bill ? data.id : null);
            amount > 0 ? selected.setValue(true) : '';
            this.calculateForemanAmountPaid();
          }

}
