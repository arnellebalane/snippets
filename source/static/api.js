import axios from 'axios';

const instance = axios.create({
    baseURL: window.location.origin + '/api/'
});

export function get(url) {
    return instance.get(url, {
        headers: {
            Accept: 'application/json'
        }
    }).then(response => response.data);
};

export function post(url, body) {
    return instance.post(url, body, {
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(response => response.data);
};
