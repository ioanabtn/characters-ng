import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ICharacter } from '../character';
import { CharacterService } from '../character.service';
import { Subscription } from 'rxjs';

@Component({
  templateUrl: './character.component.html',
  styleUrls: ['./character.component.css']
})
export class CharacterComponent implements OnInit, OnDestroy {
  pageTitle: string ='Character details';
  character: ICharacter;
  private subscription: Subscription = new Subscription();
  
  constructor(
    private route: ActivatedRoute,
    private characterService: CharacterService,
    private router: Router) { }

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
   
}
