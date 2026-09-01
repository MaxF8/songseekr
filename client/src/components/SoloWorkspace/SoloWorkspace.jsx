import { useEffect, useMemo, useRef, useState } from "react";

import { PentatonicShapes } from "../PracticeDiagrams/PracticeDiagrams";
import SoloFretboard, {
  notesForPitchClasses,
} from "./SoloFretboard";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
  describeKey,
  getDiatonicHarmony,
  getPentatonicPitchClasses,
  getScaleFretboardNotes,
} from "../../utils/music";

const MAX_PROGRESSION_CHORDS = 10;
const LABEL_MODES = [
  { label: "Notes", value: "notes" },
  { label: "Dots", value: "dots" },
  { label: "Degrees", value: "degrees" },
];

function SegmentedControl({ label, onChange, options, value }) {
  return (
    <div className="solo-segmented" role="group" aria-label={label}>
      {options.map((option) => (
        <Button
          className="solo-segmented__button"
          key={option.value}
          variant="outline"
          aria-pressed={value === option.value}
          onClick={() => onChange(option.value)}
        >
          {option.label}
        </Button>
      ))}
    </div>
  );
}

function TempoTrainer({ tempo }) {
  const songTempo = Number.isFinite(tempo) ? Math.round(tempo) : 100;
  const [bpm, setBpm] = useState(songTempo);
  const [playing, setPlaying] = useState(false);
  const audioContextRef = useRef(null);

  useEffect(() => {
    if (!playing || !audioContextRef.current) return undefined;

    const context = audioContextRef.current;
    const tick = () => {
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      oscillator.frequency.value = 880;
      gain.gain.setValueAtTime(0.0001, context.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.16, context.currentTime + 0.005);
      gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 0.06);
      oscillator.connect(gain);
      gain.connect(context.destination);
      oscillator.start();
      oscillator.stop(context.currentTime + 0.07);
    };

    tick();
    const intervalId = window.setInterval(tick, 60000 / bpm);
    return () => window.clearInterval(intervalId);
  }, [bpm, playing]);

  useEffect(() => () => {
    audioContextRef.current?.close();
  }, []);

  const toggleMetronome = async () => {
    if (!playing) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      audioContextRef.current ||= new AudioContext();
      await audioContextRef.current.resume();
    }
    setPlaying((current) => !current);
  };

  const updateBpm = (value) => {
    const nextBpm = Math.min(240, Math.max(35, Number(value) || 35));
    setBpm(nextBpm);
  };

  return (
    <section className="solo-card tempo-trainer" aria-labelledby="tempo-heading">
        <div className="solo-card__heading">
          <p className="eyebrow">Timing</p>
          <h3 id="tempo-heading">Tempo trainer</h3>
          <p>Set a tempo and practice with a steady click.</p>
      </div>
      <div className="tempo-trainer__controls">
        <label htmlFor="solo-bpm">BPM</label>
        <Input
          className="tempo-trainer__bpm"
          id="solo-bpm"
          type="number"
          min="35"
          max="240"
          inputMode="numeric"
          value={bpm}
          onChange={(event) => updateBpm(event.target.value)}
        />
        <input
          className="tempo-trainer__range"
          type="range"
          min="35"
          max="240"
          aria-label="Metronome tempo"
          value={bpm}
          onChange={(event) => updateBpm(event.target.value)}
        />
        <Button
          className="tempo-trainer__song-tempo"
          variant="outline"
          onClick={() => setBpm(songTempo)}
        >
          Song tempo
        </Button>
        <Button className="tempo-trainer__toggle" onClick={toggleMetronome}>
          {playing ? "Stop" : "Start"}
        </Button>
      </div>
      {!Number.isFinite(tempo) ? (
        <p className="solo-card__note">Spotify did not provide a tempo, so 100 BPM is the editable starting point.</p>
      ) : null}
    </section>
  );
}

