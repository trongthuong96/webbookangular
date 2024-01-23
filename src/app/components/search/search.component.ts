import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { GenreShowModel } from '../../models/genre/genre.model';
import { GenreService } from '../../services/genre.service';
import { ActivatedRoute, NavigationEnd, Router, RouterLink } from '@angular/router';
import { PaginationComponent } from '../pagination/pagination.component';
import { BookService } from '../../services/book.service';
import { BookTotalPageModel } from '../../models/book/books.totalPage.model';
import { Title } from '@angular/platform-browser';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { SD } from '../../Utility/SD';
import { UriModel } from '../../models/uri/uri.model';
import { filter, fromEvent, take } from 'rxjs';
import { NgHttpLoaderModule, SpinnerVisibilityService } from 'ng-http-loader';
import { RestoreScrollPositonDirective } from '../../directives/restore.scroll.positon.directive';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [
    CommonModule, 
    RouterLink, 
    PaginationComponent, 
    ReactiveFormsModule, 
    NgHttpLoaderModule,
    RestoreScrollPositonDirective
  ],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css'
})
export class SearchComponent implements OnInit, AfterViewInit{

  genre?: GenreShowModel;
  genreValue!: number;
  genreParam?: string;

  //genre localstore
  genres!: GenreShowModel[];

  // book
  booksTotal?: BookTotalPageModel;
  bookParam?: string;

  //page
  currentPage: number = 1;
  totalPages!: number;

  searchForm!: FormGroup;

  // form chapLength
  chapLengthValues = [0, 50, 100, 200, 500];

  // form getALlSearch
  keyword?: string;
  status: number[] = [];
  genreNumber: number = 0;
  chapLength: number = 0;

  /**
   *
   */
  constructor(
    private genreService: GenreService,
    private bookService: BookService,
    private route: ActivatedRoute,
    private router: Router,
    private titleService: Title,
    private spinner: SpinnerVisibilityService
  ) {
     /// Form search
     this.searchForm = new FormGroup({
      keyword: new FormControl(""),
      status: new FormArray([
        new FormControl(false), // Đang ra (0)
        new FormControl(false), // Hoàn thành (1)
        new FormControl(false), // Tạm ngưng (2)
      ]),
      genre: new FormArray([]),
      chapLength: new FormArray([]),
    });
   }

  ngOnInit(): void {

    this.route.queryParams.subscribe(params => {

      // params['the-loai'] sẽ chứa giá trị của query parameter 'the-loai'
      this.genreParam = params['the-loai'];
      this.genreValue = parseInt(this.genreParam!);
      this.currentPage = parseInt(params['page']);
      this.bookParam = params['tu-tim-kiem'];
      this.keyword = params['tu-khoa'];
      this.status = params['trang-thai'];
      this.genreNumber =  params['the-loai.'];
      this.chapLength = params['do-dai-chuong'];

      if(isNaN(this.currentPage)) {
        this.currentPage = 1;
      }

      if ( this.genreParam !== undefined) {
        if(!isNaN(this.genreValue)) {
          this.getBooksByGenreId(this.genreValue, this.currentPage);
        }
      }

      if (this.bookParam !== undefined) {
        this.titleService.setTitle("Danh Sách Truyện");
        this.getBookByTitle(this.bookParam!.trim(), this.currentPage);
      }

      if (this.keyword !== undefined) {
        this.titleService.setTitle("Danh Sách Truyện");
        if (this.status === undefined) {
          this.status = [0, 1, 2];
        }

        this.GetBookSearchAll(this.keyword, this.status, this.genreNumber, this.chapLength, this.currentPage);
      }
      
    });

    if (typeof localStorage !== 'undefined') {
      if (localStorage.getItem("genres_info")) {
        // Đọc dữ liệu từ Local Storage
        var storedGenresData = localStorage.getItem('genres_info');
        this.genres = JSON.parse(storedGenresData!);

        const genreForm =  {id: 0, name: "Tất cả", description: '', bookInGenreDtos: [], totalPages: 0};
        this.genres.unshift(genreForm);

        this.addGenreRadioButtons(this.genres);
      }
    }
   
    this.addChapLengthRadioButtons(this.chapLengthValues);
  }

