# ShredQuest: build a groovebox in ChucK

This file is the complete content source for a chapter-based ChucK tutorial series.
It is written to be handed to a coding agent that generates the UI. All prose, code,
and structure below is final content, the agent's job is presentation only.

---

## BUILD BRIEF (for the agent)

**What this is.** A 13-chapter tutorial series. Each chapter adds to the same file,
`groovebox.ck`, building a multi-track step sequencer. Audience is programmers who
have never done audio. Not musicians, not beginners at coding.

**Hard rules.**

1. **Do not edit the ChucK code.** Every block marked `verified: true` was executed
   against ChucK 1.5.5.9-dev and produces exactly the output shown. Do not "fix"
   syntax that looks wrong: `=>`, `@=>`, `::`, `<<< >>>` and `spork ~` are all real.
2. **Do not reorder or merge chapters.** Each one is motivated by a limitation of the
   previous one. Chapter 5 only makes sense because chapter 4 blocks.
3. **Do not run the code in the browser.** There is deliberately no embedded runner in
   this version. Readers install ChucK and run locally.
4. Preserve the `hear`, `note`, `changed` and `ruler` blocks as distinct components.
   They do different jobs and should not collapse into one generic callout.

**Chapter grouping for navigation.**

- Part one: in the terminal: chapters 00–04
- Part two: many things at once: chapters 05–08
- Part three: the outside world: chapters 09–12

**Suggested design tokens.** Use these or replace them, but keep the reasoning: the
series thesis is that time is explicit, so the design should make time visible.

```
--paper:    #E7EAEE   cool grey page
--card:     #F3F5F7
--ink:      #12161D
--ink2:     #4C5665   body secondary
--ink3:     #7C8798   captions
--rule:     #C7CFD9
--chuck:    #2437E0   electric blue: the => operator, links, active nav
--hear:     #B96A00   amber: audio callouts only
--code-bg:  #0F141E
--code-fg:  #D8E0EC
```

Display face: Archivo (variable, use the width axis, ~112 wdth / 800 wght for h1).
Body: IBM Plex Sans. Code: IBM Plex Mono. Background: faint 96px grid, ~35% opacity.

**Signature element: the time ruler.** A horizontal tick strip that shows where `now`
sits at each point in an example. Chapters 01, 03, 04 and 05 have `ruler` blocks with
the tick data. This is the one element the site should be remembered by; everything
else stays quiet.

**Component conventions used below.**

| Marker | Meaning |
|---|---|
| ` ```chuck file="x.ck" verified=true ` | ChucK source. Render with a filename bar above. |
| ` ```output ` | Real program output. Render dimmed, monospace, no filename bar. |
| ` ```terminal ` | Shell command. |
| `:::hear` | "What you should hear" — amber left border. Audio expectation. |
| `:::note` | Aside, gotcha, version warning. Grey left border. |
| `:::changed` | End-of-chapter summary list. Card with border. |
| `:::ruler caption="..."` | Time ruler. Rows are `time \| label \| hit?`: `hit` means highlight. |

---

## Chapter 00: Getting ChucK running

```yaml
part: one
eyebrow: Episode 00
next: 01
```

Welcome to ShredQuest, a series where we build a groovebox from scratch in ChucK. If
you write code but have never touched audio, this is written for you. No music theory,
no DSP maths you have to take on faith.

Quick word on why ChucK and not something you already know. In most languages, audio is
something you hand to a callback and hope for the best. Your code runs, a buffer gets
filled, and the actual timing of things is somebody else's problem. ChucK does the
opposite. Time is a value you control directly, down to the individual sample, and that
turns out to change how you think about the whole problem.

By the end of this series you'll have a working groovebox: multiple tracks, a synth
voice you wrote yourself, patterns you can edit while the music is still playing. We'll
get there one chapter at a time, and every chapter adds to the same file.

### Installing it

Grab the release from [chuck.stanford.edu/release](https://chuck.stanford.edu/release/).
There are installers for macOS and Windows, and on Linux you can build from source or
use your package manager. This series is written against **ChucK 1.5.5.7** or newer.
That matters more than you'd think, and I'll explain why in chapter 4.

You get two things. `chuck` is the command-line compiler and virtual machine.
**miniAudicle** is a small editor with a run button and a console, which is nicer while
you're learning. Use whichever you prefer; everything here works in both.

Check it worked:

```terminal
chuck --version
```

You should see the version number, your platform, and the audio driver it picked. If
you see a version, you're done.

### Your first file

Make a file called `groovebox.ck`. That `.ck` extension is what ChucK source files use.
This one file is the thing we'll grow across the whole series.

```chuck file="groovebox.ck" verified=true
// a sine wave, straight into the speakers
SinOsc osc => dac;
440 => osc.freq;
2::second => now;
```

Run it:

```terminal
chuck groovebox.ck
```

:::hear
A clean 440 Hz tone for exactly two seconds, then silence and the program exits. Not two
seconds and a bit. Exactly two.
:::

Four lines and there's already a lot going on, so we'll pull it apart properly in the
next chapter. For now just notice that `=>` shows up three times doing what look like
three completely different jobs, and that the program ended on its own without you
telling it to stop.

### If you hear nothing

Run `chuck --probe`. It lists every audio device ChucK can see, each with a number. Pick
the one you actually want and pass it in:

```terminal
chuck --dac2 groovebox.ck
```

:::note
There's also `chuck --silent`, which runs your program with no audio device at all.
Useless for hearing things, very useful when you only want to check that the code
compiles and the timing is right. I use it constantly.
:::

---

## Chapter 01: Time is a variable

```yaml
part: one
eyebrow: Episode 01
prev: 00
next: 02
```

This is the one idea that makes ChucK different from every language you already know.
Everything else in the series sits on top of it, so it gets its own chapter before we
make a single interesting sound.

In ChucK there is a built-in variable called `now`. It holds the current time. And
here's the part that breaks people: **your program's time does not move unless you move
it.** There's no clock ticking in the background that your code is racing against. You
assign to `now`, and time advances by that much.

Let's prove it. `<<< ... >>>` is ChucK's print statement.

```chuck file="groovebox.ck" verified=true
<<< "the time is", now/second, "seconds" >>>;
1::second => now;
<<< "the time is", now/second, "seconds" >>>;
0.5::second => now;
<<< "the time is", now/second, "seconds" >>>;
```

```output
the time is 0.000000 seconds
the time is 1.000000 seconds
the time is 1.500000 seconds
```

:::ruler caption="where now sits after each line"
0.0s | print | hit
0.5s |  |
1.0s | print | hit
1.5s | print | hit
:::

Three prints, and the gaps between them are exact. Not "roughly a second, depending on
scheduler load". Exactly a second, because you said so.

### The two operators

Two bits of syntax are doing the work here.

`=>` is the **chuck operator**, and it's where the language gets its name. It sends the
thing on the left to the thing on the right. If you're used to `x = 5`, ChucK writes
that as `5 => x`. Left to right, matching the direction the data actually flows. It
reads oddly for about a day and then it's fine.

`::` builds a **duration**. It multiplies a number by a unit of time. So `1::second` is
a duration of one second, and `250::ms` is a duration of 250 milliseconds. The units
built into the language are `samp`, `ms`, `second`, `minute`, `hour`, `day` and `week`.

That first one is the interesting one. `samp` is the duration of a single audio sample,
which means you can write:

```chuck file="groovebox.ck" verified=true
<<< "samplerate:", second/samp, "samples per second" >>>;
<<< "one 1/8 note at 120bpm =", (0.25::second)/ms, "ms" >>>;
1::samp => now;
<<< "advanced one sample; now =", now/samp, "samples" >>>;
```

```output
samplerate: 48000.000000 samples per second
one 1/8 note at 120bpm = 250.000000 ms
advanced one sample; now = 1.000000 samples
```

You just stepped your program forward by one sample. At 48kHz that's about 21
microseconds. This is the resolution you get to work at, and it's the reason people call
ChucK **strongly-timed**.

Notice also that dividing a duration by a duration gives you a plain number, which is
how `now/second` printed nicely. Durations are a real type with real arithmetic, not
just integers you've agreed to treat as milliseconds.

### Loops advance time too

A loop that advances time is the shape almost everything in this series will take.

```chuck file="groovebox.ck" verified=true
0 => int beat;

