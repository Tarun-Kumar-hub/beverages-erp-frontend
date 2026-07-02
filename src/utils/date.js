// import { formatDistanceToNow } from "date-fns";

// // Convert UTC to Indian Time

// export const formatDateTime = (date) => {
//   if (!date) return "-";

//   const utcDate = new Date(date);

//   const istDate = new Date(utcDate.getTime() + 5.5 * 60 * 60 * 1000);

//   return istDate.toLocaleString("en-IN", {
//     day: "numeric",
//     month: "short",
//     year: "numeric",
//     hour: "numeric",
//     minute: "2-digit",
//     second: "2-digit",
//     hour12: true,
//   });
// };

// export const timeAgo = (date) => {
//   if (!date) return "-";

//   const utcDate = new Date(date);

//   const istDate = new Date(utcDate.getTime() + 5.5 * 60 * 60 * 1000);

//   return formatDistanceToNow(istDate, {
//     addSuffix: true,
//   });
// };

import { formatDistanceToNow } from "date-fns";

export const formatDateTime = (date) => {
  if (!date) return "-";

  return new Date(date).toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });
};

export const timeAgo = (date) => {
  if (!date) return "-";

  return formatDistanceToNow(new Date(date), {
    addSuffix: true,
  });
};
