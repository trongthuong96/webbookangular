import { Routes } from '@angular/router';

export const routes: Routes = [
   // { path: '', pathMatch: 'full', redirectTo: 'trang-chu' },
    {
        path: '',
        loadComponent: () => import('./components/home/home.component')
            .then(mod => mod.HomeComponent),
        data: { reuse: true, title: "Truyện Mới - Nguồn Cung Cấp Truyện Đa Dạng và Dịch Nhanh"} 
    },
    {
        path: 'truyen/:slug', loadComponent: () => import('./components/book/book.component')
            .then(mod => mod.BookComponent),
            data: { reuse: true } 
    },
    {
        path: 'truyen/:slug/:bookId/:chineseBookId/:chapterIndex', loadComponent: () => import('./components/chapter/chapter.component')
            .then(mod => mod.ChapterComponent),
           // data: { reuse: true } 
    },
    {
        path: 'truyen', loadComponent: () => import('./components/search/search.component')
            .then(mod => mod.SearchComponent),
            data: { reuse: true } 
    },
    {
        path: 'nguon-nhung', loadComponent: () => import('./components/embeddable.website/embeddable.website.component')
            .then(mod => mod.EmbeddableWebsiteComponent),
            data: { reuse: true } 
    },
    {
        path: 'notfound', loadComponent: () => import('./components/notfoundpage/notfoundpage.component')
            .then(mod => mod.NotfoundpageComponent),
            // data: { reuse: true } 
    },
    {
        path: 'tai-khoan/thong-tin', loadComponent: () => import('./components/user.profile/user.profile.component')
            .then(mod => mod.UserProfileComponent),
            data: { reuse: true } 
    },
    {
        path: '**', loadComponent: () => import('./components/notfoundpage/notfoundpage.component')
            .then(mod => mod.NotfoundpageComponent),
           // data: { reuse: true } 
    },
   
];
