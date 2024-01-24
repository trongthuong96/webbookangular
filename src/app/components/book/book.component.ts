import { Component, OnInit, PLATFORM_ID, Inject, TransferState, AfterViewInit } from '@angular/core';
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

@Component({
  selector: 'app-book',
  standalone: true,
  imports: [
    CommonModule, 
    RouterLink,
    NgHttpLoaderModule,
    RestoreScrollPositonDirective
  ],
  templateUrl: './book.component.html',
  styleUrl: './book.component.css'
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

  /**
   *
   */
  constructor(
    private bookService: BookService,
    private route: ActivatedRoute,
    private router: Router,
    private titleService: TitleService,
    private chapterService: ChapterService,
    private transferState: TransferState,
    @Inject(PLATFORM_ID) private platformId: Object,
    private spinner: SpinnerVisibilityService
  ) 
  {}

  ngOnInit(): void {
    
    // Xử lý khi không có dữ liệu trong state
    this.route.paramMap.subscribe(params => {
      this.slug = params.get('slug')?.toString()!;

      // get slug
      this.GetBookBySlug(this.slug);
      
    });
   
    if (isPlatformBrowser(this.platformId)) {
      // Code chỉ chạy trên trình duyệt
      this.loadDataForBrowser();

      const booksRead = localStorage.getItem(environment.bookReading);
      if (booksRead) {
        this.bookListRead = JSON.parse(booksRead);
      }
    } 
  }

  ngAfterViewInit(): void {
    this.router.events.pipe(
      filter(e => e instanceof NavigationEnd && (this.slug === this.router.url.split('/')[2]) && /^\/truyen\/[^\/]+$/.test(this.router.url)),
      
    ).subscribe(() => {
      if (this.book && this.book.slug === this.slug) {
        this.book.chineseBooks.forEach(e => {
          this.chapterService.getChaptersByChineseBookId(e.id).subscribe((chaps) => {
            if (chaps.length !== 0) {
              this.chapters = chaps;
            } 
          }, (e) => {
            this.spinner.hide();
          });
        });

        setTimeout(() => {
          this.spinner.hide();
        }, 10);
      }    

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
          }
        }
      } 
    });
  }

  private loadDataForBrowser(): void {
    if (typeof localStorage !== 'undefined' && localStorage.getItem("genres_info")) {
      // Đọc dữ liệu từ Local Storage
      const storedGenresData = localStorage.getItem('genres_info');
      this.genres = JSON.parse(storedGenresData!);
    }
  }

  // get id
  // GetBookById(id: number): void {
  //   this.bookService.GetBookById(id).subscribe(book => {
  //     this.book = book;
  //   })
  // }

  // GetChaptersByBookId(bookId: number) {
  //   this.chapterService.getChaptersByBookId(bookId).subscribe((chap) => {
  //     this.chapters = chap;
  //     this.checkLoadingSpinChap = false;
  //   });
  // }

  // get slug
  GetBookBySlug(slug: string) {
    //this.reLoadPage();
    this.bookService.GetBookBySlug(slug).subscribe(
      (book) => {
        this.chapters = [];
        this.reverseCheck = false;
        this.reverse = " ";
        this.book = book;
        
        // chapter list
        this.chineseBookId = book.chineseBooks[0].id;
        //if (isPlatformBrowser(this.platformId)) {

          // chapter list
          this.GetChaptersByChineseBookId(this.chineseBookId);
        //}

        this.titleService.setTitle(this.book!.title);
      },
      (error) => {
        // Xử lý lỗi ở đây
        if (error.status !== 0) {
          this.router.navigate(['notfound']);
        }
      }
    );
  }

  // change color chapter of book reading
  changeColorChapterTitle() {
    if (this.bookRead !== null && this.bookRead !== undefined) {

    }
  }

  //
  reverseChapters() {
    this.reverseCheck = !this.reverseCheck;
    if (this.reverseCheck)
    {
      this.reverse = "flex-row-reverse flex-wrap-reverse";
    } else {
      this.reverse = " ";
    }
  }

  // get chapter by chinese book id
  GetChaptersByChineseBookId(chineseBookId: number) {
    this.chineseBookId = chineseBookId;
    

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
   
    //end book reading

    this.chapterService.getChaptersByChineseBookId(chineseBookId).subscribe((chaps) => {
      if (chaps.length !== 0) {
        this.chapters = chaps;
        this.spinner.hide();
      } 
    }, (e) => {
      this.spinner.hide();
    });
  }


  // GetListChapCrawl
  GetListChapCrawl(bookId: number, chineseBookId: number) {
    var data = new DataChapCrawl();
    data.bookId = bookId;
    data.chineseBookId = chineseBookId;

    this.chapterService.GetListChapCrawl(data).pipe(
      switchMap(() => {
        return this.chapterService.getChaptersByChineseBookId(chineseBookId);
      })
    ).subscribe(
      (chaps) => {
        this.chapters = chaps;
      }
    );
  }

}
