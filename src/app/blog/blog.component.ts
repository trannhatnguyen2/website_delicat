import { Component, OnInit } from '@angular/core';
import { Blog } from '../models/blog';
import { BlogService } from '../services/blog.service';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.css'],
})
export class BlogComponent implements OnInit {
  blogs: Blog[] = [];
  errMessage: string = '';
  blogsShow: any;

  constructor(private service: BlogService, private _router: Router) {
    this.getBlogs();
  }

  ngOnInit(): void {}

  // get all items in shop
  getBlogs() {
    this.service.getBlogs().subscribe({
      next: (res: any) => {
        this.blogs = res;
        console.log(this.blogs);
        this.sortNewBlog();
      },
      error: (err) => {
        this.errMessage = err;
        console.log('Error occured while fetching file meta data');
      },
    });
  }

  sortNewBlog() {
    this.blogsShow = this.convertDateStringToDate(this.blogs);
    this.blogsShow.sort(
      (a: any, b: any) => b.dateCreated.getTime() - a.dateCreated.getTime()
    );
  }

  convertDateStringToDate(posts: any[]) {
    return posts.map((post) => {
      const date = new Date(Date.parse(post.date));
      return { ...post, dateCreated: date };
    });
  }

  viewBlogDetail(f: string) {
    this._router.navigate(['blog/blog-detail', f]).then(() => {
      location.reload();
    });
  }
}
