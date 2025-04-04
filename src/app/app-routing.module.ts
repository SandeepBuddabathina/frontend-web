import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VideoCallComponent } from './video-call/video-call.component';

const routes: Routes = [
  { path: 'video-call/:meetingId', component: VideoCallComponent },
  { path: '**', redirectTo: 'video-call/test123' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
