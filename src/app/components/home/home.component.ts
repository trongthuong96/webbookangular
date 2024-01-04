import { CommonModule, NgOptimizedImage, isPlatformBrowser, isPlatformServer } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID, afterNextRender, afterRender } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterLink, RouterOutlet } from '@angular/router';
import { BookService } from '../../services/book.service';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AccountService } from '../../services/account.service';
import { LoginModel } from '../../models/user/login.model';
import { TimeAgoPipe } from '../../config/time-ago.pipe';
import { BookShowListModel } from '../../models/book/book.list.model';
import BookShowModel from '../../models/book/book.one.model';
import { TitleService } from '../../services/title.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterOutlet, ReactiveFormsModule, TimeAgoPipe, RouterLink, NgOptimizedImage],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit{

  book?: BookShowModel;
  bookListView: BookShowListModel[] = [];
  bookListUpdateAt: BookShowListModel[] = [];
  bookListStatus: BookShowListModel[] = [];
  checkLoadingSpin1 = true;
  checkLoadingSpin2 = true;
  checkLoadingSpin3 = true;

  loginModel: LoginModel = new LoginModel();
  test: string | undefined | null;
  addBookForm = new FormGroup({
    title: new FormControl(""),
    description: new FormControl(""),
    coverImage: new FormControl(""),
    authorName: new FormControl(""),
    genreBookCreate: new FormControl("")
  });

  loginForm = new FormGroup({
    email: new FormControl(""),
    password: new FormControl("")
  })

  constructor(
    private bookService: BookService,
    private accountService: AccountService,
    private titleService: TitleService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    this.GetBooksOrderByViewsAt(1);
    this.GetBooksOrderByUpdatedAt(1);
    this.GetBooksStatus(1);
    
    this.titleService.setTitle("Truyện Mới - Nguồn Cung Cấp Truyện Đa Dạng và Dịch Nhanh");

  }

  // GetBookById(id: number): void {
  //   this.bookService.GetBookById(id).subscribe(book => {
  //     this.book = book;
  //   })
  // }

  GetBooksOrderByViewsAt(page: number): void {
    this.bookService.GetBooksOrderByViewsAt(page).subscribe(books => {
      this.bookListView = books;
      this.checkLoadingSpin1 = false;
    })
  }

  GetBooksOrderByUpdatedAt(page: number): void {
    this.bookService.GetBooksOrderByUpdatedAt(page).subscribe(books => {
      this.bookListUpdateAt = books;
      this.checkLoadingSpin2 = false;
    })
  }

  GetBooksStatus(page: number): void {
    this.bookService.GetBookStatus(page).subscribe(books => {
      this.bookListStatus = books;
      this.checkLoadingSpin3 = false;
    })
  }

  SubmitAddBook() {
    this.test = this.addBookForm.value.title;
    console.log(this.addBookForm.value.title)
  }

  SubmitLogin() {
    this.loginModel.email = this.loginForm.value.email;
    this.loginModel.password = this.loginForm.value.password;
    console.log(this.loginModel);
    this.accountService.login(this.loginModel).subscribe(token => {
      console.log(token);
    })
  }

   //
   reLoadPage() {
    if (isPlatformBrowser(this.platformId)) {
      window.scrollTo(0, 0);
    }
  }
}
