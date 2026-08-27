# Wordle Solver

Enter the clues you have, get every English word that matches. One self-contained
HTML file, no backend, no dependencies — open it and it works, online or off.

**[Live version](https://hakanburakkaya.github.io/word-finder/)** · or download
[`wordle-solver.html`](wordle-solver.html) and open it locally.

## What it does

- **Board mode** — type a guess, tap each tile to cycle grey → yellow → green.
  Add as many rows as you like; they all filter together.
- **Advanced filters** — required/banned letters, per-position "is" and "is not"
  rules, a `_a__t` pattern, and minimum counts like `2l`. Combines with the board.
- Word lengths 4–8, results ranked best-first with 3 suggested guesses, or A–Z.
- On-screen keyboard coloured by what's known. Dark, mobile-first.

## Repeated letters

Most quick solvers get this wrong. A grey tile does **not** mean "this letter is
absent" — it means "no more of this letter than I already marked". Each guess is
compiled into per-letter `{min, max}` counters:

- green + yellow occurrences of a letter in one row = the **minimum** count
- if that same row also greys that letter, the minimum is also the **maximum**
- any non-green tile also rules that letter out **at that position**
- across rows: `min` = the largest minimum, `max` = the smallest maximum

So `SPEED` with a green E in slot 3 and a grey E in slot 4 means *exactly one* E —
`CREEK` is correctly rejected. Nine assertions cover this; they run on page load
and report in the footer and the console.

## Speed

Words are pre-grouped by length and flattened into typed arrays (a 26-bit
letter-presence mask plus a byte per letter), so filtering never touches strings.
Measured in-browser: 1–6 ms typical, 32 ms worst case (a single yellow E at 8
letters, ranking 18,383 words).

## Word lists

| Length | Source | Words |
|---|---|---|
| 5 | [Wordle valid-guess list](https://github.com/tabatkins/wordle-list) | 14,855 |
| 4, 6, 7, 8 | [ENABLE1](https://github.com/dolph/dictionary) | 70,664 |

## Building

`wordle-solver.html` is generated — edit `template.html`, not the built file:

```
node build.js
```

It injects the word lists from `wordle5.txt` and `enable1.txt` (both committed;
the source URLs are at the top of `build.js`) into `template.html`.
