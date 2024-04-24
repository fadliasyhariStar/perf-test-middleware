import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  // A number specifying the number of VUs to run concurrently.
  vus: 10,
  // A string specifying the total duration of the test run.
  duration: '60s',
  ext: {
    loadimpact: {
      projectID: 3693331,
      // Test runs with the same name groups test runs together
      name: 'Registration'
    }
  }

  // The following section contains configuration options for execution of this
  // test script in Grafana Cloud.
  //
  // See https://grafana.com/docs/grafana-cloud/k6/get-started/run-cloud-tests-from-the-cli/
  // to learn about authoring and running k6 test scripts in Grafana k6 Cloud.
  //
  // cloud: {
  //   // The ID of the project to which the test is assigned in the k6 Cloud UI.
  //   // By default tests are executed in default project.
  //   projectID: "",
  //   // The name of the test in the k6 Cloud UI.
  //   // Test runs with the same name will be grouped.
  //   name: "test.js"
  // },

  // Uncomment this section to enable the use of Browser API in your tests.
  //
  // See https://grafana.com/docs/k6/latest/using-k6-browser/running-browser-tests/ to learn more
  // about using Browser API in your test scripts.
  //
  // scenarios: {
  //   // The scenario name appears in the result summary, tags, and so on.
  //   // You can give the scenario any name, as long as each name in the script is unique.
  //   ui: {
  //     // Executor is a mandatory parameter for browser-based tests.
  //     // Shared iterations in this case tells k6 to reuse VUs to execute iterations.
  //     //
  //     // See https://grafana.com/docs/k6/latest/using-k6/scenarios/executors/ for other executor types.
  //     executor: 'shared-iterations',
  //     options: {
  //       browser: {
  //         // This is a mandatory parameter that instructs k6 to launch and
  //         // connect to a chromium-based browser, and use it to run UI-based
  //         // tests.
  //         type: 'chromium',
  //       },
  //     },
  //   },
  // }
};

// The function that defines VU logic.
//
// See https://grafana.com/docs/k6/latest/examples/get-started-with-k6/ to learn more
// about authoring k6 scripts.
//
export default function() {
    const url = 'https://api-stg.star-am.com/registration/new';
    const payload = JSON.stringify({
        "partnerReferenceNo": "REGDANAX000000000020",
        "customerExternalId": "DANAX000000000020",
        "kyc": {
            "name": "DANA User",
            "email": "danauser@dana.id",
            "birthDate": "1992-07-25",
            "birthPlace": "jakarta",
            "gender": "FML",
            "nationality": "IDN",
            "maritalStatus": "MRD",
            "motherMaidenName": "IBU",
            "religion": "KONGH",
            "occupation": "2",
            "idNumber": "020030078993001",
            "statementType": "E-statement",
            "incomeSource": "1",
            "annualIncome": "1",
            "investmentPurpose": "1",
            "educationBackground": "OTH",
            "legal": {
                "country": "IDN",
                "province": "ID-JB",
                "city": "3276",
                "postalCode": "13568",
                "address": "Cipete"
            },
            "settlementBank": "BANK NEGARA INDONESIA, (PERSERO), PT",
            "settlementAccountName": "TEST",
            "settlementAccountNo": "12312300090"
        },
        "riskProfile": "1"
    });
    const channelID = `CHANNEL_ID_${__VU}`;
    const params = {
        headers: {
            'accept': 'application/json',
            'Content-Type': 'application/json',
            'CHANNEL_ID': channelID,
        },
    };

    let response = http.post(url, payload, params);

    // Check for a successful response
    check(response, {
        'is status 200': (r) => r.status === 200,
        'is not status 429': (r) => r.status !== 429,
        // Add any additional checks relevant to your application
    });
    

    // Optional: print response body for debugging
    console.log(response.body);

    sleep(1);  // pause between iterations to mimic realistic scenario
}
