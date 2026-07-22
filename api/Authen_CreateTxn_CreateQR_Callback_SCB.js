import http from 'k6/http';
import { SharedArray } from 'k6/data';
import { error_check } from '../check/check.js';


// โหลด Ref1 จากไฟล์
const data = new SharedArray('ref2', function () {
    return JSON.parse(open('../file/payment_transaction_ref1.json')).ref1;
});

export function Authen_CreateTxn_CreateQR_Callback_SCB(cid, scenario) {
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
    if (!response_qr || response_qr.error_code || (response_qr.status !== 200 && response_qr.status !== 201)) {
        console.log("QR Fail :" + response_qr.body);
        return response_qr
    }
    error_check(response_qr)
    //======================================================================================================
    //Step 4 : Callback
    const ref1 = data[scenario.iterationInTest];
    const url_callback = 'https://loadtest-new-ops.inet.co.th/scb/api/v1/payment/qr-callback';

    const payload_callback = JSON.stringify({
        amount: '1',
        billPaymentRef1: ref1,
        billPaymentRef2: 'M00000496',
        billPaymentRef3: 'NJBP240404000004',
        channelCode: 'PMH',
        currencyCode: '764',
        payeeAccountNumber: '1234567890',
        payeeName: 'LOAD TEST',
        payeeProxyId: '819064831660717',
        payeeProxyType: 'BILLERID',
        payerAccountNumber: '5121090001',
        payerName: 'LOAD TEST',
        payerProxyId: '5121090001',
        payerProxyType: 'ACCOUNT',
        receivingBankCode: '014',
        sendingBankCode: '014',
        transactionDateandTime: '2024-04-04T11:11:39+07:00',
        transactionId: '202404045xzncRcGVcHnQBS',
        transactionType: 'Domestic Transfer',
    });

    const headers_callback = {
        'Content-Type': 'application/json',
        Cookie: '__cf_bm=OB.Eb3YiVk4qS8fCnJpg4vIA6Tn_8oZLo3jQvwxCz9s-1711509545-1.0.1.1-YVef23500PEE1PxfAJHO7Ke_mV7z1jJksp58_U_SbozddU04PxHw_aVgc55uP4qNBzHoeck43EnSAWa_KJkv9g; __cfruid=b569a32fdc9e1d3c4d318e9ea9540b4c361bf28e-1711509545',
    };

    const response_callback = http.post(url_callback, payload_callback, {
        headers_callback,
    });

    //console.log(response.body);

    return response_callback;

}