function useChordPreview() {
  const audioContextRef = useRef(null);
  const activeOscillatorsRef = useRef(new Set());
  const mutedRef = useRef(false);
  const [muted, setMuted] = useState(false);
  const stopActiveOscillators = () => {
    activeOscillatorsRef.current.forEach((oscillator) => {
      try {
        oscillator.stop();
      } catch {
        // An oscillator may already have reached its scheduled stop time.
      }
    });
    activeOscillatorsRef.current.clear();
  };

  useEffect(() => () => {
    stopActiveOscillators();
    audioContextRef.current?.close();
  }, []);

  const playChord = async (chord) => {
    if (mutedRef.current) return;
    const chordTones = chord?.tones?.slice(0, 3);
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext || chordTones?.length < 3) return;

    audioContextRef.current ||= new AudioContext();
    const context = audioContextRef.current;
    await context.resume();

    const startTime = context.currentTime;
    let previousMidi = null;

    chordTones.forEach((tone) => {
      let midi = 48 + tone.pitchClass;
      while (previousMidi !== null && midi <= previousMidi) midi += 12;
      previousMidi = midi;

      const oscillator = context.createOscillator();
      const gain = context.createGain();
      oscillator.type = "triangle";
      oscillator.frequency.value = 440 * (2 ** ((midi - 69) / 12));
      gain.gain.setValueAtTime(0.0001, startTime);
      gain.gain.exponentialRampToValueAtTime(0.045, startTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 1);
      oscillator.connect(gain);
      gain.connect(context.destination);
      oscillator.start(startTime);
      oscillator.stop(startTime + 1.02);
      activeOscillatorsRef.current.add(oscillator);
      window.setTimeout(() => activeOscillatorsRef.current.delete(oscillator), 1100);
    });
  };

  const toggleMute = () => {
    const nextMuted = !mutedRef.current;
    mutedRef.current = nextMuted;
    setMuted(nextMuted);
    if (nextMuted) stopActiveOscillators();
  };

  return { muted, playChord, toggleMute };
}

