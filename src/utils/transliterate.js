// Serbian Latin → Cyrillic transliteration (1:1 mapping)
// Digraphs must be processed before single letters
const DIGRAPHS = [
  ['Lj', 'Љ'], ['lj', 'љ'],
  ['Nj', 'Њ'], ['nj', 'њ'],
  ['Dž', 'Џ'], ['dž', 'џ'],
  ['LJ', 'Љ'], ['NJ', 'Њ'], ['DŽ', 'Џ']
];

const SINGLE = [
  ['A', 'А'], ['a', 'а'],
  ['B', 'Б'], ['b', 'б'],
  ['V', 'В'], ['v', 'в'],
  ['G', 'Г'], ['g', 'г'],
  ['D', 'Д'], ['d', 'д'],
  ['Đ', 'Ђ'], ['đ', 'ђ'],
  ['E', 'Е'], ['e', 'е'],
  ['Ž', 'Ж'], ['ž', 'ж'],
  ['Z', 'З'], ['z', 'з'],
  ['I', 'И'], ['i', 'и'],
  ['J', 'Ј'], ['j', 'ј'],
  ['K', 'К'], ['k', 'к'],
  ['L', 'Л'], ['l', 'л'],
  ['M', 'М'], ['m', 'м'],
  ['N', 'Н'], ['n', 'н'],
  ['O', 'О'], ['o', 'о'],
  ['P', 'П'], ['p', 'п'],
  ['R', 'Р'], ['r', 'р'],
  ['S', 'С'], ['s', 'с'],
  ['T', 'Т'], ['t', 'т'],
  ['Ć', 'Ћ'], ['ć', 'ћ'],
  ['U', 'У'], ['u', 'у'],
  ['F', 'Ф'], ['f', 'ф'],
  ['H', 'Х'], ['h', 'х'],
  ['C', 'Ц'], ['c', 'ц'],
  ['Č', 'Ч'], ['č', 'ч'],
  ['Š', 'Ш'], ['š', 'ш']
];

export function latinToCyrillic(text) {
  if (!text) return text;
  let result = text;
  // Digraphs first
  for (const [lat, cyr] of DIGRAPHS) {
    result = result.split(lat).join(cyr);
  }
  // Then single characters
  for (const [lat, cyr] of SINGLE) {
    result = result.split(lat).join(cyr);
  }
  return result;
}
