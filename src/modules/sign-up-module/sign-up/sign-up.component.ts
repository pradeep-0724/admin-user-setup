import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ErrorComponent } from "../../error-module/error/error.component";
import { CommonModule } from '@angular/common';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { PdfSampleComponent } from "../../pdf-sample/pdf-sample.component";
import { MapsModuleComponent } from "../../maps-module/maps-module.component";
import { Router } from '@angular/router';
import { TripVisualizerComponent } from '../../ravi_review/trip-visualizer';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [ErrorComponent,TripVisualizerComponent, ReactiveFormsModule, FormsModule, CommonModule, PdfSampleComponent, MapsModuleComponent],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.scss',
})
export class SignUpComponent implements OnInit{

  constructor(private _fb : FormBuilder,private _httpClient : HttpClient,
    private router : Router){}
  
  signUpForm : FormGroup = new FormGroup({}) ;
  
  noMatchFound  : boolean = true;

  envTitle = environment.envTitle;
  csrfToken: string = '';

  ngOnInit(): void {
    this.buildForm();
    this.getCsrfToken();
    this.getAllUsers();
  }

  buildForm(){
    this.signUpForm = this._fb.group({
      email: [null,[Validators.required,Validators.minLength(10)]],
      password : [null, Validators.required],
      name : [null,Validators.required],
      number : [null,Validators.required]
    })
  }

  getAllUsers(){
    this._httpClient.get('http://127.0.0.1:8000/api/get-users/').subscribe((data)=>{
      console.log(data);
    })
  }
  
  submit(){
    let form = this.signUpForm;
    const headers = new HttpHeaders({
      'X-CSRFToken': this.csrfToken,
      'Content-Type': 'application/json'

    });

    this._httpClient.post('http://127.0.0.1:8000/api/login/',form.value, { headers, withCredentials: true }).subscribe((data:any)=>{
      localStorage.setItem('access_token', data.access);
      localStorage.setItem('refresh_token', data.refresh);
      this.router.navigate(['/pdf']);
      console.log(data);
      
    })
  }

  getCsrfToken() {
    this._httpClient.get<{ csrfToken: string }>('http://127.0.0.1:8000/csrf/', { withCredentials: false })
      .subscribe(response => {   
        console.log(response);
        
        // document.cookie = `csrftoken=${response.csrfToken}; expires=1; path=/`;     
        this.csrfToken = response.csrfToken;
      });
  }


  
}
