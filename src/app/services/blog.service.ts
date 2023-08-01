import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable, map } from 'rxjs';
import { Blog } from '../models/blog';

@Injectable({
  providedIn: 'root',
})
export class BlogService {
  constructor(private fireStore: AngularFirestore) {}

  // GET: retrieve all contents
  getBlogs(): Observable<Blog[]> {
    return this.fireStore
      .collection<Blog>('Content')
      .snapshotChanges()
      .pipe(
        map((actions) =>
          actions.map((a) => {
            const data = a.payload.doc.data() as Blog;
            const id = a.payload.doc.id;
            return { ...data, id };
          })
        )
      );
  }

  // GET: retrieve content by id
  getBlogById(id: string): Observable<Blog | null> {
    return this.fireStore
      .collection<Blog>('Content')
      .doc(id)
      .get()
      .pipe(
        map((doc) => {
          if (doc.exists) {
            const data = doc.data() as Blog;
            return new Blog(
              id,
              data.title,
              data.img,
              data.content,
              data.author,
              data.date
            );
          } else {
            console.log(
              'Cant find content by id: ' + id + '. Error at service.'
            );
            return null;
          }
        })
      );
  }
}
