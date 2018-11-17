import { Component } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  itemsRef: AngularFireList<any>;
  items: Observable<any[]>;

  newItem = '';
  editMsg: boolean = false;
  editId: number;

  constructor(db: AngularFireDatabase) {
    this.itemsRef = db.list('messages');
    // Use snapshotChanges().map() to store the key
    this.items = this.itemsRef.snapshotChanges().pipe(
      map(changes =>
        changes.map(c => ({ key: c.payload.key, ...c.payload.val() }))
      )
    );
  }

  addItem(newName: string) {
    this.itemsRef.push({ text: newName });
    this.newItem = '';
  }

  updateItem(key: string, newText: string) {
    this.itemsRef.update(key, { text: newText });
    this.editMsg = false;
  }

  deleteItem(key: string) {
    this.itemsRef.remove(key);
  }

}
