import { UntypedFormArray,  AbstractControl } from '@angular/forms';
import { defaultZero,} from 'src/app/shared-module/utilities/currency-utils';
import { normalDate } from 'src/app/shared-module/utilities/date-utilis';
import { isValidValue, roundOffAmount } from 'src/app/shared-module/utilities/helper-utils';



export class InvoicePaymentClass{


    editInvoicePaymentForm ;
    totals: any = {
        credit_avail: 0.0,
        withheld: 0.0,
        outStandingAmonut: 0.0,
        total_discount_amount: 0.0,
        debit_amount_received: 0.0,
        invoice_amount_received: 0.0,
        total_amount_received: 0.0,
        debit_amount_withheld: 0.0,
        invoice_amount_withheld: 0.0,
        bos_amount_withheld: 0.0,
        bos_amount_received: 0.0,
        total_amount_withheld: 0.0,
        total_party_received: 0.0,
        total_banking_charges: 0.0,
        total: 0.0,
    };
    invoiceId: string;
    doAutoFill: boolean;
    netAmountAfterTax: number = 0;
    amountAfterTax: number = 0;
    total: number;
    amountPayable:any;
    removeSelectedDebitNotes: any = [];
    debitNoteList: any = [];
    invoiceList: any = [];
    bosList : any = [];
    removeSelectedInvoice: any = [];
    removeSelectedBos: any = [];
    deductAmount: any;

    calculateCreditAvail() {
        let credit = {};
        this.totals.credit_avail = 0
        const creditNotes = this.editInvoicePaymentForm.controls['utilise_credit'] as UntypedFormArray;
        credit['filtered'] = creditNotes.controls.filter((controls, index) => {
            if (controls.get('selected').value == true)
                return controls;
        });
        credit['filtered'].forEach((group, index) => {
            this.totals.credit_avail =(Number(this.totals.credit_avail) + Number(defaultZero(group.get('availing_amount').value))).toFixed(3);
        });
        this.calculateAmountReceived();
    }

    calculateAmountReceived(calledByAutoFill: boolean = false) {

        if (!calledByAutoFill && !this.invoiceId) {
            this.doAutoFill = false;
          }

        this.netAmountAfterTax = 0;
        this.amountAfterTax = 0;
        this.totals.final_recieved = 0;
        this.totals.total_amount_received = 0;
        this.totals.debit_amount_received = 0;
        this.totals.total_discount_amount= 0;
        this.totals.invoice_amount_received = 0;
        this.totals.bos_amount_received = 0;
        this.totals.total_amount_withheld = 0;
        this.totals.debit_amount_withheld = 0;
        this.totals.invoice_amount_withheld = 0;
        this.totals.bos_amount_withheld = 0;

        const invoices = this.editInvoicePaymentForm.controls['outstanding_invoice'] as UntypedFormArray;
        const debitNotes = this.editInvoicePaymentForm.controls['outstanding_debit'] as UntypedFormArray;
        const bos = this.editInvoicePaymentForm.controls['outstanding_bos'] as UntypedFormArray;
        // Outstanding Debit Calculation
        debitNotes.controls.filter((controls) => {
            if (controls.get('selected').value == true) {
                this.totals.debit_amount_withheld = this.totals.debit_amount_withheld + defaultZero(controls.get('withheld').value);
                this.totals.debit_amount_received =(Number(this.totals.debit_amount_received) + Number(defaultZero(controls.get('amount_received').value)) + Number(defaultZero(controls.get('adjustment').value))).toFixed(3);
                this.totals.total_discount_amount = this.totals.total_discount_amount + defaultZero(controls.get('adjustment').value);
                let balance = controls.get('balance').value
                let adjustment = controls.get('adjustment').value
                let withheld = controls.get('withheld').value
                let amount_received = controls.get('amount_received').value
                let adj_amount = defaultZero(adjustment) + defaultZero(withheld) + defaultZero(amount_received)
                let total_balance = defaultZero(balance) - adj_amount;
                controls.get('total_balance').setValue((total_balance).toFixed(3));
            }
        });
        // Outstanding Invoice Calculation
        invoices.controls.filter((controls) => {
            if (controls.get('selected').value == true) {
                this.totals.invoice_amount_withheld = this.totals.invoice_amount_withheld + defaultZero(controls.get('withheld').value);
                this.totals.invoice_amount_received =(Number(this.totals.invoice_amount_received) +Number(defaultZero(controls.get('amount_received').value)) +Number(defaultZero(controls.get('adjustment').value))).toFixed(3);
                this.totals.total_discount_amount = this.totals.total_discount_amount + defaultZero(controls.get('adjustment').value);
                let balance = controls.get('balance').value
                let adjustment = controls.get('adjustment').value
                let withheld = controls.get('withheld').value
                let amount_received = controls.get('amount_received').value
                let adj_amount = defaultZero(adjustment) + defaultZero(withheld) + defaultZero(amount_received)
                let total_balance = defaultZero(balance) - adj_amount;
                controls.get('total_balance').setValue((total_balance).toFixed(3));
            }
        });

        bos.controls.filter((controls) => {
          if (controls.get('selected').value == true) {
              this.totals.bos_amount_withheld = this.totals.bos_amount_withheld + defaultZero(controls.get('withheld').value);
              this.totals.bos_amount_received = (Number(this.totals.bos_amount_received) + Number(defaultZero(controls.get('amount_received').value)) +Number(defaultZero(controls.get('adjustment').value))).toFixed(3);
              this.totals.total_discount_amount = this.totals.total_discount_amount + defaultZero(controls.get('adjustment').value);
              let balance = controls.get('balance').value
              let adjustment = controls.get('adjustment').value
              let withheld = controls.get('withheld').value
              let amount_received = controls.get('amount_received').value
              let adj_amount = defaultZero(adjustment) + defaultZero(withheld) + defaultZero(amount_received)
              let total_balance = defaultZero(balance) - adj_amount;
              controls.get('total_balance').setValue((total_balance).toFixed(3));
          }
      });

        this.totals.total_amount_withheld = (defaultZero(this.totals.debit_amount_withheld) + defaultZero(this.totals.invoice_amount_withheld) + defaultZero(this.totals.bos_amount_withheld)).toFixed(3)  ;
        this.totals.total_amount_received = (defaultZero(this.totals.bos_amount_received)+ defaultZero(this.totals.debit_amount_received) + defaultZero(this.totals.invoice_amount_received)).toFixed(3);
        this.calculateTotalForAdjustment();
    }

