# Word Finder

Two word tools in one self-contained HTML file. No backend, no dependencies,
no network — open it and it works, online or off.

**[Live version](https://hakanburakkaya.github.io/word-finder/)** · or download
[`index.html`](index.html) and open it locally.

## 1. Word Finder

Type the letters you have and get every word you can build from them — longest
first, grouped by length, with Scrabble points. `?` is a blank that stands in for
any letter.

Leave the letters box empty and it becomes a crossword search instead: a pattern
like `c_a__`, starts with, ends with, must contain, must not contain, exact
length. The two mix freely — letters *and* a shape at the same time.

Letters are consumed the way tiles are: `BLURB` needs two B's, so a rack holding
one B only matches it if you also have a blank. Formally, a word is buildable when

```
sum over letters of max(0, used_by_word - held_in_rack) <= blanks
```

## 2. Wordle Helper

Type a guess, tap each tile to cycle grey → yellow → green, add as many rows as
you like — they all filter together. Results are ranked by letter frequency in
the surviving pool, with three suggested guesses at the top. An advanced panel
adds patterns, required/banned letters, per-position rules, and minimum letter
counts.

### Repeated letters

Most quick solvers get this wrong. A grey tile does **not** mean "this letter is
absent" — it means "no more of this letter than I already marked". Each guess is
compiled into per-letter `{min, max}` counters:

- green + yellow occurrences of a letter in one row = the **minimum** count
- if that same row also greys that letter, the minimum is also the **maximum**
- any non-green tile also rules that letter out **at that position**
- across rows: `min` = the largest minimum, `max` = the smallest maximum

So `SPEED` with a green E in slot 3 and a grey E in slot 4 means *exactly one* E —
`CREEK` is correctly rejected.

## Correctness

17 assertions — 9 on the Wordle colour rules, 8 on the rack/blank arithmetic —
run on page load and report in the footer and the browser console. They use a
fixed 16-word dictionary, so they test the logic rather than the word lists.

## Speed

Words are pre-grouped by length and flattened into typed arrays (a 26-bit
letter-presence mask plus a byte per letter), so filtering never touches strings.
The rack check, the Wordle constraints and the positional rules all run in one
pass, and result ordering uses a packed numeric sort key so the native sort runs
without a comparator callback.

Measured in-browser, worst cases: 24 ms to unscramble a 7-tile rack with a blank
(1,042 hits), 23 ms for an unfiltered scan of all 80,368 words, 32 ms for the
Wordle helper ranking 18,383 eight-letter candidates. Typical interactions are
1–6 ms.

## Word lists

| Used by | Source | Words |
|---|---|---|
| Word Finder, 2–8 letters | [ENABLE1](https://github.com/dolph/dictionary) | 80,368 |
| Wordle Helper, 5 letters | [Wordle valid-guess list](https://github.com/tabatkins/wordle-list) | 14,855 |
| Wordle Helper, 4/6/7/8 letters | ENABLE1 | 70,664 |

The Wordle helper needs the list Wordle actually accepts; the finder wants one
consistent dictionary across every length. So both are embedded.

## Building

`index.html` is generated — edit `template.html`, not the built file:

```
node build.js
```

It injects the word lists from `wordle5.txt` and `enable1.txt` (both committed;
the source URLs are at the top of `build.js`) into `template.html`.
