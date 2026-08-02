import api from './axios';

/**
 * Get subjects with optional search and page number.
 */
export async function getSubjects(
    search = '',
    page = 1
) {
    const response = await api.get('/subjects', {
        params: {
            search,
            page,
        },
    });

    return response.data;
}

/**
 * Get one subject.
 */
export async function getSubject(id) {
    const response = await api.get(`/subjects/${id}`);

    return response.data;
}

/**
 * Create a subject.
 */
export async function createSubject(data) {
    const response = await api.post('/subjects', data);

    return response.data;
}

/**
 * Update a subject.
 */
export async function updateSubject(id, data) {
    const response = await api.put(
        `/subjects/${id}`,
        data
    );

    return response.data;
}

/**
 * Delete a subject.
 */
export async function deleteSubject(id) {
    const response = await api.delete(
        `/subjects/${id}`
    );

    return response.data;
}