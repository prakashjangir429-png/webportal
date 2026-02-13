import { useState } from 'react';
import PageBreadcrumb from "../components/common/PageBreadCrumb";
import PageMeta from "../components/common/PageMeta";
import Button from '../components/ui/button/Button';

export default function PayoutAPIDocs() {
  const [activeTab, setActiveTab] = useState('initiate');

  const codeExamples = {
    initiatePayout: `// Request
POST /api/v1/payments/initiate
Headers:
  Authorization: Bearer <your_jwt_token>
  Content-Type: application/json

Body:
{
  "trxId": 9876543234567,
  "amount": 100,
  "mobileNumber":9637410888,
  "bankName":"State bank of india",
  "accountNumber": "1234567890",
  "ifscCode": "ABCD0123456",
  "accountHolderName": "John Doe",
  "purpose": "refund"
}

// Success Response
{
  "status": "Pending",
  "status_code": 200,
  "message": "Payout initiated successfully",
  "transaction_id": "9876543234567",
  "accountNumber":"1234567890",
  "amount":100
}
  // Fail Response
{
  "status": "Failed",
  "status_code": 400,
  "message": "message"
}`,

    checkStatus: `// Request
GET /api/v1/payments/status/9876543234567
Headers:
  Authorization: Bearer <your_jwt_token>

// Success Response
{
  "status": "Success",
  "status_code": 200,
  "message": "Transaction details fetched",
  "data": {
    "txnId": "9876543234567",
    "amount": 1000,
    "chargeAmount": 15,
    "netAmount": 985,
    "accountNumber": "1234567890",
    "accountHolderName": "John Doe",
    "ifscCode": "ABCD0123456",
    "status": "Success",
    "utr": "UTR123456789012",
    "initiatedAt": "2023-08-15T10:30:00.000Z",
    "completedAt": "2023-08-15T10:35:00.000Z"
  }
}`,

callbackSuccess: `// Successful Payout Callback (POST to your callback URL)
{
  "event": "payout_success",
  "txnId": "PYT123456789",
  "status": "Success",
  "status_code": 200,
  "amount": 1000,
  "chargeAmount": 15,
  "netAmount": 985,
  "utr": "UTR123456789012",
  "completedAt": "2023-08-15T10:35:00.000Z",
  "initiatedAt": "2023-08-15T10:30:00.000Z",
  "message": "Payout processed successfully"
}`,

callbackFailed: `// Failed Payout Callback (POST to your callback URL)
{
  "event": "payout_failed",
  "txnId": "PYT123456789",
  "status": "Failed",
  "status_code": 400,
  "amount": 1000,
  "utr": null,
  "initiatedAt": "2023-08-15T10:30:00.000Z",
  "failureReason": "Insufficient balance",
  "message": "Payout failed"
}`
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert('Code copied to clipboard!');
  };

  return (
    <div>
      <PageMeta
        title="Payout API Documentation"
        description="Comprehensive documentation for Payout API integration"
      />
      <PageBreadcrumb pageTitle="Payout API Documentation" />

      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white/90">Payout API Documentation</h2>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Integrate seamless money transfer capabilities into your application with our Payout API
          </p>
        </div>

        <div className="space-y-8">
          {/* Authentication Section */}
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-6 dark:border-gray-700 dark:bg-gray-800">
            <h3 className="mb-4 text-lg font-semibold text-gray-800 dark:text-white/90">Authentication</h3>
            <div className="prose prose-sm max-w-none dark:prose-invert">
              <p>
                All API requests require JWT authentication in the <code>Authorization</code> header:
              </p>
              <div className="relative mt-2">
                <pre className="overflow-x-auto rounded-md bg-gray-100 p-4 text-sm dark:bg-gray-700">
                  {`Authorization: Bearer <your_jwt_token>`}
                </pre>
                <button
                  onClick={() => copyToClipboard("Authorization: Bearer <your_jwt_token>")}
                  className="mt-2 rounded bg-indigo-600 px-3 py-1 text-sm text-white"
                >
                  Copy Code
                </button>
              </div>
            </div>
          </div>

          {/* API Endpoints */}
          <div>
            <h3 className="mb-4 text-lg font-semibold text-gray-800 dark:text-white/90">API Endpoints</h3>

            <div className="mb-4 flex space-x-4 border-b border-gray-200 dark:border-gray-700">
              <Button
                size='sm'
                variant={`${activeTab === 'initiate' ? 'primary' : 'outline'}`}
                onClick={() => setActiveTab('initiate')}
              >
                Initiate Payout
              </Button>
              <Button
                size='sm'
                variant={`${activeTab === 'status' ? 'primary' : 'outline'}`}
                onClick={() => setActiveTab('status')}
              >
                Check Status
              </Button>
              <Button
                size='sm'
                variant={`${activeTab === 'callback' ? 'primary' : 'outline'}`}
                onClick={() => setActiveTab('callback')}
              >
                Callback Examples
              </Button>
            </div>

            <div className="relative mt-4">
              {activeTab === 'initiate' && (
                <>
                  <pre className="overflow-x-auto rounded-md bg-gray-100 p-4 text-sm dark:bg-gray-700">
                    {codeExamples.initiatePayout}
                  </pre>
                  <button
                    onClick={() => copyToClipboard(codeExamples.initiatePayout)}
                    className="mt-2 rounded bg-indigo-600 px-3 py-1 text-sm text-white"
                  >
                    Copy Code
                  </button>
                </>
              )}

              {activeTab === 'status' && (
                <>
                  <pre className="overflow-x-auto rounded-md bg-gray-100 p-4 text-sm dark:bg-gray-700">
                    {codeExamples.checkStatus}
                  </pre>
                  <button
                    onClick={() => copyToClipboard(codeExamples.checkStatus)}
                    className="mt-2 rounded bg-indigo-600 px-3 py-1 text-sm text-white"
                  >
                    Copy Code
                  </button>
                </>
              )}

              {activeTab === 'callback' && (
                <div className="space-y-6">
                  <div>
                    <h4 className="mb-2 font-medium text-gray-800 dark:text-white/90">Success Callback</h4>
                    <pre className="overflow-x-auto rounded-md bg-gray-100 p-4 text-sm dark:bg-gray-700">
                      {codeExamples.callbackSuccess}
                    </pre>
                    <button
                      onClick={() => copyToClipboard(codeExamples.callbackSuccess)}
                      className="mt-2 rounded bg-indigo-600 px-3 py-1 text-sm text-white"
                    >
                      Copy Code
                    </button>
                  </div>

                  <div>
                    <h4 className="mb-2 font-medium text-gray-800 dark:text-white/90">Failed Callback</h4>
                    <pre className="overflow-x-auto rounded-md bg-gray-100 p-4 text-sm dark:bg-gray-700">
                      {codeExamples.callbackFailed}
                    </pre>
                    <button
                      onClick={() => copyToClipboard(codeExamples.callbackFailed)}
                      className="mt-2 rounded bg-indigo-600 px-3 py-1 text-sm text-white"
                    >
                      Copy Code
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Additional Information */}
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-6 dark:border-gray-700 dark:bg-gray-800">
            <h3 className="mb-4 text-lg font-semibold text-gray-800 dark:text-white/90">Implementation Notes</h3>
            <div className="prose prose-sm max-w-none dark:prose-invert">
              <h4>Payout Processing</h4>
              <ul>
                <li>Payouts typically process within 15-30 minutes</li>
                <li>Status will initially show as "Processing"</li>
                <li>Final status comes via callback (Success/Failed)</li>
              </ul>

              <h4 className="mt-6">Callback Requirements</h4>
              <ul>
                <li>Your endpoint must accept POST requests</li>
                <li>Return HTTP 200 to acknowledge receipt</li>
                <li>Store the UTR for successful payouts</li>
              </ul>

              <h4 className="mt-6">Important Fields</h4>
              <ul>
                <li><code>txnId</code>: Your unique transaction reference</li>
                <li><code>utr</code>: Unique transaction reference from bank (successful payouts only)</li>
                <li><code>failureReason</code>: Detailed error message (failed payouts)</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}