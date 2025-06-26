import { Component, OnInit, Input } from '@angular/core';
import { Editor, Toolbar } from 'ngx-editor';
import { CommentService } from './comments.service';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss']
})
export class CommentComponent implements OnInit {

  constructor(private _commentService:CommentService) { }
  allComments:any=[];
  comment:string='';
  pattern =/<([^\s>]+)(\s[^>]*)?>\s*<\/\1>/g;
  @Input() commentData={
    key:'',
    object_id:''
  }
  editor: Editor;
  toolbar: Toolbar = [
    ['ordered_list', 'bullet_list'],

  ];
  ngOnInit(): void {
    this.editor = new Editor();
    this.getAllComments();
  }

  getAllComments(){
    this._commentService.getComments(this.commentData.key,this.commentData.object_id).subscribe(resp=>{
      this.allComments = resp.result;
    });
  }

  addComment(){
    let payLoad={
      key:this.commentData.key,
      object_id:this.commentData.object_id,
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
