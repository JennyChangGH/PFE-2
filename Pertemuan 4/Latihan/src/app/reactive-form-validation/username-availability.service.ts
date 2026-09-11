import { Injectable } from '@angular/core';
import { AbstractControl, AsyncValidator, ValidationErrors } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { catchError, delay, map } from 'rxjs/operators';

const TAKEN_USERNAMES = ['admin', 'root', 'jenny'];

@Injectable({ providedIn: 'root' })
export class UsernameAvailabilityValidator implements AsyncValidator {
  validate(control: AbstractControl): Observable<ValidationErrors | null> {
    const username = (control.value ?? '').toLowerCase();
    return of(TAKEN_USERNAMES.includes(username)).pipe(
      delay(600),
      map((isTaken) => (isTaken ? { usernameTaken: true } : null)),
      catchError(() => of(null)),
    );
  }
}
