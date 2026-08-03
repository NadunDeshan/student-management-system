import api from './axios';

/**
 * Get assessments with search, filters, and pagination.
 */
export async function getAssessments(
    search = '',
    type = '',
    status = '',
    page = 1
) {
    const response = await api.get('/assessments', {
        params: {
            search,
            type,
            status,
            page,
        },
    });

    return response.data;
}

/**
 * Get one assessment.
 */
export async function getAssessment(id) {
    const response = await api.get(
        `/assessments/${id}`
    );

    return response.data;
}

/**
 * Create an assessment.
 *
 * Data must be FormData because a PDF
 * attachment may be uploaded.
 */
export async function createAssessment(data) {
    const response = await api.post(
        '/assessments',
        data
    );

    return response.data;
}

/**
 * Update an assessment.
 *
 * We use POST with _method=PUT because
 * multipart file updates work more reliably
 * with Laravel this way.
 */
export async function updateAssessment(id, data) {
    data.append('_method', 'PUT');

    const response = await api.post(
        `/assessments/${id}`,
        data
    );

    return response.data;
}

/**
 * Delete an assessment.
 */
export async function deleteAssessment(id) {
    const response = await api.delete(
        `/assessments/${id}`
    );

    return response.data;
}
export async function getAssessmentSubjects() {
    const user = JSON.parse(
        localStorage.getItem('user') || '{}'
    );

    const endpoint =
        user.role === 'lecturer'
            ? '/lecturer/subjects'
            : '/subjects';

    const response = await api.get(endpoint);

    if (user.role === 'lecturer') {
        return response.data.subjects ?? [];
    }

    return response.data.data ?? [];
}