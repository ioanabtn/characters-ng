import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ICharacter } from '../character';
import { CharacterService } from '../character.service';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material';
import { CharactersStoreService } from 'src/app/store/characters-store.service';
import { ModalComponent } from 'src/app/modal/modal.component';
import { map } from 'rxjs/operators';
import { DeleteConfirmDialogComponent } from 'src/app/modal/delete-confirm-dialog/delete-confirm-dialog.component';

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
    // let id = +this.route.snapshot.paramMap.get('id'); or
    this.subscription.add(this.route.paramMap.
      subscribe(params => {
          const id = +params.get('id');
          this.subscription.add(this.characterService.getCharacter(id)
            .subscribe({
              next: character => this.character = character
            })
          );
        })
      );
  }

  onBack(): void {
    this.router.navigate(['/characters']);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  openDialog(character: ICharacter): void {
    const dialogRef = this.dialog.open(ModalComponent, {
      data: { id: character.id, name: character.name, side: character.side }
    });

    this.subscription.add(dialogRef.afterClosed()
      .pipe(
        map(updatedCharacter => {
          if (updatedCharacter) {
            this.character = updatedCharacter;
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

  delete(character: ICharacter): void {
    const dialogRef = this.dialog.open(DeleteConfirmDialogComponent, {
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
            this.onBack();
          }
        })
      ).subscribe({
        error: err => this.errorMessage = err
      })
    );
  }

}