    calculateTotalForAdjustment() {
        this.total = 0;
        this.amountPayable = '0';
        this.editInvoicePaymentForm.get('amount_received').value;
        this.total = (Number(this.totals.total_party_received) + Number(this.totals.credit_avail) + Number(this.totals.total_discount_amount) +
                      defaultZero(this.totals.advance_avail) +  Number(this.totals.total_banking_charges)).toFixed(3);
        this.amountPayable = (Number(this.totals.invoice_amount_received) +Number(this.totals.debit_amount_received) +Number(this.totals.bos_amount_received)).toFixed(3);
    }

    calculateInvoiceTotalBalance(dueAmount, adjustment, witheld, amountRecieved) {
        return Number(dueAmount) - adjustment - witheld - amountRecieved;
    }
    calculateBosTotalBalance(dueAmount, adjustment, witheld, amountRecieved) {
      return Number(dueAmount) - adjustment - witheld - amountRecieved;
  }

    setPartyAmountRecevied() {
        this.totals.total_party_received = (Number(this.editInvoicePaymentForm.get('amount_received').value)).toFixed(3);
        this.calculateTotalForAdjustment();
        // if(!this.invoiceId){
        // this.autoFillOutStandingBalances();
        // }
      }

    setBankingCharges() {
      this.totals.total_banking_charges = (Number(this.editInvoicePaymentForm.get('bank_charge').value)).toFixed(3);      
      this.calculateTotalForAdjustment();
      if(!this.invoiceId){
      this.autoFillOutStandingBalances();
      }
    }

    onCheckboxChangeDebit(event, list, index) {
        const debitNotes = this.editInvoicePaymentForm.controls['outstanding_debit'] as UntypedFormArray;
        if (event.target.checked) {
            if (this.removeSelectedDebitNotes.length && this.removeSelectedDebitNotes.indexOf(event.target.value) > -1) {
                let position = this.removeSelectedDebitNotes.indexOf(event.target.value);
                this.removeSelectedDebitNotes.splice(position, 1);
                list.filter(data => {
                    if (event.target.value == data.id) {
                        debitNotes.controls[index].get('debit_note').setValue(data.debit_note);
                    }
                });
            }
            else {
                list.filter(data => {
                    if (event.target.value == data.id) {
                        debitNotes.controls[index].get('id').setValue(null);
                        debitNotes.controls[index].get('debit_note').setValue(data.id);
                    }
                });
            }
        }
        else {
            if (isValidValue(debitNotes.controls[index].get('id').value) && !debitNotes.controls[index].get('selected').value)
                this.removeSelectedDebitNotes.push(debitNotes.controls[index].get('id').value);
            debitNotes.controls[index].get('debit_note').setValue(null);
        }
    }

