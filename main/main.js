//=============================== import API =================================
import { sleep } from 'k6';
import { error_check } from '../check/check.js';
import { scenario } from 'k6/execution';
import { Authen } from '../api/Authen.js';
import { Authen_CreateTxn } from '../api/Authen_CreateTxn.js';
import { Authen_CreateTxn_CreateQR_TTB } from '../api/Authen_CreateTxn_CreateQR_TTB.js';
import { Authen_CreateTxn_CreateQR_SCB } from '../api/Authen_CreateTxn_CreateQR_SCB.js';
import { SCB_callback } from '../api/SCB_callback.js';
import { Authen_CreateTxn_CreateQR_Callback_SCB } from '../api/Authen_CreateTxn_CreateQR_Callback_SCB.js';
import { Authen_CreateTxn_CreateQR_Bay } from '../api/Authen_CreateTxn_CreateQR_Bay.js';
import { BAY_callback } from '../api/BAY_callback.js';
import { InquiryDate } from '../api/InquiryDate.js';
import { InquiryTxn } from '../api/InquiryTxn.js';
import { TTB_callback } from '../api/TTB_callback.js';




//============================================================================

export default function () {    //เรียกใช้ API ใน export default function
  /// TTB
  //response = Authen()
  //response = Authen_CreateTxn(cid)
  //response = Authen_CreateTxn_CreateQR_TTB(cid)
  response = TTB_callback(scenario)

  /// SCB
  //response = Authen_CreateTxn_CreateQR_SCB(scenario)
  //response = SCB_callback()
  //response = Authen_CreateTxn_CreateQR_Callback_SCB()

  /// BAY
  //response = Authen_CreateTxn_CreateQR_Bay()
  //response = BAY_callback()

  /// InquiryDate
  //response = InquiryDate()
  //response = InquiryTxn()

  error_check(response);
  sleep(1)
}











































































const cid = __ENV.cid || "1";
const id = __ENV.id || "1";
const projectname = __ENV.projectname || "1";
const user = __ENV.user || "1";
const durationx = __ENV.durationx || "1";
let response;
const scenariox = __ENV.scenariox || "1";
let options;
const vusx = Math.ceil(user / durationx);
if (scenariox == 1) {
  options = {
    http: {
      timeout: '300s'
    },
    insecureSkipTLSVerify: true,
    discardResponseBodies: false,
    scenarios: {
      contacts: {
        executor: 'per-vu-iterations',
        vus: vusx,
        iterations: durationx,
        maxDuration: '10m',
        gracefulStop: '120s',
      },
    },
  };
}
else if (scenariox == 2) {
  options = {
    http: {
      timeout: '300s'
    },
    insecureSkipTLSVerify: true,
    vus: user,
    duration: durationx + 's',
    gracefulStop: '120s',
  };
}
else if (scenariox == 3) {
  options = {
    http: {
      timeout: '300s'
    },
    insecureSkipTLSVerify: true,
    scenarios: {
      example_scenario: {
        executor: 'constant-arrival-rate',
        // rate: user,
        // timeUnit: durationx+'s',
        rate: vusx,
        timeUnit: '1s',
        preAllocatedVUs: user,
        duration: durationx + 's', // ระบุระยะเวลาที่ต้องการให้ทดสอบ
        gracefulStop: '120s',
      },
    },
  };
}
else {
  options = {
    insecureSkipTLSVerify: true,
    discardResponseBodies: true,
    scenarios: {
      contacts: {
        executor: 'per-vu-iterations',
        vus: vusx,
        iterations: durationx,
        maxDuration: '10m',
      },
    },
  };
}
export { options };