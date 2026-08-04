import api from "./axios";

/**
 * Get all questions for one MCQ assessment.
 */
export async function getAssessmentQuestions(
  assessmentId,
) {
  const response = await api.get(
    `/assessments/${assessmentId}/questions`,
  );

  return response.data;
}

/**
 * Get one MCQ question.
 */
export async function getAssessmentQuestion(
  assessmentId,
  questionId,
) {
  const response = await api.get(
    `/assessments/${assessmentId}/questions/${questionId}`,
  );

  return response.data;
}

/**
 * Create a new MCQ question.
 */
export async function createAssessmentQuestion(
  assessmentId,
  data,
) {
  const response = await api.post(
    `/assessments/${assessmentId}/questions`,
    data,
  );

  return response.data;
}

/**
 * Update an MCQ question.
 */
export async function updateAssessmentQuestion(
  assessmentId,
  questionId,
  data,
) {
  const response = await api.put(
    `/assessments/${assessmentId}/questions/${questionId}`,
    data,
  );

  return response.data;
}

/**
 * Delete an MCQ question.
 */
export async function deleteAssessmentQuestion(
  assessmentId,
  questionId,
) {
  const response = await api.delete(
    `/assessments/${assessmentId}/questions/${questionId}`,
  );

  return response.data;
}