    onCheckboxChangeAddDebit(event, list, index) {
        const debitNotes = this.editInvoicePaymentForm.controls['outstanding_debit'] as UntypedFormArray;
        if (event.target.checked) {
          list.filter(data => {
            if (event.target.value == data.id) {
              debitNotes.controls[index].get('debit_note').setValue(data.id);
            }
          });
        }
        else {
          this.clearControlValidator(debitNotes.controls[index].get('total_balance'));
          debitNotes.controls[index].get('debit_note').setValue(null);
          debitNotes.controls[index].get('amount_received').setValue(0);
          debitNotes.controls[index].get('adjustment').setValue(0);
          debitNotes.controls[index].get('withheld').setValue(0);
        }
      }

      clearControlValidator(control: AbstractControl) {
        control.clearValidators();
        control.updateValueAndValidity({emitEvent: true});
      }

    onDebitNotesSelected(ele, index) {
      const debitNotes = this.editInvoicePaymentForm.controls['outstanding_debit'] as UntypedFormArray;
        if (!ele.target.checked) {
            this.editInvoicePaymentForm.controls['all_debit_selected'].setValue(false);
        }
        if(debitNotes.controls[index].get('selected').value){
          debitNotes.controls[index].get('amount_received').setValue(debitNotes.controls[index].get('balance').value)
        }else{
          debitNotes.controls[index].get('amount_received').setValue(0)
        }
        this.invoiceId ? this.onCheckboxChangeDebit(ele, this.debitNoteList, index) : this.onCheckboxChangeAddDebit(ele, this.debitNoteList, index)
        this.calculateCreditAvail();
        this.calculateAmountReceived();
        if (debitNotes.controls.every((debitNote) => debitNote.get('selected').value === true)) {
            this.editInvoicePaymentForm.controls['all_debit_selected'].setValue(true);
        }
    }


      onSelectAllDebitNotes(ele,calledByAutoFill: boolean = false) {
        const debitNotes = this.editInvoicePaymentForm.controls['outstanding_debit'] as UntypedFormArray;
        debitNotes.controls.map((debitNote, index) => {
            debitNote.get('selected').setValue(ele.target.checked);
            ele.target.value = this.debitNoteList && this.debitNoteList.length > 0 ? this.debitNoteList[index].id : null;
            if(this.invoiceId){              
            this.onDebitNotesSelected(ele, index);
            }
            else{
                this.invoiceId ? this.onCheckboxChangeDebit(ele, this.debitNoteList, index) : this.onCheckboxChangeAddDebit(ele, this.debitNoteList, index)
            }
            this.onDebitNotesSelected(ele, index);

            return true;
        });

        if(!this.invoiceId){
            if (ele.target.checked) {
                this.editInvoicePaymentForm.controls['all_debit_selected'].setValue(true);
              } else {
                this.editInvoicePaymentForm.controls['all_debit_selected'].setValue(false);
              }

              if (!calledByAutoFill)
                this.calculateAmountReceived();
        }
    }


    onInvoiceSelected(ele, index) {
      const invoices = this.editInvoicePaymentForm.controls['outstanding_invoice'] as UntypedFormArray;
        if (!ele.target.checked) {
            this.editInvoicePaymentForm.controls['all_invoice_selected'].setValue(false);
        }
        
        if(ele.target.checked){          
          invoices.controls[index].get('amount_received').setValue( invoices.controls[index].get('balance').value)
        }else{          
          invoices.controls[index].get('amount_received').setValue(0)
        }
        this.invoiceId ? this.onCheckboxChangeInvoice(ele, this.invoiceList, index) : this.onCheckboxChangeAddInvoice(ele, this.invoiceList, index)
        this.calculateTotalsCall();
        if (invoices.controls.every((invoice) => invoice.get('selected').value === true)) {
            this.editInvoicePaymentForm.controls['all_invoice_selected'].setValue(true);
        }
    }

    onBosSelected(ele, index) {
      const bos = this.editInvoicePaymentForm.controls['outstanding_bos'] as UntypedFormArray;
      if (!ele.target.checked) {
          this.editInvoicePaymentForm.controls['all_bos_selected'].setValue(false);
      }
      if(bos.controls[index].get('selected').value){
        bos.controls[index].get('amount_received').setValue(bos.controls[index].get('balance').value)
      }else{
        bos.controls[index].get('amount_received').setValue(0)
      }
      this.invoiceId ? this.onCheckboxChangeBos(ele, this.bosList, index) : this.onCheckboxChangeAddBos(ele, this.bosList, index)
      this.calculateTotalsCall();
      if (bos.controls.every((invoice) => invoice.get('selected').value === true)) {
          this.editInvoicePaymentForm.controls['all_bos_selected'].setValue(true);
      }
  }

