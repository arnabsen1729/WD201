const letters = "abcdefghijklmnopqrstuvwxyz";

const getRandomTitle = () => {
  const randomLetters = Array.from(
    { length: 20 },
    () => letters[Math.floor(Math.random() * letters.length)]
  );
  return randomLetters.join("");
};

const getRandomDateInFuture = () => {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + Math.floor(Math.random() * 100));
  return tomorrow.toISOString().split("T")[0];
};

const getRandomDateInPast = () => {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - Math.floor(Math.random() * 100));
  return yesterday.toISOString().split("T")[0];
};

const getRandomBoolean = () => {
  return Math.random() >= 0.5;
};

module.exports = {
  getRandomTitle,
  getRandomDateInFuture,
  getRandomDateInPast,
  getRandomBoolean,
};
