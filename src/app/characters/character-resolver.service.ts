import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { ICharacterResolved } from './character';
import { Observable, of } from 'rxjs';
import { CharacterService } from './character.service';
import { map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class CharacterResolver implements Resolve<ICharacterResolved> {

    constructor(private characterService: CharacterService) { }
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<ICharacterResolved> {
        const id = route.paramMap.get('id');
        if (isNaN(+id)) {
            const msg = `Charater id was not a number: ${id}`;
            console.error(msg);
            return of({ character: null, error: msg });
        }

        return this.characterService.getCharacter(+id)
            .pipe(
                map(character => ({ character: character }))
            );
    }

}