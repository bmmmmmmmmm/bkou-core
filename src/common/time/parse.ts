const getDateD8 = (offSet: number = 0): DateD8 => {
  const date = new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * offSet)
  const PDate = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}`;
  return PDate;
}

const getDateS = (start) => {
  const date = new Date().getTime() * 1000 + offSet
  return date
}
