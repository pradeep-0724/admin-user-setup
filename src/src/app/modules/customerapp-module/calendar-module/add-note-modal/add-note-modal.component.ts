import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { UntypedFormGroup, Validators, UntypedFormBuilder, AbstractControl, UntypedFormArray, UntypedFormControl } from '@angular/forms';
import { TransportValidator } from '../../../../shared-module/components/validators/validators';
import { CommonService } from 'src/app/core/services/common.service';
import { changeDateToServerFormat } from '../../../../shared-module/utilities/date-utilis';
import { popupOverflowService } from 'src/app/modules/customerapp-module/api-services/auth-and-general-services/popup-overflow.service';
import { dateWithTimeZone } from 'src/app/core/services/time-zone.service';

@Component({
  selector: 'add-note-modal',
  templateUrl: './add-note-modal.component.html',
  styleUrls: ['./add-note-modal.component.scss']
})
export class AddNoteModalComponent implements OnInit {
  @Input() showNoteModal:boolean = false;
  @Output() noteEntered = new EventEmitter<any>();
  @Output() modalClosed = new EventEmitter<any>();
  @Input() noteDate: any;

  addNoteForm:UntypedFormGroup;
  constructor(
      private _fb: UntypedFormBuilder,
      private _commonService: CommonService,
      private _popupBodyScrollService:popupOverflowService
    ) { }

  ngOnInit() {
    this.buildForm();
  }

  ngOnChanges(changes: SimpleChanges) {
    let selectedDate: any;
    this.buildForm();
    if (this.noteDate !== undefined){
      selectedDate = this.noteDate;
    } else{
      selectedDate  = new Date(dateWithTimeZone());
    }
    var year = selectedDate.getFullYear();
    var month = (1 + selectedDate.getMonth()).toString();
    month = month.length > 1 ? month : '0' + month;
    var day = selectedDate.getDate().toString();
    day = day.length > 1 ? day : '0' + day;
    let formattedDate = year + '-' + month + '-' + day;
    this.addNoteForm.controls['reminder'].setValue(formattedDate);
  }

  buildForm() {
    this.addNoteForm = this._fb.group({
      reminder: [
				null, Validators.required
			],
			text: [
				null, Validators.required
			],
    });
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

  submitNote(form:UntypedFormGroup) {
    if (form.valid) {
      this._popupBodyScrollService.popupHide();
        this._commonService.addCalendarNote(this.prepareRequest(form)).subscribe((response) => {
          this.closeModal();
        });
    }
    else{
      this.setAsTouched(form);
    }
  }

  prepareRequest(form: UntypedFormGroup) {
    let params = form.value;
    params['reminder']
		params['reminder'] = changeDateToServerFormat(form.controls['reminder'].value);
		return params;
  }

  addErrorClass(controlName: AbstractControl) {
		return TransportValidator.addErrorClass(controlName);
  }

  closeModal() {
    this.showNoteModal = false;
    this.resetForm();
    this.modalClosed.emit(true);
    this._popupBodyScrollService.popupHide();
  }

  resetForm() {
    this.addNoteForm.reset();
  }
}