    onCheckboxChangeAddInvoice(event, list, index) {
        const invoices = this.editInvoicePaymentForm.controls['outstanding_invoice'] as UntypedFormArray;
        if (event.target.checked) {
          list.filter(data => {
            if (event.target.value == data.id) {
              invoices.controls[index].get('invoice').setValue(data.id);
            }
          });
        }
        else {
          this.clearControlValidator(invoices.controls[index].get('total_balance'));
          invoices.controls[index].get('invoice').setValue(null);
          invoices.controls[index].get('amount_received').setValue(0);
          invoices.controls[index].get('adjustment').setValue(0);
          invoices.controls[index].get('withheld').setValue(0);
        }
      }

      onCheckboxChangeAddBos(event, list, index) {
        const invoices = this.editInvoicePaymentForm.controls['outstanding_bos'] as UntypedFormArray;
        if (event.target.checked) {
          list.filter(data => {
            if (event.target.value == data.id) {
              invoices.controls[index].get('bos').setValue(data.id);
            }
          });
        }
        else {
          this.clearControlValidator(invoices.controls[index].get('total_balance'));
          invoices.controls[index].get('bos').setValue(null);
          invoices.controls[index].get('amount_received').setValue(0);
          invoices.controls[index].get('adjustment').setValue(0);
          invoices.controls[index].get('withheld').setValue(0);
        }
      }

    onCheckboxChangeInvoice(event, list, index) {
        const invoices = this.editInvoicePaymentForm.controls['outstanding_invoice'] as UntypedFormArray;
        if (event.target.checked) {
            if (this.removeSelectedInvoice.length && this.removeSelectedInvoice.indexOf(event.target.value) > -1) {
                let position = this.removeSelectedInvoice.indexOf(event.target.value);
                this.removeSelectedInvoice.splice(position, 1);
                list.filter(data => {
                    if (event.target.value == data.id) {
                        invoices.controls[index].get('invoice').setValue(data.invoice);
                    }
                });
            }
            else {
                list.filter(data => {
                    if (event.target.value == data.id) {
                        invoices.controls[index].get('id').setValue(null);
                        invoices.controls[index].get('invoice').setValue(data.id);
                    }
                });
            }
        }
        else {
            if (isValidValue(invoices.controls[index].get('id').value) && !invoices.controls[index].get('selected').value)
                this.removeSelectedInvoice.push(invoices.controls[index].get('id').value);
            invoices.controls[index].get('invoice').setValue('');
        }
    }

    onCheckboxChangeBos(event, list, index) {
      const bos = this.editInvoicePaymentForm.controls['outstanding_bos'] as UntypedFormArray;
      if (event.target.checked) {
          if (this.removeSelectedBos.length && this.removeSelectedBos.indexOf(event.target.value) > -1) {
              let position = this.removeSelectedBos.indexOf(event.target.value);
              this.removeSelectedBos.splice(position, 1);
              list.filter(data => {
                  if (event.target.value == data.id) {
                      bos.controls[index].get('bos').setValue(data.bos);
                  }
              });
          }
          else {
              list.filter(data => {
                  if (event.target.value == data.id) {
                      bos.controls[index].get('id').setValue(null);
                      bos.controls[index].get('bos').setValue(data.id);
                  }
              });
          }
      }
      else {
          if (isValidValue(bos.controls[index].get('id').value) && !bos.controls[index].get('selected').value)
              this.removeSelectedBos.push(bos.controls[index].get('id').value);
          bos.controls[index].get('bos').setValue('');
      }
  }


    onSelectAllInvoices(ele,calledByAutoFill: boolean = false) {
        const invoices = this.editInvoicePaymentForm.controls['outstanding_invoice'] as UntypedFormArray;
        invoices.controls.every((invoice, index) => {
            invoice.get('selected').setValue(ele.target.checked);
            ele.target.value = this.invoiceList && this.invoiceList.length > 0 ? this.invoiceList[index].id : null;
            if(this.invoiceId){
            this.onInvoiceSelected(ele, index);
            }else{
                this.invoiceId ? this.onCheckboxChangeInvoice(ele, this.invoiceList, index) : this.onCheckboxChangeAddInvoice(ele, this.invoiceList, index)
            }
            this.onInvoiceSelected(ele, index);
            return true;
        });

        if(!this.invoiceId){
        if (ele.target.checked) {
            this.editInvoicePaymentForm.controls['all_invoice_selected'].setValue(true);
          } else {
            this.editInvoicePaymentForm.controls['all_invoice_selected'].setValue(false);
          }
          if (!calledByAutoFill)
            this.calculateAmountReceived();
        }
    }

