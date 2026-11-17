# Audio credits

Every sound in `public/audio/` is CC0 (public domain). No music is used.

| File in `public/audio/` | Cue | Source pack | Original file | Author | License |
|---|---|---|---|---|---|
| _(none yet)_ | | | | | |

Cues without a file use a sound synthesized in code (`src/audio/synth.ts`). Ambiences (wind, fire, waves) are always synthesized.

## How to add the Kenney packs

1. Download these packs from kenney.nl (all CC0) and leave the `.zip` files in `art/audio/kenney/` (that folder is git-ignored):
   - Casino Audio — https://kenney.nl/assets/casino-audio
   - Impact Sounds — https://kenney.nl/assets/impact-sounds
   - Interface Sounds — https://kenney.nl/assets/interface-sounds
   - Sci-fi Sounds — https://kenney.nl/assets/sci-fi-sounds
2. Claude picks one file per cue, converts it to mono MP3 at 96 kbps into `public/audio/`, lists it in `src/audio/manifest.ts` and fills the table above.
