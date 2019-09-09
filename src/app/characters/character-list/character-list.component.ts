import { Component, OnInit, OnChanges, OnDestroy } from '@angular/core';
import { ICharacter } from '../character';
import { CharacterService } from '../character.service';
import { MatDialog } from '@angular/material';
import { ModalComponent } from 'src/app/modal/modal.component';
import { map } from 'rxjs/operators'
import { CharactersStoreService } from 'src/app/store/characters-store.service';
import { Side } from 'src/app/shared/side';
import { Subscription } from 'rxjs';
import { DeleteConfirmDialogComponent } from 'src/app/modal/delete-confirm-dialog/delete-confirm-dialog.component';

@Component({
  templateUrl: './character-list.component.html',
  styleUrls: ['./character-list.component.css']
})
export class CharacterListComponent implements OnInit, OnDestroy {
  pageTitle: string = 'Character List';
  characters: ICharacter[] = [];
  errorMessage: string = '';
  private sides: any;
  private selectedSide: Side;
  private subscription: Subscription = new Subscription();


  constructor(
    private characterService: CharacterService,
    public dialog: MatDialog,
    public charactersStore: CharactersStoreService
  ) {
    this.sides = [Side[0].toLocaleLowerCase(), Side[1].toLocaleLowerCase()];
  }

  ngOnInit(): void {
    this.subscription.add(this.characterService.getCharacters().subscribe({
      next: characters => {
        this.charactersStore.characters = characters;
      },
      error: err => this.errorMessage = err
    })
    );
  }


  addCharacter(characterName: string): void {
    characterName = characterName.trim();
    if (!characterName) {
      return
    }
    console.log({ name: characterName, side: this.selectedSide })
    this.subscription.add(this.characterService.addCharacter({ name: characterName, side: this.selectedSide } as ICharacter)
      .subscribe({
        next: character => {
          this.charactersStore.addCharacter(character);
          console.log(character);
        },
        error: err => this.errorMessage = err
      })
    );
  }

  deleteCharacter(character: ICharacter): void {
    const dialogRef = this.dialog.open(DeleteConfirmDialogComponent, {
      width: '50%',
      data: { id: character.id, name: character.name, side: character.side }
    });

    this.subscription.add(dialogRef.afterClosed()
      .pipe(
        map(toDeleteCharacter => {
          if (toDeleteCharacter) {
            this.charactersStore.removeCharacter(character.id);
            this.subscription.add(this.characterService.deleteCharacter(character)
              .subscribe({
                error: err => this.errorMessage = err
              })
            );
          }
        })
      ).subscribe({
        error: err => this.errorMessage = err
      })
    );
  }

  openDialog(character: ICharacter): void {
    const dialogRef = this.dialog.open(ModalComponent, {
      width: '50%',
      data: { id: character.id, name: character.name, side: character.side }
    });

    this.subscription.add(dialogRef.afterClosed()
      .pipe(
        map(updatedCharacter => {
          if (updatedCharacter) {
            let index = this.charactersStore.characters.indexOf(character);
            if (~index) {
              this.charactersStore.characters[index] = updatedCharacter;
            }
            this.subscription.add(this.characterService.updateCharacter(updatedCharacter)
              .subscribe({
                error: err => this.errorMessage = err
              })
            );
          }
        })
      ).subscribe({
        error: err => this.errorMessage = err
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