while( beat < 4 )
{
    <<< "beat", beat, "at", now/second, "sec" >>>;
    0.5::second => now;
    beat++;
}
```

```output
beat 0 at 0.000000 sec
beat 1 at 0.500000 sec
beat 2 at 1.000000 sec
beat 3 at 1.500000 sec
```

That's a metronome at 120 bpm, and it will not drift. Ever. Not after four beats, not
after four hours. The time between beats isn't the result of a sleep call that got close
enough, it's the definition of when the next iteration happens.

:::note
**The mistake everyone makes once.** Write a `while(true)` loop with no time advance in
it and ChucK will hang. Not crash, hang. From the language's point of view you've
written a loop that runs an infinite amount of code in zero time, which is exactly what
you asked for.

The VM notices and prints a stall warning after a couple of seconds. When you see it,
the fix is always the same: something in that loop needs to advance `now`.
:::

### Why this matters beyond ChucK

If you take one thing from this series, take this chapter. Every real-time audio system
has to answer the question "what happens between now and the next buffer", and most of
them answer it by making you fill a block of samples in a callback while carefully not
doing anything slow. ChucK answers it by making time explicit in the language.

Once you've written code this way, the callback model in JUCE or the scheduling in
SuperCollider stops feeling arbitrary. You'll recognise what they're working around.
We'll come back to that properly in the last chapter.

---

## Chapter 02: Making a sound

```yaml
part: one
eyebrow: Episode 02
prev: 01
next: 03
```

Now that time makes sense, we can put something in it. This chapter is about unit
generators, which are the building blocks every audio system is made of, and about that
`=>` operator doing a second job.

A **unit generator**, usually shortened to UGen, is an object that produces or processes
audio. An oscillator is a UGen. A filter is a UGen. Your speakers are a UGen, called
`dac`. You build sound by connecting them into a chain, and `=>` is how you connect
them.

```chuck file="groovebox.ck" verified=true
SinOsc osc => dac;
440 => osc.freq;
0.5 => osc.gain;
2::second => now;
```

Line by line. `SinOsc osc` declares a sine oscillator called `osc`, and chucking it into
`dac` patches its output to your speakers. `440 => osc.freq` sets its frequency to 440
Hz. `0.5 => osc.gain` halves its volume, where 1.0 is full scale. Then we advance time
by two seconds, and during those two seconds the whole chain is running and producing
samples.

That last point is the one to sit with. The oscillator isn't producing sound because of
the line that created it. It produces sound during the line that advances time. No time
advance, no audio. This is why chapter 1 came first.

:::hear
Same 440 Hz tone as chapter 0, now at half volume. A pure sine is a slightly dull sound,
which is deliberate; it's the reference point everything else gets compared against.
:::

### Chains are longer than two

A sine wave has exactly one frequency in it, so there's nothing for a filter to remove.
Let's switch to a sawtooth, which has plenty, and put a low-pass filter in the middle of
the chain.

```chuck file="groovebox.ck" verified=true
SawOsc osc => LPF filter => dac;
110 => osc.freq;
0.3 => osc.gain;
2000 => filter.freq;
2 => filter.Q;
2::second => now;
```

You can chain the whole thing in one line, declaring the filter inline as you go. Signal
flows left to right: oscillator into filter into speakers.

`LPF` is a low-pass filter, meaning it lets low frequencies through and cuts high ones.
`filter.freq` is the cutoff, the point above which things start getting removed.
`filter.Q` is resonance, which emphasises frequencies right at the cutoff. Higher Q,
more of that vocal, whistling quality.

:::hear
A buzzy low note, noticeably softer and rounder than a raw saw. Change `2000` to `400`
and it goes muffled. Change it to `12000` and it's almost the unfiltered saw again.
:::

### Making the filter move

Static filter, static sound. Everything interesting in synthesis comes from parameters
changing over time, and now that we know how to advance time we can do that.

```chuck file="groovebox.ck" verified=true
SawOsc osc => LPF filter => dac;
110 => osc.freq;
0.3 => osc.gain;
2 => filter.Q;

200 => float cutoff;

