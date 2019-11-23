function calculateBoxSize (width, height, orientation, noOfStars) {
    if (orientation == 'LtoR' || orientation == 'RtoL') {
      return ((width / noOfStars) < height) ? (width / noOfStars) : height
    } else {
      return ((height / noOfStars) < width) ? (height / noOfStars) : width
    }
  }
  
  function greaterThanMaximumPadding (box, padding) {
    if (padding > (box * 10 / 100)) { return true }
    return false
  }
  
  function checkHexValue (str) {
    let regExpr = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/
    if (regExpr.test(str)) { return true }
    return false
  }

  export {calculateBoxSize, greaterThanMaximumPadding, checkHexValue};