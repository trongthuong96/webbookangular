import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, HostListener, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { ChapterShowModel } from '../../models/chapter/chapter.show.model';
import { ChapterService } from '../../services/chapter.service';
import { ActivatedRoute, Router, RouterLink, RouterModule } from '@angular/router';
import { DomSanitizer, SafeHtml, Title } from '@angular/platform-browser';


@Component({
  selector: 'app-chapter',
  standalone: true,
  imports: [
    CommonModule, 
    RouterLink
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
      this.checkLoadingSpin = true;
      this.bookSlug = params.get('slug')?.toString()!;
      let temp = parseInt(params.get('chapterIndex')!);
      if(!isNaN(temp)) {
        this.chapterIndex = temp;
      }
      // get slug
      this.getChapterMeTruyenCV(this.bookSlug, this.chapterIndex!);
    });
  }

  // get by index
  getChapterMeTruyenCV(bookSlug: string, chapterIndex: number) {
    
    this.chapterService.getChapterMeTruyenCV(bookSlug, chapterIndex).subscribe(chap => {  
      this.chapterModel = chap;
      this.safeHtml = this.sanitizer.bypassSecurityTrustHtml(this.chapterModel.content);
      this.checkLoadingSpin = false;
      this.titleService.setTitle("Chương " + chap.chapNumber + ": " + chap.title);
    },
    (error) => {
      // Xử lý lỗi ở đây
      this.router.navigate(['/truyen',bookSlug]);
    })
  }

  // pre or next page by key
  @HostListener('window:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    this.route.paramMap.subscribe(params => {

      this.bookSlug = params.get('slug')?.toString()!;
      let temp = parseInt(params.get('chapterIndex')!);
      if(!isNaN(temp)) {
        this.chapterIndex = temp;
      }
    });
    // Kiểm tra nút bấm là nút trái hoặc phải
    if (event.key === 'ArrowLeft') {
      this.reLoadPage();
      this.router.navigate(['/truyen', this.bookSlug, this.chapterIndex! - 1]);
    } else if (event.key === 'ArrowRight') {
      this.reLoadPage();
      this.router.navigate(['/truyen', this.bookSlug, this.chapterIndex! + 1]);
    }
  }

  reLoadPage() {
    if (isPlatformBrowser(this.platformId)) {
      this.checkLoadingSpin = true;
      window.scrollTo(0, 0);
    }
  }

  menuButton() {
    this.reLoadPage();
    this.router.navigate(['/truyen', this.bookSlug]);
  }
}
