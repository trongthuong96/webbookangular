import { Component, OnInit, PLATFORM_ID, Inject, AfterViewInit } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BookService } from '../../services/book.service';
import BookShowModel from '../../models/book/book.one.model';
import { ActivatedRoute, NavigationEnd, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { GenreShowModel } from '../../models/genre/genre.model';
import { TitleService } from '../../services/title.service';
import { BookShowListModel } from '../../models/book/book.list.model';
import { UriModel } from '../../models/uri/uri.model';
import { ChapterService } from '../../services/chapter.service';
import { ChapterShowModel } from '../../models/chapter/chapter.show.model';
import { DataChapCrawl } from '../../models/crawl/data.chap.crawl';
import { filter, fromEvent, switchMap, take } from 'rxjs';
import { BookReadingModel } from '../../models/book.reading/book.reading.model';
import { environment } from '../../../environments/environment.development';
import { NgHttpLoaderModule, SpinnerVisibilityService } from 'ng-http-loader';
import { RestoreScrollPositonDirective } from '../../directives/restore.scroll.positon.directive';
import { PaginationComponent } from '../pagination/pagination.component';
import { CookieService } from 'ngx-cookie-service';
import { CommentService } from '../../services/comment.service';
import { CommentModel } from '../../models/comment/comment.momel';
import { TimeAgoPipe } from '../../config/time-ago.pipe';
import { CommentComponent } from '../comment/comment.component';
import { RatingComponent } from '../rating/rating.component';

@Component({
  selector: 'app-book',
  standalone: true,
  imports: [
    CommonModule, 
    RouterLink,
    NgHttpLoaderModule,
    RestoreScrollPositonDirective,
    PaginationComponent,
    TimeAgoPipe,
    CommentComponent,
    RatingComponent
  ],
  templateUrl: './book.component.html',
  styleUrl: './book.component.css',
})
export class BookComponent implements OnInit, AfterViewInit{
  book?: BookShowModel;
  bookByAuthor?: BookShowListModel[];
  bookByUser?: BookShowListModel[];
  slug!: string;
  chapters?: ChapterShowModel[];

  // css
  reverseCheck = false;
  reverse = " ";

  // value body crawling
  uriValue?: string;
  uri!: UriModel;

  //genre localstore
  genres?: GenreShowModel[];

  // chinese book id
  chineseBookId?: number;

  // book read lacalStorage
  bookListRead!: BookReadingModel[];
  bookRead?: BookReadingModel;

  // panigate
  currentPage: number = 1;
  totalPages!: number;
  arrange: number = 0;

  checkUserExist: boolean = this.cookieService.check(environment.UserCookie);

  commentsParent?: CommentModel[];
  
  /**
   *
   */
  constructor(
    private bookService: BookService,
    private route: ActivatedRoute,
    private router: Router,
    private titleService: TitleService,
    private chapterService: ChapterService,
    private cookieService: CookieService,
    @Inject(PLATFORM_ID) private platformId: Object,
    private spinner: SpinnerVisibilityService,
    private commentService: CommentService
  ) 
  {}

  ngOnInit(): void {

    this.route.queryParams.subscribe(params => {

      const page = parseInt(params['page']);
      const arrange = parseInt(params['arrange']);

      if (isNaN(page)) {
        this.currentPage = 1;
      } else {
        this.currentPage = page;
      }

      if (isNaN(arrange)) {
        this.arrange = 0;
      } else {
        this.arrange = arrange;
      }

      if (this.arrange === 0) {
        this.reverseCheck = false;
      } else {
        this.reverseCheck = true;
      }
      
      if (this.chineseBookId) {
        this.spinner.show();
        this.GetChapterByChineseBookIdSingle(this.chineseBookId!, page, this.arrange);
      }
    });
    
    // Xử lý khi không có dữ liệu trong state
    this.route.paramMap.subscribe(params => {
      this.slug = params.get('slug')?.toString()!;

      // get slug
      this.GetBookBySlug(this.slug, this.currentPage, this.arrange);
      
    });
   
    if (isPlatformBrowser(this.platformId)) {
      
      if (this.checkUserExist) {
        environment.bookReading = "bookReadingExistUser";
      }
  
      // book read
      const booksRead = localStorage.getItem(environment.bookReading);
      if (booksRead) {
        this.bookListRead = JSON.parse(booksRead);
      }
    } 
  }

  ngAfterViewInit(): void {

    const segments = this.router.url.split('/')[2].split('?');
    const slug = segments.length >= 2 ? segments[0] : segments[0];

    this.router.events.pipe(

      filter(e => e instanceof NavigationEnd && (this.slug === slug) && /^\/truyen\/[^\/]+$/.test(this.router.url)),
      
    ).subscribe(() => {

      this.titleService.setTitle(this.book!.title);

      const booksRead = localStorage.getItem(environment.bookReading);
      if (booksRead) {
        this.bookListRead = JSON.parse(booksRead);
        if (this.bookListRead) {
          // Kiểm tra xem có sách nào có các thuộc tính giống với sách cần thêm hay không
          const existingBook = this.bookListRead.find(bookRead =>
            bookRead.bookId === this.book!.id &&
            bookRead.chineseBookId === this.chineseBookId
          );
    
          if (existingBook) {
            this.bookRead = existingBook;
          } else {
            this.bookRead = undefined;
          }
        }
      } 
    });
  }

  // get slug
  GetBookBySlug(slug: string, page: number, arrange: number) {
    //this.reLoadPage();
    this.bookService.GetBookBySlug(slug).subscribe({
      next: (book) => {
        this.chapters = [];
        this.reverse = " ";
        this.book = book;
        
        // chapter list
        this.chineseBookId = book.chineseBooks[0].id;
        //if (isPlatformBrowser(this.platformId)) {
    
          // chapter list
          this.GetChaptersByChineseBookId(this.chineseBookId, page, arrange);
        //}
    
        this.titleService.setTitle(this.book!.title);
      },
      error: (error) => {
        // Xử lý lỗi ở đây
        if (error.status !== 0) {
          this.router.navigate(['notfound']);
        }
      }
    });
  }

  // change color chapter of book reading
  changeColorChapterTitle() {
    if (this.bookRead !== null && this.bookRead !== undefined) {

    }
  }

  //
  reverseChapters() {
    this.reverseCheck = !this.reverseCheck;

    this.currentPage = 1;

    if (this.reverseCheck)
    {
      this.arrange = 1;
      if (this.chineseBookId) {
        this.spinner.show();
        this.GetChapterByChineseBookIdSingle(this.chineseBookId!, 1, 1);
      }
    } else {
      this.arrange = 0;
      if (this.chineseBookId) {
        this.spinner.show();
        this.GetChapterByChineseBookIdSingle(this.chineseBookId!, 1, 0);
      }
    }

    // Sử dụng Router để thay đổi URL với query parameter mới
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { page: this.currentPage, arrange: this.arrange },
      replaceUrl: true
     // queryParamsHandling: 'merge',
    });
  }

  // find book read
  GetBookRead(chineseBookId: number) {
    //start book reading
    this.bookRead = undefined;

    if (this.bookListRead) {
      // Kiểm tra xem có sách nào có các thuộc tính giống với sách cần thêm hay không
      const existingBook = this.bookListRead.find(bookRead =>
        bookRead.bookId === this.book!.id &&
        bookRead.chineseBookId === chineseBookId
      );

      if (existingBook) {
        this.bookRead = existingBook;
      }
    }
  }

  // get chapter by chinese book id
  GetChaptersByChineseBookId(chineseBookId: number, page: number, arrange: number) {

    this.GetBookRead(chineseBookId);

    this.GetChapterByChineseBookIdSingle(chineseBookId, page, arrange);
  }

  // single list chapter by chinese book id
  GetChapterByChineseBookIdSingle(chineseBookId: number, page: number, arrange: number) {

    this.chineseBookId = chineseBookId;

    this.chapterService.getChaptersByChineseBookId(chineseBookId, page, arrange).subscribe({
      next: (chaps) => {
        if (chaps.chapters.length !== 0) {
          this.chapters = chaps.chapters;
          this.totalPages = chaps.total;
          this.spinner.hide();
        }
      },
      error: (e) => {
        this.spinner.hide();
      }
    });
  }


  // GetListChapCrawl
  GetListChapCrawl(bookId: number, chineseBookId: number, page: number, arrange:number) {
    var data = new DataChapCrawl();
    data.bookId = bookId;
    data.chineseBookId = chineseBookId;

    this.currentPage = page;
    this.arrange = arrange;

    // Sử dụng Router để thay đổi URL với query parameter mới
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { page: this.currentPage, arrange: this.arrange },
     // queryParamsHandling: 'merge',
    });

    this.chapterService.GetListChapCrawl(data).pipe(
      switchMap(() => {
        return this.chapterService.getChaptersByChineseBookId(chineseBookId, page, arrange);
      })
    ).subscribe(
      (chaps) => {
        this.chapters = chaps.chapters;
        this.totalPages = chaps.total;
      }
    );
  }

  // panigate
   // chuyển trang
   handlePageChange(page: number) {
    // Xử lý khi trang thay đổi
    this.currentPage = page;
    // Sử dụng Router để thay đổi URL với query parameter mới
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { page: this.currentPage, arrange: this.arrange},
      queryParamsHandling: 'merge',
      replaceUrl: true
    });
  }

   // scroll when change page
   scrollChangePage() {
    // Cuộn đến một phần tử cụ thể có id là 'elementId'
    const element = document.getElementById('chapListScroll');
    if (element) {
      const scroll$ = fromEvent(document, 'scroll').pipe(
        take(1), // Chỉ lắng nghe 1 lần scroll
     );
   
     scroll$.subscribe({
       next: () => {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'auto' });
        });
       }
     })
    }    
  }

  
  pageCommentsParend = 1;
  totalCommentParent: number = 0;

  // Comment parent
  getCommentsParent(bookId: number, page: number, pageSize: number) {
    this.commentService.getCommentsParent(bookId, page, pageSize).subscribe({
      next: (response) => {
        this.commentsParent = response.comments;
        this.totalCommentParent = response.totalPage;
        this.pageCommentsParend = 1;
        this.pageCommentsParend += 1;
      }
    });
  }
}
