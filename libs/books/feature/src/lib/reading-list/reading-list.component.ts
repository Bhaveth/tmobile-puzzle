import { Component, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { getReadingList, removeFromReadingList, addToReadingList, confirmedRemoveFromReadingList } from '@tmo/books/data-access';
import {MatSnackBar} from '@angular/material/snack-bar';
import { ReadingListItem } from '@tmo/shared/models';
import { Actions, ofType } from '@ngrx/effects';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'tmo-reading-list',
  templateUrl: './reading-list.component.html',
  styleUrls: ['./reading-list.component.scss']
})
export class ReadingListComponent implements OnDestroy{
  readingList$ = this.store.select(getReadingList);
  destroyed$ = new Subject<boolean>();

  constructor(private readonly store: Store,  private _snackBar: MatSnackBar, private action$: Actions) {
    action$.pipe(
      ofType(confirmedRemoveFromReadingList),
      takeUntil(this.destroyed$)
   )
   .subscribe((data) => {
      this.openSnackBar(data.item);
   });
  }

  removeFromReadingList(item) {
    this.store.dispatch(removeFromReadingList({ item }));
  }

  openSnackBar(item: ReadingListItem) {
    let snackBarRef = this._snackBar.open('Book removed from reading list', 'Undo', {
      duration: 2000,
    });

    snackBarRef.onAction().subscribe(() => {
      const book = {id: item.bookId, ...item};
      this.store.dispatch(addToReadingList({ book }));
    });
  }

  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}
