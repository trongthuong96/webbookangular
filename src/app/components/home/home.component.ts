import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { BookService } from '../../services/book.service';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { LoginModel } from '../../models/user/login.model';
import { TimeAgoPipe } from '../../config/time-ago.pipe';
import { BookShowListModel } from '../../models/book/book.list.model';
import BookShowModel from '../../models/book/book.one.model';
import { TitleService } from '../../services/title.service';
import { forkJoin } from 'rxjs';
import { NgHttpLoaderModule, SpinnerVisibilityService } from 'ng-http-loader';
import { RestoreScrollPositonDirective } from '../../directives/restore.scroll.positon.directive';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule, 
    RouterOutlet, 
    ReactiveFormsModule, 
    TimeAgoPipe, 
    RouterLink, 
    NgOptimizedImage,
    NgHttpLoaderModule,
    RestoreScrollPositonDirective
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit{

  book?: BookShowModel;
  bookListView: BookShowListModel[] = [];
  bookListUpdateAt: BookShowListModel[] = [];
  bookListStatus: BookShowListModel[] = [];

  loginModel: LoginModel = new LoginModel();
  test: string | undefined | null;
  addBookForm = new FormGroup({
    title: new FormControl(""),
    description: new FormControl(""),
    coverImage: new FormControl(""),
    authorName: new FormControl(""),
    genreBookCreate: new FormControl("")
  });

  constructor(
    private bookService: BookService,
    private titleService: TitleService,
    private spinner: SpinnerVisibilityService
  ) {}

  ngOnInit(): void {

    this.combineRequests(1);
    
    this.titleService.setTitle("Truyện Mới - Nguồn Cung Cấp Truyện Đa Dạng và Dịch Nhanh");

  }

  combineRequests(page: number): void {
    const booksOrderByViews$ = this.bookService.GetBooksOrderByViewsAt(page);
    const booksOrderByUpdatedAt$ = this.bookService.GetBooksOrderByUpdatedAt(page);
    const booksStatus$ = this.bookService.GetBookStatus(page);
  
    forkJoin({
      booksOrderByViews: booksOrderByViews$,
      booksOrderByUpdatedAt: booksOrderByUpdatedAt$,
      booksStatus: booksStatus$
    }).subscribe({
      next: (results: any) => {
        this.bookListView = results.booksOrderByViews;
        this.bookListUpdateAt = results.booksOrderByUpdatedAt;
        this.bookListStatus = results.booksStatus; 
        this.spinner.hide();
      },
      error: (error) => {
        // Xử lý lỗi nếu cần
        this.spinner.hide();
      }
    });
  }

  SubmitAddBook() {
    this.test = this.addBookForm.value.title;
  }
}
