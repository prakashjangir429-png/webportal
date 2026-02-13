import { useState } from 'react';
import PageBreadcrumb from "../components/common/PageBreadCrumb";
import PageMeta from "../components/common/PageMeta";
import Button from '../components/ui/button/Button';

export default function PayInAPIDocs() {
    const [activeTab, setActiveTab] = useState('generate');

    const codeExamples = {
        generatePayment: `// Request
POST /api/v1/payment/create
Headers:
  Authorization: Bearer <your_jwt_token>
  Content-Type: application/json

Body:
{
  "txnId": 987654321238800,
  "amount": 100,
  "name": "John Doe",
  "email": "john@example.com",
  "mobileNumber": "9876543210"
}

// Success Response
{
  "status": "Success",
  "status_code": 200,
  "message": "intent generate successfully",
  "qr_intent": "upi://pay?pa=merchant@upi&pn=Merchant&tn=Payment&am=1000",
  "qr_image": "base64_encoded_qr_image",
  "transaction_id": 987654321238800
}
  
// Fail Response
{
  "status": "Failed",
  "status_code": 400,
  "message": "message"
}`,

        checkStatus: `// Request
GET /api/v1/payment/status/:txnId
Headers:
  Authorization: Bearer <your_jwt_token>

// Failed Response
{    
    "status": "Success",
    "status_code": 200,
    "message": "Transaction Detail fetch successfully",
    "data": {
        "txnId": "Tkdfkjdkfj0",
        "amount": 1,
        "chargeAmount": 10,
        "status": "Failed",
        "createdAt": "2025-08-24T07:38:22.292Z",
        "updatedAt": "2025-08-24T07:38:34.794Z",
        "totalAmount": 11,
        "userDetails": {
            "name": "John Doe",
            "email": "john@example.com",
            "mobile": "9876543210"
        }
    }
}
// Success Response
{
    "status": "Success",
    "status_code": 200,
    "message": "Transaction Detail fetch successfully",
    "data": {
        "txnId": "Txxv504555557",
        "amount": 1,
        "chargeAmount": 10,
        "status": "Success",
        "createdAt": "2025-08-24T07:15:18.807Z",
        "updatedAt": "2025-08-24T07:18:25.012Z",
        "utr": "TX45647025557",
        "totalAmount": 11,
        "userDetails": {
            "name": "John Doe",
            "email": "john@example.com",
            "mobile": "9876543210"
        }
    }
}
`,

        callbackSuccess: `// Successful Payment Callback (POST to your callback URL)
{
  "event": "payin_success",
  "txnId": "TXN123456789",
  "status": "Success",
  "status_code": 200,
  "amount": 1000,
  "gatwayCharge": 20,
  "utr": "123456789012",
  "vpaId": "abc@upi",
  "txnCompleteDate": "2023-08-15T10:32:00.000Z",
  "txnStartDate": "2023-08-15T10:30:00.000Z",
  "message": "Payment Received successfully"
}`,

        callbackFailed: `// Failed Payment Callback (POST to your callback URL)
{
  "event": "payin_failed",
  "txnId": "TXN123456789",
  "status": "Failed",
  "status_code": 200,
  "amount": 1000,
  "utr": null,
  "vpaId": null,
  "txnStartDate": "2023-08-15T10:30:00.000Z",
  "message": "Payment failed"
}`
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        alert('Code copied to clipboard!');
    };

    return (
        <div>
            <PageMeta
                title="PayIn API Documentation"
                description="Comprehensive documentation for PayIn API integration"
            />
            <PageBreadcrumb pageTitle="PayIn API Documentation" />

            <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
                <div className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white/90">PayIn API Documentation</h2>
                    <p className="mt-2 text-gray-600 dark:text-gray-400">
                        Integrate seamless payment collection into your application with our PayIn API
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

                        <div className="mb-4 flex space-x-4">
                            <Button
                                onClick={() => setActiveTab('generate')}
                                className={`text-base`}
                                size='sm'
                                variant={`${activeTab === 'generate' ? 'primary' : 'outline'}`}
                            >
                                Generate Payment
                            </Button>
                            <Button
                                size='sm'
                                variant={`${activeTab === 'status' ? 'primary' : 'outline'}`}
                                onClick={() => setActiveTab('status')}
                            >
                                Check Status
                            </Button>
                            <Button
                                onClick={() => setActiveTab('callback')}
                                size='sm'
                                variant={`${activeTab === 'callback' ? 'primary' : 'outline'}`}
                            >
                                Callback Examples
                            </Button>
                        </div>

                        <div className="relative mt-4">
                            {activeTab === 'generate' && (
                                <>
                                    <pre className="overflow-x-auto rounded-md bg-gray-100 p-4 text-sm dark:bg-gray-700">
                                        {codeExamples.generatePayment}
                                    </pre>
                                    <button
                                        onClick={() => copyToClipboard(codeExamples.generatePayment)}
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
                            <h4>Callback Requirements</h4>
                            <ul>
                                <li>Your callback endpoint must accept POST requests</li>
                                <li>It should return a 200 status code to acknowledge receipt</li>
                                <li>Handle both success and failure callbacks</li>
                            </ul>

                            <h4 className="mt-6">Response Handling</h4>
                            <ul>
                                <li>Verify the transaction ID matches your records</li>
                                <li>Check the status field ("Success" or "Failed")</li>
                                <li>For successful payments, store the UTR reference</li>
                            </ul>

                            <h4 className="mt-6">Testing</h4>
                            <p>
                                You can test your callback implementation using tools like Postman or by setting up a local webhook receiver.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}