import http from 'k6/http';

export function InquiryDate() {
  const url = 'https://loadtest-new-ops.inet.co.th/portal/api/v1/payment-transactions/inquiry-txn';

  const payload = JSON.stringify({
    key: "T1kbWWoJs68MZ+CZAO2NnitijJviGOhmwpHABEHyMTDt9cckRkbis7ssQOHfRyVmc8rKE8iORfW2WnRvCvS6k0Yj4U4uP4mbiu1K2utFeOBJZmX8CdkDt2nHWnDdbQN0UdCwPYhuqr8HW6O/nyuhqKggh0g77DVZvGfZnDIaPRI=",
    status: "Success",
    payment_transaction_no: "",
    end_date: "20260202",
    start_date: "20260101"
  });

  const params = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const response = http.post(url, payload, params);
  console.log('Response body:', response.body);
  return response;
}