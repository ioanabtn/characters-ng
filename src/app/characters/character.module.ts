import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CharacterListComponent } from './character-list/character-list.component';
import { ModalComponent } from 'src/app/modal/modal.component';
import { DeleteConfirmDialogComponent } from 'src/app/modal/delete-confirm-dialog/delete-confirm-dialog.component';
import { CharacterComponent } from './character/character.component';
import { MaterialModule } from '../material/material.module';
import { CommonModule } from '@angular/common';
import { CharacterResolver } from './character-resolver.service';

const routes = [
    { path: 'characters', component: CharacterListComponent },
    {
        path: 'characters/:id', component: CharacterComponent,
        resolve: { resolvedData: CharacterResolver }
    }
]
@NgModule({
    imports: [
        RouterModule.forChild(routes),
        MaterialModule,
        CommonModule
    ],
    entryComponents: [ModalComponent, DeleteConfirmDialogComponent],
    declarations: [
        CharacterListComponent,
        CharacterComponent,
        ModalComponent,
        DeleteConfirmDialogComponent,
    ]
})
export class CharacterModule { }