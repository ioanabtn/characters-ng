import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-lines',
  templateUrl: './lines.component.html',
  styleUrls: ['./character.component.css']
})
export class LinesComponent implements OnInit {
  lines: string[];

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.lines = this.route.parent.snapshot.data['resolvedData'].character.lines;
  }

  addLine(newLine: string) {
    if (!newLine) {
      return
    }
    if (this.lines && this.lines.length) {
      this.lines = [
        ...this.lines,
        newLine
      ];
    } else {
      this.lines = [newLine];
    }

  }

  deleteLine(oldLine: string) {
    this.lines = this.lines.filter(line => oldLine !== line);
  }
}
