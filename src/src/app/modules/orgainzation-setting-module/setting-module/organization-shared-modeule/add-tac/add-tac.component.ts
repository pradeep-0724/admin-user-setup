
import { Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { UntypedFormGroup, Validators, UntypedFormBuilder, AbstractControl} from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { SettingSeviceService } from 'src/app/modules/customerapp-module/api-services/orgainzation-setting-module-services/setting-service/setting-sevice.service';
import { TransportValidator } from 'src/app/shared-module/components/validators/validators';
import { setAsTouched } from 'src/app/shared-module/utilities/form-utils';

@Component({
  selector: 'app-add-tac',
  templateUrl: './add-tac.component.html',
  styleUrls: ['./add-tac.component.scss'],
  host: {
    '(document:click)': 'outSideClick($event)',
  }
})
export class AddTacComponent implements OnInit { 

  showOptions: any;
  @Input() key: string='';
  tcs: any = [];
  tcId: string = "";
  @Input() canSaveInline : boolean = true;
  @Output() displayTNCOnSamPage? = new EventEmitter();
  defaultTNC = '';
  selectedValue: string = 'same_page';
  
  constructor(public dialog: MatDialog, private _settingService: SettingSeviceService) { }

  ngOnInit() {
    this.getTCSetting()
  }

  getTCSetting(){
    this._settingService.getTCSettings(this.key).subscribe((item: any) => {      
      this.tcs = item.result.tc_content;
      this.tcs.forEach(element => {
        if (element.is_default) {
          this.defaultTNC = element.id
        }
      });
      this.selectedValue = item.result.tc_setting.same_page_display ? 'same_page' : 'next_page'
      this.tcId = item.result.tc_setting.id;
      this.displayTNCOnSamPage.emit(
        { 
          selectedValue : this.selectedValue == 'same_page' ? true : false,
          id : this.tcId,
          default_tnc : this.defaultTNC
        })
    })
  }

  addTCModal(){

      const dialogRef= this.dialog.open(TCDialog,{
        width:'700px',
        maxWidth:'80%',
        height:'auto',
        data: {name: '', content: ''}
      });
      dialogRef.afterClosed().subscribe(result =>{
        if (result){
            this._settingService.postTC({name: result.name, content: result.content,
                                         tc: this.tcId}).subscribe(()=>{this.getTCSetting()})
        }
      })
  }

  editTCModal(tcContent){

    const dialogRef= this.dialog.open(TCDialog,{
      width:'700px',
      maxWidth:'80%',
      height:'auto',
      data: {name: tcContent.name, content: tcContent.content}
    });
    dialogRef.afterClosed().subscribe(result =>{
      if (result){
          this._settingService.updateTC(tcContent.id, {name: result.name, content: result.content,
                                       tc: this.tcId}).subscribe(()=>{this.getTCSetting()})
      }
    })

  }

  deleteTCModal(tcContent){
    this._settingService.deleteTC(tcContent.id).subscribe(()=>{this.getTCSetting()})
  }

  setDisplayIn(){
    this.displayTNCOnSamPage.emit(
      { 
        selectedValue : this.selectedValue == 'same_page' ? true : false,
        id : this.tcId,
        default_tnc : this.defaultTNC
      })
    if(this.canSaveInline){
      const samePageDisplayIn = this.selectedValue == 'same_page' ? true : false
      this._settingService.updateTCSettings({key: this.key, same_page_display: samePageDisplayIn}).subscribe(()=>{})
    }
  }

  outSideClick(env) {
    try {
      if ((env.target.className).indexOf('more-icon') == -1){
        this.showOptions = ''
      }
    } catch (error) {
      console.log(error)
    }
  }

  optionsList(event, list_index) {
    return this.showOptions = list_index;
  }
  defaultTNCChecked(event,id){
    if (event.target.checked) {
      this.defaultTNC = id
      this.tcs.forEach((item: any) => {
        item.is_default = false;
        if(item.id === id) item.is_default = true;
      });
      this.displayTNCOnSamPage.emit(
        { 
          selectedValue : this.selectedValue == 'same_page' ? true : false,
          id : this.tcId,
          default_tnc : this.defaultTNC
        }
      )
      event.target.checked = false;
    }
  }
}
 

@Component({
  selector: 'app-tc-modal',
  template: `<form [formGroup]="addTCForm">
  <div class="gb-popup-header">Add Terms and Conditions</div>
<div class="row mx-0 px-3 py-4">
  <div class="col-lg-8">
    <div class="input-wrap error"  [ngClass]="addErrorClass(addTCForm.get('name'))">
      <label class="input--required">Terms and Conditions Name</label>
      <input formControlName="name" maxlength="25" class="input--bd no-style" />
      <app-error [controlName]="addTCForm.get('name')"></app-error>
    </div>
  </div>
  <div class="col-lg-12">
    <div>
       <angular-editor [placeholder]="'Enter text here...'" formControlName="content" [config]="config"></angular-editor>
       <p style="color: red;" *ngIf="addTCForm.get('content').invalid && addTCForm.get('content').touched">This field is required</p>
    </div>

  </div>
</div>
  <div  class="d-flex  justify-content-between px-4 pb-4">
    <button  (click)="close()" class="btn btn--sm">Cancel</button>
    <button  class="btn btn--primary btn--sm" (click)="save()">Save</button>
  </div>
  </form>`
})

export class TCDialog implements OnInit{
  constructor( public dialogRef: MatDialogRef<TCDialog>,private fb: UntypedFormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any){

  }

  addTCForm: UntypedFormGroup;
  tcModalId =''
  
  config: AngularEditorConfig = {
    editable: true,
      spellcheck: true,
      height: '200px',
      minHeight: '200px',
      maxHeight: '200px',
      width: 'auto',
      minWidth: '100px',
      translate: 'yes',
      enableToolbar: true,
      showToolbar: true,
      placeholder: 'Enter text here...',
      defaultParagraphSeparator: '',
      defaultFontName: '',
      defaultFontSize: '',
      fonts: [
        {class: 'arial', name: 'Arial'},
        {class: 'times-new-roman', name: 'Times New Roman'},
        {class: 'calibri', name: 'Calibri'},
        {class: 'comic-sans-ms', name: 'Comic Sans MS'}
      ],
      customClasses: [
      {
        name: 'quote',
        class: 'quote',
      },
      {
        name: 'redText',
        class: 'redText'
      },
      {
        name: 'titleText',
        class: 'titleText',
        tag: 'h1',
      },
    ],
    sanitize: true,
    toolbarPosition: 'top',
    toolbarHiddenButtons: [
      [
        'strikeThrough',
        'subscript',
        'superscript',
        'fontName',
        'heading',
        'justifyLeft',
        'justifyCenter',
        'justifyRight',
        'justifyFull',
        'indent',
        'outdent',
        'undo',
        'redo',
      ],
      ['fontSize',
      'textColor',
      'customClasses',
      'link',
      'unlink',
      'insertImage',
      'insertVideo',
      'insertHorizontalRule',
      'backgroundColor',
      'removeFormat',
      'toggleEditorMode']
    ]
};

  ngOnInit(): void {
    this.buildform();
    if(this.data.id){
      this.tcModalId  = this.data.id
    }
    this.addTCForm.get('name').setValue(this.data.name);
    this.addTCForm.get('content').setValue(this.data.content);
  }


  buildform(){
    this.addTCForm=this.fb.group({
      name: ['', Validators.required],
      content: ['', Validators.required]
    });
  }

  close(): void {
    const closeValue = false;
    this.dialogRef.close(closeValue);
  }

  addErrorClass(controlName: AbstractControl) {
    return TransportValidator.addErrorClass(controlName);
  }


  save() {
    if (this.addTCForm.valid) {
      if(this.tcModalId){
        this.dialogRef.close({name: this.addTCForm.get('name').value , id : this.tcModalId, 
                content: this.addTCForm.get('content').value})
        }
        else{
          this.dialogRef.close({name: this.addTCForm.get('name').value, 
                  content: this.addTCForm.get('content').value})
    
        }
    }else{
      setAsTouched(this.addTCForm)
    }

  }
}
