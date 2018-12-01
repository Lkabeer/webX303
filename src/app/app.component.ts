import { Component, ViewChild, ElementRef } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  @ViewChild('updateText') updateText: ElementRef;

  itemsRef: AngularFireList<any>;
  items$: Observable<any[]>;

  newItem: string = '';
  editMember: boolean = false;
  editId: number;

  constructor(public db: AngularFireDatabase) {
    this.itemsRef = db.list('/messages');
    this.loadMembers(false);
  }

  addItem(newName: string) {
    this.itemsRef.push({ text: newName });
    this.newItem = '';
  }

  editItem(i) {
    this.editMember = true;
    this.editId = i;
    setTimeout( () => this.updateText.nativeElement.focus());
  }

  updateItem(key: string, newText: string) {
    this.itemsRef.update(key, { text: newText });
    this.editMember = false;
  }

  deleteItem(key: string) {
    if(confirm('R u sure u wanna delete this?!'))
      this.itemsRef.remove(key);
  }

  loadMembers(filterX) {
    // Use snapshotChanges().map() to store the key
    this.items$ = this.itemsRef.snapshotChanges().pipe(
      map(changes => {
        //filter Members X-Team 
        changes = (filterX) ?
          changes.filter(changes => changes.payload.val().text.toLowerCase().includes(filterX.toLowerCase())) :
          changes;
        // Sort Alphabetical X-Team
        changes = changes.sort((a, b) => a.payload.val().text.toLowerCase() < b.payload.val().text.toLowerCase() ? -1 : 1);
        // key and value X-Team
        return changes.map(c => ({ key: c.payload.key, ...c.payload.val() }))
      })
    );
  }

  test() {
    console.log('test');
  }

}