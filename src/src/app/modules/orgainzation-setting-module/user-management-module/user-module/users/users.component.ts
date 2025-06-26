import { Component, OnInit } from '@angular/core';
import { ValidationConstants } from 'src/app/core/constants/constant';
import {MatDialog} from '@angular/material/dialog';
import { AddUserComponent } from './adduser.component';
import { UserManagementService } from '../../../../customerapp-module/api-services/orgainzation-setting-module-services/user-management-service/user-management-service.service';
import { ApiHandlerService } from 'src/app/core/services/api-handler.service';


@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
  host: {
    '(document:click)': 'outSideClick($event)'
  }
})
export class UsersComponent implements OnInit {
  filter = new ValidationConstants().filter;
  showOptions: string = '';
  popupOutputData: any;
  listIndexData = {};
  apiError: String = "";
    sortedData: any = [];
    allRoles: any = [];
  userDataAndOptions={
    allRoles:[],
    popupType:'',
    id:'',
    selectedRoles:[],
    userDetails:[],
    isSuperUser: false,
    status: ""
  }
  search='';
  canAdd: boolean = false;
  maxUser =1;
  popupInputData = {
    'msg': 'Are you sure, you want to delete?',
    'type': 'warning',
    'show': false
  }
  popupInputAddRole = {
    'msg': 'Please add Roles and Responsibilities first, in order to grant the user access.',
    'type': 'error',
    'show': false
  }

  constructor(public dialog: MatDialog,private _userManagement_service:UserManagementService,private apiHandler:ApiHandlerService) { }

  ngOnInit() {
    this.getRoles();
    this.initView();
  }

  initView() {
   this._userManagement_service.getUserList().subscribe(result=>{
     this.sortedData=result['result']['users'];
     this.canAdd = result['result']['can_add'];
     this.maxUser =  result['result']['max_user'];
   })
  }



  deleteUser(id) {
    this.apiHandler.handleRequest(this._userManagement_service.deleteUser(id),'User deleted Successfully!').subscribe({
      next:(resp)=>{
        this.initView();
      },
      error:(err)=>{
        console.log(err)
      }
    })
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
    return (this.showOptions = list_index);
  }

  popupFunction(id, index: any = null) {
    this.listIndexData = { 'id': id, 'index': index };
    this.popupInputData['show'] = true;
  }

  confirmButton(event) {
    if (event) {
      let id = this.listIndexData['id'];
      this.deleteUser(id);
      this.listIndexData = {};
    }
  }

  edit(id, index): void {
    if(this.allRoles.length==0){
      this.popupInputAddRole.show=true

    }else{
      var isSuperuser = true;
      this._userManagement_service.getUserByID(id).subscribe(result=>{
        let data =[];
        data = result['result'];
        let selectedRoles=[];
        if(data['roles'].length>0){
          data['roles'].forEach(item =>{
           selectedRoles.push({
            name:item.role__name,
            id:item.role__id
           })
          })
        }
  
        if (index > 0) {
          isSuperuser = false
        }
        const dialogRef = this.dialog.open(AddUserComponent, {
          width: '500px',
          data: this.userDataAndOptions={
            popupType:'Edit User',
            allRoles:this.allRoles,
            selectedRoles:selectedRoles,
            isSuperUser: isSuperuser,
            id:id,
            status: this.sortedData[index].status,
            userDetails:[{
              email:data['email'],
              name:data['user_name']
            }]
          }
        });
        dialogRef.afterClosed().subscribe(result => {
          if(result){
            this.initView()
          }
        });
      },err=>{
        console.log(err)
      });

    }
   
  }

  openDialog(): void {
    if(this.allRoles.length==0){
      this.popupInputAddRole.show=true

    }else{
      const dialogRef = this.dialog.open(AddUserComponent, {
        width: '500px',
        data: this.userDataAndOptions={
          popupType:'Invite User',
          allRoles:this.allRoles,
          isSuperUser: false,
          selectedRoles:[],
          id:'null',
          userDetails:[],
          status: ""
        }
      });
  
      dialogRef.afterClosed().subscribe(result => {
        if(result){
          this.initView()
        }
      });
    }


   
  }


  getRoles(){
    this._userManagement_service.getRolesList().subscribe(result=>{
     this.allRoles = result['result']
    })
  }

  resendInvite(userId) {
    this.apiHandler.handleRequest(this._userManagement_service.resendInvite(userId),'Invitation sent successfully!').subscribe({
      next:(resp)=>{
      },
      error:(err)=>{
        console.log(err)
      }
    })
  }

  markActive(userId) {
    this.apiHandler.handleRequest(this._userManagement_service.markeActive(userId),'User activated Successfully!').subscribe({
      next:(resp)=>{
        this.initView();
      },
      error:(err)=>{
        console.log(err)
      }
    })
  }

}



