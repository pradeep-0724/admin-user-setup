import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { AbstractControl, AbstractControlDirective, FormControl ,ReactiveFormsModule} from '@angular/forms';

@Component({
  selector: 'app-error',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './error.component.html',
  styleUrl: './error.component.scss'
})
export class ErrorComponent implements OnInit,OnChanges {

  ngOnChanges(changes: SimpleChanges): void {
  }

  ngOnInit(): void {
    
  }
  @Input() controlName : AbstractControl | AbstractControlDirective| any;
  errorsList :any[]= [];
  errorMessages :any= { 
		required: () => `This field is required`,
		max: (params:any) => `Max. ${params.max} number are allowed`,
		min: (params:any) => `Min. ${params.min} number is allowed`,
		maxlength: (params:any) => `Max. ${params.requiredLength} characters are allowed`,
		pattern: () => `Enter a valid field`,
		minlength: (params:any) => `Min. ${params.requiredLength} characters are allowed`,
		error: (params:any) => ``
	};

  listOfErrors(){
    this.errorsList = [];
    Object.keys(this.controlName.errors).map((error)=>{
      if(this.controlName.touched || this.controlName.dirty){
        this.errorsList.push(this.errorMessages[error] (this.controlName.errors[error]))
      }
    })
   return this.errorsList 
  }
}