    onSelectAllBos(ele,calledByAutoFill: boolean = false) {
      const bosForm = this.editInvoicePaymentForm.controls['outstanding_bos'] as UntypedFormArray;
      bosForm.controls.every((bos, index) => {
          bos.get('selected').setValue(ele.target.checked);
          ele.target.value = this.bosList && this.bosList.length > 0 ? this.bosList[index].id : null;
          if(this.invoiceId){
          this.onInvoiceSelected(ele, index);
          }else{
              this.invoiceId ? this.onCheckboxChangeBos(ele, this.bosList, index) : this.onCheckboxChangeAddBos(ele, this.bosList, index)
          }
          this.onBosSelected(ele,index)
          return true;
      });

      if(!this.invoiceId){
      if (ele.target.checked) {
          this.editInvoicePaymentForm.controls['all_bos_selected'].setValue(true);
        } else {
          this.editInvoicePaymentForm.controls['all_bos_selected'].setValue(false);
        }
        if (!calledByAutoFill)
          this.calculateAmountReceived();
      }
  }



    selectIndividualInvoice(amount, index, id) {
        const selected = this.editInvoicePaymentForm.controls.outstanding_invoice.controls[index].controls.selected;
        const totalBalance = this.editInvoicePaymentForm.controls.outstanding_invoice.controls[index].controls.total_balance;
        const balance = this.editInvoicePaymentForm.controls.outstanding_invoice.controls[index].controls.balance.value;
        if (Number(amount) == 0) {
          if (Number(balance) == Number(totalBalance.value)) {
            this.editInvoicePaymentForm.controls.outstanding_invoice.controls[index].controls.invoice.setValue(null);
          selected.setValue(false);
          this.clearControlValidator(totalBalance);
          }
        } else {
          this.editInvoicePaymentForm.controls.outstanding_invoice.controls[index].controls.invoice.setValue(id);
          selected.setValue(true);
        }
      }

      selectIndividualBos(amount, index, id) {
        const selected = this.editInvoicePaymentForm.controls.outstanding_bos.controls[index].controls.selected;
        const totalBalance = this.editInvoicePaymentForm.controls.outstanding_bos.controls[index].controls.total_balance;
        const balance = this.editInvoicePaymentForm.controls.outstanding_bos.controls[index].controls.balance.value;
        if (Number(amount) == 0) {
          if (Number(balance) == Number(totalBalance.value)) {
            this.editInvoicePaymentForm.controls.outstanding_bos.controls[index].controls.invoice.setValue(null);
          selected.setValue(false);
          this.clearControlValidator(totalBalance);
          }
        } else {
          this.editInvoicePaymentForm.controls.outstanding_bos.controls[index].controls.bos.setValue(id);
          selected.setValue(true);
        }
      }

      setAllInvoiceSelected() {
        const invoices = this.editInvoicePaymentForm.controls['outstanding_invoice'] as UntypedFormArray;
        if (invoices.controls.every((invoice) => invoice.get('selected').value === true)) {
          this.editInvoicePaymentForm.controls['all_invoice_selected'].setValue(true);
        } else {
          this.editInvoicePaymentForm.controls['all_invoice_selected'].setValue(false);
        }
      }

      setAllBosSelected() {
        const invoices = this.editInvoicePaymentForm.controls['outstanding_bos'] as UntypedFormArray;
        if (invoices.controls.every((bos) => bos.get('selected').value === true)) {
          this.editInvoicePaymentForm.controls['all_bos_selected'].setValue(true);
        } else {
          this.editInvoicePaymentForm.controls['all_bos_selected'].setValue(false);
        }
      }



