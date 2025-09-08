function convertPointsToGrade(points: number): { grade: string; reason: string } {
  switch (true) {
    case points >= 92:
      return { grade: "Sehr gut (1)", reason: "Punkte liegen über 92." };
    case points >= 81:
      return { grade: "Gut (2)", reason: "Punkte liegen zwischen 81 und 91." };
    case points >= 67:
      return { grade: "Befriedigend (3)", reason: "Punkte liegen zwischen 67 und 80." };
    case points >= 50:
      return { grade: "Ausreichend (4)", reason: "Punkte liegen zwischen 50 und 66." };
    case points >= 30:
      return { grade: "Mangelhaft (5)", reason: "Punkte liegen zwischen 30 und 49." };
    default:
      return { grade: "Ungenügend (6)", reason: "Punkte liegen unter 30." };
  }
}

export default function calculateResults(grades: Record<string, number>) {
  const teil1Weight = 0.4;
  const teil2Weight = 0.6;

  const teil1 = grades.teil1 || 0;

  const teil2_p1 =
    (grades.teil2_p1_doku || 0) * 0.5 +
    (grades.teil2_p1_präsi || 0) * 0.25 +
    (grades.teil2_p1_gespräch || 0) * 0.25;

  const teil2_p2 =
    (grades.teil2_p2_planung || 0) * 0.5 +
    (grades.teil2_p2_algorithmen || 0) * 0.5;

  const ws = grades.teil2_ws || 0;

  const totalTeil2 = teil2_p1 * 0.5 + teil2_p2 * 0.4 + ws * 0.1;

  const total = teil1 * teil1Weight + totalTeil2 * teil2Weight;

  const { grade: finalGrade, reason: gradeReason } = convertPointsToGrade(total);

  const teil2Grades = [
    grades.teil2_p1_doku || 0,
    grades.teil2_p1_präsi || 0,
    grades.teil2_p1_gespräch || 0,
    grades.teil2_p2_planung || 0,
    grades.teil2_p2_algorithmen || 0,
    ws,
  ];

  const hasSixInTeil2 = teil2Grades.some((grade) => grade < 30);

  const fiveCountInTeil2 = teil2Grades.filter(
    (grade) => grade >= 30 && grade < 50
  ).length;

  const teil2Passed = totalTeil2 >= 50 && !hasSixInTeil2 && fiveCountInTeil2 <= 1;

  const passed = teil2Passed && total >= 50;

  const issues: string[] = [];

  if (hasSixInTeil2) {
    issues.push("Es gibt mindestens eine Note 6 in Teil 2.");
  }
  if (fiveCountInTeil2 > 1) {
    issues.push("Es gibt mehr als eine Note 5 in Teil 2.");
  }

  return {
    total,
    finalGrade,
    gradeReason,
    passed,
    issues,
  };
}