while( cutoff < 6000 )
{
    cutoff => filter.freq;
    cutoff * 1.05 => cutoff;
    10::ms => now;
}
```

Every 10 milliseconds we nudge the cutoff up by 5% and let time move on. That's a filter
sweep, and it's the same loop shape from chapter 1 with a parameter update in it.

We multiply rather than add because pitch and frequency are perceived logarithmically.
Adding a fixed 100 Hz each step sounds fast at the bottom and then crawls; multiplying
sounds like an even sweep.

:::hear
The classic filter sweep, roughly two and a half seconds of a note opening up from
muffled to bright.
:::

### More than one thing at once

You can chuck several UGens into `dac` and they sum together.

```chuck file="groovebox.ck" verified=true
SinOsc a => dac;
SinOsc b => dac;
220 => a.freq;
330 => b.freq;
0.2 => a.gain;
0.2 => b.gain;
2::second => now;
```

Keep the gains low when you do this. Two things at 0.5 each will clip, because summing
is just addition and nothing is protecting you from going past full scale.

:::changed
- UGens: `SinOsc`, `SawOsc`, `LPF`, and `dac`
- `=>` connects UGens as well as assigning values
- Chains can be any length and are written left to right
- A UGen only makes sound while time is advancing
- Changing a parameter inside a timed loop is how you get movement
:::

---

## Chapter 03: One voice

```yaml
part: one
eyebrow: Episode 03
prev: 02
next: 04
```

Right now our sound starts instantly and stops instantly, which is why it sounds like a
test tone and not an instrument. This chapter fixes that with an envelope, and wraps the
result into a function we can actually play notes with.

Real sounds have a shape over time. A plucked string jumps to full volume and decays
away. A bowed one fades in. The standard way to describe that shape is an **ADSR
envelope**: Attack, Decay, Sustain, Release.

Attack is how long it takes to reach full volume after the note starts. Decay is how
long it then takes to fall to the sustain level. Sustain is the level it holds at while
the note is held down, and it's a level rather than a time. Release is how long it takes
to fade to silence after the note is let go.

```chuck file="groovebox.ck" verified=true
SawOsc osc => ADSR env => LPF filter => dac;
110 => osc.freq;
0.4 => osc.gain;
1200 => filter.freq;
2 => filter.Q;

env.set( 5::ms, 100::ms, 0.3, 200::ms );

env.keyOn();
300::ms => now;
env.keyOff();
300::ms => now;
```

`ADSR` goes into the chain right after the oscillator, because it works by scaling
whatever passes through it. The four arguments to `env.set()` are attack, decay, sustain
and release, in that order. Three of them are durations and the sustain is a plain
number between 0 and 1, which trips people up the first time.

`keyOn()` starts the note, exactly like pressing a key. `keyOff()` releases it. In
between you advance time, and that's how long the note is held for.

:::ruler caption="what the envelope is doing"
0ms | keyOn: attack | hit
5ms | decay |
105ms | sustain 0.3 |
300ms | keyOff: release | hit
500ms | silent |
:::

Note the second time advance after `keyOff()`. Release takes 200ms, and if the program
ends before that time passes, you cut the tail off. Forgetting the wait after a release
is one of those bugs that sounds like a click and takes twenty minutes to find.

:::hear
A short plucky note instead of a blast of tone. Set attack to `400::ms` and the same
note now swells in like a pad. Same oscillator, same filter, completely different
instrument.
:::

### Turning it into a function

Playing one note by hand is fine. Playing sixteen is not, so let's wrap it.

```chuck file="groovebox.ck" verified=true
SawOsc osc => ADSR env => LPF filter => dac;
0.4 => osc.gain;
1200 => filter.freq;
2 => filter.Q;
env.set( 5::ms, 100::ms, 0.3, 200::ms );

fun void playNote( float freq, dur length )
{
    freq => osc.freq;
    env.keyOn();
    length => now;
    env.keyOff();
    200::ms => now;
}

playNote( 220, 300::ms );
playNote( 277.18, 300::ms );
playNote( 329.63, 300::ms );
```

Functions are declared with `fun`, then the return type, then the name. Nothing
surprising there. The surprising part is the second parameter: `dur` is a first-class
type, so a function can take a duration the same way it takes a float.

The important thing about this function is that **it advances time itself**. Calling
`playNote` doesn't schedule a note for later, it plays the note and returns 500ms of
program time later. Three calls, one after another, is a melody. That's why the three
notes come out sequentially without any scheduling code.

It's also a limitation, and it's the one that sets up the next few chapters. Because
`playNote` blocks, you cannot use it to play two notes at the same time. We'll fix that
in chapter 5.

### Note numbers instead of frequencies

Those magic numbers above are A3, C#4 and E4. Nobody remembers frequencies, so use MIDI
note numbers and convert:

```chuck file="groovebox.ck" verified=true
<<< "midi 69 =", Std.mtof(69), "Hz" >>>;
<<< "midi 60 =", Std.mtof(60), "Hz" >>>;
<<< "midi 36 =", Std.mtof(36), "Hz" >>>;
```

```output
midi 69 = 440.000000 Hz
midi 60 = 261.625565 Hz
midi 36 = 65.406391 Hz
```

`Std.mtof` is "MIDI to frequency". 69 is A4 at 440 Hz, 60 is middle C, and every 12
numbers is an octave. Adding 12 to a note number doubles its frequency, which is a much
easier thing to hold in your head than the actual Hz values. From here on, notes are
integers.

:::changed
- `ADSR` in the chain, driven by `keyOn()` and `keyOff()`
- Always advance time after `keyOff()` or you lose the release tail
- `fun` declares functions, and `dur` is a normal parameter type
- A function that advances time blocks, which is fine for melody and useless for chords
- `Std.mtof()` turns note numbers into frequencies
:::

---

## Chapter 04: A pattern

```yaml
part: one
eyebrow: Episode 04
prev: 03
next: 05
```

We have a voice and we have precise time. Put an array between them and you have a
sequencer, which is the first thing in this series that sounds like actual music.

A drum pattern is a grid. Sixteen steps to a bar, and at each step a drum either fires or
it doesn't. That's an array of ones and zeros, and it's the standard way of representing
this going back to hardware drum machines from the eighties.

```chuck file="groovebox.ck" verified=true
[1, 0, 0, 0, 1, 0, 0, 0] @=> int kick[];
<<< "steps:", kick.size() >>>;
```

New operator. `@=>` is the **reference assignment** operator, used for objects and arrays
rather than plain numbers. Regular `=>` copies a value; `@=>` points a name at an object.
Arrays are objects, so arrays use `@=>`. If you've written Java, it's the same
distinction as primitives versus references.

### The step loop

Now walk the array in time.

```chuck file="groovebox.ck" verified=true
SinOsc osc => ADSR env => dac;
55 => osc.freq;
0.8 => osc.gain;
env.set( 1::ms, 120::ms, 0.0, 1::ms );