      autoFillOutStandingBalances() {
        if (!this.doAutoFill) {
          return;
        }

        let amountToAutoFill = Number(this.total);
        this.onSelectAllDebitNotes({target: {checked: false, value: null}}, true);
        this.onSelectAllInvoices({target: {checked: false, value: null}}, true);
        this.onSelectAllBos({target: {checked: false, value: null}}, true);

        const numInvoices = this.invoiceList.length;
        const numDebiNotes = this.debitNoteList.length;
        const numBos = this.bosList.length;

        const invoices = this.editInvoicePaymentForm.controls['outstanding_invoice'] as UntypedFormArray;
        for( let index = numInvoices-1; index >= 0; index--) {
          if (amountToAutoFill <= 0) {
            break
          }
          let balance = Number(invoices.at(index).get('balance').value);
          if (amountToAutoFill > 0 && amountToAutoFill < balance) {
            balance = amountToAutoFill;
          }
          amountToAutoFill -= balance;
          invoices.at(index).get('amount_received').setValue(balance.toFixed(3));
          this.selectIndividualInvoice(balance.toFixed(3), index, this.invoiceList[index].id);
        }
        this.setAllInvoiceSelected();

        const bos = this.editInvoicePaymentForm.controls['outstanding_bos'] as UntypedFormArray;
        for( let index = numBos-1; index >= 0; index--) {
          if (amountToAutoFill <= 0) {
            break
          }

          let balance = Number(bos.at(index).get('balance').value);

          if (amountToAutoFill > 0 && amountToAutoFill < balance) {
            balance = amountToAutoFill;
          }

          amountToAutoFill -= balance;

          bos.at(index).get('amount_received').setValue(balance.toFixed(3));
          this.selectIndividualBos(balance.toFixed(3), index, this.bosList[index].id);
        }

        this.setAllBosSelected();

        const debits = this.editInvoicePaymentForm.controls['outstanding_debit'] as UntypedFormArray;
        for( let index = numDebiNotes-1; index >= 0; index--) {
          if (amountToAutoFill <= 0) {
            break
          }

          let balance = Number(debits.at(index).get('balance').value);

          if (amountToAutoFill > 0 && amountToAutoFill < balance) {
            balance = amountToAutoFill;
          }

          amountToAutoFill -= balance;

          debits.at(index).get('amount_received').setValue(balance.toFixed(3));
          this.selectIndividualDebit(balance.toFixed(3), index, this.debitNoteList[index].id);
        }
        this.setAllDebitNoteSelected();
        this.calculateAmountReceived(true);
      }


      selectIndividualDebit(amount, index, id) {
        const selected = this.editInvoicePaymentForm.controls.outstanding_debit.controls[index].controls.selected;
        const totalBalance = this.editInvoicePaymentForm.controls.outstanding_debit.controls[index].controls.total_balance;
        const balance = this.editInvoicePaymentForm.controls.outstanding_debit.controls[index].controls.balance.value;
        if (Number(amount) == 0) {
          if (Number(balance) == Number(totalBalance.value)) {
            this.editInvoicePaymentForm.controls.outstanding_debit.controls[index].controls.debit_note.setValue(null);
          selected.setValue(false);
          this.clearControlValidator(totalBalance);
          }
        } else {
          this.editInvoicePaymentForm.controls.outstanding_debit.controls[index].controls.debit_note.setValue(id);
          selected.setValue(true);
        }
      }

      setAllDebitNoteSelected() {
        const debitNotes = this.editInvoicePaymentForm.controls['outstanding_debit'] as UntypedFormArray;
        if (debitNotes.controls.every((debitNote) => debitNote.get('selected').value === true)) {
          this.editInvoicePaymentForm.controls['all_debit_selected'].setValue(true);
        } else {
          this.editInvoicePaymentForm.controls['all_debit_selected'].setValue(false);
        }
      }


      dateChange(date) {
        return normalDate(date);
    }

    dataAvailable(data) {
        if (data) {
            return data;
        }
        else {
            return '-';
        }
    }


    calculateOutstandingBalance() {
        let outStanding = {};
        let debitOutStaning = 0;
        let invoiceOutStanding = 0;
        this.totals.outStandingAmonut = 0;
        const invoices = this.editInvoicePaymentForm.controls['outstanding_invoice'] as UntypedFormArray;
        const debitNotes = this.editInvoicePaymentForm.controls['outstanding_debit'] as UntypedFormArray;
        outStanding['outstanding_invoice'] = invoices.controls.filter((controls, index) => {
            if (controls.get('selected').value == true)
                return controls;
        });
        outStanding['outstanding_debit'] = debitNotes.controls.filter((controls, index) => {
            if (controls.get('selected').value == true)
                return controls;
        });

        outStanding['outstanding_debit'].forEach((controls, index) => {
            debitOutStaning = debitOutStaning + defaultZero(controls.get('total_balance').value);
        });
        outStanding['outstanding_invoice'].forEach((controls, index) => {
            invoiceOutStanding = invoiceOutStanding + defaultZero(controls.get('total_balance').value);
        });

        this.totals.outStandingAmonut = defaultZero(debitOutStaning) + defaultZero(invoiceOutStanding);
    }


    calculateAdvanceAvail() {
        let advance = {};
        this.totals.advance_avail = 0
        const customerAdvance = this.editInvoicePaymentForm.controls['advance_received'] as UntypedFormArray;
        advance['filtered'] = customerAdvance.controls.filter((controls, index) => {
            if (controls.get('selected').value == true)
                return controls;
        });
        advance['filtered'].forEach((group, index) => {
            this.totals.advance_avail =(Number(this.totals.advance_avail) + Number(defaultZero(group.get('availing_amount').value))).toFixed(3);
        });
        this.calculateAmountReceived();
    }


