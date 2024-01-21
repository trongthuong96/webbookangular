import { CommonModule, NgOptimizedImage } from '@angular/common';
import { AfterViewInit, Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterOutlet } from '@angular/router';
import { BookService } from '../../services/book.service';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { LoginModel } from '../../models/user/login.model';
import { TimeAgoPipe } from '../../config/time-ago.pipe';
import { BookShowListModel } from '../../models/book/book.list.model';
import BookShowModel from '../../models/book/book.one.model';
import { TitleService } from '../../services/title.service';
import { filter, forkJoin, timeout } from 'rxjs';
import { SwUpdate } from '@angular/service-worker';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterOutlet, ReactiveFormsModule, TimeAgoPipe, RouterLink, NgOptimizedImage],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit, AfterViewInit{

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

  constructor(
    private bookService: BookService,
    private titleService: TitleService,
    private swUpdate: SwUpdate,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {

    this.combineRequests(1);
    
    this.titleService.setTitle("Truyện Mới - Nguồn Cung Cấp Truyện Đa Dạng và Dịch Nhanh");

  }

  ngAfterViewInit(): void {
    this.router.events.pipe(
      filter(e => e instanceof NavigationEnd)
    ).subscribe(() => {
      if (this.router.url === "/") {

        this.combineRequests(1);

        // console.log("check home")

        // if (this.swUpdate.isEnabled) {
        //   this.swUpdate.checkForUpdate().then(() => {
        //     this.swUpdate.activateUpdate().then(() => {
        //       console.log('Update complete.');
        //     });
        //   });      
        // }
       
      }
    });
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
        
        // Đặt các cờ loading ở đây nếu cần
        this.checkLoadingSpin1 = false;
        this.checkLoadingSpin2 = false;
        this.checkLoadingSpin3 = false;    
      },
      error: (error) => {
        // Xử lý lỗi nếu cần
      }
    });
  }

  SubmitAddBook() {
    this.test = this.addBookForm.value.title;
  }
}
