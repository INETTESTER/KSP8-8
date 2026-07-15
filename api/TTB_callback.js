import http from 'k6/http';
import { SharedArray } from 'k6/data'; ///POST กรณี id ไม่ซ้ำ (ดึง id จากไฟล์ json)
const data = new SharedArray('ref1', function () { ///POST กรณี id ไม่ซ้ำ (ดึง id จากไฟล์ json)
    return JSON.parse(open('../file/id.json')).id; ///POST กรณี id ไม่ซ้ำ (ดึง id จากไฟล์ json)
});

export function TTB_callback(scenario) {
    const ref1 = data[scenario.iterationInTest];
    //console.log(ref1);
    const url = 'https://loadtest-new-ops.inet.co.th/ttb/api/v1/payment/qr/callback';

    const payload = JSON.stringify({
        InstructionId: '20250610134300097126904315100733020',
        BillerNo: '010753700001716',
        Ref1: '' + ref1,
        Ref2: 'M24070300001',
        QRId: 'ZNETE251231000099697',
        PayerAccount: '0123456789',
        PayerName: 'นส.สุธาสิณี ผาซิว',
        PayerBank: '004',
        Amount: '1',
        ResultCode: '000',
        ResultDesc: 'Successful',
        TransDate: '20260610214828',
    });

    const params = {
        headers: {
            'Content-Type': 'application/json',
            'Cookie': '__cf_bm=OB.Eb3YiVk4qS8fCnJpg4vIA6Tn_8oZLo3jQvwxCz9s-1711509545-1.0.1.1-YVef23500PEE1PxfAJHO7Ke_mV7z1jJksp58_U_SbozddU04PxHw_aVgc55uP4qNBzHoeck43EnSAWa_KJkv9g; __cfruid=b569a32fdc9e1d3c4d318e9ea9540b4c361bf28e-1711509545',
        },
    };

    const response = http.post(url, payload, params);

    // console.log(`Status: ${response.status}`);
    // console.log(`Response: ${response.body}`);

    return response;
}