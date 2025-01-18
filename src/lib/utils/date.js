export const formatDateString = (date) => {
  return new Date(date).toLocaleDateString("en-GB", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
};
