import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ICharacter } from './character';
import { tap, map } from 'rxjs/operators';

import { CharacterAdapter } from '../shared/character.adapter';

@Injectable({
  providedIn: 'root'
})
export class CharacterService {
  private baseUrl: string = 'http://localhost:3000/api/characters';

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(
    private http: HttpClient,
    private adapter: CharacterAdapter
  ) { }

  getCharacters(): Observable<ICharacter[]> {
    const url = `${this.baseUrl}/`;
    return this.http.get(url).pipe(
      map((data: any[]) => 
        data.map((item: any) => this.adapter.adapt(item))),
      tap(data => console.log(`Data is in fe: ${data}`))
    )
  }

  getCharacter(id: string): Observable<ICharacter> {
    return this.http.get(`${this.baseUrl}/${id}/`)
      .pipe(
        map((data: any) => 
          this.adapter.adaptOne(data)
        ),
        tap(data => console.log(`Character with ${id} is ${JSON.stringify(data)}`))
      );
  }

  addCharacter(character: ICharacter): Observable<ICharacter> {
    const url = `${this.baseUrl}/`;
    return this.http.post(url, character, this.httpOptions)
      .pipe(
        map((data: any) => 
        this.adapter.adaptOne(data)
      ),
        tap(data => console.log(`New character was added w/ id=${data.id}`))
      );
  }

  deleteCharacter(character: ICharacter): Observable<ICharacter> {
    const id = character.id;
    const rev = character.rev;

  return this.http.delete<ICharacter>(`${this.baseUrl}/${id}/${rev}`, this.httpOptions)
      .pipe(
        tap(_ => console.log(`Deleted hero w/ id ${id}`))
      );
  }

  updateCharacter(character: ICharacter): Observable<any> {
    const id = character.id;
    const rev = character.rev;
    
    return this.http.put<ICharacter>(`${this.baseUrl}/${id}/${rev}`, character, this.httpOptions)
      .pipe(
        tap(_ => console.log(`Character with ${character.id} was updated`))
      );
  }
}
