import { Component, Inject, OnInit, PLATFORM_ID, TransferState, afterNextRender, makeStateKey } from '@angular/core';
import { CommonModule, isPlatformBrowser, isPlatformServer } from '@angular/common';
import { NavigationEnd, NavigationExtras, Router, RouterLink, RouterOutlet } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { GenreService } from './services/genre.service';
import { GenreShowModel } from './models/genre/genre.model';
import { FormsModule } from '@angular/forms';
import { SD } from './Utility/SD';
import { BookService } from './services/book.service';
import { UriModel } from './models/uri/uri.model';
import { CsrfTokenService } from './services/csrf-token.service';
import { SignatureService } from './services/signature.service';
import { filter } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, HomeComponent, RouterLink, FormsModule],
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
  token = "";
  /**
   *
   */
  constructor(
    private genreService: GenreService,
    private bookService: BookService,
    private router: Router,
    private csrfTokenService: CsrfTokenService,
    private signatureService: SignatureService,
    @Inject(PLATFORM_ID) private platformId: Object,
  ) {
    afterNextRender(() => {
      this.csrfTokenService.refreshCsrfToken().subscribe(async (reponse) => {
        this.csrfTokenService.setCsrfToken(await this.signatureService.decryptAESAsync(reponse.token));
      });
      router.events.pipe(
        filter(e => e instanceof NavigationEnd)
     ).subscribe(() => {
        window.scrollTo(0, 0);
     });
    });
  }

  ngOnInit(): void {

    if (isPlatformBrowser(this.platformId) && typeof localStorage !== 'undefined') {
      if (localStorage.getItem('darkLight') === "dark-theme") {
        this.darkLight = "dark-theme";
        this.checked = true;
      } 
    }

    this.getGenres();
    // //const sitemap = this.sitemapService.generateSitemap();
   
  }

  // get genres
  getGenres() {
    if (isPlatformBrowser(this.platformId) && typeof localStorage !== 'undefined') {
      if(localStorage.getItem("genres_info")){
          // Đọc dữ liệu từ Local Storage
          var storedGenresData = localStorage.getItem('genres_info');
          this.genreListModel = JSON.parse(storedGenresData!);
      } else {
        this.genreService.getGenres().subscribe( genres => {
          this.genreListModel = genres;
          localStorage.setItem("genres_info", JSON.stringify(this.genreListModel));
        })
      }
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
      this.router.navigate(['/truyen'], { queryParams: { 'tu-tim-kiem': this.value } });     
    }
    this.value = "";
  }
}
