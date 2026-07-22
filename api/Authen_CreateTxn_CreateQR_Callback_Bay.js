import http from 'k6/http';
import { SharedArray } from 'k6/data';
import { error_check } from '../check/check.js';


// โหลด Ref1 จากไฟล์
const data = new SharedArray('ref3', function () {
    return JSON.parse(open('../file/bankref.json')).ref1;
});

export function Authen_CreateTxn_CreateQR_Callback_Bay(cid, scenario) {
    //=========================================
    // Step 1 : Authen
    //=========================================
    const url = 'https://loadtest-new-ops.inet.co.th/oauth/api/v1/oauth-token';
    const orderId = `${__VU}${__ITER}` + cid;

    const payload = JSON.stringify({
        key: "cQkSVpaRegca85zVwUnqrLfiJE6FmfZBL3Q2VmldoCa2xzoh6l65g5qtjEwWDTuUHtJA02WO5wlVndXPu2R7wfuSK89B4iFFNGNm397P4FqTgrfa2nai2uogUahclyqWxsDZFvN8bkow4HewrKb92Z49WbZmcYL3wp7vRVgVhvo=",
        orderId: "LOADTEST-BAY-20250625" + orderId
    });

    const response_authen = http.post(url, payload, {
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (!response_authen || response_authen.error_code || (response_authen.status !== 200 && response_authen.status !== 201)) {
        console.log("Authen Fail!!");
        return response_authen;
    }

    const token_authen = JSON.parse(response_authen.body).data.token;
    error_check(response_authen);

    //=========================================
    // Step 2 : Create Transaction
    //=========================================
    const response = http.post(
        'https://loadtest-new-ops.inet.co.th/api/v1/payment-transactions/access-token',
        JSON.stringify({
            key: "cQkSVpaRegca85zVwUnqrLfiJE6FmfZBL3Q2VmldoCa2xzoh6l65g5qtjEwWDTuUHtJA02WO5wlVndXPu2R7wfuSK89B4iFFNGNm397P4FqTgrfa2nai2uogUahclyqWxsDZFvN8bkow4HewrKb92Z49WbZmcYL3wp7vRVgVhvo=",
            orderId: "LOADTEST-BAY-20250625" + orderId,
            orderDesc: "LOADTEST-BAY-20250625",
            amount: 1,
            payType: "QR",
            regRef: ""
        }),
        {
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + token_authen,
            },
        }
    );

    if (!response || response.error_code || (response.status !== 200 && response.status !== 201)) {
        console.log("CreateTxn Fail");
        return response;
    }

    const token_transaction = JSON.parse(response.body).data.accessToken;
    error_check(response);

    //=========================================
    // Step 3 : Generate QR
    //=========================================
    const response_qr = http.post(
        'https://loadtest-new-ops.inet.co.th/bay/api/v1/payment/qr',
        JSON.stringify({
            accessToken: token_transaction,
        }),
        {
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Basic Y2ltYnByb21wdHBheTo=',
            },
        }
    );

    if (!response_qr || response_qr.error_code || (response_qr.status !== 200 && response_qr.status !== 201)) {
        console.log("Generate QR Fail");
        return response_qr;
    }

    error_check(response_qr);

    //=========================================
    // Step 4 : Callback
    //=========================================
    const ref1 = data[scenario.iterationInTest];
    const response_callback = http.post(
        'https://loadtest-new-ops.inet.co.th/bay/api/v1/payment/qr/callback',
        JSON.stringify({
            trxId: ref1,
            trxStatus: '1',
            amount: '1',
            datetime: '2026-06-12T20:35:03Z',
            terminalId: '',
            feeMerchant: '0.00',
            fromAccount: 'XXXXXX8109',
            billerId: '010754400009425',
            channel: '2',
        }),
        {
            headers: {
                'Content-Type': 'application/json',
            },
        }
    );

    //error_check(response_callback);

    return response_callback;
}