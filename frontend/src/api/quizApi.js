import api from "./axios";

/**
 * Start a quiz or continue an existing
 * in-progress attempt.
 */
export async function startQuiz(assessmentId) {
  const response = await api.post(
    `/student/quizzes/${assessmentId}/start`,
  );

  return response.data;
}

/**
 * Submit all selected quiz answers.
 */
export async function submitQuiz(
  assessmentId,
  answers,
) {
  const response = await api.post(
    `/student/quizzes/${assessmentId}/submit`,
    {
      answers,
    },
  );

  return response.data;
}

/**
 * Get the submitted quiz result.
 */
export async function getQuizResult(
  assessmentId,
) {
  const response = await api.get(
    `/student/quizzes/${assessmentId}/result`,
  );

  return response.data;
}