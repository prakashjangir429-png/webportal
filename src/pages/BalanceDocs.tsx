import { useState } from 'react';
import PageBreadcrumb from "../components/common/PageBreadCrumb";
import PageMeta from "../components/common/PageMeta";
import Button from '../components/ui/button/Button';

export default function BalanceEnquiryDocs() {
    const [activeTab, setActiveTab] = useState('request');

    const codeExamples = {
        request: `// Request
GET /api/v1/payment/balance
Headers:
  Authorization: Bearer <your_jwt_token>
  Content-Type: application/json`,

        response: `// Success Response
{
  "status": "Success",
  "status_code": 200,
  "message": "User balance fetched successfully",
  "data": {
    "userName": "spiralfashion",
    "mainWalletBalance": 0,
    "eWalletBalance": -9,
    "clientId": "UID-MEP8KQKC-9U03HZ"
  }
}

// Error Response (Invalid Token)
{
  "status": "Failed",
  "status_code": 401,
  "message": "Unauthorized access"
}

// Error Response (Token Expired)
{
  "status": "Failed",
  "status_code": 401,
  "message": "Token expired"
}`,

        errorHandling: `// Common Error Responses

// 400 - Bad Request
{
  "status": "Failed",
  "status_code": 400,
  "message": "Invalid request parameters"
}

// 404 - Not Found
{
  "status": "Failed",
  "status_code": 404,
  "message": "User not found"
}

// 500 - Internal Server Error
{
  "status": "Failed",
  "status_code": 500,
  "message": "Internal server error"
}`
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        alert('Code copied to clipboard!');
    };

    return (
        <div>
            <PageMeta
                title="Balance Enquiry API Documentation"
                description="Comprehensive documentation for Balance Enquiry API integration"
            />
            <PageBreadcrumb pageTitle="Balance Enquiry API Documentation" />

            <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
                <div className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white/90">Balance Enquiry API Documentation</h2>
                    <p className="mt-2 text-gray-600 dark:text-gray-400">
                        Retrieve user wallet balances with our simple and secure Balance Enquiry API
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

                    {/* API Endpoint */}
                    <div>
                        <h3 className="mb-4 text-lg font-semibold text-gray-800 dark:text-white/90">API Endpoint</h3>

                        <div className="mb-4 flex space-x-4">
                            <Button
                                onClick={() => setActiveTab('request')}
                                className={`text-base`}
                                size='sm'
                                variant={`${activeTab === 'request' ? 'primary' : 'outline'}`}
                            >
                                Request
                            </Button>
                            <Button
                                size='sm'
                                variant={`${activeTab === 'response' ? 'primary' : 'outline'}`}
                                onClick={() => setActiveTab('response')}
                            >
                                Response
                            </Button>
                            <Button
                                onClick={() => setActiveTab('errorHandling')}
                                size='sm'
                                variant={`${activeTab === 'errorHandling' ? 'primary' : 'outline'}`}
                            >
                                Error Handling
                            </Button>
                        </div>

                        <div className="relative mt-4">
                            {activeTab === 'request' && (
                                <>
                                    <pre className="overflow-x-auto rounded-md bg-gray-100 p-4 text-sm dark:bg-gray-700">
                                        {codeExamples.request}
                                    </pre>
                                    <button
                                        onClick={() => copyToClipboard(codeExamples.request)}
                                        className="mt-2 rounded bg-indigo-600 px-3 py-1 text-sm text-white"
                                    >
                                        Copy Code
                                    </button>
                                </>
                            )}

                            {activeTab === 'response' && (
                                <>
                                    <pre className="overflow-x-auto rounded-md bg-gray-100 p-4 text-sm dark:bg-gray-700">
                                        {codeExamples.response}
                                    </pre>
                                    <button
                                        onClick={() => copyToClipboard(codeExamples.response)}
                                        className="mt-2 rounded bg-indigo-600 px-3 py-1 text-sm text-white"
                                    >
                                        Copy Code
                                    </button>
                                </>
                            )}

                            {activeTab === 'errorHandling' && (
                                <>
                                    <pre className="overflow-x-auto rounded-md bg-gray-100 p-4 text-sm dark:bg-gray-700">
                                        {codeExamples.errorHandling}
                                    </pre>
                                    <button
                                        onClick={() => copyToClipboard(codeExamples.errorHandling)}
                                        className="mt-2 rounded bg-indigo-600 px-3 py-1 text-sm text-white"
                                    >
                                        Copy Code
                                    </button>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Response Field Details */}
                    <div className="rounded-lg border border-gray-200 bg-gray-50 p-6 dark:border-gray-700 dark:bg-gray-800">
                        <h3 className="mb-4 text-lg font-semibold text-gray-800 dark:text-white/90">Response Field Details</h3>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                <thead className="bg-gray-100 dark:bg-gray-700">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-700 dark:text-gray-300">
                                            Field
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-700 dark:text-gray-300">
                                            Type
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-700 dark:text-gray-300">
                                            Description
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800">
                                    <tr>
                                        <td className="whitespace-nowrap px-4 py-4 text-sm font-medium text-gray-900 dark:text-white">
                                            status
                                        </td>
                                        <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-500 dark:text-gray-300">
                                            String
                                        </td>
                                        <td className="px-4 py-4 text-sm text-gray-500 dark:text-gray-300">
                                            Response status ("Success" or "Failed")
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="whitespace-nowrap px-4 py-4 text-sm font-medium text-gray-900 dark:text-white">
                                            status_code
                                        </td>
                                        <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-500 dark:text-gray-300">
                                            Number
                                        </td>
                                        <td className="px-4 py-4 text-sm text-gray-500 dark:text-gray-300">
                                            HTTP status code (200 for success)
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="whitespace-nowrap px-4 py-4 text-sm font-medium text-gray-900 dark:text-white">
                                            message
                                        </td>
                                        <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-500 dark:text-gray-300">
                                            String
                                        </td>
                                        <td className="px-4 py-4 text-sm text-gray-500 dark:text-gray-300">
                                            Descriptive message about the operation
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="whitespace-nowrap px-4 py-4 text-sm font-medium text-gray-900 dark:text-white">
                                            data.userName
                                        </td>
                                        <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-500 dark:text-gray-300">
                                            String
                                        </td>
                                        <td className="px-4 py-4 text-sm text-gray-500 dark:text-gray-300">
                                            Username of the account holder
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="whitespace-nowrap px-4 py-4 text-sm font-medium text-gray-900 dark:text-white">
                                            data.mainWalletBalance
                                        </td>
                                        <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-500 dark:text-gray-300">
                                            Number
                                        </td>
                                        <td className="px-4 py-4 text-sm text-gray-500 dark:text-gray-300">
                                            Balance in the main wallet (in currency units)
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="whitespace-nowrap px-4 py-4 text-sm font-medium text-gray-900 dark:text-white">
                                            data.eWalletBalance
                                        </td>
                                        <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-500 dark:text-gray-300">
                                            Number
                                        </td>
                                        <td className="px-4 py-4 text-sm text-gray-500 dark:text-gray-300">
                                            Balance in the e-wallet (in currency units)
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="whitespace-nowrap px-4 py-4 text-sm font-medium text-gray-900 dark:text-white">
                                            data.clientId
                                        </td>
                                        <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-500 dark:text-gray-300">
                                            String
                                        </td>
                                        <td className="px-4 py-4 text-sm text-gray-500 dark:text-gray-300">
                                            Unique client identifier for the user account
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Implementation Notes */}
                    <div className="rounded-lg border border-gray-200 bg-gray-50 p-6 dark:border-gray-700 dark:bg-gray-800">
                        <h3 className="mb-4 text-lg font-semibold text-gray-800 dark:text-white/90">Implementation Notes</h3>
                        <div className="prose prose-sm max-w-none dark:prose-invert">
                            <h4>Usage Guidelines</h4>
                            <ul>
                                <li>Ensure the JWT token is valid and not expired</li>
                                <li>Handle both positive and negative balance values appropriately</li>
                                <li>The API returns real-time balance information</li>
                                <li>Cache responses appropriately to reduce API calls</li>
                            </ul>

                            <h4 className="mt-6">Best Practices</h4>
                            <ul>
                                <li>Implement proper error handling for authentication failures</li>
                                <li>Display balance information in a user-friendly format</li>
                                <li>Handle currency formatting based on your application's requirements</li>
                                <li>Consider implementing client-side caching with appropriate expiration</li>
                            </ul>
                        </div>
                    </div>

                    {/* Example Usage */}
                    <div className="rounded-lg border border-gray-200 bg-gray-50 p-6 dark:border-gray-700 dark:bg-gray-800">
                        <h3 className="mb-4 text-lg font-semibold text-gray-800 dark:text-white/90">Example Usage</h3>
                        <div className="prose prose-sm max-w-none dark:prose-invert">
                            <h4>JavaScript Fetch Example</h4>
                            <pre className="mt-2 rounded-md bg-gray-100 p-4 text-sm dark:bg-gray-700">
                                {`async function getBalance() {
  try {
    const response = await fetch('{API_BASE_URL}/api/v1/payment/balance', {
      method: 'GET',
      headers: {
        'Authorization': token,
        'Content-Type': 'application/json'
      }
    });
    
    const data = await response.json();
    
    if (data.status === 'Success') {
      console.log('Main Wallet:', data.data.mainWalletBalance);
      console.log('E-Wallet:', data.data.eWalletBalance);
      console.log('Client ID:', data.data.clientId);
    } else {
      console.error('Error:', data.message);
    }
  } catch (error) {
    console.error('Network error:', error);
  }
}`}
                            </pre>
                            
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}