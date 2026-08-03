import api from './axios';

export const getStudents = async (search = '', page = 1) => {
    const response = await api.get('/students', {
        params: {
            search,
            page,
        },
    });

    return response.data;
};

export const getStudent = async (id) => {
    const response = await api.get(`/students/${id}`);

    return response.data;
};

export const createStudent = async (formData) => {
    const response = await api.post('/students', formData);

    return response.data;
};

export const updateStudent = async (id, formData) => {
    formData.append('_method', 'PUT');

    const response = await api.post(
        `/students/${id}`,
        formData
    );

    return response.data;
};

export const deleteStudent = async (id) => {
    const response = await api.delete(`/students/${id}`);

    return response.data;
};

/**
 * Get one student with all available subjects
 * and their currently registered subject IDs.
 */
export async function getStudentSubjects(studentId) {
    const response = await api.get(
        `/students/${studentId}/subjects`
    );

    return response.data;
}

/**
 * Update the subjects registered to one student.
 */
export async function updateStudentSubjects(
    studentId,
    subjectIds
) {
    const response = await api.put(
        `/students/${studentId}/subjects`,
        {
            subject_ids: subjectIds,
        }
    );

    return response.data;
}