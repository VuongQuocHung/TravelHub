module.exports.randomNumberString = (n) => {
  let result = '';
  for (let i = 0; i < n; i++) {
    result += Math.floor(Math.random() * 10); // số từ 0–9
  }
  return result;
}
