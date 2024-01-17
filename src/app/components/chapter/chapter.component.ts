import { CommonModule, isPlatformBrowser } from '@angular/common';
import { AfterViewInit, Component, HostListener, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { ChapterShowModel } from '../../models/chapter/chapter.show.model';
import { ChapterService } from '../../services/chapter.service';
import { ActivatedRoute, NavigationEnd, Router, RouterLink } from '@angular/router';
import { DomSanitizer, SafeHtml, Title } from '@angular/platform-browser';
import { DataCrawl } from '../../models/crawl/data.crawl';
import { BookReadingModel } from '../../models/book.reading/book.reading.model';
import { environment } from '../../../environments/environment.development';
import { filter } from 'rxjs';


@Component({
  selector: 'app-chapter',
  standalone: true,
  imports: [
    CommonModule, 
    RouterLink,
  ],
  templateUrl: './chapter.component.html',
  styleUrl: './chapter.component.css'
})
export class ChapterComponent implements OnInit, AfterViewInit{

  chapterModel?: ChapterShowModel;
  bookSlug?: string;
  chapterIndex?: number;
  safeHtml?: SafeHtml;
  checkLoadingSpin = true;
  chineseBookId?: number;
  bookId?: number;

  // crawl
  data: DataCrawl = new DataCrawl();

  // book read
  booksReadLocal: BookReadingModel[] = [];
  bookRead?: BookReadingModel;

  /**
   *
   */
  constructor(
    private chapterService: ChapterService,
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer,
    private router: Router,
    private titleService: Title,
    @Inject(PLATFORM_ID) private platformId: Object,
  ) {}

  ngOnInit(): void {
    this.bookRead = new BookReadingModel();
    this.route.paramMap.subscribe(params => {
      this.bookSlug = params.get('slug')?.toString()!;

      //chineseBookId
      let temp1 = parseInt(params.get('chineseBookId')!);
      if(!isNaN(temp1)) {
        this.chineseBookId = temp1;
        this.data.chineseBookId = temp1!;
      }

      //chineseBookId
      let temp2 = parseInt(params.get('bookId')!);
      if(!isNaN(temp2)) {
        this.bookId = temp2;
        this.data.bookId = temp2!;
      }

      let temp = parseInt(params.get('chapterIndex')!);
      if(!isNaN(temp)) {
        this.chapterIndex = temp;
        this.data.chapterIndex = temp;
      }

      this.getContentChapterCrawl(this.data);
      this.bookRead!.bookId = this.bookId!;
      this.bookRead!.chineseBookId = this.chineseBookId!;
      this.bookRead!.bookSlug = this.bookSlug!;
      
    });
  }

  ngAfterViewInit(): void {
    
    this.router.events.pipe(
      filter(e => e instanceof NavigationEnd)
    ).subscribe(() => {
      if (/^\/truyen\/[^\/]+\/\d+\/\d+\/\d+$/.test(this.router.url)) {
       
        const matchResult = this.router.url.match(/\/(\d+)\/?$/);
        if (matchResult) {
          if (this.bookRead!.chapterIndex === parseInt(matchResult[1])) {
            this.addBookReadLocal();
          }
        }
      }
    });
  }

  // get content chapter
  getContentChapterCrawl(data: DataCrawl) {
    this.checkLoadingSpin = true;
      this.chapterService.getContentChapCrawl(data).subscribe((chap) => {
        this.chapterModel = chap;
        this.safeHtml = this.sanitizer.bypassSecurityTrustHtml(this.chapterModel.content);
        this.checkLoadingSpin = false;
        this.titleService.setTitle("Chương " + chap.chapNumber + ": " + chap.title);

        // bookRead localStorage
        this.bookRead!.bookTitle = this.chapterModel.bookTitle;
        this.bookRead!.chapNumber = this.chapterModel.chapNumber;
        this.bookRead!.chapTitle = this.chapterModel.title;
        this.bookRead!.chapterIndex = this.chapterModel.chapterIndex;
        this.bookRead!.updatedAt = new Date();

        if (isPlatformBrowser(this.platformId)) {
          this.addBookReadLocal();
        }
      
      },
      (error) => {
        this.router.navigate(['/truyen',this.bookSlug]);
      }
    );
  }

  // pre or next page by key
  @HostListener('window:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    // Kiểm tra nút bấm là mũi tên trái hoặc phải
    if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
      this.route.paramMap.subscribe(params => {
        this.bookSlug = params.get('slug')?.toString()!;
        let temp = parseInt(params.get('chapterIndex')!);
        if (!isNaN(temp)) {
          this.chapterIndex = temp;
        }
      });

      if (event.key === 'ArrowLeft') {

        if (this.chapterIndex! <= 1 ) {

          this.router.navigate(['/truyen', this.bookSlug]);

        } else {

          this.router.navigate(['/truyen', this.bookSlug, this.bookId, this.chineseBookId, this.chapterIndex! - 1]);
        }
       
      } else if (event.key === 'ArrowRight') {
        this.router.navigate(['/truyen', this.bookSlug, this.bookId, this.chineseBookId, this.chapterIndex! + 1]);
      }
    }
  } 

  // menu
  menuButton() {
    this.router.navigate(['/truyen/', this.bookSlug]);
  }

  // bookRead localStorage
  addBookReadLocal() {
    const tempBooks = localStorage.getItem(environment.bookReading);
    
    if (tempBooks !== 'null' && tempBooks !== null) {
      this.booksReadLocal = JSON.parse(tempBooks);

      // Kiểm tra xem có sách nào có các thuộc tính giống với sách cần thêm hay không
      const existingBook = this.booksReadLocal.find(book =>
        book.bookId === this.bookRead!.bookId &&
        book.chineseBookId === this.bookRead!.chineseBookId
      );

      if (existingBook) {
        // Nếu đã tồn tại, thực hiện cập nhật
        existingBook.chapNumber = this.bookRead!.chapNumber; // Cập nhật các thuộc tính khác nếu cần
        existingBook.chapTitle = this.bookRead!.chapTitle;
        existingBook.chapterIndex = this.bookRead!.chapterIndex;
        existingBook.updatedAt = new Date();
      } else {
        // Nếu không tồn tại, thực hiện thêm mới
        this.booksReadLocal.push(this.bookRead!);
      }
    } else {
      // Nếu không tồn tại, thực hiện thêm mới
      this.booksReadLocal.push(this.bookRead!);
    }

    // Lưu mảng vào localStorage
    localStorage.setItem(environment.bookReading, JSON.stringify(this.booksReadLocal));
    
  }
}
