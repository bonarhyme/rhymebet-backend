const expiryDate = (regDate, duration) => {
  const timeSpan = duration * 24 * 60 * 60 * 1000;
  const theRegDate = regDate;
  const totalDate = timeSpan + theRegDate;
  const theFuture = new Date(totalDate);
  return { expiryDateLiteral: theFuture, expiryDateNumber: totalDate };
};

module.exports = expiryDate;