    calculateTotalsCall() {
        this.calculateOutstandingBalance();
        this.calculateAmountReceived();
    }

    setDeductionAmount() {
        let tempAmount = this.editInvoicePaymentForm.controls['deduction_amount'].value;
        this.deductAmount = Number(tempAmount).toFixed(3);
      }


          /**
   * On change availing amount > 0 on customer advance check the checkbox
   */
    onChangeAvailingAmount(index, advanceData) {
        const amount = this.editInvoicePaymentForm.controls.advance_received.controls[index].controls.availing_amount.value;
        const selected = this.editInvoicePaymentForm.controls.advance_received.controls[index].controls.selected;
        this.editInvoicePaymentForm.controls.advance_received.controls[index].controls.advance.setValue(advanceData.advance ? advanceData.advance : advanceData.id);
        this.editInvoicePaymentForm.controls.advance_received.controls[index].controls.id.setValue(advanceData.advance ? advanceData.id : null);
        amount > 0 ? selected.setValue(true) : '';
        this.calculateAdvanceAvail();
    }

    /**
     * On change availing amount > 0 on Credit Utilized check the checkbox
     */
    onChangeCreditAvail(index, creditNote) {
        const amount = this.editInvoicePaymentForm.controls.utilise_credit.controls[index].controls.availing_amount.value;
        const selected = this.editInvoicePaymentForm.controls.utilise_credit.controls[index].controls.selected;
        this.editInvoicePaymentForm.controls.utilise_credit.controls[index].controls.credit_note.setValue(creditNote.credit_number ? creditNote.credit_number : creditNote.id);
        this.editInvoicePaymentForm.controls.utilise_credit.controls[index].controls.id.setValue(creditNote.credit_number ? creditNote.id : null);
        amount > 0 ? selected.setValue(true) : '';
        this.calculateCreditAvail();
    }

    /**
     * On change  amount_received > 0 on Amount Received check the checkbox
     */
    onChangeInvoiceAmountReceived(index, invoiceData) {
        const amount = this.editInvoicePaymentForm.controls.outstanding_invoice.controls[index].controls.amount_received.value;
        const selected = this.editInvoicePaymentForm.controls.outstanding_invoice.controls[index].controls.selected;
        this.editInvoicePaymentForm.controls.outstanding_invoice.controls[index].controls.invoice.setValue(invoiceData.invoice ? invoiceData.invoice : invoiceData.id);
        this.editInvoicePaymentForm.controls.outstanding_invoice.controls[index].controls.id.setValue(invoiceData.invoice ? invoiceData.id : null);
        amount > 0 ? selected.setValue(true) : '';
        this.calculateAmountReceived();
    }

    onChangeBosAmountReceived(index, bosData) {
      const amount = this.editInvoicePaymentForm.controls.outstanding_bos.controls[index].controls.amount_received.value;
      const selected = this.editInvoicePaymentForm.controls.outstanding_bos.controls[index].controls.selected;
      this.editInvoicePaymentForm.controls.outstanding_bos.controls[index].controls.bos.setValue(bosData.bos ? bosData.bos : bosData.id);
      this.editInvoicePaymentForm.controls.outstanding_bos.controls[index].controls.id.setValue(bosData.bos ? bosData.id : null);
      amount > 0 ? selected.setValue(true) : '';
      this.calculateAmountReceived();
  }

        /**
   * On change  amount_received > 0 on Amount Received check the checkbox
   */
  onChangeInvoiceWithheld(index, invoiceData) {
    const amount = this.editInvoicePaymentForm.controls.outstanding_invoice.controls[index].controls.withheld.value;
    const selected = this.editInvoicePaymentForm.controls.outstanding_invoice.controls[index].controls.selected;
    this.editInvoicePaymentForm.controls.outstanding_invoice.controls[index].controls.invoice.setValue(invoiceData.invoice ? invoiceData.invoice : invoiceData.id);
    this.editInvoicePaymentForm.controls.outstanding_invoice.controls[index].controls.id.setValue(invoiceData.invoice ? invoiceData.id : null);
    amount > 0 ? selected.setValue(true) : '';
    this.calculateAmountReceived();
  }

  onChangeBosWithheld(index, bosData) {
    const amount = this.editInvoicePaymentForm.controls.outstanding_bos.controls[index].controls.withheld.value;
    const selected = this.editInvoicePaymentForm.controls.outstanding_bos.controls[index].controls.selected;
    this.editInvoicePaymentForm.controls.outstanding_bos.controls[index].controls.bos.setValue(bosData.bos ? bosData.bos : bosData.id);
    this.editInvoicePaymentForm.controls.outstanding_bos.controls[index].controls.id.setValue(bosData.bos ? bosData.id : null);
    amount > 0 ? selected.setValue(true) : '';
    this.calculateAmountReceived();
  }

