import { Component, OnInit } from '@angular/core';
import { ICharacter } from '../character';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-basic-info',
  templateUrl: './basic-info.component.html',
  styleUrls: ['./character.component.css']
})
export class BasicInfoComponent implements OnInit {
  character: ICharacter;

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.character = this.route.parent.snapshot.data['resolvedData'].character;
  }
}
