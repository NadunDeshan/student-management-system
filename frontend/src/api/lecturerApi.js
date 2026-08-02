import api from './axios';

export const getLecturers = async (search = '', page = 1) => {
    
    const response = await api.get('/lecturers', {
        params: {
            search,
            page,
        },
    });

    return response.data;
};

export const getLecturer = async (id) => {
    const response = await api.get(`/lecturers/${id}`);

    return response.data;
};

export const createLecturer = async (formData) => {
    const response = await api.post('/lecturers', formData);

    return response.data;
};

export const updateLecturer = async (id, formData) => {
    formData.append('_method', 'PUT');

    const response = await api.post(
        `/lecturers/${id}`,
        formData
    );

    return response.data;
};

export const deleteLecturer = async (id) => {
    const response = await api.delete(`/lecturers/${id}`);

    return response.data;
};