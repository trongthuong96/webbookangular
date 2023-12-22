import { Routes } from '@angular/router';

export const routes: Routes = [
    { path: '', pathMatch: 'full', redirectTo: 'trang-chu' },
    {
        path: 'trang-chu', loadComponent: () => import('./components/home/home.component')
            .then(mod => mod.HomeComponent),
            data: { reuse: true, title: "Truyện Mới"} 
    },
    {
        path: 'truyen/:slug', loadComponent: () => import('./components/book/book.component')
            .then(mod => mod.BookComponent),
            data: { reuse: true } 
    },
    {
        path: 'truyen/:slug/:chapterIndex', loadComponent: () => import('./components/chapter/chapter.component')
            .then(mod => mod.ChapterComponent),
            data: { reuse: true } 
    },
    {
        path: 'truyen', loadComponent: () => import('./components/search/search.component')
            .then(mod => mod.SearchComponent),
            data: { reuse: true } 
    },
    {
        path: 'notfound', loadComponent: () => import('./components/notfoundpage/notfoundpage.component')
            .then(mod => mod.NotfoundpageComponent),
            data: { reuse: true } 
    },
    {
        path: 'account', loadComponent: () => import('./components/account/account.component')
            .then(mod => mod.AccountComponent),
            data: { reuse: true } 
    },
    {
        path: '**', loadComponent: () => import('./components/notfoundpage/notfoundpage.component')
            .then(mod => mod.NotfoundpageComponent),
            data: { reuse: true } 
    },
   
];
