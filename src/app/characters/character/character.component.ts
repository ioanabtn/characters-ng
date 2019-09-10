import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ICharacter } from '../character';
import { CharacterService } from '../character.service';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material';
import { CharactersStoreService } from 'src/app/store/characters-store.service';
import { ModalComponent } from 'src/app/modal/modal.component';
import { map } from 'rxjs/operators';

@Component({
  templateUrl: './character.component.html',
  styleUrls: ['./character.component.css']
})
export class CharacterComponent implements OnInit, OnDestroy {
  pageTitle: string ='Character details';
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
    let id = +this.route.snapshot.paramMap.get('id');
    this.subscription.add(this.characterService.getCharacter(id)
      .subscribe({
        next: character => this.character = character
      })
    );
  }

  onBack(): void {
    this.router.navigate(['/products']);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
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
   
}