    /**
   * On change  amount_received > 0 on Amount Received check the checkbox
   */
  onChangeInvoiceAdjustment(index, invoiceData) {
    const amount = this.editInvoicePaymentForm.controls.outstanding_invoice.controls[index].controls.adjustment.value;
    const selected = this.editInvoicePaymentForm.controls.outstanding_invoice.controls[index].controls.selected;
    this.editInvoicePaymentForm.controls.outstanding_invoice.controls[index].controls.invoice.setValue(invoiceData.invoice ? invoiceData.invoice : invoiceData.id);
    this.editInvoicePaymentForm.controls.outstanding_invoice.controls[index].controls.id.setValue(invoiceData.invoice ? invoiceData.id : null);
    amount > 0 ? selected.setValue(true) : '';
    this.calculateAmountReceived();
  }

  onChangeBosAdjustment(index, invoiceData) {
    const amount = this.editInvoicePaymentForm.controls.outstanding_bos.controls[index].controls.adjustment.value;
    const selected = this.editInvoicePaymentForm.controls.outstanding_bos.controls[index].controls.selected;
    this.editInvoicePaymentForm.controls.outstanding_bos.controls[index].controls.bos.setValue(invoiceData.bos ? invoiceData.bos : invoiceData.id);
    this.editInvoicePaymentForm.controls.outstanding_bos.controls[index].controls.id.setValue(invoiceData.bos ? invoiceData.id : null);
    amount > 0 ? selected.setValue(true) : '';
    this.calculateAmountReceived();
  }

    /**
     * On change debit amount > 0 check the checkbox
     */
    onChangeDebitAmountReceived(index, debitData) {
        const amount = this.editInvoicePaymentForm.controls.outstanding_debit.controls[index].controls.amount_received.value;
        const selected = this.editInvoicePaymentForm.controls.outstanding_debit.controls[index].controls.selected;
        this.editInvoicePaymentForm.controls.outstanding_debit.controls[index].controls.debit_note.setValue(debitData.debit_note ? debitData.debit_note : debitData.id);
        this.editInvoicePaymentForm.controls.outstanding_debit.controls[index].controls.id.setValue(debitData.debit_note ? debitData.id : null);
        amount > 0 ? selected.setValue(true) : '';
        this.calculateAmountReceived();
    }

    // round off amount
    roundOffAmount(formControl) {
        roundOffAmount(formControl);
    }


        /**
   * On change debit amount > 0 check the checkbox
   */
  onChangeDebitWtihheld(index, debitData) {
    const amount = this.editInvoicePaymentForm.controls.outstanding_debit.controls[index].controls.withheld.value;
    const selected = this.editInvoicePaymentForm.controls.outstanding_debit.controls[index].controls.selected;
    this.editInvoicePaymentForm.controls.outstanding_debit.controls[index].controls.debit_note.setValue(debitData.debit_note ? debitData.debit_note : debitData.id);
    this.editInvoicePaymentForm.controls.outstanding_debit.controls[index].controls.id.setValue(debitData.debit_note ? debitData.id : null);
    amount > 0 ? selected.setValue(true) : '';
    this.calculateAmountReceived();
  }


    /**
   * On change debit amount > 0 check the checkbox
   */
  onChangeDebitAdjustment(index, debitData) {
    const amount = this.editInvoicePaymentForm.controls.outstanding_debit.controls[index].controls.adjustment.value;
    const selected = this.editInvoicePaymentForm.controls.outstanding_debit.controls[index].controls.selected;
    this.editInvoicePaymentForm.controls.outstanding_debit.controls[index].controls.debit_note.setValue(debitData.debit_note ? debitData.debit_note : debitData.id);
    this.editInvoicePaymentForm.controls.outstanding_debit.controls[index].controls.id.setValue(debitData.debit_note ? debitData.id : null);
    amount > 0 ? selected.setValue(true) : '';
    this.calculateAmountReceived();
  }


  onCheckboxChangeAddCredit(event, list, index) {
    const creditNotes = this.editInvoicePaymentForm.controls['utilise_credit'] as UntypedFormArray;
    if (event.target.checked) {
      list.filter(data => {
        if (event.target.value == data.id) {
          creditNotes.controls[index].get('credit_note').setValue(data.id);
        }
      });
    }
    else {
      this.clearControlValidator(creditNotes.controls[index].get('availing_amount'));
      creditNotes.controls[index].get('credit_note').setValue(null);
      creditNotes.controls[index].get('availing_amount').setValue(0);
    }
  }









}
