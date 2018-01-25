export function get(url) {
    return fetch(url).then(response => response.json());
}

export function post(url, body) {
    return fetch(url, {
        method: 'POST',
        body: JSON.stringify(body),
        credentials: 'include'
    }).then(response => response.json());
}
