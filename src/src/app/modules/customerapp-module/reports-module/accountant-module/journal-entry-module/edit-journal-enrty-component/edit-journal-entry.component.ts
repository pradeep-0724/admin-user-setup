import { JournalService } from './../services/journal.service';
import { UntypedFormGroup, UntypedFormBuilder, Validators, UntypedFormArray, AbstractControl, UntypedFormControl } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { changeDateToServerFormat } from 'src/app/shared-module/utilities/date-utilis';
import { Router, ActivatedRoute } from '@angular/router';
import { isValidValue } from 'src/app/shared-module/utilities/helper-utils';
import { TransportValidator } from 'src/app/shared-module/components/validators/validators';
import { CurrencyService } from 'src/app/core/services/currency.service';
import { PrefixUrlService } from 'src/app/core/services/prefixurl.service';
import { OperationConstants, ScreenConstants, ScreenType } from 'src/app/core/constants/data-analytics.constants';
import { AnalyticsService } from 'src/app/core/services/analytics.service';

@Component({
    selector: 'app-edit-journal-entry',
    templateUrl: './edit-journal-entry.component.html',
    styleUrls: [
		'./edit-journal-entry.component.scss'
	]
})
export class EditJournalEntryComponent implements OnInit {

    addJournalentry: UntypedFormGroup;
    accountsList: any;
    journal_id: any;
    sum: number = 0;
    journalDocument = [];
    documentAttachments = [];
    deletedEntriesArray = [];
    totals: any = {
        subtotal_debit: 0.00,
        subtotal_credit: 0.00,
        total: 0.00,
    };
    selectedAccountList = [];
    apiError: any;
    i;
    currency_type;
    prefixUrl: string;
    analyticsType= OperationConstants;
    analyticsScreen=ScreenConstants;
    screenType=ScreenType;

    constructor(private _fb: UntypedFormBuilder,
        private _journalService: JournalService,
        private _activatedRoute: ActivatedRoute,
        private _analytics:AnalyticsService,
        private currency:CurrencyService,
        private _prefixUrl:PrefixUrlService,
        private _router: Router,) { }

    ngOnInit() {
       setTimeout(() => {
      this.prefixUrl = this._prefixUrl.getprefixUrl();
      this.currency_type = this.currency.getCurrency();
    }, 1000);
        this._analytics.addEvent(this.analyticsType.IN,this.analyticsScreen.MANUALJOURNALENTRY,this.screenType.EDIT,"Navigated");
        this._activatedRoute.params.subscribe((params: any) => {
            this.journal_id = params.journal_id;
        this._journalService.getAllAccountList().subscribe((response: any) => {
            this.accountsList = response.result;
        });
        this.buildForm();
    });
    }

    patchFormValues(data: any) {
        if (isValidValue(data)) {
            if( data.entries.length > 0) {
                 data.entries.forEach((entries) => {
                    this.selectedAccountList.push(
                        {value: isValidValue(entries.account) ? entries.account.id : null,
                         label: isValidValue(entries.account) ? entries.account.name : ''}
                    )
                    entries.account= isValidValue(entries.account) ? entries.account.id : null;
                });
                this.buildEntries(data.entries);
             } else {
                this.buildEntries([{}]);
             }
            this.addJournalentry.patchValue(data);
        }

    }

    getFormValues() {
        this._journalService.getManualJournalEntryDetail(this.journal_id).subscribe((data: any) => {
            this.patchFormValues(data.result);
        });
    }

    ngAfterViewInit() {
        setTimeout(() => {
            this.getFormValues();
        }, 1);
    }

    buildForm() {
        this.addJournalentry = this._fb.group({
            journal_no: ['', Validators.required],
            date: [null, Validators.required],
            reference_no: ['', Validators.required],
            narration: [''],
            total_credit: [0],
            total_debit: [0],
            document: [[]],
            entries: this._fb.array([]),
        });
    }

    addEntries(item) {
        const otherForm = this._fb.group({
            id: [item.id || null],
            account: [null, Validators.required],
            reference_no: [''],
            debit: [0],
            credit: [0],
        });
        let tempValue: any;
        let creditValue: any;
        otherForm.get('debit').valueChanges.pipe(
            debounceTime(50),
            distinctUntilChanged()
        ).subscribe((updateValue) => {
            if (JSON.stringify(tempValue) !== JSON.stringify(updateValue)) {
                tempValue = updateValue;
                this.sumOfDebitAmount();
            }
        });
        otherForm.get('credit').valueChanges.pipe(
            debounceTime(50),
            distinctUntilChanged()
        ).subscribe((updateCredit) => {
            if (JSON.stringify(creditValue) !== JSON.stringify(updateCredit)) {
                creditValue = updateCredit;
                this.sumOfCreditAmount();
            }
        });
        return otherForm;
    }

    debitValueChange (otherForm: AbstractControl) {
        if (otherForm.get('credit').value && otherForm.get('debit').value) {
            otherForm.get('credit').setValue(0);
            otherForm.get('credit').updateValueAndValidity();
        }
    }

