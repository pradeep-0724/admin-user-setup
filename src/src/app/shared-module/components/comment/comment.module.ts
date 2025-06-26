import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommentComponent } from './comment.component';
import { FormsModule } from '@angular/forms';
import { NgxEditorModule } from 'ngx-editor';



@NgModule({
  declarations: [CommentComponent],
  imports: [
    CommonModule,
    FormsModule,
    NgxEditorModule

  ],
  exports:[CommentComponent] 
})
export class CommentModule { }
