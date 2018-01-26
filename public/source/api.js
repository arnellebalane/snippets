export function get(url) {
    return fetch(url, {
        headers: {
            'Accept': 'application/json'
        }
    }).then(response => response.json());
}

export function post(url, body) {
    return fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body),
        credentials: 'include'
    }).then(response => response.json());
}
