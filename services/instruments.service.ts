import { Injectable } from '@angular/core';
import { Sampler, Synth } from 'tone';
import * as Tone from 'tone';

@Injectable({
  providedIn: 'root',
})
export class InstrumentsService {
  constructor() {}

  public makeSynth() {
    let synth = new Tone.Synth({
      oscillator: {
        type: 'sawtooth4',
      },
    }).toDestination()
    return synth;
  }

  public makeSampler() {
    let sampler = new Tone.Sampler({
      urls: {
        C4: 'C4.mp3',
        'D#4': 'Ds4.mp3',
        'F#4': 'Fs4.mp3',
        A4: 'A4.mp3',
      },
      release: 1,
      baseUrl: 'https://tonejs.github.io/audio/salamander/',
    }).toDestination();

    return sampler;
  }
}
