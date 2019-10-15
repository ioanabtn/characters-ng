import { Injectable } from "@angular/core";
import { Adapter } from './adapter';
import { ICharacter } from '../characters/character';

@Injectable({
    providedIn: 'root'
})
export class CharacterAdapter implements Adapter<ICharacter> {

    adapt(item: any): ICharacter {
        const adaptee: ICharacter = {
            id: item.id,
            rev: item.value.rev,
            name: item.value.name,
            side: item.value.side,
            lines: item.value.lines ? item.value.lines : []
        }
        console.log(adaptee);
        return adaptee;
    }

    adaptOne(item: any): ICharacter {
        console.log(item);
        const adaptee: ICharacter = {
            id: item._id,
            rev: item._rev,
            name: item.name,
            side: item.side,
            lines: item.lines
        }

        return adaptee;
    }
}