[1, 0, 0, 0, 1, 0, 0, 0] @=> int kick[];
0.125::second => dur step;

for( 0 => int bar; bar < 2; bar++ )
{
    for( 0 => int i; i < kick.size(); i++ )
    {
        if( kick[i] == 1 ) env.keyOn();
        step => now;
    }
}
```

The inner loop walks one bar. For each step, if the pattern says fire, we trigger the
envelope, and then we advance one step's worth of time regardless. The outer loop repeats
the bar.

The envelope settings are what make this read as a drum rather than a note. Attack of 1ms
so it's instant, decay of 120ms, and crucially **sustain of 0.0**. With nothing to
sustain to, the sound dies on its own after the decay and we never need to call
`keyOff()` at all. Percussion is just an envelope that ignores how long you held the key.

:::ruler caption="one bar, 8 steps at 0.125s"
0 | kick | hit
1 |  |
2 |  |
3 |  |
4 | kick | hit
5 |  |
6 |  |
7 |  |
:::

:::hear
Two bars of a plain four-on-the-floor kick, four seconds total. It's dull, and it's a
sequencer. Change a `0` to a `1` and hear the pattern move.
:::

### Tempo, properly

That hardcoded `0.125::second` should be derived from a BPM, because right now changing
the tempo means doing arithmetic in your head.

```chuck file="groovebox.ck" verified=true
120 => float bpm;
(60.0/bpm)::second => dur beat;
beat/2 => dur step;

<<< "at", bpm, "bpm one beat is", beat/ms, "ms" >>>;
<<< "one 1/8 step is", step/ms, "ms" >>>;
```

```output
at 120.000000 bpm one beat is 500.000000 ms
one 1/8 step is 250.000000 ms
```

Sixty seconds divided by beats per minute gives you the length of one beat, and `::`
turns that float into a duration. Then a step is half a beat if you're working in eighth
notes, or a quarter of one for sixteenths. One variable at the top now controls the tempo
of everything downstream.

:::note
**Version warning, and this one bites.** As of ChucK 1.5.5.7, array bounds are enforced
against the array's *size*, not its capacity. Indexing past the end throws an
`ArrayOutofBounds` exception rather than quietly returning something:

```output
[chuck]:(EXCEPTION) ArrayOutofBounds: on line[2] index[9]
```

Older tutorials were written before this change and lean on the old behaviour. If you're
following along on an older build, or reading someone else's ChucK from a few years back,
this is the difference you'll hit first. Use `.size()` to grow an array deliberately;
`.capacity()` only reserves space and no longer changes what's in bounds.
:::

:::changed
- `@=>` for arrays and objects, plain `=>` for values
- A pattern is an `int` array; the step loop reads it and advances time
- Sustain of 0.0 gives you percussion with no `keyOff()` needed
- Tempo derived from BPM, so `step` is never a magic number again
- Array indexing past `.size()` throws, as of 1.5.5.7
:::

One kick is not a groove. Next chapter we add a hi-hat running at a different rate to the
kick, discover that our blocking step loop can't do two things at once, and meet the
feature ChucK is actually named after.

---

## Chapter 05: Two tracks at once

```yaml
part: two
eyebrow: Episode 05
prev: 04
next: 06
```

A kick on its own isn't a groove. Adding a hi-hat sounds like it should be five minutes
of work, and instead it walks us straight into the wall that ChucK was built to knock
down.

Here's the problem. Our step loop from chapter 4 advances time itself. That's what makes
it work. But it also means that while it's running, nothing else in the program can
happen, because time only moves when that loop moves it. A hi-hat on eighth notes and a
kick on quarter notes are two loops with different step lengths, and one blocking loop
cannot be two loops.

You could interleave them by hand. Work out the least common multiple of both patterns,
build one combined grid, and step through that. It works for two tracks. It's miserable
for four, and it's impossible once one track has swing on it. That's not the answer.

### Shreds

ChucK's answer is the **shred**. A shred is an independently running piece of your
program with **its own timeline**. Each one has its own view of `now`, advances time on
its own terms, and the virtual machine keeps them all in step with each other at sample
resolution.

You create one with `spork ~` in front of a function call.

```chuck file="groovebox.ck" verified=true
fun void counter( string name, dur period )
{
    for( 0 => int i; i < 3; i++ )
    {
        <<< name, i, "at", now/ms, "ms" >>>;
        period => now;
    }
}

spork ~ counter( "A", 100::ms );
spork ~ counter( "B", 150::ms );
1::second => now;
```

```output
A 0 at 0.000000 ms
B 0 at 0.000000 ms
A 1 at 100.000000 ms
B 1 at 150.000000 ms
A 2 at 200.000000 ms
B 2 at 300.000000 ms
```

Two functions, two rates, exact timings on both. No thread pool, no scheduler you had to
configure, no callback. Just `spork ~`.

:::ruler caption="two shreds, two rates, one timeline"
0ms | A0 · B0 | hit
100 | A1 | hit
150 | B1 | hit
200 | A2 | hit
300 | B2 | hit
:::

The last line matters as much as the sporks. `spork` starts a shred but doesn't run it
yet; the new shred gets its turn once the current shred advances time or exits. And when
the shred that sporked them ends, the program can end with it. So the parent needs to
stick around, which is what that `1::second => now` is doing.

### Two real tracks

Now the actual groovebox. Each track becomes a function, and each function owns its own
UGen chain.

```chuck file="groovebox.ck" verified=true
fun void kickTrack()
{
    SinOsc osc => ADSR env => dac;
    55 => osc.freq;
    0.8 => osc.gain;
    env.set( 1::ms, 120::ms, 0.0, 1::ms );

    [1,0,0,0,1,0,0,0] @=> int p[];

    for( 0 => int i; i < 16; i++ )
    {
        if( p[i % p.size()] == 1 ) env.keyOn();
        0.25::second => now;
    }
}

fun void hatTrack()
{
    Noise n => ADSR env => HPF hp => dac;
    0.15 => n.gain;
    7000 => hp.freq;
    env.set( 1::ms, 40::ms, 0.0, 1::ms );

    for( 0 => int i; i < 32; i++ )
    {
        env.keyOn();
        0.125::second => now;
    }
}

