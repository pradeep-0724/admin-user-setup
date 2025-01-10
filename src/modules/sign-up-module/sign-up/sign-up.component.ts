import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ErrorComponent } from "../../error-module/error/error.component";
import { CommonModule } from '@angular/common';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [ErrorComponent,ReactiveFormsModule,FormsModule,CommonModule],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.scss'
})
export class SignUpComponent implements OnInit{

  constructor(private _fb : FormBuilder){}
  
  signUpForm : FormGroup = new FormGroup({}) ;
  
  noMatchFound  : boolean = true;

  envTitle = environment.envTitle;
  ngOnInit(): void {
    this.buildForm();
  }

  buildForm(){
    this.signUpForm = this._fb.group({
      email: [null,[Validators.required,Validators.minLength(10)]],
      password : [null, Validators.required],
      c_password : [null,Validators.required],
      mobile : [null,Validators.required]
    })
  }
  submit(){
    let form = this.signUpForm
    console.log(form);
    console.log(form.value);
  }
  
}
