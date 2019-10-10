import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ICharacter } from '../character';
import { Subscription } from 'rxjs';
import { CharacterService } from '../character.service';
import { retry } from 'rxjs/operators';

@Component({
  selector: 'app-lines',
  templateUrl: './lines.component.html',
  styleUrls: ['./character.component.css']
})
export class LinesComponent implements OnInit, OnDestroy {
  lines: string[];
  character: ICharacter;
  subscription: Subscription = new Subscription();
  errorMessage: string = '';

  constructor(
    private route: ActivatedRoute,
    private characterService: CharacterService
  ) { }

  ngOnInit() {
    this.route.parent.data.subscribe(data => {
      this.character = data['resolvedData'].character;
    })
    this.lines = this.character.lines;
  }

  addLine(newLine: string): void {
    if (!newLine) {
      return
    }
    if (this.character.lines && this.character.lines.length) {
      this.character.lines = [
        ...this.character.lines,
        newLine
      ];
    } else {
      this.character.lines = [newLine];
    }
    this.subscription.add(this.characterService.updateCharacter(this.character)
      .subscribe({
        error: err => this.errorMessage = err,
        complete: () => this.lines = this.character.lines
      })
    );
  }

  // addLine(newLine: string) {
  //   if (!newLine) {
  //     return
  //   }
  //   if (this.lines && this.lines.length) {
  //     this.lines = [
  //       ...this.lines,
  //       newLine
  //     ];
  //   } else {
  //     this.lines = [newLine];
  //   }

  // }

  deleteLine(oldLine: string) {
    this.character.lines = this.character.lines.filter(line => oldLine !== line);
    console.log(this.character)
    this.subscription.add(this.characterService.updateCharacter(this.character)
      .pipe(
        retry(1)
      )
      .subscribe({
        error: err => this.errorMessage = err,
        complete: () => this.lines = this.character.lines
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    
  }
}