spork ~ kickTrack();
spork ~ hatTrack();
4::second => now;
```

The hi-hat is `Noise` through a high-pass filter, which is the cheapest convincing cymbal
you can build. Noise contains every frequency at once, `HPF` throws away everything below
7kHz, and a 40ms decay does the rest. Not a real hi-hat, close enough to groove.

Note that each track declares its UGens inside its own function. They're local, so the
two tracks can't accidentally share an oscillator, and each connects to `dac`
independently. Two chains, summed at the output, exactly like the two sine waves in
chapter 2.

:::hear
Four seconds of kick on the quarters with hats on the eighths. It's the first thing in
this series you could nod your head to.
:::

:::note
**Shreds are not threads.** Nothing here runs in parallel on another core, and you will
never get a race condition on a shared variable because only one shred runs at a time.
What you get is a scheduler that understands time, so a shred that asks to wake up in
125ms wakes up in exactly 125ms of audio time.

The trade is the same one from chapter 1: a shred that loops without advancing time hangs
the whole VM, not just itself.
:::

:::changed
- `spork ~ f()` starts a shred with its own timeline
- Each track is a function that owns its UGen chain and its own step loop
- The parent shred has to stay alive or the program exits under its children
- `Noise` into `HPF` is a serviceable hi-hat
:::

Two tracks work. Now try changing the tempo, and notice there are two places to change
it.

---

## Chapter 06: Keeping them in sync

```yaml
part: two
eyebrow: Episode 06
prev: 05
next: 07
```

Our two tracks each own their own tempo, their own step counter and their own idea of
where the bar starts. That's four things to keep in agreement by hand, and it gets worse
with every track we add.

First, an honest correction to what you might expect. Our two shreds do **not** drift
apart. In a language where sleep is approximate they would, and every audio tutorial
warns you about it. In ChucK the timings are exact, so a hat shred stepping at 125ms will
still be exactly on the grid an hour later.

The real problems are different, and they're structural:

- Tempo is written in two places. Change one and the tracks disagree.
- A track sporked later starts wherever it starts. There's no shared idea of "step 0".
- Nothing knows what step number it's on, so patterns of different lengths can't line up
  against a common bar.

The fix is one shred that owns time and tells everyone else about it. Which means we need
a way for shreds to talk.

### Events

An `Event` is something a shred can wait on. Chuck an event into `now` and the shred
sleeps until the event fires, however long that takes.

```chuck file="groovebox.ck" verified=true
Event tick;

tick => now;   // waits here until someone fires it
```

That's the same `=> now` you've been writing since chapter 1, and it means the same
thing: advance time until this. The only difference is that the amount is decided by
another shred instead of by a number.

Two ways to fire one. `signal()` wakes a single waiting shred, and `broadcast()` wakes
all of them. For a clock, it's always `broadcast()`.

### The clock shred

```chuck file="groovebox.ck" verified=true
120 => float bpm;
(60.0/bpm)::second / 2 => dur step;

Event tick;
0 => int stepCount;

fun void clock()
{
    while( true )
    {
        tick.broadcast();
        step => now;
        stepCount++;
    }
}

fun void track( string name, int pattern[] )
{
    while( true )
    {
        tick => now;
        if( pattern[ stepCount % pattern.size() ] == 1 )
            <<< name, "on step", stepCount, "at", now/ms, "ms" >>>;
    }
}

spork ~ track( "kick", [1,0,0,0] );
spork ~ track( "hat",  [0,1,0,1] );
spork ~ clock();

1500::ms => now;
```

```output
kick on step 0 at 0.000000 ms
hat on step 1 at 250.000000 ms
hat on step 3 at 750.000000 ms
kick on step 4 at 1000.000000 ms
hat on step 5 at 1250.000000 ms
```

Now there is exactly one place that knows about tempo and exactly one step counter. A
track never advances time by a duration at all. It waits for the tick, does its work, and
waits again. Tracks became pure pattern logic, which is what we wanted.

Notice the patterns have different lengths, four steps each here but they needn't be, and
they still line up, because `stepCount % pattern.size()` is measured against a counter
everybody shares.

:::note
**Spork the clock last.** This one cost me an evening. `spork` queues a shred but doesn't
run it until the current shred yields, so if you spork the clock first, it runs first,
broadcasts to an empty room, and your tracks miss the opening steps. Sporked in the order
above, both tracks reach `tick => now` and are waiting before the clock ever fires.

If your first bar is missing hits and every bar after is fine, this is why.
:::

### Why this shape is worth the trouble

Once there's a clock event, a lot of things become nearly free. Changing `bpm` changes
everything. A new track is one more `spork` with an array in it. And because tracks are
now waiting on an event rather than on a duration, the thing driving them doesn't have to
be a clock at all. In chapter 10 we point a MIDI controller at that same event and the
whole groovebox follows external hardware without any track code changing.

:::changed
- `Event`, and `evt => now` to wait on one
- `broadcast()` wakes every waiter, `signal()` wakes one
- One clock shred owns tempo and the step counter
- Tracks hold no timing of their own, only patterns
- Spork order decides who is waiting when the first broadcast lands
:::

---

## Chapter 07: A reusable Voice

```yaml
part: two
eyebrow: Episode 07
prev: 06
next: 08
```

Every track so far declares its own oscillator, its own envelope and its own filter, and
the code to do that is nearly identical each time. Time to write it once.

ChucK has classes, and they work roughly how you'd expect coming from Java or C++. The
interesting part is what happens when you put UGens inside one: each instance gets its
own chain, wired up when the object is created.

```chuck file="groovebox.ck" verified=true
class Voice
{
    SawOsc osc => ADSR env => LPF filt => Gain out;
    0.3 => osc.gain;
    2 => filt.Q;

    fun void setup( float cutoff, dur a, dur d, float s, dur r )
    {
        cutoff => filt.freq;
        env.set( a, d, s, r );
    }

    fun void hit( int note )
    {
        Std.mtof( note ) => osc.freq;
        env.keyOn();
    }

    fun void release()
    {
        env.keyOff();
    }
}
```

The chain is declared as a member, at class scope, and so are the two lines setting gain
and Q. Anything written directly in the class body runs when an instance is created, so
every `Voice` comes out already wired and already sensible.

The last UGen in the chain is a `Gain` called `out` rather than `dac`, and that's
deliberate. If the class chucked itself straight into the speakers, every voice would be
permanently connected the moment it existed and you'd have no say in it. Ending at a
`Gain` gives the class an output you connect yourself.

```chuck file="groovebox.ck" verified=true
Voice bass;
Voice lead;

