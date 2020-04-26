export const generateId = (): string => {
  return "_".concat(
    Math.random()
      .toString(36)
      .substr(2, 9)
  );
};

export const getRandomInt = (max: number): number => {
  return Math.floor(Math.random() * Math.floor(max));
};

export const shuffle = (arr: Array<any>): Array<any> => {
  for (let i: number = 0; i < arr.length; i++) {
    const randomIndex: number = getRandomInt(arr.length);
    [arr[i], arr[randomIndex]] = [arr[randomIndex], arr[i]];
  }

  return arr;
};
