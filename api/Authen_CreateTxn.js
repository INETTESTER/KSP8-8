import http from 'k6/http';
import { error_check } from '../check/check.js';
export function Authen_CreateTxn(cid) {
    //Step 1 : Authen
    const url = 'https://loadtest-new-ops.inet.co.th/oauth/api/v1/oauth-token';
    const orderId = `${__VU}${__ITER}` + cid;
    //console.log(orderId);
    const payload = JSON.stringify({
        key: "T1kbWWoJs68MZ+CZAO2NnitijJviGOhmwpHABEHyMTDt9cckRkbis7ssQOHfRyVmc8rKE8iORfW2WnRvCvS6k0Yj4U4uP4mbiu1K2utFeOBJZmX8CdkDt2nHWnDdbQN0UdCwPYhuqr8HW6O/nyuhqKggh0g77DVZvGfZnDIaPRI=",
        orderId: "LOADTEST-KSP" + orderId
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
    //console.log('Response body:', token_authen);
    //return response_authen;
    //=========================================================================================================
    //Step 2 : Create Transactions
    const url2 = 'https://loadtest-new-ops.inet.co.th/api/v1/payment-transactions/access-token';

    const payload2 = JSON.stringify({
        key: "T1kbWWoJs68MZ+CZAO2NnitijJviGOhmwpHABEHyMTDt9cckRkbis7ssQOHfRyVmc8rKE8iORfW2WnRvCvS6k0Yj4U4uP4mbiu1K2utFeOBJZmX8CdkDt2nHWnDdbQN0UdCwPYhuqr8HW6O/nyuhqKggh0g77DVZvGfZnDIaPRI=",
        //orderId: "LOADTEST-KSP",
        orderId: "LOADTEST-KSP" + orderId,
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
    return response;
}