bass.out => dac;
lead.out => dac;

bass.setup( 800,  2::ms, 150::ms, 0.0, 5::ms );
lead.setup( 3000, 2::ms, 90::ms,  0.0, 5::ms );

bass.hit( 36 );
250::ms => now;
lead.hit( 60 );
250::ms => now;
```

Two instances, two completely separate signal chains, different cutoffs and different
envelopes, from one class. Same object with different settings is the difference between
a bass and a lead, which is a fair summary of subtractive synthesis generally.

:::hear
A short dark note low down, then a brighter one two octaves up. Both plucky, because both
have sustain at 0.0.
:::

### Dropping it into the tracks

Now the track function from chapter 6 takes a voice and a pattern, and stops caring how
the sound is made:

```chuck file="groovebox.ck"
fun void track( Voice v, int pattern[], int note )
{
    while( true )
    {
        tick => now;
        if( pattern[ stepCount % pattern.size() ] == 1 )
            v.hit( note );
    }
}

spork ~ track( bass, [1,0,0,0], 36 );
spork ~ track( lead, [0,0,1,0], 60 );
spork ~ clock();
```

Three concerns now live in three places: `Voice` makes sound, `track` reads patterns,
`clock` owns time. Adding a fourth track is one line. This is the point where the file
stops being a script and starts being a program.

:::note
Objects use `@=>`, same as the arrays in chapter 4. `Voice bass;` creates one, and if you
later want a second name for the same voice it's `bass @=> Voice alias;`, not `=>`. Two
names, one object, one signal chain.
:::

:::changed
- `class`, with UGen chains as members that wire on instantiation
- Class-body statements run at construction, so instances arrive configured
- End the chain at a `Gain`, not `dac`, and let the caller connect it
- Tracks take a `Voice`, so pattern logic and sound design are finally separate
:::

---

## Chapter 08: Changing code while it runs

```yaml
part: two
eyebrow: Episode 08
prev: 07
next: 09
```

This is the chapter I'd point at if someone asked why bother with ChucK at all. We're
going to edit a running program's source, and hear the change arrive, without the music
ever stopping.

Every language you know has an edit-compile-run loop with a stop in it. You change the
code, you restart the thing, you lose whatever state it had. For a web server that's
fine. For music it's fatal, because the state you just threw away was a groove somebody
was dancing to.

ChucK has no stop in that loop. Shreds can be added to and removed from a running virtual
machine, from the outside, while it plays. This is what people mean by **on-the-fly
programming**, and it's what the language was originally built to do.

### Starting a VM with nothing in it

```terminal
chuck --loop
```

That starts ChucK with no program at all, and leaves it running. Silent, idle, waiting.
Leave that terminal alone; it's your machine now. Everything else happens from a second
terminal.

```terminal
chuck + clock.ck
chuck + kick.ck
chuck + hat.ck
```

Each `+` adds that file to the running VM as a new shred. The clock starts, then the kick
joins it, then the hats. Nothing restarted between those three commands, and the music
kept playing throughout.

The other two commands:

```terminal
chuck ^              # list running shreds and their ids
chuck - 3            # remove shred 3
chuck = 3 hat.ck     # replace shred 3 with a fresh copy of hat.ck
```

That last one is the whole point. Open `hat.ck`, change a zero to a one, save, and run
`chuck = 3 hat.ck`. The old hat shred is removed and the new one starts, and everything
else (clock, kick, your place in the bar) carries straight on.

:::hear
The pattern changes and the groove doesn't stop. Not a stutter, not a gap, not a click.
If you've only ever restarted programs to see changes, this is a genuinely strange
feeling the first time.
:::

### Doing it from inside

The same operations are available to your code through `Machine`, which means a shred can
add and remove other shreds.

```chuck file="groovebox.ck" verified=true
<<< "my shred id:", me.id() >>>;
<<< "my source:", me.sourcePath() >>>;
<<< "shreds running:", Machine.numShreds() >>>;

Machine.add( me.dir() + "/hat.ck" ) => int id;
<<< "added shred", id >>>;

4::second => now;
Machine.remove( id );
```

`me` refers to the current shred. `me.id()` is the number you'd pass to `chuck -` from
the terminal, and `me.dir()` is the directory the source file lives in, which is how you
build paths that still work on somebody else's machine.

`Machine.add()` returns the new shred's id, and you need to keep it, because
`Machine.remove()` and `Machine.replace()` both take it. A launcher file that adds every
track and holds their ids is a nice way to arrange this once you have more than three.

:::note
**Design for replacement.** Live swapping only feels good if a shred can be killed at any
instant without leaving a mess. Two rules cover most of it: keep per-track state inside
the track's own shred so removing it takes the state with it, and have tracks wait on the
shared clock rather than hold timing of their own, so a replacement lands on the next
tick instead of wherever it happened to start.

Chapter 6 was already setting this up. That's why the clock came before this chapter and
not after.
:::

:::changed
- `chuck --loop` runs an empty VM you add to from another terminal
- `chuck +` adds, `-` removes, `=` replaces, `^` lists
- `Machine.add/remove/replace` do the same from inside a program
- `me.id()`, `me.dir()`, `me.sourcePath()`
- Shreds that hold their own state and wait on a shared clock are safe to swap
:::

---

## Chapter 09: Samples and files

```yaml
part: three
eyebrow: Episode 09
prev: 08
next: 10
```

Synthesised drums have a sound, and it's a 1980s sound. Sometimes you want an actual
recording of an actual drum, and that means loading files off disk.

`SndBuf` is a UGen that holds an audio file in memory and plays it back. It's the
sampler, and it's about as simple as this gets.

```chuck file="groovebox.ck" verified=true
SndBuf buf => dac;
me.dir() + "/samples/kick.wav" => buf.read;

<<< "loaded", buf.samples(), "samples,", buf.length()/second, "sec" >>>;

0 => buf.pos;
1.0 => buf.rate;
0.8 => buf.gain;

