import { Component, Inject, OnInit, PLATFORM_ID, afterNextRender, makeStateKey } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { GenreService } from './services/genre.service';
import { GenreShowModel } from './models/genre/genre.model';
import { FormsModule } from '@angular/forms';
import { SD } from './Utility/SD';
import { BookService } from './services/book.service';
import { UriModel } from './models/uri/uri.model';
import { AccountComponent } from './components/account/account.component';
import { environment } from '../environments/environment.development';
import { SignatureService } from './services/signature.service';
import { CsrfTokenService } from './services/csrf-token.service';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, HomeComponent, RouterLink, FormsModule, AccountComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css' 
})
export class AppComponent implements OnInit{
  title = "Truyện Mới - Nguồn Cung Cấp Truyện Đa Dạng và Dịch Nhanh"

  genreListModel: GenreShowModel[] = [];
  darkLight = "";
  checked = false;
  cookieKey = makeStateKey<string>('cookie-data');
  cookie = "";
  
  // search
  value: string = "";

  // csrf token
  csrfTokenKey = makeStateKey<string>('csrfToken');

  /**
   *
   */
  constructor(
    private genreService: GenreService,
    private bookService: BookService,
    private router: Router,
    private csrfTokenService: CsrfTokenService,
    private signatureService: SignatureService,
    private cookieService: CookieService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
   
    afterNextRender(() => {
        // csrf token
      this.csrfTokenService.refreshCsrfToken().subscribe(async (reponse) => {
        this.csrfTokenService.setCsrfToken(await this.signatureService.decryptAESAsync(reponse.token));
      });

      // book reading
      if (this.cookieService.check(environment.UserCookie)) {
        const bookRead = localStorage.getItem(environment.bookReading);
        if (bookRead === undefined || bookRead === null) {
         setTimeout(() => {
           this.GetBookReadingsByUserId();
         }, 1000);
       }
      }
    });
  }

  ngOnInit(): void {
    // const timestamp = 1705293871.042;
    // const date = new Date(timestamp * 1000); // Convert from seconds to milliseconds
    // console.log(date.toLocaleString()); // Display the date in a readable format

    // const dateString = "2056-01-20T12:30:00"; // Thay thế chuỗi này bằng ngày cụ thể bạn muốn chuyển đổi
    // const date = new Date(dateString);
    // const timestamp = date.getTime() / 1000; // Chia cho 1000 để chuyển từ mili giây sang giây
    // console.log(timestamp);

    
    if (isPlatformBrowser(this.platformId)) {

      this.getGenres();

      if (localStorage.getItem('darkLight') === "dark-theme") {
        this.darkLight = "dark-theme";
        this.checked = true;
      } 
    }

    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('message', (event) => {
        // Xử lý phản hồi từ Service Worker
        if (event.data.type === 'fetchResponse') {
          console.log('Phản hồi từ Service Worker:', event.data.data);
        }
      });
    }

    // //const sitemap = this.sitemapService.generateSitemap();
   
  }

  // get genres
  getGenres() {
    const storedGenresData = localStorage.getItem('genres_info');
    if ( storedGenresData !== null && storedGenresData !== undefined && storedGenresData !== '') {
      // Đọc dữ liệu từ Local Storage
      this.genreListModel = JSON.parse(storedGenresData);
    } else {
      setTimeout(() => {
        this.genreService.getGenres().subscribe(genres => {
          this.genreListModel = genres;
          localStorage.setItem("genres_info", JSON.stringify(this.genreListModel));
        });
      }, 1000)
    }
  }

  // dark or light
  turnOnOrOffDarkLight() {
    if (this.darkLight === "") {
      this.darkLight = "dark-theme";
      localStorage.setItem('darkLight', 'dark-theme');
      this.checked = true;
    } else {
      this.darkLight = "";
      localStorage.setItem('darkLight', '');
    }
  }

  // tim kiem
  search() {
    // Điều hướng đến trang '/tim-kiem' với giá trị từ input\
    const checkUrl = SD.isUrl(this.value);

    // Kiểm tra xem có phải là link không, nếu phải thì tải truyện, không phải thì tìm kiếm truyện
    if (checkUrl) {
      var uri = new UriModel();
      uri.uri = this.value;

      this.bookService.GetBookAndListChapterCrawl(uri).subscribe((slug) => {
        this.router.navigate([`/truyen/${slug}`]);
      });      
    } 
    else {
      this.router.navigate(['/truyen'], { queryParams: { 'tu-tim-kiem': this.value, 'page': 1 } });     
    }
    this.value = "";
  }

  // book reading
  GetBookReadingsByUserId() {
    this.bookService.GetBookReadingsByUserId().subscribe((bookList) => {
      localStorage.setItem(environment.bookReading,  JSON.stringify(bookList));
    })
  }
}
