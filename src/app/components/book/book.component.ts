import { Component, OnInit, PLATFORM_ID, Inject, TransferState, afterRender, afterNextRender } from '@angular/core';
import { isPlatformBrowser, isPlatformServer } from '@angular/common';
import { BookService } from '../../services/book.service';
import BookShowModel from '../../models/book/book.one.model';
import { ActivatedRoute, Router, RouterLink, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { GenreShowModel } from '../../models/genre/genre.model';
import { TitleService } from '../../services/title.service';
import { BookShowListModel } from '../../models/book/book.list.model';
import { UriModel } from '../../models/uri/uri.model';
import { ChapterService } from '../../services/chapter.service';
import { ChapterShowModel } from '../../models/chapter/chapter.show.model';

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

  /**
   *
   */
  constructor(
    private bookService: BookService,
    private route: ActivatedRoute,
    private router: Router,
    private titleService: TitleService,
    private chapterService: ChapterService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) 
  {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      // params['the-loai'] sẽ chứa giá trị của query parameter 'the-loai'
      this.uriValue = params['uri'];
       // Kiểm tra xem có dữ liệu trong state hay không
      if (this.uriValue != undefined && this.uriValue != null) {
        this.checkLoadingSpin = true;
        this.reLoadPage();
        this.uri = new UriModel();
        this.uri.uri = this.uriValue;
        this.GetBookCrawlUri(this.uri);
      } else {
        // Xử lý khi không có dữ liệu trong state
        this.route.paramMap.subscribe(params => {
          this.checkLoadingSpin = true;
          this.reLoadPage();
          this.slug = params.get('slug')?.toString()!;

          // get slug
          this.GetBookBySlug(this.slug);
        });
      }
    });
   
    if (isPlatformBrowser(this.platformId)) {
      // Code chỉ chạy trên trình duyệt
      this.loadDataForBrowser();
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
  GetBookById(id: number): void {
    this.bookService.GetBookById(id).subscribe(book => {
      this.book = book;
    })
  }

  GetChaptersByBookId(bookId: number) {
    this.chapterService.getChaptersByBookId(bookId).subscribe((chap) => {
      this.chapters = chap;
      this.checkLoadingSpinChap = false;
    });
  }

  // get slug
  GetBookBySlug(slug: string) {
    this.bookService.GetBookBySlug(slug).subscribe(
      (book) => {
        // Xử lý kết quả thành công ở đây
        this.chapters = [];
        this.checkLoadingSpinChap = true;
        this.book = book;
        this.checkLoadingSpin = false;
        this.GetChaptersByBookId(this.book?.id!);
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

  // crawling book
  GetBookCrawlUri(uri: UriModel) {
    this.bookService.GetBookCrawlUri(uri).subscribe((book) => {
      this.book = book;
      this.checkLoadingSpin = false;
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
    )
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

  // 
  reLoadPage() {
    if (isPlatformBrowser(this.platformId)) {
      window.scrollTo(0, 0);
    }
  }
}
