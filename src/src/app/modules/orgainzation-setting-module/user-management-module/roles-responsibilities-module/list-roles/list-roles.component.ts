import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { getPrefix } from 'src/app/core/services/prefixurl.service';
import { UserManagementService } from '../../../../customerapp-module/api-services/orgainzation-setting-module-services/user-management-service/user-management-service.service';
import { ApiHandlerService } from 'src/app/core/services/api-handler.service';

@Component({
  selector: 'app-list-roles',
  templateUrl: './list-roles.component.html',
  styleUrls: ['./list-roles.component.scss'],
  host: {
    '(document:click)': 'outSideClick($event)'
  }
})
export class ListRolesComponent implements OnInit {
  showOptions='';
  cloneId='';
  listIndexData = {};
  roleList=[];
  popupInputData = {
    'msg': 'Are you sure, you want to delete?',
    'type': 'warning',
    'show': false
  }
  constructor(private _userManagementService:UserManagementService,private route:Router,private apiHandler:ApiHandlerService) { }

  ngOnInit() {
   this.initView()
  }

  initView(){
    this._userManagementService.getRolesList().subscribe(result=>{
      this.roleList=result['result'];
    })
  }
  cloneRole(id){
    this.cloneId=id;
   this._userManagementService.setCloneID(this.cloneId);
   this.route.navigateByUrl(getPrefix()+"/organization_setting/user_management/user-roles-responsibilities/add-role");
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



  popupFunction(id, index: any = null) {
    this.listIndexData = { 'id': id, 'index': index };
    this.popupInputData['show'] = true;
  }

  confirmButton(event) {
    if (event) {
      let id = this.listIndexData['id'];
      this.deleteRole(id);
      this.listIndexData = {};
    }
  }

  optionsList(event, list_index) {
    return (this.showOptions = list_index);
  }

   deleteRole(id){
    this.apiHandler.handleRequest(this._userManagementService.deleteRole(id),'Role deleted successfully!').subscribe({
      next:(resp)=>{
        this.initView();
      },
      error:(err)=>{
        console.log(err)
      }
    })
   }


}
