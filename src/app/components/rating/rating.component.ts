import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, Input, OnInit, QueryList, ViewChildren } from '@angular/core';
import { RatingService } from '../../services/rating.service';
import { RatingCreateModel } from '../../models/rating/rating.create.model';
import { RatingModel } from '../../models/rating/rating.model';
import { CookieService } from 'ngx-cookie-service';
import { environment } from '../../../environments/environment.development';
import { RatingAvgModel } from '../../models/rating/rating.avg.model';

@Component({
  selector: 'app-rating',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './rating.component.html',
  styleUrl: './rating.component.css'
})
export class RatingComponent implements OnInit, AfterViewInit {
  @ViewChildren('starsContainer', { read: ElementRef }) starsContainer!: QueryList<ElementRef>;

  reviewContent: string = ''; // Biến để lưu nội dung đánh giá

  stars = [
    { value: 1, title: "Không Còn gì để nói" },
    { value: 2, title: "Dở" },
    { value: 3, title: "Không Hay" },
    { value: 4, title: "Không Hay Lắm" },
    { value: 5, title: "Bình Thường" },
    { value: 6, title: "Tạm Thôi" },
    { value: 7, title: "Ổn Đấy" },
    { value: 8, title: "Hay" },
    { value: 9, title: "Rất Hay" },
    { value: 10, title: "Tuyệt Vời Luôn!" }
  ];

  // check user
  checkUserExist: boolean = this.cookieService.check(environment.UserCookie);

  ratingCreate!: RatingCreateModel;
  rating!: RatingModel;
  ratingAvg!: RatingAvgModel;

  @Input() bookId: number = 0;

  constructor(
    private ratingService: RatingService,
    private cookieService: CookieService
  ) {}

  ngOnInit(): void {
    if (this.bookId > 0) {
      this.getRatingAvg(this.bookId);
    }
  }

  ngAfterViewInit(): void {
    this.starsContainer.changes.subscribe(() => {
      this.initStars();
    });
  }

  initStars(): void {
    if (this.starsContainer && this.starsContainer.first) {
      const stars = this.starsContainer.first.nativeElement.querySelectorAll('.star');

      stars.forEach((star: HTMLElement, index: number) => {
        star.addEventListener('mouseover', () => this.onMouseOver(this.stars[index]));
        star.addEventListener('mouseout', () => this.onMouseOut(this.stars[index]));
        star.addEventListener('click', () => this.onClick(this.stars[index]));
      });
    }
  }

  onMouseOver(star: any): void {
    const stars = this.starsContainer.first.nativeElement.querySelectorAll('.star');

    stars.forEach((s: HTMLElement) => {
      s.classList.replace('vote-active', 'vote-active1');
    });

    for (let i = 0; i < star.value; i++) {
      stars[i].classList.add('vote-hover');
    }
  }

  onMouseOut(star: any): void {
    const stars = this.starsContainer.first.nativeElement.querySelectorAll('.star');

    stars.forEach((s: HTMLElement) => {
      s.classList.remove('vote-hover');
      s.classList.replace('vote-active1', 'vote-active');
    });

    for (let i = 0; i < star.value; i++) {
      if (stars[i].classList.contains('vote-active1')) {
        stars[i].classList.add('vote-hover');
      }
    }
  }

  onClick(star: any): void {
    //const stars = this.starsContainer.first.nativeElement.querySelectorAll('.star');

    // stars.forEach((s: HTMLElement) => {
    //   s.classList.remove('vote-active1');
    // });

    // for (let i = 0; i < star.value; i++) {
    //   stars[i].classList.add('vote-active1');
    // }

    if (!this.checkUserExist) {
      alert('Đăng nhập để đánh giá truyện!');
      return;
    }

    // Hiển thị hộp thoại alert và nhập nội dung đánh giá
    const reviewContent = window.prompt(`Bạn đã chọn đánh giá ${star.value}/10. Nhập nội dung đánh giá:`);
    if (reviewContent !== null) {
      this.reviewContent = reviewContent;

      this.ratingCreate = new RatingCreateModel();

      if (this.bookId === 0) {
        return;
      }

      this.ratingCreate.bookId = this.bookId;
      this.ratingCreate.content = this.reviewContent;
      this.ratingCreate.ratingValue = star.value;

      this.addRating(this.ratingCreate);
    }
  }

  // add rating
  addRating(ratingCreate: RatingCreateModel) {
    this.ratingService.addRating(ratingCreate).subscribe({
      next: (response) => {
        this.rating = response;
        alert('Đánh giá thành công!');
        this.getRatingAvg(this.bookId);
      },

      error: (e) => {
        console.log(e.error)
        if (e.error === "User rated") {
          alert('Bạn đã đánh giá truyện này rồi!');
        }
      }
    });
  }

  // get rating avg
  getRatingAvg(bookId: number) {
    this.ratingService.getRatingAvg(bookId).subscribe({
      next: (response) => {
        this.ratingAvg = response;
      }
    });
  }
}