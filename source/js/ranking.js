
/*!
 * Upstatic string ranking algorithm v1.0
 * (A port of the Quicksilver string ranking algorithm)
 *
 * http://upstatic.io
 */

String.prototype.score = function (abbreviation) {

  if (abbreviation.length === 0) return 0.9;
  if (abbreviation.length > this.length) return 0.0;

  for (var i = abbreviation.length; i > 0; i--) {
    var subAbbreviation = abbreviation.substring(0,i);
    var index = this.indexOf(subAbbreviation);

    if (index < 0) continue;
    if (index + abbreviation.length > this.length) continue;

    var nextString = this.substring(index + subAbbreviation.length);
    var nextAbbreviation = null;

    if (i >= abbreviation.length) {
      nextAbbreviation = "";
    } else {
      nextAbbreviation = abbreviation.substring(i);
    }

    var remainingScore = nextString.score(nextAbbreviation, index);

    if (remainingScore > 0) {
      var score = this.length - nextString.length;

      if (index !== 0) {
        var j = 0;
        var char = this.charCodeAt(index - 1);

        if (char === 32 || char === 9) {
          for (j = (index - 2); j >= 0; j--) {
            char = this.charCodeAt(j);
            score -= ((char === 32 || char === 9) ? 1 : 0.15);
          }
        } else {
          score -= index;
        }
      }

      score += remainingScore * nextString.length;
      score /= this.length;
      return score;
    }
  }

  return 0.0;
};
