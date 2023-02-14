import { AfterContentChecked, Component, OnChanges, OnInit } from '@angular/core';
import { InstrumentsService } from 'src/services/instruments.service';
import * as Tone from 'tone';
import { Synth } from 'tone';

export interface Row {
  note: string;
  isActive: boolean;
  id: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnChanges, AfterContentChecked {
  public notes = ['F4', 'Eb4', 'C4', 'Bb3', 'Ab3', 'F3',];
  public rows: Row[][] = [];
  public synths: Synth[] = [];
  public playing = false;
  public started = false;
  public grid = this.makeGrid(this.notes);
  public rowIndex!: number;
  public noteIndex!: number;
  public bpm = 120;
  public beat = 0;

  constructor(private instrumentsService: InstrumentsService) {}

  ngOnChanges() {
    this.changeBpm(this.bpm.toString())
  }

  ngAfterContentChecked(): void {
    console.log(this.bpm)
  }

  public makeSynths(count: number) {
    for (let i = 0; i < count; i++) {
      // Make an array of synths
      let synth = this.instrumentsService.makeSynth();
      this.synths.push(synth);
    }

    return this.synths;
  }

  public makeGrid(notes: string[]) {
    for (const note of notes) {
      const row = [];
      for (let i = 0; i < 8; i++) {
        row.push({
          note: note,
          isActive: false,
          id: i + note,
        });
      }
      this.rows.push(row);
    }
    // we now have 6 rows each containing 8 eighth notes
    return this.rows;
  }

  public configLoop() {
    const synths = this.makeSynths(6);

    const repeat = (time: number) => {
      this.grid.forEach((row, index) => {
        let synth = synths[index];
        let note = row[this.beat];
        if (note.isActive) {
          synth.triggerAttackRelease(note.note, '8n', time);
          console.log(synth.get())
        }
      });

      this.beat = (this.beat + 1) % 8;
    };

    Tone.Transport.bpm.value = this.bpm;
    Tone.Transport.scheduleRepeat(repeat, '8n');
  }

  public configPlayButton() {
    if (!this.started) {
      Tone.start();
      Tone.getDestination().volume.rampTo(-10, 0.001);
      this.configLoop();
      this.started = !this.started;
    }

    if (this.playing) {
      Tone.Transport.stop();
      this.playing = false;
      this.started = !this.started;
    } else {
      Tone.Transport.start();
      this.playing = true;
    }
  }

  handleNoteClick(clickedRowIndex: number, clickedNoteIndex: number) {
    this.rowIndex = clickedRowIndex;
    this.noteIndex = clickedNoteIndex;
    // iterating through the grid
    this.rows.forEach((row, rowIndex) => {
      // iterate through each note in current row
      row.forEach((note, noteIndex) => {
        if (clickedRowIndex === rowIndex && clickedNoteIndex === noteIndex) {
          note.isActive = !note.isActive;
        }
      });
    });
  }

  changeBpm(bpm: string) {
    this.bpm = +bpm;
  }
}
