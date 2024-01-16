import { Component, OnInit, PLATFORM_ID, Inject, TransferState, ChangeDetectionStrategy } from '@angular/core';
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
import { filter, switchMap } from 'rxjs';
import { BookReadingModel } from '../../models/book.reading/book.reading.model';
import { environment } from '../../../environments/environment.development';

@Component({
  selector: 'app-book',
  standalone: true,
  imports: [
    CommonModule, 
    RouterLink
  ],
  templateUrl: './book.component.html',
  styleUrl: './book.component.css'
})
export class BookComponent implements OnInit{
  book?: BookShowModel;
  bookByAuthor?: BookShowListModel[];
  bookByUser?: BookShowListModel[];
  slug!: string;
  chapters?: ChapterShowModel[];

  // css
  reverseCheck = false;
  reverse = " ";
  checkLoadingSpin = true;
  checkLoadingSpinChap = true;

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
    @Inject(PLATFORM_ID) private platformId: Object
  ) 
  {}

  ngOnInit(): void {
    
    // Xử lý khi không có dữ liệu trong state
    this.route.paramMap.subscribe(params => {
      this.checkLoadingSpin = true;
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
        this.checkLoadingSpin = false;
        
        // chapter list
        this.chineseBookId = book.chineseBooks[0].id;
        if (isPlatformBrowser(this.platformId)) {

          // chapter list
          this.GetChaptersByChineseBookId(this.chineseBookId);
        }

        this.titleService.setTitle(this.book!.title);
        this.GetBookAuthor(book.author.id!, 1);
        this.GetBookUser(book.applicationUser.id!, 1);

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

  //Book/Author/2?page=1
  GetBookAuthor(authorId: number, page: number) {
    this.bookService.GetBookAuthor(authorId, page).subscribe(book => {
      this.bookByAuthor = book;
    })
  }

  //Book/User/2?page=1
  GetBookUser(userId: string, page: number) {
    this.bookService.GetBookUser(userId, page).subscribe(book => {
      this.bookByUser = book;
    })
  }

  // get chapter by chinese book id
  GetChaptersByChineseBookId(chineseBookId: number) {
    this.checkLoadingSpinChap = true;
    this.chineseBookId = chineseBookId;
    

    //start book reading
    this.bookRead = undefined;

    // Kiểm tra xem có sách nào có các thuộc tính giống với sách cần thêm hay không
    const existingBook = this.bookListRead.find(bookRead =>
      bookRead.bookId === this.book!.id &&
      bookRead.chineseBookId === chineseBookId
    );

    if (existingBook) {
      this.bookRead = existingBook;
    }
    //end book reading

    this.chapterService.getChaptersByChineseBookId(chineseBookId).subscribe((chaps) => {
      if (chaps.length !== 0) {
        this.chapters = chaps;
    } 
      
      this.checkLoadingSpinChap = false;
    });
  }


  // GetListChapCrawl
  GetListChapCrawl(bookId: number, chineseBookId: number) {
    var data = new DataChapCrawl();
    data.bookId = bookId;
    data.chineseBookId = chineseBookId;
    this.checkLoadingSpinChap = true;

    this.chapterService.GetListChapCrawl(data).pipe(
      switchMap(() => {
        return this.chapterService.getChaptersByChineseBookId(chineseBookId);
      })
    ).subscribe(
      (chaps) => {
        this.chapters = chaps;
        this.checkLoadingSpinChap = false;
      },
      (error) => {
        this.checkLoadingSpinChap = false;
        // Xử lý lỗi
      }
    );
  }

  // 
  // reLoadPage() {
  //   if (isPlatformBrowser(this.platformId)) {
  //     window.scrollTo(0, 0);
  //   }
  // }
}
