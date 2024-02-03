import { Component, Inject, Input, OnInit, PLATFORM_ID } from '@angular/core';
import { CommentModel } from '../../models/comment/comment.momel';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommentService } from '../../services/comment.service';
import { CookieService } from 'ngx-cookie-service';
import { UserProfileModel } from '../../models/user/user.profile.model';
import { environment } from '../../../environments/environment.development';
import { CommentCreateModel } from '../../models/comment/comment.create.model';
import { TimeAgoPipe } from '../../config/time-ago.pipe';
import { CommonModule, isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-comment',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TimeAgoPipe
  ],
  templateUrl: './comment.component.html',
  styleUrl: './comment.component.css',
})
export class CommentComponent implements OnInit{
  // comment
 
  commentsChild?: CommentModel[];
  pageCommentsChild = 1;
  pageCommentsParend = 1;
  totalCommentChild: number = 0;

  // 
  @Input() bookId!: number;
  @Input() commentsParent?: CommentModel[];
  @Input() totalCommentParent: number = 0;

  // comment form
  commentForm = new FormGroup({
    content: new FormControl("", [
      Validators.required,
      Validators.minLength(3)
    ])
  })

  // comment form
  commentReplyForm = new FormGroup({
    contentReply: new FormControl("", [
      Validators.required,
      Validators.minLength(3)
    ])
  })


  checkUserExist: boolean = this.cookieService.check(environment.UserCookie);

  // user 
  userProfile: UserProfileModel = new UserProfileModel();

  constructor(
    private cookieService: CookieService,
    @Inject(PLATFORM_ID) private platformId: Object,
    private commentService: CommentService
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      const storedUserProfile = localStorage.getItem(environment.UserProfileLocal);
    
      if (storedUserProfile) {
        // Chuyển đổi chuỗi thành đối tượng
        this.userProfile = JSON.parse(storedUserProfile);
      }
    }
  }

  // comment reply
  onClickReply(replyForm: HTMLFormElement) {
    // Toggle reply form
    if(replyForm.style.display === 'block') {
      replyForm.style.display = 'none';
    } else {
      replyForm.style.display = 'block';
    }
  }

  getCommentsParentPush(bookId: number, page: number, pageSize: number) {
    this.commentService.getCommentsParent(bookId, page, pageSize).subscribe({
      next: (response) => {
        for (const comment of response.comments) {
          this.commentsParent!.push(comment);
        }
        this.totalCommentParent = response.totalPage;
        this.pageCommentsParend += 1;
      }
    });
  }

   // Comment child
   getCommentsChild(commentId: number, page: number, pageSize: number, replyForm: HTMLFormElement) {

    replyForm.style.display = 'block';

    this.commentService.getCommentsChild(commentId, page, pageSize).subscribe({
      next: (response) => {
        this.commentsChild = response.comments;
        this.totalCommentChild = response.totalPage;
        this.pageCommentsChild = 1;
        this.pageCommentsChild += 1;
      }
    });
  }

  getCommentsChildPush(commentId: number, page: number, pageSize: number) {
    this.commentService.getCommentsChild(commentId, page, pageSize).subscribe({
      next: (response) => {
        for (const comment of response.comments) {
          this.commentsChild!.push(comment);
        }
        this.totalCommentChild = response.totalPage;
        this.pageCommentsChild += 1;
      }
    });
  }

  // add comment parent
  addCommentParent(bookId: number) {

    if (!this.checkUserExist) {
      alert('Đăng nhập để bình luận!');
      return;
    }

    let comment: CommentCreateModel = new CommentCreateModel();
    
    if (this.commentForm.invalid) {
      alert('Vui lòng nhập bình luận có ít nhất 3 ký tự!');
      return;
    }

    comment.bookId = bookId;
    comment.content = this.commentForm.value.content!;
    comment.parentId = null;

    this.commentService.addComment(comment).subscribe({
      next: (response) => {

        if (this.commentsParent === undefined) {
          this.commentsParent = [];
        }

        this.commentsParent!.unshift(response);
      }
    });

    this.commentForm.setValue({content: ""});
  }

   // add comment child
   addCommentChild(commentId: number, bookId: number) {
    
    if (!this.checkUserExist) {
      alert('Đăng nhập để bình luận!');
      return;
    }

    let comment: CommentCreateModel = new CommentCreateModel();
    
    if (this.commentReplyForm.invalid) {
      alert('Vui lòng nhập bình luận có ít nhất 3 ký tự!');
      return;
    }

    comment.bookId = bookId;
    comment.content = this.commentReplyForm.value.contentReply!;
    comment.parentId = commentId;

    this.commentService.addComment(comment).subscribe({
      next: (response) => {

        if (this.commentsChild !== undefined && this.commentsChild.length > 0 && commentId !== this.commentsChild[0].parentId) {
          this.commentsChild = [];
        }

        if (this.commentsChild === undefined) {
          this.commentsChild = [];
        }

        this.commentsChild.push(response);
        const temp = this.commentsChild[0].parentId;

        if (this.commentsParent) {
          var comment = this.commentsParent.find(comment => comment.id === temp);
          if (comment !== undefined) {
            comment!.count += 1; // Sử dụng ! để bảo đảm rằng comment không phải là undefined
          }
        }
      }
    });

    this.commentReplyForm.setValue({contentReply: ""});
  }
  
  deleteCommentParent(commentId: number) {
    this.commentService.deleteComment(commentId).subscribe({
      next: (response) => {

        if (!response) {
          return;
        }

        if (this.commentsParent !== undefined && this.commentsParent.length > 0) {
          // Xóa comment trong mảng commentsParent
          this.commentsParent = this.commentsParent.filter(c => c.id !== commentId);
        }        
      }
    });
  }

  deleteCommentChild(commentId: number) {
    this.commentService.deleteComment(commentId).subscribe({
      next: (response) => {

        if (!response) {
          return;
        }

        if (this.commentsParent !== undefined && this.commentsParent.length > 0) {

            // Xóa commentsChild có parentId là commentId
            if (this.commentsChild !== undefined && this.commentsChild.length > 0) {

              let tempCommentChild = this.commentsChild;

              let temp = tempCommentChild.filter(ch => ch.id !== commentId && ch.parentId !== null);

              if (temp.length > 0) {
                this.commentsChild = temp;

                 // trừ count khi xóa child
                const temp1 = this.commentsChild[0].parentId;
                var comment = this.commentsParent.find(comment => comment.id === temp1);
                if (comment !== undefined) {
                  comment!.count = this.commentsChild.length; // Sử dụng ! để bảo đảm rằng comment không phải là undefined
                }
              } else {
                 // trừ count khi xóa child
                 const temp1 = this.commentsChild[0].parentId;
                 var comment = this.commentsParent.find(comment => comment.id === temp1);
                 if (comment !== undefined) {
                   comment!.count = 0; // Sử dụng ! để bảo đảm rằng comment không phải là undefined
                 }
                this.commentsChild = undefined;
              }
            }
            
        }        
      }
    });
  }
}
