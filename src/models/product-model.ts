export type ProductModel = {
  id: string;
  name: string;
  price: number;
  imgURL: string[];
  describe: string;
  tag: string;
  size: string[];
  color: string[];
  reviews: Reviews;
};

export type ProductDetailModel = {
  id: string;
  name: string;
  price: number;
  imgURL: string;
  describe: string;
  tag: string;
  quantity: number;
  size: string;
  color: string;
  reviews: Reviews;
};

type Reviews = {
  ratingStar: number;
  countReviews: number;
  comments: Comments[];
};

export type Comments = {
  id: number;
  ratingComment: number;
  userName: string;
  dateCreate: string;
  review: string;
};
