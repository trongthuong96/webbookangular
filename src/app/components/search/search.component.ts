import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { GenreShowModel } from '../../models/genre/genre.model';
import { GenreService } from '../../services/genre.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { PaginationComponent } from '../pagination/pagination.component';
import { BookService } from '../../services/book.service';
import { BookTotalPageModel } from '../../models/book/books.totalPage.model';
import { Title } from '@angular/platform-browser';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { SD } from '../../Utility/SD';
import { UriModel } from '../../models/uri/uri.model';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [
    CommonModule, 
    RouterLink, 
    PaginationComponent, 
    ReactiveFormsModule, 
  ],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css'
})
export class SearchComponent implements OnInit{

  genre?: GenreShowModel;
  genreValue!: number;
  genreParam?: string;

  //genre localstore
  genres!: GenreShowModel[];

  // book
  booksTotal?: BookTotalPageModel;
  bookParam?: string;

  // form
  keywordParam?: string;

  //page
  currentPage: number = 1;
  totalPages!: number;

  checkLoadingSpin = true;
  searchForm!: FormGroup;

  // form chapLength
  chapLengthValues = [0, 50, 100, 200, 500];

  /**
   *
   */
  constructor(
    private genreService: GenreService,
    private bookService: BookService,
    private route: ActivatedRoute,
    private router: Router,
    private titleService: Title,
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
      this.keywordParam = params['tu-khoa'];;

      if(isNaN(this.currentPage)) {
        this.currentPage = 1;
      }

      if (params['the-loai'] !== undefined) {
        if(!isNaN(this.genreValue)) {
          this.getBooksByGenreId(this.genreValue, this.currentPage);
        }
      }

      if (this.bookParam !== undefined) {
        this.titleService.setTitle("Danh Sách Truyện")
        this.getBookByTitle(this.bookParam!.trim(), this.currentPage);
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

  // get genre by id
  getBooksByGenreId(id: number, page: number) {
    this.genreService.getBooksByGenreId(id, page).subscribe(genre => {
      this.genre = genre;
      if (genre) {
        this.totalPages! = genre!.totalPages;
        this.titleService.setTitle(genre.name);
      }
      this.checkLoadingSpin = false;
    });
  }

  // get book by title
  getBookByTitle(title: string, page: number) {
    this.bookService.GetBookByTitle(title, page).subscribe(bookTotal => {
      this.booksTotal = bookTotal;
      this.totalPages = this.booksTotal.totalPages;
      this.checkLoadingSpin = false;
    });
  }

  // chuyển trang
  handlePageChange(page: number) {
    this.reLoadPage();
    // Xử lý khi trang thay đổi
    this.currentPage = page;

    // Sử dụng Router để thay đổi URL với query parameter mới
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { page: this.currentPage },
      queryParamsHandling: 'merge',
    });

    // Gọi hàm để lấy dữ liệu mới hoặc thực hiện các công việc khác cần thiết
    this.getBooksByGenreId(this.genreValue, page);
  }

   //
   reLoadPage() {
    this.checkLoadingSpin = true;
    window.scrollTo(0,0);
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
    const keyword = this.searchForm.value.keyword.trim();

    // Điều hướng đến trang '/tim-kiem' với giá trị từ input\
    const checkUrl = SD.isUrl(keyword);

    // Kiểm tra xem có phải là link không, nếu phải thì tải truyện, không phải thì tìm kiếm truyện
    if (checkUrl) {
      var uri = new UriModel();
      uri.uri = keyword;

      this.searchForm.get('keyword')!.setValue("");

      this.bookService.GetBookAndListChapterCrawl(uri).subscribe((slug) => {
        this.router.navigate([`/truyen/${slug}`]);
      });  
      
    } 
    else {  
      const status = this.getStatusSelection();
      const genre = this.getGenreSelectionId();
      const chapLength = this.getChapLengthSelection()!;

      this.reLoadPage();
      this.currentPage = page;

      // Sử dụng Router để thay đổi URL với query parameter mới
      this.router.navigate(['/truyen'], {
        relativeTo: this.route,
        queryParams: { 
          'tu-khoa': keyword,
          'trang-thai': status,
          'the-loai.': genre,
          'do-dai-chuong': chapLength,
          page: this.currentPage 
        },
        //queryParamsHandling: 'merge',
      });
    
      this.bookService.GetBookSearchAll(keyword, status, genre, chapLength, page).subscribe (book => {
        this.booksTotal = book;
        this.totalPages = this.booksTotal.totalPages;
        this.checkLoadingSpin = false;
      });
    }
  }
}
