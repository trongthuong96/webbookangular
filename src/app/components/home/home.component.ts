import { CommonModule, NgOptimizedImage, isPlatformBrowser } from '@angular/common';
import { AfterViewInit, Component, Inject, OnInit, PLATFORM_ID, afterNextRender } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterOutlet } from '@angular/router';
import { BookService } from '../../services/book.service';
import { ReactiveFormsModule } from '@angular/forms';
import { TimeAgoPipe } from '../../config/time-ago.pipe';
import { BookShowListModel } from '../../models/book/book.list.model';
import BookShowModel from '../../models/book/book.one.model';
import { TitleService } from '../../services/title.service';
import { filter, forkJoin } from 'rxjs';
import { NgHttpLoaderModule, SpinnerVisibilityService } from 'ng-http-loader';
import { RestoreScrollPositonDirective } from '../../directives/restore.scroll.positon.directive';
import { BookReadingModel } from '../../models/book.reading/book.reading.model';
import { environment } from '../../../environments/environment.development';

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
export class HomeComponent implements OnInit, AfterViewInit{

  book?: BookShowModel;
  bookListView: BookShowListModel[] = [];
  bookListUpdateAt: BookShowListModel[] = [];
  bookListStatus: BookShowListModel[] = [];
   // book read lacalStorage
   bookListRead!: BookReadingModel[];

  constructor(
    private bookService: BookService,
    private titleService: TitleService,
    private spinner: SpinnerVisibilityService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object,
  ) {}

  ngAfterViewInit(): void {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd && this.router.url === '/'))
      .subscribe(() => {
        // Thực hiện các hành động cần thiết khi route thay đổi

        if (isPlatformBrowser(this.platformId)) {
          const booksRead = localStorage.getItem(environment.bookReading);
          if (booksRead) {
            this.bookListRead = JSON.parse(booksRead);
            // Sắp xếp theo giảm dần theo updatedAt
            this.bookListRead.sort((a, b) => {
              const dateA = new Date(a.updatedAt).getTime();
              const dateB = new Date(b.updatedAt).getTime();
              return dateB - dateA;
            });
          }
        }

        this.combineRequests(1);

        setTimeout(() => {
          this.spinner.hide();
        }, 10);
    });
  }

  ngOnInit(): void {

    this.combineRequests(1);

    if (isPlatformBrowser(this.platformId)) {
      const booksRead = localStorage.getItem(environment.bookReading);
      if (booksRead) {
        this.bookListRead = JSON.parse(booksRead);
        this.bookListRead.sort((a, b) => {
          const dateA = new Date(a.updatedAt).getTime();
          const dateB = new Date(b.updatedAt).getTime();
          return dateB - dateA;
        });
      }
    }

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
}
