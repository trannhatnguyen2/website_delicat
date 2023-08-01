import { Component, OnInit } from '@angular/core';
import { BlogService } from '../services/blog.service';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Blog } from '../models/blog';

@Component({
  selector: 'app-blog-detail',
  templateUrl: './blog-detail.component.html',
  styleUrls: ['./blog-detail.component.css'],
})
export class BlogDetailComponent implements OnInit {
  blogDetail!: Blog;
  errMessage: string = '';

  constructor(
    private activateRoute: ActivatedRoute,
    private service: BlogService,
    private _router: Router
  ) {
    activateRoute.paramMap.subscribe((param) => {
      let id = param.get('id');

      if (id != null) {
        this.getBlogById(id);
      }
    });
  }

  ngOnInit(): void {
    // Xử lý sự kiện chuyển trang
    this._router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        window.scrollTo(0, 0);
      }
    });
  }

  getBlogById(id: any) {
    this.service.getBlogById(id).subscribe({
      next: (res: any) => {
        this.blogDetail = res;
      },
      error: (err) => {
        this.errMessage = err;
        console.log('Error occured while fetching file meta data');
      },
    });
  }

  viewBlog() {
    this._router.navigate(['blog']);
  }
}
