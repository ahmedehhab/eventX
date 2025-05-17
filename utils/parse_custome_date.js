 function parseCustomDate(dateStr) {
  const [day, month, year] = dateStr.split('-');
  return new Date(`${year}-${month}-${day}`);
}

export default parseCustomDate;