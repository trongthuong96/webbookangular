import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, HostListener, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { ChapterShowModel } from '../../models/chapter/chapter.show.model';
import { ChapterService } from '../../services/chapter.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { DomSanitizer, SafeHtml, Title } from '@angular/platform-browser';
import { DataCrawl } from '../../models/crawl/data.crawl';


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
export class ChapterComponent implements OnInit{

  chapterModel?: ChapterShowModel;
  bookSlug?: string;
  chapterIndex?: number;
  safeHtml?: SafeHtml;
  checkLoadingSpin = true;
  chineseBookId?: number;

  // crawl
  data: DataCrawl = new DataCrawl();

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

    this.route.paramMap.subscribe(params => {
      this.bookSlug = params.get('slug')?.toString()!;

      //chineseBookId
      let temp1 = parseInt(params.get('chineseBookId')!);
      if(!isNaN(temp1)) {
        this.chineseBookId = temp1;
        this.data.chineseBookId = temp1!;
      }

      let temp = parseInt(params.get('chapterIndex')!);
      if(!isNaN(temp)) {
        this.chapterIndex = temp;
        this.data.chapterIndex = temp;
      }

      this.getContentChapterCrawl(this.data);
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

          this.router.navigate(['/truyen', this.bookSlug, this.chineseBookId, this.chapterIndex! - 1]);
        }
       
      } else if (event.key === 'ArrowRight') {
        this.router.navigate(['/truyen', this.bookSlug, this.chineseBookId, this.chapterIndex! + 1]);
      }
    }
  }

  menuButton() {
    this.router.navigate(['/truyen/', this.bookSlug]);
  }
}
