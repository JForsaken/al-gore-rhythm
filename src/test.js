export const test1 = () => {
  console.log('lambda');
};

export const test2 = () => {
  // spread operator test
  const obj = { a: 1, b: 2, c: 3 };
  console.log({ d: 4, ...obj });
};
