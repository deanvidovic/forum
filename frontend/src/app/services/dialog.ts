import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export interface DialogData {
  type: String,
  message: String,
  show: Boolean
}

@Injectable({
  providedIn: 'root',
})

export class Dialog {
  private dialogSubject = new Subject<DialogData>();
  dialogState$ = this.dialogSubject.asObservable();

  show(message: String, type: String) {
    this.dialogSubject.next({
      message, type, show: true
    })

    setTimeout(() => {
      this.dialogSubject.next({
        message: '',
        type: 'success',
        show: false
      });
    }, 5000);
  }

  
}
