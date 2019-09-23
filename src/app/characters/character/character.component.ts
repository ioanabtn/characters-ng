import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ICharacter, ICharacterResolved } from '../character';
import { CharacterService } from '../character.service';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material';
import { CharactersStoreService } from 'src/app/store/characters-store.service';
import { ModalComponent } from 'src/app/modal/modal.component';
import { map } from 'rxjs/operators';
import { DeleteConfirmDialogComponent } from 'src/app/modal/delete-confirm-dialog/delete-confirm-dialog.component';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

@Component({
  templateUrl: './character.component.html',
  styleUrls: ['./character.component.css']
})
export class CharacterComponent implements OnInit, OnDestroy {
  pageTitle: string = 'Character details';
  character: ICharacter;
  private subscription: Subscription = new Subscription();
  errorMessage: string = '';

  constructor(
    private route: ActivatedRoute,
    private characterService: CharacterService,
    private router: Router,
    public dialog: MatDialog,
    public charactersStore: CharactersStoreService) { }

  ngOnInit(): void {
    this.route.data.subscribe(
      data => {
        const resolvedData: ICharacterResolved = data['resolvedData'];
        this.onCharacterRetrieved(resolvedData.character);
      }
    )
  }

  onCharacterRetrieved(character: ICharacter): void {
    this.character = character;

    if (this.character) {
      this.pageTitle += `: ${this.character.name}`;
    }
  }

  onBack(): void {
    this.router.navigate(['/characters']);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  delete(character: ICharacter): void {
    const dialogRef = this.dialog.open(DeleteConfirmDialogComponent, {
      data: { id: character.id, name: character.name }
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
            this.onBack();
          }
        })
      ).subscribe({
        error: err => this.errorMessage = err
      })
    );
  }
}
