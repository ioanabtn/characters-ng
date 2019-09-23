import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CharacterListComponent } from './character-list/character-list.component';
import { ModalComponent } from 'src/app/modal/modal.component';
import { DeleteConfirmDialogComponent } from 'src/app/modal/delete-confirm-dialog/delete-confirm-dialog.component';
import { CharacterComponent } from './character/character.component';
import { MaterialModule } from '../material/material.module';
import { CommonModule } from '@angular/common';
import { CharacterResolver } from './character-resolver.service';
import { BasicInfoComponent } from './character/basic-info.component';
import { LinesComponent } from './character/lines.component';
import { AuthGuard } from '../users/auth.guard';

const routes = [
    { path: 'characters', canActivate: [AuthGuard], component: CharacterListComponent },
    {
        path: 'characters/:id', component: CharacterComponent,
        resolve: { resolvedData: CharacterResolver },
        children: [
            {
                path: '', redirectTo: 'info', pathMatch: 'full'
            },
            {
                path: 'info', component: BasicInfoComponent
            },
            {
                path: 'lines', component: LinesComponent
            }
        ]
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
        BasicInfoComponent,
        LinesComponent
    ]
})
export class CharacterModule { }