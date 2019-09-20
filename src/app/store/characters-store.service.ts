import { Injectable } from '@angular/core';
import { ICharacter } from '../characters/character';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';

@Injectable({
  providedIn: 'root'
})
export class CharactersStoreService {
  // - We set the initial state in BehaviorSubject's constructor
  // - Nobody outside the Store should have access to the BehaviorSubject 
  //   because it has the write rights
  // - Writing to state should be handled by specialized Store methods (ex: addCharacter, remo, etc)
  // - Create one BehaviorSubject per store entity, for example if you have Groups
  //   create a new BehaviorSubject for it, as well as the observable$, and getters/setters
  private readonly _characters = new BehaviorSubject<ICharacter[]>([]);

  // Expose the observable$ part of the _characters subject (read only stream)
  readonly characters$ = this._characters.asObservable();

  // the getter will return the last value emitted in _characters subject
  get characters(): ICharacter[] {
    return this._characters.getValue();
  }


  // assigning a value to this.characters will push it onto the observable 
  // and down to all of its subsribers (ex: this.characters = [])
  set characters(val: ICharacter[]) {
    this._characters.next(val);
  }

  addCharacter(newCharacter: ICharacter) {
    // we assign a new copy of  by adding a new character to it 
    this.characters = [
      newCharacter,
      ...this.characters
    ];
  }

  removeCharacter(id: number) {
    this.characters = this.characters.filter(character => character.id !== id);
  }
  constructor() { }
}