    creditValueChange(otherForm: AbstractControl) {
        if (otherForm.get('debit').value && otherForm.get('credit').value) {
            otherForm.get('debit').setValue(0);
            otherForm.get('debit').updateValueAndValidity();
        }
    }


    sumOfDebitAmount() {
        const entries = this.addJournalentry.controls['entries'] as UntypedFormArray;
        this.totals.subtotal_debit = 0;
        entries.controls.forEach((controls) => {
            this.totals.subtotal_debit = this.totals.subtotal_debit + parseFloat(!isNaN(controls.get('debit').value) && controls.get('debit').value ? controls.get('debit').value : 0);
        });
        this.addJournalentry.get('total_debit').setValue(parseFloat(this.totals.subtotal_debit));
    }

    sumOfCreditAmount() {
        this.totals.subtotal_credit = 0;
        const entries = this.addJournalentry.controls['entries'] as UntypedFormArray;
        entries.controls.forEach((controls) => {
            this.totals.subtotal_credit = this.totals.subtotal_credit + parseFloat(!isNaN(controls.get('credit').value) && controls.get('credit').value ? controls.get('credit').value : 0);
        });
        this.addJournalentry.get('total_credit').setValue(parseFloat(this.totals.subtotal_credit));
    }

    buildEntries(items: any = []) {
        const entries = this.addJournalentry.controls['entries'] as UntypedFormArray;
        items.forEach((item) => {
            entries.push(this.addEntries(item));
        });
    }


    addMoreEntries() {
        const otherItems = this.addJournalentry.controls['entries'] as UntypedFormArray;
        otherItems.push(this.addEntries({}));
    }

    clearAllCells () {
        const otherItems = this.addJournalentry.controls['entries'] as UntypedFormArray;
        otherItems.controls.forEach((controls) => {
            controls.get('credit').reset();
            controls.get('debit').reset();
            controls.get('reference_no').setValue('');
            controls.get('account').reset();
            this.selectedAccountList=[];
        });
    }
    removeOtherItem(index) {
        const otherItems = this.addJournalentry.controls['entries'] as UntypedFormArray;
        let deletedId = otherItems.controls[index].get('id').value
        if(deletedId)
            this.deletedEntriesArray.push(deletedId)
        otherItems.removeAt(index);
        this.sumOfDebitAmount();
        this.sumOfCreditAmount();
    }
    addErrorClass(controlName: AbstractControl) {
		return TransportValidator.addErrorClass(controlName);
	}

	setAsTouched(group: UntypedFormGroup | UntypedFormArray) {
		group.markAsTouched();
		for (let i in group.controls) {
			if (group.controls[i] instanceof UntypedFormControl) {
				group.controls[i].markAsTouched();
			} else {
				this.setAsTouched(group.controls[i]);
			}
		}
	}

    onFileUpload(files: any[]) { }

    fileUploaderDebit(filesUploaded, documentIndex = 0) {
        if (this.journalDocument[documentIndex] === undefined) {
            this.journalDocument[documentIndex] = [];
        }
        filesUploaded.forEach(element => {
            this.journalDocument[documentIndex].push(element.id);
        });
    }

    fileDeleted(deletedFileIndex, documentIndex) {
        this.documentAttachments[documentIndex].splice(deletedFileIndex, 1);
    }

    patchForm() {
        const entries = this.addJournalentry.controls['entries'] as UntypedFormArray;
        entries.controls.forEach((controls) => {
            if (!controls.get('credit').value)
                controls.get('credit').setValue(0);
            if (!controls.get('debit').value)
                controls.get('debit').setValue(0);
        });
        this.addJournalentry.get('date').setValue(changeDateToServerFormat(this.addJournalentry.controls['date'].value));
    }

    checkForTotals(form){
        this.apiError = '';
        if(this.addJournalentry.get('total_credit').value != this.addJournalentry.get('total_debit').value){
            this.apiError = 'Total Credit amount should match with total Debit amount';
            form.setErrors({ 'invalid': true });
            window.scrollTo(0, 0);
        }
        if(this.addJournalentry.get('total_credit').value <= 0 || this.addJournalentry.get('total_debit').value <= 0){
            this.apiError = 'Total Credit amount and Total Debit amount should greater than zero';
            form.setErrors({ 'invalid': true });
            window.scrollTo(0, 0);
        }
    }

    submitForm(form: UntypedFormGroup) {
    this.apiError = '';
    this.checkForTotals(form)
    if(form.valid){
        this.patchForm();
        form.value['deletedentries']= this.deletedEntriesArray;
        this._journalService.editManualJournalEntry(form.value, this.journal_id).subscribe((data: any) => {
          this._analytics.addEvent(this.analyticsType.UPDATED,this.analyticsScreen.MANUALJOURNALENTRY)
            this._router.navigate([this.prefixUrl+'/reports/accountant/journal-entry/list']);
        },
        (err) => {
            this.apiError = '';
            if (err.error.hasOwnProperty("message")) {
                this.apiError = err.error.message;
                window.scrollTo(0, 0);
            }
        });
    }
    else{
        this.setAsTouched(form);
    }}
}
