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
import { ActivatedRoute } from '@angular/router';

@Component({
  templateUrl: './character-list.component.html',
  styleUrls: ['./character-list.component.css']
})
export class CharacterListComponent implements OnInit, OnDestroy {
  pageTitle: string = 'Character List';
  errorMessage: string = '';
  sides: any;
  selectedSide: Side;
  subscription: Subscription = new Subscription();

  _listFilter: string = '';
  get listFilter(): string {
    return this._listFilter;
  }

  set listFilter(value: string) {
    this._listFilter = value;
    this.filteredCharacters = this.listFilter ? this.performFilter(this.listFilter) : this.charactersStore.characters;
  }

  filteredCharacters: ICharacter[] = [];

  constructor(
    private characterService: CharacterService,
    public dialog: MatDialog,
    public charactersStore: CharactersStoreService,
    private route: ActivatedRoute
  ) {
    this.sides = [Side[0].toLocaleLowerCase(), Side[1].toLocaleLowerCase()];
  }

  ngOnInit(): void {
    this.listFilter = this.route.snapshot.queryParamMap.get('filterBy') || '';

    this.subscription.add(this.characterService.getCharacters().subscribe({
      next: characters => {
        this.charactersStore.characters = characters;
        this.filteredCharacters = this.performFilter(this.listFilter);
      },
      error: err => this.errorMessage = err
    })
    );
  }

  performFilter(filterBy: string): ICharacter[] {
    filterBy = filterBy.toLocaleLowerCase();
    return this.charactersStore.characters.filter((character: ICharacter) =>
      character.name.toLocaleLowerCase().indexOf(filterBy) !== -1);
  }

  addCharacter(characterName: string): void {
    characterName = characterName.trim();
    if (!characterName) {
      return
    }
    this.subscription.add(this.characterService.addCharacter({ name: characterName, side: this.selectedSide } as ICharacter)
      .subscribe({
        next: character => {
          this.subscription.add(this.characterService.getCharacters().subscribe({
            next: characters => {
              this.charactersStore.characters = characters;
              this.filteredCharacters = this.performFilter(this.listFilter);
            },
            error: err => this.errorMessage = err
          }));
        },
        error: err => this.errorMessage = err
      })
    );
  }

  deleteCharacter(character: ICharacter): void {
    const dialogRef = this.dialog.open(DeleteConfirmDialogComponent, {
      data: { id: character.id, rev: character.rev, name: character.name, side: character.side }
    });

    this.subscription.add(dialogRef.afterClosed()
      .pipe(
        map(toDeleteCharacter => {
          if (toDeleteCharacter) {
            this.charactersStore.removeCharacter(character.id);
            this.filteredCharacters = this.performFilter(this.listFilter);
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
      data: { id: character.id, rev: character.rev, name: character.name, side: character.side, lines: character.lines }
    });
    this.subscription.add(dialogRef.afterClosed()
      .pipe(
        map(updatedCharacter => {
          if (updatedCharacter.name && updatedCharacter.side) {
            let index = this.charactersStore.characters.indexOf(character);
            let indexFiltered = this.filteredCharacters.indexOf(character);
            if (~index) {
              this.charactersStore.characters[index] = updatedCharacter;
              this.filteredCharacters[indexFiltered] = updatedCharacter;
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
