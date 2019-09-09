import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ICharacter } from './character';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CharacterService {
  //mock url
  private url: string = 'http://localhost:8080/api/characters';

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(
    private http: HttpClient
  ) { }

  getCharacters(): Observable<ICharacter[]> {
    return this.http.get<ICharacter[]>(this.url)
      .pipe(
        tap(data => console.log('All characters are loaded! '))
      );
  }

  getCharacter(id: number): Observable<ICharacter> {
    return this.http.get<ICharacter>(`${this.url}/${id}`)
      .pipe(
        tap(data => console.log(`Hero with ${id} is ${JSON.stringify(data)}`))
      );
  }

  addCharacter(character: ICharacter): Observable<ICharacter> {
    return this.http.post<ICharacter>(this.url, character, this.httpOptions)
      .pipe(
        tap(data => console.log(`New character was added w/ id=${data.id}`))
      );
  }

  deleteCharacter(character: ICharacter | number): Observable<ICharacter> {
    const id = typeof character === "number" ? character : character.id;

    return this.http.delete<ICharacter>(`${this.url}/${id}`, this.httpOptions)
      .pipe(
        tap(_ => console.log(`Deleted hero w/ id ${id}`))
      );
  }

  updateCharacter(character: ICharacter): Observable<any> {
    return this.http.put<ICharacter>(this.url, character, this.httpOptions)
      .pipe(
        tap(_ => console.log(`Character with ${character.id} was updated`))
      );
  }
}
