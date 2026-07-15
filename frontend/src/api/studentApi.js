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