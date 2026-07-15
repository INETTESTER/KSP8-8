import http from 'k6/http';
import { error_check } from '../check/check.js';
export function Authen_CreateTxn_CreateQR_Bay(cid) {
    //Step 1 : Authen
    const url = 'https://loadtest-new-ops.inet.co.th/oauth/api/v1/oauth-token';
    const orderId = `${__VU}${__ITER}` + cid;
    const payload = JSON.stringify({
        key: "cQkSVpaRegca85zVwUnqrLfiJE6FmfZBL3Q2VmldoCa2xzoh6l65g5qtjEwWDTuUHtJA02WO5wlVndXPu2R7wfuSK89B4iFFNGNm397P4FqTgrfa2nai2uogUahclyqWxsDZFvN8bkow4HewrKb92Z49WbZmcYL3wp7vRVgVhvo=",
        orderId: "LOADTEST-BAY-20250625" + orderId
        //orderId: "LOADTEST-KSP"
    });

    const params = {
        //timeout: "180s", // หรือ "300000ms"
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
    //console.log('Response body:', token_authen);
    //return response_authen;
    //====================================================================================================
    //Step 2 : Create Transactions
    const url2 = 'https://loadtest-new-ops.inet.co.th/api/v1/payment-transactions/access-token';

    const payload2 = JSON.stringify({
        key: "cQkSVpaRegca85zVwUnqrLfiJE6FmfZBL3Q2VmldoCa2xzoh6l65g5qtjEwWDTuUHtJA02WO5wlVndXPu2R7wfuSK89B4iFFNGNm397P4FqTgrfa2nai2uogUahclyqWxsDZFvN8bkow4HewrKb92Z49WbZmcYL3wp7vRVgVhvo=",
        //orderId: "LOADTEST-KSP",
        orderId: "LOADTEST-BAY-20250625" + orderId,
        orderDesc: "LOADTEST-BAY-20250625",
        amount: 1,
        payType: "QR",
        regRef: ""
    });

    const params2 = {
        //timeout: "180s", // หรือ "300000ms"
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
    const url_qr = 'https://loadtest-new-ops.inet.co.th/bay/api/v1/payment/qr';

    const payload_qr = JSON.stringify({
        accessToken: '' + token_transaction,
    });

    const headers = {
        'Content-Type': 'application/json',
        Authorization: 'Basic Y2ltYnByb21wdHBheTo=',
    };

    const response_qr = http.post(url_qr, payload_qr, {
        headers,
    });

    //console.log(response_qr.body);

    return response_qr;
}