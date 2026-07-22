import http from 'k6/http';
import { error_check } from '../check/check.js';
export function Authen_CreateTxn_CreateQR_SCB(cid) {
    //Step 1 : Authen
    const url = 'https://loadtest-new-ops.inet.co.th/oauth/api/v1/oauth-token';
    const orderId = `${__VU}${__ITER}` + cid;
    const payload = JSON.stringify({
        key: "hKUW6hS0XGO7+MlxuBWoiYE66J8zm8YNE+NDSkE/JqpRTq7nggGO8WvyWn0dhZRJBEdeV9tzzM4cIE7FB8Av/P3GaFz7CTf3+K7a6AhmrqLDzMSzaSd4d4PU5RPD9QR980U8KIceaKpzxjR2SuIUV1ppvLwOpkM36uRizkIXFWM=",
        orderId: "test-balance" + orderId
        //orderId: "LOADTEST-KSP"
    });

    const params = {
        headers: {
            'Content-Type': 'application/json',
        },
    };

    const response_authen = http.post(url, payload, params);
    if (!response_authen || response_authen.error_code || (response_authen.status !== 200 && response_authen.status !== 201)) {
        console.log("Authen Fail!!");
        return response_authen
    }
    const responseBody_oauth = JSON.parse(response_authen.body);
    const token_authen = responseBody_oauth.data.token;
    error_check(response_authen)

    //return response_authen;
    //====================================================================================================
    //Step 2 : Create Transactions
    const url2 = 'https://loadtest-new-ops.inet.co.th/api/v1/payment-transactions/access-token';

    const payload2 = JSON.stringify({
        key: "hKUW6hS0XGO7+MlxuBWoiYE66J8zm8YNE+NDSkE/JqpRTq7nggGO8WvyWn0dhZRJBEdeV9tzzM4cIE7FB8Av/P3GaFz7CTf3+K7a6AhmrqLDzMSzaSd4d4PU5RPD9QR980U8KIceaKpzxjR2SuIUV1ppvLwOpkM36uRizkIXFWM=",
        //orderId: "LOADTEST-KSP",
        orderId: "test-balance" + orderId,
        orderDesc: "LOADTEST-KSP",
        amount: 1,
        payType: "QR",
        regRef: ""
    });

    const params2 = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token_authen,
        },
    };

    const response = http.post(url2, payload2, params2);
    //console.log('Response body:', response.body);
    if (!response || response.error_code || (response.status !== 200 && response.status !== 201)) {
        console.log("CreateTxn Fail ");
        return response
    }
    const responseBody_transaction = JSON.parse(response.body);
    const token_transaction = responseBody_transaction.data.accessToken;
    error_check(response)
    //return response;
    //=================================================================================================
    //Step 3 : QR Code
    //console.log(token_transaction);
    const url_qr = 'https://loadtest-new-ops.inet.co.th/scb/api/v1/payment/qr';

    const payload_qr = JSON.stringify({
        accessToken: '' + token_transaction,
    });

    const headers = {
        'Content-Type': 'application/json',
    };

    const response_qr = http.post(url_qr, payload_qr, {
        headers,
    });
    if (response_qr.status == 401) {
        console.log(response_qr.body);
    }
    //console.log(response_qr.body);

    return response_qr;
}