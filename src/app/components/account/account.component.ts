import { Component, OnInit } from '@angular/core';
import { ServerModule } from '@angular/platform-server';
import BookShowModel from '../../models/book/book.one.model';
import { BookService } from '../../services/book.service';
import { CommonModule } from '@angular/common';
import { CommonEngine } from '@angular/ssr';

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [],
  templateUrl: './account.component.html',
  styleUrl: './account.component.css'
})
export class AccountComponent implements OnInit{

  book?: BookShowModel;


  constructor(
    private bookService: BookService
  ){}

  ngOnInit(): void {
    this.GetBookById(1);
  }

  // get id
  GetBookById(id: number): void {
    this.bookService.GetBookById(id).subscribe(book => {
      this.book = book;
    })
  }
}