500::ms => now;
```

Chucking a filename into `buf.read` loads the file. It plays from wherever `buf.pos`
currently is, so `0 => buf.pos` is how you trigger it: rewind to the start and it goes.
That's the whole API for one-shot playback.

Two details that matter. `buf.rate` is playback speed, where 1.0 is normal, 2.0 is an
octave up and half as long, and negative values play it backwards. And a buffer that has
finished playing sits at the end doing nothing, which is why you retrigger by setting
`pos` rather than by calling some `play()` method that doesn't exist.

Use `me.dir()` for the path, always. A relative path is resolved against wherever you
happened to run `chuck` from, so it works on your machine and breaks on everyone else's.

### A sampled track

Wrapping it in the pattern from chapter 6 needs almost nothing new:

```chuck file="groovebox.ck"
fun void sampleTrack( string file, int pattern[], float level )
{
    SndBuf buf => dac;
    me.dir() + file => buf.read;
    level => buf.gain;
    buf.samples() => buf.pos;   // park at the end, silent

    while( true )
    {
        tick => now;
        if( pattern[ stepCount % pattern.size() ] == 1 )
            0 => buf.pos;
    }
}

spork ~ sampleTrack( "/samples/kick.wav", [1,0,0,0], 0.9 );
spork ~ sampleTrack( "/samples/snare.wav", [0,0,1,0], 0.7 );
```

That `buf.samples() => buf.pos` on load is the one non-obvious line. A freshly loaded
buffer sits at position zero, which means it plays immediately, which means every sample
track fires once the moment your program starts. Parking it at the end keeps it quiet
until the first real hit.

:::note
ChucK reads WAV, AIFF and a few others through its built-in libsndfile. It does not read
MP3. Convert first, and prefer 48kHz files so nothing gets resampled on load.
:::

:::changed
- `SndBuf`, loaded by chucking a path into `.read`
- Trigger by setting `.pos` to 0; there is no play method
- `.rate` for speed and pitch, negative for reverse
- Park a freshly loaded buffer at `.samples()` or it fires on startup
- Always build paths from `me.dir()`
:::

---

## Chapter 10: Playing it from outside

```yaml
part: three
eyebrow: Episode 10
prev: 09
next: 11
```

The groovebox currently only listens to itself. Two ways to change that: MIDI, for
hardware sitting on your desk, and OSC, for anything on the network.

### MIDI in

First find out what's connected:

```terminal
chuck --probe
```

Among the audio devices it lists MIDI inputs, each with a number. Then:

```chuck file="groovebox.ck" verified=partial
MidiIn min;
MidiMsg msg;

if( !min.open( 0 ) )
{
    <<< "could not open midi device 0" >>>;
    me.exit();
}

<<< "listening to", min.name() >>>;

while( true )
{
    min => now;
    while( min.recv( msg ) )
    {
        <<< msg.data1, msg.data2, msg.data3 >>>;
    }
}
```

> Note for the agent: this block compiles but was not executed end-to-end during
> verification, because the test environment had no MIDI backend. Everything else marked
> `verified=true` was run. Do not flag this as an error; do not "correct" it.

Look at the shape of that loop, because it's the same shape as chapter 6. `min => now`
waits on the MIDI input exactly the way `tick => now` waits on the clock event. A
`MidiIn` *is* an event as far as your code is concerned. Everything you learned about
events applies unchanged.

The inner `while` is there because several messages can arrive in the same instant, and
`recv` returns false once you've drained them.

The three bytes: `data1` is the status, where 144 is note-on and 128 is note-off on
channel 1. `data2` is the note number, the same numbering as `Std.mtof` from chapter 3.
`data3` is velocity. A note-on with velocity 0 means note-off, because MIDI is from 1983
and has opinions.

```chuck file="groovebox.ck"
while( min.recv( msg ) )
{
    if( msg.data1 == 144 && msg.data3 > 0 )
        lead.hit( msg.data2 );
    else if( msg.data1 == 128 || msg.data3 == 0 )
        lead.release();
}
```

Six lines and the `Voice` class from chapter 7 is now a playable instrument. It works
because `hit()` already took a note number.

### OSC

Open Sound Control is the modern one: messages over UDP with readable addresses and real
types, so anything on the network can drive the groovebox.

```chuck file="groovebox.ck" verified=true
OscIn oin;
OscMsg omsg;

6449 => oin.port;
oin.addAddress( "/step, i" );

<<< "listening on port", oin.port() >>>;

while( true )
{
    oin => now;
    while( oin.recv( omsg ) )
    {
        <<< "step", omsg.getInt(0) >>>;
    }
}
```

Same loop again. `addAddress` declares what you'll accept: an address pattern, then a
comma, then a type string, where `i` is int, `f` is float and `s` is string. Read the
arguments back with `getInt`, `getFloat` and `getString` by position.

:::note
Point this at the clock from chapter 6 and something else becomes the timekeeper. Have
the OSC handler call `tick.broadcast()` instead of running your own clock shred, and
every track follows the network with no changes to any track code. That's the payoff for
having put the clock behind an event three chapters ago.
:::

:::changed
- `MidiIn` and `MidiMsg`, opened by device number from `--probe`
- Inputs behave like events: `min => now`, then drain with `recv`
- 144 note-on, 128 note-off, and velocity 0 means off
- `OscIn` with `addAddress("/name, types")`
- Anything that can broadcast the clock event can drive the whole machine
:::

---

## Chapter 11: Recording it

```yaml
part: three
eyebrow: Episode 11
prev: 10
next: 12
```

Everything so far exists only while it's playing. `WvOut` writes it to a file, and it
takes about three lines once you know where they go.

```chuck file="groovebox.ck" verified=true
dac => WvOut2 rec => blackhole;
me.dir() + "/render.wav" => rec.wavFilename;

// ... the whole groovebox runs here ...

rec.closeFile();
```

Three things worth understanding in that first line.

`WvOut2` is the stereo version; plain `WvOut` is mono. Since `dac` is stereo, you want
the 2.

`dac => rec` looks backwards and isn't. You can chuck `dac` into something to tap
whatever is reaching the speakers, which is exactly what you want for recording a mix
rather than one track.

`blackhole` is a UGen that consumes samples and produces nothing. Every chain needs
something pulling samples through it, and since the recorder's output shouldn't go to the
speakers and create a loop, it goes to the blackhole instead. Any time you need a UGen to
run without being heard (analysis, metering, recording), this is the ending you want.

:::note
**The bug everybody hits.** Forget `closeFile()` and you get a WAV with a broken header
that some players refuse to open. The file was being written the whole time; the header
holding the length only gets finalised on close.

If you kill the VM with Ctrl-C mid-render, same result. Give the recording shred a
definite length and let it finish.
:::

To render a fixed number of bars and exit cleanly:

```chuck file="groovebox.ck"
dac => WvOut2 rec => blackhole;
me.dir() + "/render.wav" => rec.wavFilename;

