import { Component, Input } from '@angular/core';
import { Blog } from '../models/blog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-blog-item',
  templateUrl: './blog-item.component.html',
  styleUrls: ['./blog-item.component.css'],
})
export class BlogItemComponent {
  @Input() blogItem!: Blog;

  constructor(private _router: Router) {}

  viewBlogDetail(f: string) {
    this._router.navigate(['blog/blog-detail', f]);
  }
}
