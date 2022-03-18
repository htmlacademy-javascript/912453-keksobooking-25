const getRandomInRangeInt = (rangeFrom, rangeTo) => {
  if (rangeFrom >= 0 && rangeFrom <= rangeTo) {
    return Math.round(rangeFrom + (Math.random() * (rangeTo - rangeFrom)));
  }
  return null;
};

const getRandomInRangeFloat = (rangeFrom, rangeTo, accuracy) => {
  if (rangeFrom >= 0 && rangeFrom <= rangeTo && accuracy >= 0) {
    return (rangeFrom + (Math.random() * (rangeTo - rangeFrom))).toFixed(accuracy);
  }
  return null;
};

getRandomInRangeInt(0, 10);
getRandomInRangeFloat(0, 100, 4);