spork ~ track( bass, [1,0,0,0], 36 );
spork ~ track( lead, [0,0,1,0], 60 );
spork ~ clock();

8 * 4 * step => now;   // eight bars of four steps

rec.closeFile();
<<< "wrote render.wav" >>>;
```

Because the duration is written in `step` units, the render is exactly eight bars at
whatever tempo you set, with no arithmetic on your part. Durations being a real type
keeps paying off.

Add `--silent` and it renders without opening an audio device at all, which is faster
than real time and doesn't need speakers:

```terminal
chuck --silent groovebox.ck
```

:::changed
- `WvOut2` for stereo, `WvOut` for mono
- `dac => rec` taps the final mix
- `blackhole` pulls samples through a chain nobody hears
- `closeFile()` or the header is broken
- `--silent` renders offline, no audio device needed
:::

---

## Chapter 12: Where this transfers

```yaml
part: three
eyebrow: Episode 12
prev: 11
next: null
```

Last one. Nobody is hiring ChucK developers, and I'd rather say that plainly than let you
find out later. What you've actually learned across these twelve chapters transfers
almost completely, so this chapter is the map.

ChucK is a research and teaching language out of Princeton and Stanford. The audio
industry runs on C++ with JUCE for plugins, SuperCollider for a lot of live and
installation work, Faust for DSP, and Python for anything touching machine learning. What
ChucK gave you is the mental model, and the mental model is the part that's hard to
acquire.

### Where `now` went

The single biggest thing to translate. In ChucK you advance time and the engine fills in
the audio. Everywhere else it's inverted: the engine calls your function every so often
with a buffer to fill, and you have no say in when.

In JUCE that's `processBlock`, handed a buffer of maybe 256 samples and expected to
return quickly. There is no `now`. You keep a sample counter, and "half a second from
now" becomes "when my counter reaches 24000". Your envelope no longer sets itself over
100ms; it advances a fraction per sample, every sample, forever.

This feels like a downgrade because it is one, and it's a downgrade with a reason. That
callback runs on a realtime audio thread that must never block, never allocate, and never
take a lock. ChucK's scheduler does the same work for you and pays the cost internally.
Once you've written both, the restrictions on the audio thread stop looking arbitrary and
start looking like the obvious consequence of having to hit a deadline every 5
milliseconds.

### Concept by concept

**Unit generators and chains.** Chapter 2 transfers directly. SuperCollider has UGens by
that exact name and chains them in a synth graph. Faust is entirely built from operators
that connect processors, and its `:` is our `=>`. JUCE has `juce::dsp` with a
`ProcessorChain` doing the same job with more ceremony. The idea that sound is a graph of
small processors is universal.

**Envelopes.** Chapter 3 transfers with the names intact. JUCE has `ADSR` and
`ADSR::Parameters`, and you call `noteOn` and `noteOff` instead of `keyOn` and `keyOff`.
SuperCollider has `EnvGen` with `Env.adsr`. Same four numbers, same behaviour, same bug
where you cut off the release.

**Shreds and concurrency.** Chapter 5 is the one with no direct equivalent, and knowing
that is itself useful. SuperCollider's Routines and Tasks driven by a Clock are the
closest thing. In JUCE you don't get concurrency at all in the audio thread; you get one
callback and you multiplex tracks by hand, checking each one's counter every block.
Having written the version where the language handles it, you'll recognise exactly what
the manual version is reimplementing.

**Events and clocks.** Chapter 6 becomes SuperCollider's `TempoClock`, and in JUCE it
becomes a sample counter plus a message-thread timer for anything not sample-accurate.
The structural lesson (one thing owns tempo, everything else subscribes) is how every
sequencer ever written is organised, including the ones you'll be paid to work on.

**Live code swapping.** Chapter 8 is ChucK's, and mostly stays ChucK's. SuperCollider can
re-evaluate blocks live, which is close. JUCE plugins get hot reload only if you build it
yourself. This is the one capability you should expect to miss.

**MIDI, OSC, files.** Chapters 9 to 11 are the same everywhere with different spellings.
`MidiMessage` in JUCE, still three bytes, still 144 and 128. OSC is a wire protocol, so
it's identical by definition. `AudioFormatReader` and `AudioFormatWriter` replace
`SndBuf` and `WvOut`.

### What to do next

If plugins are where you're heading, JUCE is the move, and you'll find your ChucK
experience does most of the conceptual work. If you want to keep writing music as code,
SuperCollider is the deeper language with the larger community. If you liked the DSP
itself more than the sequencing, Faust compiles to C++, WASM and plugin formats, and
there's FaucK, which lets you write Faust inside ChucK.

And ChucK stays useful even after you've moved on. It's the fastest way I know to test
whether an idea for a rhythm or a synth voice is any good, before committing a weekend to
building it properly in C++.

That's the series. You started with a program that couldn't do anything until you told
time to move, and ended with a multi-track groovebox you can rewrite while it plays. Go
add something to it: a snare with a bit of swing, a bassline that follows the kick, a
filter that opens across eight bars. That's the fun part and it's yours now.

Thanks for following along, and see you in a different one. Till then, have fun coding
music.

---

## APPENDIX: verification status

Built and run against ChucK `1.5.5.9-dev (chai)` compiled from `github.com/ccrma/chuck`,
using the RtAudio dummy backend and `chuck --silent`, so examples were executed with no
audio hardware.

| Chapter | Status |
|---|---|
| 00–04 | All blocks executed. Outputs shown are real. |
| 05–09 | All blocks executed. Outputs shown are real. |
| 10 | OSC executed. **MIDI compiled but not run**: no MIDI backend in the test container. |
| 11 | Executed; `WvOut2` produced a valid 48kHz stereo WAV. |
| 12 | Prose only, no ChucK code. |

Blocks marked `verified=true` in their info string ran exactly as written. Blocks with no
`verified` flag are composed from verified pieces but were not run as a unit (mostly the
"drop it into the tracks" variants that depend on `clock`, `tick` and `stepCount` from
earlier chapters being present in the same file.
