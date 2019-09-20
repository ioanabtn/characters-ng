import { Side } from '../shared/side';

export interface ICharacter {
    id: number;
    name: string;
    side: Side;
    lines: string[];
}

export interface ICharacterResolved {
    character: ICharacter;
    error?: any; //optional error
}