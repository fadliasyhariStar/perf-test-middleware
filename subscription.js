import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  vus: 5,
  duration: '1m',
  ext: {
    loadimpact: {
      projectID: 3693331,
      // Test runs with the same name groups test runs together
      name: 'Subscription'
    }
  }
  // Add more options as needed
};

export default function () {
  const url = 'https://api-stg.star-am.com/transaction/subscribe';
  const payload = JSON.stringify({
    "partnerReferenceNo": "YANLORD00023",
    "productCode": "STA01MMC01MID002",
    "customerExternalId": "YANLORDREG0001",
    "sid": "SID0YAN001",
    "netAmount": {
        "currency": "IDR",
        "value": "10000"
    },
    "feeAmount": {
        "currency": "IDR",
        "value": "0"
    },
    "totalAmount": {
        "currency": "IDR",
        "value": "11000"
    }
  });
  const channelID = `CHANNEL_ID_${__VU}`;
  const params = {
    headers: {
      'accept': 'application/json',
      'Content-Type': 'application/json',
      'CHANNEL_ID': channelID,
      // Include any other headers like authorization if needed
    },
  };

  const response = http.post(url, payload, params);

  check(response, {
    'is status 200': (r) => r.status === 200,
    'is not status 429': (r) => r.status !== 429,
    // Add more checks as per your validation requirements
  });

  console.log(response.body);

  // Make sure to adjust sleep time based on your testing requirements
  sleep(1);
}
