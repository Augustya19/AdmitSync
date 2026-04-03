export const filterExams = (input, exams) => {
  let filtered = exams;

  const lower = input.toLowerCase();

  if (lower.includes("engineering")) {
    filtered = filtered.filter(e => e.field === "engineering");
  }

  if (lower.includes("commerce") || lower.includes("bcom")) {
    filtered = filtered.filter(e => e.field === "commerce");
  }

  if (lower.includes("easy")) {
    filtered = filtered.filter(e => e.difficulty === "low");
  }

  return filtered;
};