/* eslint-disable no-console */
const { Fraction } = require('fractional');
// ----------------------------------
// CONTROLS
// ----------------------------------
const art = {
  width: 10 + (9 / 16),
  height: 13 + (1 / 4),
};
const frame = {
  overlap: 1 / 8,
  margin: 1,
};
// ----------------------------------
// CALCULATION
// ----------------------------------
const cut = {
  margin: frame.margin - frame.overlap,
};
function calculateCutDistance(artDistance) {
  return artDistance + (2 * cut.margin) + (2 * frame.margin);
}
cut.width = calculateCutDistance(art.width);
cut.height = calculateCutDistance(art.height);
// ----------------------------------
// PRESENT
// ----------------------------------
function presentTicks(distance) {
  const section3 = new Fraction(frame.margin);
  const section2 = new Fraction(cut.margin);
  const section1 = new Fraction(distance);
  return `${section3}", ${section2}", ${section1}", ${section2}", ${section3}"`;
}
console.log('Width:\t', presentTicks(art.width), `\tTotal: ${new Fraction(cut.width)}"`);
console.log('Height:\t', presentTicks(art.height), `\tTotal: ${new Fraction(cut.height)}"`);