  ngAfterViewInit(): void {
    this.router.events.pipe(
      filter(e => e instanceof NavigationEnd)
    ).subscribe(() => {
      
      if (this.router.url.includes('/truyen?')) {
        const page = this.router.url.split('?')[1].split('page=')[1];
        //console.log(this.router.url.split('?')[1].split('page='))
        this.currentPage = parseInt(page);
      }
    });
   }

  // get genre by id
  getBooksByGenreId(id: number, page: number) {
    this.genreService.getBooksByGenreId(id, page).subscribe(genre => {
      this.genre = genre;
      if (genre) {
        this.totalPages! = genre!.totalPages;
        this.titleService.setTitle(genre.name);
        this.spinner.hide();
      }
    }, (e) => {
      this.spinner.hide();
    });
  }

  // get book by title
  getBookByTitle(title: string, page: number) {
    this.bookService.GetBookByTitle(title, page).subscribe(bookTotal => {
      this.booksTotal = bookTotal;
      this.totalPages = this.booksTotal.totalPages;
      this.spinner.hide();
    }, (e) => {
      this.spinner.hide();
    });
  }

  // chuyển trang
  handlePageChange(page: number) {
    // Xử lý khi trang thay đổi
    this.currentPage = page;
    // Sử dụng Router để thay đổi URL với query parameter mới
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { page: this.currentPage },
      queryParamsHandling: 'merge',
    });
  }

   // scroll when change page
   scrollChangePage() {
    // Cuộn đến một phần tử cụ thể có id là 'elementId'
    const element = document.getElementById('filter-result');
    if (element) {
      const scroll$ = fromEvent(document, 'scroll').pipe(
        take(1), // Chỉ lắng nghe 1 lần scroll
     );
   
     scroll$.subscribe({
       next: () => {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'auto' });
        });
       }
     })
    }    
  }

  //START STATUS
  getStatusSelection(): number[] {
    const statusArray = this.searchForm.get('status') as FormArray;
    return statusArray.controls
      .map((control, index) => control.value ? index : -1)
      .filter(index => index !== -1);
  }
  

  // Hàm trợ giúp để truy cập FormControl trong FormArray
  getStatusControl(index: number): FormControl {
    return (this.searchForm.get('status') as FormArray).at(index) as FormControl;
  }

  // Hàm trợ giúp để hiển thị văn bản tương ứng với giá trị trạng thái
  getStatusText(status: number): string {
    switch (status) {
      case 0: return 'Đang ra';
      case 1: return 'Hoàn thành';
      case 2: return 'Tạm ngưng';
      default: return '';
    }
  }
  // END STATUS

  // START GENRE
  // Inside your SearchComponent class
  addGenreRadioButtons(genres: GenreShowModel[]) {
   
    const genreFormArray = this.searchForm.get('genre') as FormArray;

    if (genres !== undefined) {
      genres.forEach((genre, index) => {

        let control: FormControl<boolean | null> 
        if(genre.id === 0) {
          control = new FormControl(true);
        } else {
          control = new FormControl(false);
        }

        control.valueChanges.subscribe(() => {
  
          if (control.value) {
            genreFormArray.controls.forEach((otherControl, otherIndex) => {
              if (otherIndex !== index) {
                otherControl.setValue(false, { emitEvent: false });
              }
            });
          }
        });
    
        genreFormArray.push(control);
      });
    }   
  }
  
  
   // Hàm trợ giúp để truy cập FormControl trong FormArray
   getGenreControl(index: number): FormControl {
    return (this.searchForm.get('genre') as FormArray).at(index) as FormControl;
  }

  // chứa mảng index genre
  getGenreSelectionIndex(): number[] {
    const genreArray = this.searchForm.get('genre') as FormArray;
    return genreArray.controls
      .map((control, index) => control.value ? index : -1)
      .filter(index => index !== -1);
  }

  //get genre id
  getGenreSelectionId() {
    const selectedGenreIndexes = this.getGenreSelectionIndex();
    const selectedGenre = selectedGenreIndexes.map(index => this.genres[index].id)[0];
    return selectedGenre;
  }
  // END GENRE

  // START CHAPLENGTH
  // Inside your SearchComponent class
  addChapLengthRadioButtons(chapLengthValues: number[]) {
    const chapLengthFormArray = this.searchForm.get('chapLength') as FormArray;

    chapLengthValues.forEach((chapLength, index) => {

      let control;
      if(chapLength === 0) {
        control = new FormControl(true);
      } else {
        control = new FormControl(false);
      }

      // Đặt sự kiện thay đổi cho FormControl để thực hiện chọn một giá trị duy nhất
      control.valueChanges.subscribe((value) => {
        if (value) {
          // Nếu giá trị hiện tại được chọn, đặt giá trị false cho tất cả các giá trị khác
          chapLengthFormArray.controls.forEach((otherControl, otherIndex) => {
            if (otherIndex !== index) {
              otherControl.setValue(false, { emitEvent: false }); // Đặt emitEvent thành false để tránh gọi sự kiện vô hạn
            }
          });
        }
      });

      chapLengthFormArray.push(control);
    });
  }

  // Hàm trợ giúp để truy cập FormControl trong FormArray
  getChapLengthControl(index: number): FormControl {
    return (this.searchForm.get('chapLength') as FormArray).at(index) as FormControl;
  }

  // Lấy giá trị của giá trị đang được chọn từ mảng chapLength
  getChapLengthSelection(): number | null {
    const selectedChapLengthIndex = this.getChapLengthSelectionIndex();
    return selectedChapLengthIndex.length > 0 ? this.chapLengthValues[selectedChapLengthIndex[0]] : null;
  }

  // Lấy mảng index của giá trị đang được chọn từ mảng chapLength
  getChapLengthSelectionIndex(): number[] {
    const chapLengthArray = this.searchForm.get('chapLength') as FormArray;
    return chapLengthArray.controls
      .map((control, index) => control.value ? index : -1)
      .filter(index => index !== -1);
  }

  
  // Form
  submitSearch(page: number) {
    this.keyword = this.searchForm.value.keyword.trim();
   
    // Điều hướng đến trang '/tim-kiem' với giá trị từ input\
    const checkUrl = SD.isUrl(this.keyword!);

    // Kiểm tra xem có phải là link không, nếu phải thì tải truyện, không phải thì tìm kiếm truyện
    if (checkUrl) {
      var uri = new UriModel();
      uri.uri = this.keyword! ;

      this.searchForm.get('keyword')!.setValue("");

      this.bookService.GetBookAndListChapterCrawl(uri).subscribe((slug) => {
        this.router.navigate([`/truyen/${slug}`]);
      });  
      
    } 
    else {  
      this.status = this.getStatusSelection();
      this.genreNumber = this.getGenreSelectionId();
      this.chapLength = this.getChapLengthSelection()!;

      this.currentPage = page;

      // Sử dụng Router để thay đổi URL với query parameter mới
      this.router.navigate(['/truyen'], {
        relativeTo: this.route,
        queryParams: { 
          'tu-khoa': this.keyword ,
          'trang-thai': this.status,
          'the-loai.': this.genreNumber,
          'do-dai-chuong': this.chapLength,
          page: this.currentPage 
        },
        //queryParamsHandling: 'merge',
      });
      
      // GetBookSearchAll
      this.GetBookSearchAll(this.keyword!, this.status, this.genreNumber, this.chapLength, page);
    
    }
  }

  GetBookSearchAll(keyword: string, status: number[], genre: number, chapLength: number, page: number) {

    // find book
    this.bookService.GetBookSearchAll(keyword, status, genre, chapLength, page).subscribe (book => {
      this.booksTotal = book;
      this.totalPages = this.booksTotal.totalPages;
      this.spinner.hide();
    },
    (e) => {
      this.spinner.hide();
    });
  }
}
