const axios = require('axios');

const BASE_URL = 'https://gorest.co.in/public/v2';

const TOKEN = '47dd96fbd6388136bfde2125450de034d216f7a2d53d6d8c98843d884846ce04';
const headers = {
    Authorization: `Bearer ${TOKEN}`,
    'Content-Type': 'application/json'
};

let user, post, comment;

describe('GET: Отримання всіх записів', () => {

    test('Отримання всіх користувачів', async () => {
        const response = await axios.get(`${BASE_URL}/users`);
        expect(response.status).toBe(200);
        expect(Array.isArray(response.data)).toBeTruthy();
    });

    test('Отримання всіх постів', async () => {
        const response = await axios.get(`${BASE_URL}/posts`);
        expect(response.status).toBe(200);
        expect(Array.isArray(response.data)).toBeTruthy();
    });

    test('Отримання всіх коментарів', async () => {
        const response = await axios.get(`${BASE_URL}/comments`);
        expect(response.status).toBe(200);
        expect(Array.isArray(response.data)).toBeTruthy();
    });

    test('Отримання всіх користувачів з фільтрацією по статусу', async () => {
        const response = await axios.get(`${BASE_URL}/users?status=active`);
        expect(response.status).toBe(200);
        expect(response.data.every(user => user.status === 'active')).toBeTruthy();
    });

    test('Отримання всіх постів конкретного користувача', async () => {
        const userId = 7784378;
        const response = await axios.get(`${BASE_URL}/users/${userId}/posts`);
        expect(response.status).toBe(200);
        expect(response.data).toBeTruthy();
    });

});

describe('GET: Отримання конкретного запису', () => {

    test('Отримання конкретного користувача', async () => {
        const userId = 7887679;
        const response = await axios.get(`${BASE_URL}/users/${userId}`);
        expect(response.status).toBe(200);
        expect(response.data).toHaveProperty('id', userId);
    });

    test('Отримання конкретного посту', async () => {
        const postId = 209691;
        const response = await axios.get(`${BASE_URL}/posts/${postId}`);
        expect(response.status).toBe(200);
        expect(response.data).toHaveProperty('id', postId);
    });

    test('Отримання конкретного коментаря', async () => {
        const commentId = 151516;
        const response = await axios.get(`${BASE_URL}/comments/${commentId}`);
        expect(response.status).toBe(200);
        expect(response.data).toHaveProperty('id', commentId);
    });

    test('Отримання користувача, якого не існує (404)', async () => {
        try {
            await axios.get(`${BASE_URL}/users/99999999`);
        } catch (error) {
            expect(error.response.status).toBe(404);
        }
    });

    test('Отримання посту, якого не існує (404)', async () => {
        try {
            await axios.get(`${BASE_URL}/posts/99999999`);
        } catch (error) {
            expect(error.response.status).toBe(404);
        }
    });

});

describe('POST запити до GoRest', () => {

    test('Створення нового користувача', async () => {
        const newUser = {
            name: 'Тестовий Користувач',
            gender: 'male',
            email: `testuser${Date.now()}@mail.com`,
            status: 'active'
        };

        const response = await axios.post(`${BASE_URL}/users`, newUser, { headers });
        expect(response.status).toBe(201);
        expect(response.data).toMatchObject(newUser);
        user = response.data.id;
    });

    test('Створення посту для користувача', async () => {
        const newPost = {
            user_id: user,
            title: 'Тестовий пост',
            body: 'Це тестовий запис.'
        };

        const response = await axios.post(`${BASE_URL}/posts`, newPost, { headers });
        expect(response.status).toBe(201);
        expect(response.data).toMatchObject(newPost);
        post = response.data.id;
    });

    test('Створення коментаря до посту', async () => {
        const newComment = {
            post_id: post,
            name: 'Тестовий Коментатор',
            email: `testcomment${Date.now()}@mail.com`,
            body: 'Це тестовий коментар.'
        };

        const response = await axios.post(`${BASE_URL}/comments`, newComment, { headers });
        expect(response.status).toBe(201);
        expect(response.data).toMatchObject(newComment);
        comment = response.data.id;
    });

    test('Створення запису без необхідних полів (очікується 422)', async () => {
        try {
            await axios.post(`${BASE_URL}/users`, {}, { headers });
        } catch (error) {
            expect(error.response.status).toBe(422);
        }
    });

    test('Створення користувача з уже існуючим email (очікується 422)', async () => {
        const existingUser = {
            name: 'Дубль Користувач',
            gender: 'female',
            email: 'testuser@mail.com',
            status: 'active'
        };

        try {
            await axios.post(`${BASE_URL}/users`, existingUser, { headers });
        } catch (error) {
            expect(error.response.status).toBe(422);
        }
    });

});

describe('PUT запити до GoRest', () => {

    test('Оновлення імені користувача', async () => {
        const userId = user;
        const updatedData = { name: 'Оновлене Ім’я' };

        const response = await axios.put(`${BASE_URL}/users/${userId}`, updatedData, { headers });
        expect(response.status).toBe(200);
        expect(response.data.name).toBe(updatedData.name);
    });

    test('Оновлення статусу користувача', async () => {
        const userId = user;
        const updatedData = { status: 'inactive' };

        const response = await axios.put(`${BASE_URL}/users/${userId}`, updatedData, { headers });
        expect(response.status).toBe(200);
        expect(response.data.status).toBe(updatedData.status);
    });

    test('Оновлення посту користувача', async () => {
        const postId = post;
        const updatedData = { title: 'Оновлений заголовок' };

        const response = await axios.put(`${BASE_URL}/posts/${postId}`, updatedData, { headers });
        expect(response.status).toBe(200);
        expect(response.data.title).toBe(updatedData.title);
    });

    test('Оновлення неіснуючого користувача (очікується 404)', async () => {
        try {
            await axios.put(`${BASE_URL}/users/99999999`, { name: 'Test' }, { headers });
        } catch (error) {
            expect(error.response.status).toBe(404);
        }
    });

    test('Оновлення користувача без змін (очікується 200)', async () => {
        const userId = user;
        const userData = {};

        const response = await axios.put(`${BASE_URL}/users/${userId}`, userData, { headers });
        expect(response.status).toBe(200);
    });

});

describe('DELETE запити до GoRest', () => {

    test('Видалення коментаря до посту', async () => {
        const commentId = comment;

        const response = await axios.delete(`${BASE_URL}/comments/${commentId}`, { headers });
        expect(response.status).toBe(204);
    });

    test('Видалення посту', async () => {
        const postId = post;

        const response = await axios.delete(`${BASE_URL}/posts/${postId}`, { headers });
        expect(response.status).toBe(204);
    });

    test('Видалення користувача', async () => {
        const userId = user;

        const response = await axios.delete(`${BASE_URL}/users/${userId}`, { headers });
        expect(response.status).toBe(204);
    });

    test('Видалення неіснуючого користувача (очікується 404)', async () => {
        try {
            await axios.delete(`${BASE_URL}/users/99999999`, { headers });
        } catch (error) {
            expect(error.response.status).toBe(404);
        }
    });

    test('Видалення без авторизації (очікується 401)', async () => {
        try {
            await axios.delete(`${BASE_URL}/users/7887679`);
        } catch (error) {
            expect(error.response.status).toBe(401);
        }
    });

});
