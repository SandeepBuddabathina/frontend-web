// import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
// import { ActivatedRoute } from "@angular/router";
// import { VideoCallService } from "../video-call.service";

// @Component({
//   selector: "app-video-call",
//   templateUrl: "./video-call.component.html",
//   styleUrls: ["./video-call.component.css"],
// })
// export class VideoCallComponent implements OnInit {
//   @ViewChild("localVideo") localVideo!: ElementRef;
//   meetingId!: string;
//   localStream!: MediaStream;
//   remoteStreams: { [key: string]: MediaStream } = {};
//   participants: string[] = [];
//   searchQuery: string = "";
//   videoEnabled: boolean = true;
//   audioEnabled: boolean = true;

//   constructor(
//     private route: ActivatedRoute,
//     private videoCallService: VideoCallService
//   ) {}

//   ngOnInit() {
//     this.meetingId = this.route.snapshot.paramMap.get("meetingId") || "";
//     this.startCall();
//     this.videoCallService.getParticipantUpdates().subscribe((participants) => {
//       this.participants = participants;
//     });
//   }

//   startCall() {
//     this.videoCallService
//       .initLocalStream()
//       .then((stream) => {
//         this.localStream = stream;
//         this.localVideo.nativeElement.srcObject = this.localStream;
//         this.videoCallService.joinRoom(this.meetingId);
//         this.videoCallService.getRemoteStreamsObservable().subscribe((streams) => {
//           this.remoteStreams = streams;
//         });
//       })
//       .catch((error) =>
//         console.error("Error accessing camera/microphone:", error)
//       );
//   }

//   getRemoteStreamKeys(): string[] {
//     return Object.keys(this.remoteStreams);
//   }

//   copyMeetingLink() {
//     const meetingLink = `${window.location.origin}/video-call/${this.meetingId}`;
//     navigator.clipboard.writeText(meetingLink).then(() => {
//       alert("Meeting link copied to clipboard: " + meetingLink);
//     }).catch(err => console.error("Failed to copy link: ", err));
//   }

//   filteredParticipants(): string[] {
//     return this.participants.filter(user => user.toLowerCase().includes(this.searchQuery.toLowerCase()));
//   }

//   toggleVideo() {
//     this.videoEnabled = !this.videoEnabled;
//     this.localStream.getVideoTracks().forEach(track => track.enabled = this.videoEnabled);
//   }

//   toggleAudio() {
//     this.audioEnabled = !this.audioEnabled;
//     this.localStream.getAudioTracks().forEach(track => track.enabled = this.audioEnabled);
//   }
// }
import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { VideoCallService } from "../video-call.service";

@Component({
  selector: "app-video-call",
  templateUrl: "./video-call.component.html",
  styleUrls: ["./video-call.component.css"],
})
export class VideoCallComponent implements OnInit {
  @ViewChild("localVideo") localVideo!: ElementRef;
  meetingId!: string;
  localStream!: MediaStream;
  remoteStreams: { [key: string]: MediaStream } = {};
  participants: string[] = [];
  searchQuery: string = "";
  videoEnabled: boolean = true;
  audioEnabled: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private videoCallService: VideoCallService
  ) {}

  ngOnInit() {
    this.meetingId = this.route.snapshot.paramMap.get("meetingId") || "";
    this.startCall();
    this.videoCallService.getParticipantUpdates().subscribe((participants) => {
      this.participants = participants;
    });
  }

  startCall() {
    this.videoCallService
      .initLocalStream()
      .then((stream) => {
        this.localStream = stream;
        this.localVideo.nativeElement.srcObject = this.localStream;
        this.videoCallService.joinRoom(this.meetingId);
        this.videoCallService.getRemoteStreamsObservable().subscribe((streams) => {
          this.remoteStreams = streams;
        });
      })
      .catch((error) =>
        console.error("Error accessing camera/microphone:", error)
      );
  }

  getRemoteStreamKeys(): string[] {
    return Object.keys(this.remoteStreams);
  }

  copyMeetingLink() {
    const meetingLink = `${window.location.origin}/video-call/${this.meetingId}`;
    navigator.clipboard.writeText(meetingLink).then(() => {
      alert("Meeting link copied to clipboard: " + meetingLink);
    }).catch(err => console.error("Failed to copy link: ", err));
  }

  filteredParticipants(): string[] {
    return this.participants.filter(user => user.toLowerCase().includes(this.searchQuery.toLowerCase()));
  }

  toggleVideo() {
    this.videoEnabled = !this.videoEnabled;
    this.localStream.getVideoTracks().forEach(track => track.enabled = this.videoEnabled);
  }

  toggleAudio() {
    this.audioEnabled = !this.audioEnabled;
    this.localStream.getAudioTracks().forEach(track => track.enabled = this.audioEnabled);
  }

  shareScreen() {
    this.videoCallService.shareScreen();
  }

  leaveMeeting() {
    this.videoCallService.leaveMeeting();
    alert("You have left the meeting.");
    window.location.href = "/";
  }
}
