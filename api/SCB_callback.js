import http from 'k6/http';

export function SCB_callback() {
    const url = 'https://loadtest-new-ops.inet.co.th/scb/api/v1/payment/qr-callback';

    const payload = JSON.stringify({
        amount: '1',
        billPaymentRef1: 'P240404000004',
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

    const headers = {
        'Content-Type': 'application/json',
        Cookie: '__cf_bm=OB.Eb3YiVk4qS8fCnJpg4vIA6Tn_8oZLo3jQvwxCz9s-1711509545-1.0.1.1-YVef23500PEE1PxfAJHO7Ke_mV7z1jJksp58_U_SbozddU04PxHw_aVgc55uP4qNBzHoeck43EnSAWa_KJkv9g; __cfruid=b569a32fdc9e1d3c4d318e9ea9540b4c361bf28e-1711509545',
    };

    const response = http.post(url, payload, {
        headers,
    });

    //console.log(response.body);

    return response;
}