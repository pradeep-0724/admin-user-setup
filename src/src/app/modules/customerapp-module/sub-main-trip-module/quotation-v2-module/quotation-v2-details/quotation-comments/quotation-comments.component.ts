import { DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';
import { Component, Inject, OnInit } from '@angular/core';
import { Editor } from 'ngx-editor';
import { CommentService } from 'src/app/shared-module/components/comment/comments.service';

@Component({
  selector: 'app-quotation-comments',
  templateUrl: './quotation-comments.component.html',
  styleUrls: ['./quotation-comments.component.scss']
})
export class QuotationCommentsComponent implements OnInit {

  constructor( private dialogRef: DialogRef<boolean>, @Inject(DIALOG_DATA) private data: any, private _commentService:CommentService) { }
  comment
  editor: Editor;
  commentData={
    key:'quotation',
  }
 
  pattern =/<([^\s>]+)(\s[^>]*)?>\s*<\/\1>/g;
  allComments=[];
  ngOnInit(): void {
    this.editor = new Editor();
    this.getAllComments();
  }

  close(){
   this.dialogRef.close(true)
  }

  getAllComments(){
    this._commentService.getComments(this.commentData.key,this.data).subscribe(resp=>{
      this.allComments = resp.result;
      console.log(this.allComments)
      setTimeout(() => {
        var div = document.getElementById("comment-id");
        div.scrollIntoView({'behavior':'smooth'});
      }, 10);
    });
  }

  addComment(){
    let payLoad={
      key:this.commentData.key,
      object_id:this.data,
      message:this.comment
    }
    if(this.comment.replace(this.pattern, '')){
      this._commentService.postComments(payLoad).subscribe(resp=>{
        this.comment='';
        this.getAllComments();
      });
    }

  }
  ngOnDestroy(): void {
    this.editor.destroy();
  }

}