export default function SoloWorkspace({ audioFeature }) {
  const harmony = useMemo(() => getDiatonicHarmony(audioFeature), [audioFeature]);
  const { muted, playChord, toggleMute } = useChordPreview();
  const scaleNotes = useMemo(
    () => getScaleFretboardNotes(audioFeature, 1, 17),
    [audioFeature]
  );
  const [progression, setProgression] = useState([]);
  const [selectedStep, setSelectedStep] = useState(0);
  const [labelMode, setLabelMode] = useState("notes");
  const [fretboardMode, setFretboardMode] = useState("pentatonic");
  const activeStep = Math.min(selectedStep, Math.max(0, progression.length - 1));

  const addChord = (chord) => {
    setProgression((current) => current.length >= MAX_PROGRESSION_CHORDS
      ? current
      : [...current, chord.scaleIndex]);
    setSelectedStep(Math.min(progression.length, MAX_PROGRESSION_CHORDS - 1));
    void playChord(chord);
  };

  const removeLastChord = () => {
    setProgression((current) => current.slice(0, -1));
    setSelectedStep((current) => Math.max(0, current - 1));
  };

  const moveStep = (direction) => {
    if (progression.length === 0) return;
    const nextStep = (activeStep + direction + progression.length) % progression.length;
    setSelectedStep(nextStep);
    void playChord(harmony[progression[nextStep]]);
  };

  return (
    <div className="solo-workspace">
      <section className="solo-card progression-builder" aria-labelledby="progression-heading">
        <div className="solo-card__heading">
          <p className="eyebrow">Harmony</p>
          <h3 id="progression-heading">Chords in key</h3>
          <p>Tap a chord to preview it and add it to your progression.</p>
        </div>

        <div className="progression-builder__add" aria-label="Add chord to progression">
          {harmony.map((chord) => (
            <Button
              key={chord.numeral}
              variant="outline"
              disabled={progression.length >= MAX_PROGRESSION_CHORDS}
              aria-label={`Add and play ${chord.name}`}
              onClick={() => addChord(chord)}
            >
              <span>{chord.numeral}</span>
              <strong>{chord.name}</strong>
            </Button>
          ))}
        </div>

        <div className="progression-builder__sequence">
          <Button variant="outline" onClick={() => moveStep(-1)} disabled={progression.length === 0}>
            Previous chord
          </Button>
          <div className="progression-builder__steps" aria-label="Current progression">
            {progression.length > 0 ? progression.map((scaleIndex, index) => {
              const chord = harmony[scaleIndex];
              return (
                <Button
                  className="progression-builder__step"
                  key={`${scaleIndex}-${index}`}
                  variant="outline"
                  aria-pressed={index === activeStep}
                  onClick={() => {
                    setSelectedStep(index);
                    void playChord(chord);
                  }}
                >
                  <span>{index + 1}</span>
                  {chord.name}
                </Button>
              );
            }) : <span className="progression-builder__empty">Add a chord to begin.</span>}
          </div>
          <Button variant="outline" onClick={() => moveStep(1)} disabled={progression.length === 0}>
            Next chord
          </Button>
        </div>

        <div className="progression-builder__actions">
          <Button variant="outline" onClick={toggleMute} aria-pressed={muted}>
            {muted ? "Unmute" : "Mute"}
          </Button>
          <Button variant="ghost" onClick={removeLastChord} disabled={progression.length === 0}>
            Remove last
          </Button>
          <Button
            variant="ghost"
            onClick={() => {
              setProgression([]);
              setSelectedStep(0);
            }}
          >
            Clear
          </Button>
        </div>
      </section>

      {/* <section className="solo-card chord-targets" aria-labelledby="target-heading">
        <div className="solo-card__heading">
          <p className="eyebrow">Land with purpose</p>
          <h3 id="target-heading">Chord-tone solo map</h3>
          <p>
            Over <strong>{activeChord?.name}</strong>, aim for the {target.toLowerCase()}
            {targetTone ? ` (${targetTone.name})` : ""} at the end of a phrase.
          </p>
        </div>
        <SegmentedControl
          label="Target note"
          options={TARGETS.map((item) => ({ label: item, value: item }))}
          value={target}
          onChange={setTarget}
        />
        <div className="solo-fretboard-frame">
          <SoloFretboard
            label={`Chord tones for ${activeChord?.name}`}
            labelMode={labelMode}
            notes={chordToneNotes}
            targetPitchClass={targetTone?.pitchClass}
            toneLabels={toneLabels}
          />
        </div>
        <div className="solo-legend" aria-label="Chord tone legend">
          {activeChord?.tones.map((tone) => (
            <span className={tone.role === target ? "is-target" : ""} key={tone.role}>
              <b>{tone.shortRole}</b> {tone.role}: {tone.name}
            </span>
          ))}
        </div>
      </section> */}

      <section className="solo-card scale-overlay" aria-labelledby="scale-overlay-heading">
        <div className="solo-card__heading">
          <p className="eyebrow">Expand the box</p>
          <h3 id="scale-overlay-heading">Full scale overlay</h3>
          <p>Switch between the full seven-note scale and the pentatonic notes used for soloing.</p>
        </div>
        <div className="scale-overlay__mode">
          <SegmentedControl
            label="Fretboard type"
            options={[
              { label: "Pentatonic", value: "pentatonic" },
              { label: "Full scale", value: "scale" },
            ]}
            value={fretboardMode}
            onChange={setFretboardMode}
          />
        </div>
        <SegmentedControl
          label="Fretboard labels"
          options={LABEL_MODES}
          value={labelMode}
          onChange={setLabelMode}
        />
        <div className="solo-fretboard-frame">
          <SoloFretboard
            label={`Full ${describeKey(audioFeature)} scale across the fretboard`}
            labelMode={labelMode}
            notes={fretboardMode === "pentatonic"
              ? notesForPitchClasses(scaleNotes, getPentatonicPitchClasses(audioFeature))
              : scaleNotes}
          />
        </div>
        <div className="solo-legend">
          {fretboardMode === "scale" ? (
            <>
              <span><b className="legend-dot legend-dot--safe" /> Pentatonic</span>
              <span><b className="legend-dot legend-dot--color" /> Added color note</span>
            </>
          ) : <span><b className="legend-dot legend-dot--safe" /> Pentatonic</span>}
          <span><b className="legend-dot legend-dot--root" /> Root</span>
        </div>
      </section>

      <section className="solo-reference-row" aria-labelledby="shapes-heading">
        <div className="solo-reference-row__heading">
          <h3 id="shapes-heading">Pentatonic shapes</h3>
        </div>
        <SegmentedControl
          label="Pentatonic shape labels"
          options={LABEL_MODES}
          value={labelMode}
          onChange={setLabelMode}
        />
        <PentatonicShapes audioFeature={audioFeature} labelMode={labelMode} />
      </section>

      <TempoTrainer tempo={audioFeature.tempo} />
    </div>
  );
}
