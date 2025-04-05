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
import { ToastrService } from 'ngx-toastr'; // Import ToastrService

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
  signalStrengths: { [key: string]: number } = {};  // Track signal strength for each participant
  connectionStatus: string = "Connecting...";  // Add a default connection status
  searchQuery: string = "";
  videoEnabled: boolean = true;
  audioEnabled: boolean = true;
  showParticipants: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private videoCallService: VideoCallService,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.meetingId = this.route.snapshot.paramMap.get("meetingId") || "";
    this.startCall();
    this.videoCallService.getParticipantUpdates().subscribe((participants) => {
      this.participants = participants;
      // Update signal strengths dynamically for the participants
      this.participants.forEach((userId) => {
        if (!this.signalStrengths[userId]) {
          this.signalStrengths[userId] = 100;  // Initial signal strength for demo
        }
      });
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

          // Update signal strength when remote streams are updated
          Object.keys(this.remoteStreams).forEach((userId) => {
            if (!this.signalStrengths[userId]) {
              this.signalStrengths[userId] = 100;  // Assign initial signal strength
            }
          });
        });

        this.connectionStatus = "Connected";  // Update connection status once connected
      })
      .catch((error) =>
        console.error("Error accessing camera/microphone:", error)
      );
  }

  getRemoteStreamKeys(): string[] {
    return Object.keys(this.remoteStreams);
  }

  // Method to return the connection status (Live, Connecting, or Low Signal)
  getConnectionStatus(userId: string): string {
    const status = this.signalStrengths[userId] || 0;
    if (status > 55) {
      return 'Live';  // Strong signal
    } else if (status > 40) {
      return 'Connecting...';  // Medium signal
    } else {
      return 'Low Signal';  // Weak signal
    }
  }

  // Method to return the CSS class for the signal strength (colored dots)
  getConnectionStatusClass(userId: string): string {
    const status = this.signalStrengths[userId] || 0;
    if (status > 55) {
      return 'bg-green-500';  // Live - green dot
    } else if (status > 40) {
      return 'bg-yellow-500'; // Connecting - yellow dot
    } else {
      return 'bg-red-500';    // Low signal - red dot
    }
  }

  copyMeetingLink() {
    const meetingLink = `${window.location.origin}/video-call/${this.meetingId}`;
    navigator.clipboard.writeText(meetingLink).then(() => {
      this.toastr.success('Meeting link copied to clipboard!', 'Success');
    }).catch(err => {
      this.toastr.error('Failed to copy link.', 'Error');
      console.error("Failed to copy link: ", err);
    });
  }

  filteredParticipants(): string[] {
    return this.participants.filter(user => user.toLowerCase().includes(this.searchQuery.toLowerCase()));
  }

  toggleParticipants() {
    this.showParticipants = !this.showParticipants;
  }

  toggleVideo() {
    this.videoEnabled = !this.videoEnabled;
    this.localStream.getVideoTracks().forEach(track => track.enabled = this.videoEnabled);
    if (this.videoEnabled) {
      this.toastr.info('Video enabled', 'Info');
    } else {
      this.toastr.info('Video disabled', 'Info');
    }
  }

  toggleAudio() {
    this.audioEnabled = !this.audioEnabled;
    this.localStream.getAudioTracks().forEach(track => track.enabled = this.audioEnabled);
    if (this.audioEnabled) {
      this.toastr.info('Audio unmuted', 'Info');
    } else {
      this.toastr.info('Audio muted', 'Info');
    }
  }

  shareScreen() {
    this.videoCallService.shareScreen();
    this.toastr.info('Screen sharing started', 'Info');
  }

  leaveMeeting() {
    this.videoCallService.leaveMeeting();
    this.toastr.success('You have left the meeting.', 'Goodbye');
    window.location.href = "/";
  }

  showTestToastr() {
    this.toastr.success('This is a test toast!', 'Test');
  }

  // Simulate periodic signal strength changes
  simulateSignalStrength() {
    setInterval(() => {
      // Randomly change signal strength for remote participants (for demo purposes)
      this.participants.forEach((userId) => {
        const randomSignal = Math.floor(Math.random() * 101); // Random value between 0-100
        this.signalStrengths[userId] = randomSignal;
      });
    }, 5000); // Update signal strength every 5 seconds
  }
}
