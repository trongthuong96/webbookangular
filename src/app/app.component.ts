import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { NavigationExtras, Router, RouterLink, RouterOutlet } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { GenreService } from './services/genre.service';
import { GenreShowModel } from './models/genre/genre.model';
import { FormsModule } from '@angular/forms';
import { SD } from './Utility/SD';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, HomeComponent, RouterLink, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css' 
})
export class AppComponent implements OnInit{
  title = "Truyện Mới"

  genreListModel: GenreShowModel[] = [];
  darkLight = "";
  checked = false;
  
  // search
  value: string = '';
  /**
   *
   */
  constructor(
    private genreService: GenreService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object,
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId) && typeof localStorage !== 'undefined') {
      if (localStorage.getItem('darkLight') === "dark-theme") {
        this.darkLight = "dark-theme";
        this.checked = true;
      } 
    }
    this.getGenres();
  }

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

    if (checkUrl) {

      const slug = SD.extractSlugFromUrl(this.value);
  
      this.router.navigate([`/truyen/${slug}`], { queryParams: { 'uri': this.value } });
      this.value = "";
    } 
    else {
      this.router.navigate(['/truyen'], { queryParams: { 'tu-tim-kiem': this.value } });
      this.value = "";
    }
  }
}
