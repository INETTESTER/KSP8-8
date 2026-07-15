import http from 'k6/http';

export function BAY_callback() {
    const url = 'https://loadtest-new-ops.inet.co.th/bay/api/v1/payment/qr/callback';

    const payload = JSON.stringify({
        trxId: '2606122034457339',
        trxStatus: '1',
        amount: '175',
        datetime: '2026-06-12T20:35:03Z',
        terminalId: '',
        feeMerchant: '65.00',
        fromAccount: 'XXXXXX8109',
        billerId: '010754400009425',
        channel: '2',
    });

    const headers = {
        'Content-Type': 'application/json',
    };

    const response = http.post(url, payload, {
        headers,
    });

    console.log(response.body);

    return response;
}