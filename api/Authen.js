import http from 'k6/http';

export function Authen() {
    const url = 'https://loadtest-new-ops.inet.co.th/oauth/api/v1/oauth-token';

    const payload = JSON.stringify({
        key: 'T1kbWWoJs68MZ+CZAO2NnitijJviGOhmwpHABEHyMTDt9cckRkbis7ssQOHfRyVmc8rKE8iORfW2WnRvCvS6k0Yj4U4uP4mbiu1K2utFeOBJZmX8CdkDt2nHWnDdbQN0UdCwPYhuqr8HW6O/nyuhqKggh0g77DVZvGfZnDIaPRI=',
        orderId: 'LOADTEST240426001',
    });

    const headers = {
        'Content-Type': 'application/json',
    };

    const response = http.post(url, payload, {
        headers,
    });

    //console.log(response.body);

    return response;
}