export const generateId = (): string => {
  return "_".concat(
    Math.random()
      .toString(36)
      .substr(2, 9)
  );
};
