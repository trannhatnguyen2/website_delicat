import { Component, Input, OnInit } from '@angular/core';
import { Comment } from '../models/comment';

@Component({
  selector: 'app-review-detail',
  templateUrl: './review-detail.component.html',
  styleUrls: ['./review-detail.component.css'],
})
export class ReviewDetailComponent implements OnInit {
  @Input() reviewDetail!: Comment;

  ratingStar: number[] = [];

  ratingStarGray: number[] = [];

  constructor() {}

  ngOnInit(): void {
    this.ratingStar = Array(this.reviewDetail!.ratingComment).fill(0);
    this.ratingStarGray = Array(5 - this.ratingStar.length).fill(0);
  }
}
