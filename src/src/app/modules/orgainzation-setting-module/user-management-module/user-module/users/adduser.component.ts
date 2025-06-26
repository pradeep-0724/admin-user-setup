import { Component, OnInit ,Inject} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { UntypedFormGroup, UntypedFormBuilder, Validators, UntypedFormArray, AbstractControl, UntypedFormControl } from '@angular/forms';
import { UserManagementService } from '../../../../customerapp-module/api-services/orgainzation-setting-module-services/user-management-service/user-management-service.service';
import { TransportValidator } from 'src/app/shared-module/components/validators/validators';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {ElementRef, ViewChild} from '@angular/core';
import {MatAutocompleteSelectedEvent, MatAutocomplete} from '@angular/material/autocomplete';
import {MatChipInputEvent} from '@angular/material/chips';
import {Observable} from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { TokenExpireService } from 'src/app/core/services/token-expire.service';
import { ApiHandlerService } from 'src/app/core/services/api-handler.service';
@Component({
  selector: 'add-user',
  templateUrl: './adduser.component.html'
})

export class AddUserComponent implements OnInit {
  inviteUser : UntypedFormGroup;
  roles=[];
  DialogData:any
  visible = true;
  selectable = true;
  apiError=''
  removable = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  filteredRoles: Observable<string[]>;
  selectedRoles: string[] = [];
  allRoles: string[] = [];
  isSuperUser: boolean = false;
  isRoleInvalid:boolean=false
  @ViewChild('roleInput',{static: true}) roleInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto',{static: true}) matAutocomplete: MatAutocomplete;
  constructor(public dialogRef: MatDialogRef<AddUserComponent>,private _fb: UntypedFormBuilder, private _tokenExpireService:TokenExpireService,
    private _userManagementService:UserManagementService, @Inject(MAT_DIALOG_DATA) public data,private apiHandler:ApiHandlerService){


  }

  ngOnInit(): void {
    this.buildForm();
    this.getRolesName(this.data['allRoles'])
    if(this.data['id']!=='null'){
      this.getSelectedRolesName(this.data['selectedRoles']);
      this.patchForm(this.data['userDetails'][0])
      this.isSuperUser = this.data['isSuperUser']
      this.makeRoleNotMandatory()
    }
    this._tokenExpireService.observeTokenExpire.subscribe(isExpired=>{
      if(isExpired){
        this.dialogRef.close(false)
      }
    })
    this.filteredRoles = this.inviteUser.controls.role.valueChanges.pipe(
      startWith(null),
      map((role: string | null) => role ? this._filter(role) : this.allRoles.slice()));
  }

  makeRoleNotMandatory() {
    if (this.isSuperUser) 
      this.inviteUser.get('role').setValidators(null)
    else 
      this.inviteUser.get('role').setValidators(Validators.required)
      this.inviteUser.get('role').updateValueAndValidity()
  }

  buildForm() {
    const emailPattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    this.inviteUser = this._fb.group({
      name:['',[Validators.required]],
      email:['',[Validators.required, Validators.pattern(emailPattern)]],
      role:['',[Validators.required]]
    })
  }

  onNoClick(): void {
    this.dialogRef.close(false);
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

  addErrorClass(controlName: AbstractControl) {
    return TransportValidator.addErrorClass(controlName);
  }

  submit(){
    let form =this.inviteUser;
    let selectedRoles=[]
    selectedRoles =this.getSelectedId()
    if(selectedRoles.length >0){
      this.inviteUser.get('role').setValidators(null)
      this.inviteUser.get('role').updateValueAndValidity()
      this.isRoleInvalid=false
    }else{
      form.controls.role.patchValue('')
      this.inviteUser.get('role').setValidators(Validators.required)
      this.inviteUser.get('role').updateValueAndValidity()
      this.isRoleInvalid=true
    }
    if(this.data['id']!=='null'){
      if(form.valid){
        let payload={
          user_name:form.value['name'],
          email:form.value['email'],
          roles:selectedRoles
        }
        this.apiHandler.handleRequest(this._userManagementService.putUser(payload,this.data['id']),'User Details updated successfully!').subscribe({
          next:(resp)=>{
            this.dialogRef.close(true);
          },
          error:(err)=>{
            this.apiError =err.error['message']
          }
        })
      }else{
        this.setAsTouched(form);
      }
    }else{
      if(form.valid){
        let payload={
          username:form.value['name'],
          email:form.value['email'],
          roles:selectedRoles
        }
        this.apiHandler.handleRequest(this._userManagementService.postUser(payload),'Invitation sent successfully!').subscribe({
          next:(resp)=>{
            this.dialogRef.close(true);
          },
          error:(err)=>{
            this.apiError =err.error['message']
          }
        })
      }else{
        this.setAsTouched(form);
      }
    }
  }


  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    if ((value || '').trim()) {
      this.selectedRoles.push(value.trim());
    }

    if (input) {
      input.value = '';
    }

    this.inviteUser.controls.role.setValue(null);
  }

  remove(role: string): void {
    const index = this.selectedRoles.indexOf(role);
    if (index >= 0) {
      this.selectedRoles.splice(index, 1);
      this.addAllRole(role);
      if(this.roleInput?.nativeElement){
        this.roleInput.nativeElement.value = '';
      }
      this.inviteUser.controls.role.setValue(null);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.selectedRoles.push(event.option.viewValue);
    this.removeItemFromAllRoles(event.option.viewValue);
    if(this.roleInput?.nativeElement){
      this.roleInput.nativeElement.value = '';
    }
    this.inviteUser.controls.role.setValue(null);
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.allRoles.filter(role => role.toLowerCase().indexOf(filterValue) === 0);
  }

  removeItemFromAllRoles(role){
    const index = this.allRoles.indexOf(role);
    if (index >= 0) {
     
      this.allRoles.splice(index, 1);
    }
  }

  addAllRole(role){
    this.allRoles.push(role)
  }

    getRolesName(data){
   this.allRoles = data.map(item =>  item.name)
   }

   getSelectedRolesName(data){
     this.selectedRoles = data.map(item =>  item.name)
       this.removeAllroleFromSelected();
    }

 removeAllroleFromSelected(){
  this.selectedRoles.forEach(item =>{
    const index = this.allRoles.indexOf(item);
    if (index >= 0) {
      this.allRoles.splice(index, 1);
    }
  });
 }
// for sending the payload data
 getSelectedId(){
   let sel=[]
  this.data['allRoles'].forEach(roleObj => {
    const index = this.selectedRoles.indexOf(roleObj['name']);
    if (index >= 0) {
       sel.push(roleObj)
    }
  });
    let selectedId=[]
    selectedId = sel.map(item => item.id );
    return selectedId;
 }

 patchForm(data){
  let form =this.inviteUser;
      form.patchValue({
        email:data.email,
        name:data.name
  })
 }
 removeAPIerror(){
  this.apiError='';
 }
}
