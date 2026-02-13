import { useState, useEffect } from 'react';
import PageBreadcrumb from "../components/common/PageBreadCrumb";
import PageMeta from "../components/common/PageMeta";
import { useAuth } from "../context/UserContext";

export default function APICredentials() {
    const { user } = useAuth();
    const [credentials, setCredentials] = useState({
        userName: '',
        clientId: '',
        clientSecret: ''
    });

    useEffect(() => {
        if (user) {
            setCredentials({
                userName: user.userName,
                clientId: user.clientId,
                clientSecret: user.clientSecret
            });
        }
    }, [user]);

    return (
        <div>
            <PageMeta
                title="API Credentials Dashboard"
                description="Manage your API credentials and learn how to authenticate with our API"
            />
            <PageBreadcrumb pageTitle="API Credentials" />

            <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
                <div className="space-y-8">
                    {/* Credentials Section */}
                    <div className="border-b border-gray-200 pb-6 dark:border-gray-800">
                        <h3 className="mb-4 text-lg font-semibold text-gray-800 dark:text-white/90">
                            Your API Credentials
                        </h3>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                            <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
                                <p className="mb-1 text-xs text-gray-500 dark:text-gray-400">Username</p>
                                <p className="font-mono text-sm font-medium text-gray-800 dark:text-white/90">
                                    {credentials.userName}
                                </p>
                            </div>
                            <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
                                <p className="mb-1 text-xs text-gray-500 dark:text-gray-400">Client ID</p>
                                <p className="font-mono text-sm font-medium text-gray-800 dark:text-white/90">
                                    {credentials.clientId}
                                </p>
                            </div>
                            <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
                                <p className="mb-1 text-xs text-gray-500 dark:text-gray-400">Client Secret</p>
                                <p className="font-mono text-sm font-medium text-gray-800 dark:text-white/90">
                                    {credentials.clientSecret}
                                </p>
                            </div>
                        </div>
                        <div className="mt-4 text-sm text-red-500 dark:text-red-400">
                            <p>⚠️ Keep your credentials secure and never share them publicly</p>
                        </div>
                    </div>

                    {/* API Usage Instructions */}
                    <div>
                        <h3 className="mb-4 text-lg font-semibold text-gray-800 dark:text-white/90">
                            API Authentication Guide
                        </h3>
                        <div className="dark:text-white/90">
                            <h4>1. How to generate a JWT token</h4>
                            <p>
                                Use your <code>clientSecret</code> to sign a JWT token with the following payload:
                            </p>
                            <pre className="rounded-md bg-gray-100 p-3 dark:bg-gray-800">
                                {`{
  "clientId": "${credentials.clientId}",
  "userName": "${credentials.userName}"
}`}
                            </pre>
                            <p>Sign it using the <code>HS256</code> algorithm.</p>

                            <h4 className="mt-6">2. How to use the token</h4>
                            <p>Include the generated JWT token in the Authorization header of your requests:</p>
                            <pre className="rounded-md bg-gray-100 p-3 dark:bg-gray-800">
                                {`Authorization: ${'your_generated_jwt_token_here'}`}
                            </pre>

                            <h4 className="mt-6">3. Node.js Example</h4>
                            <pre className="rounded-md bg-gray-100 p-3 dark:bg-gray-800">
                                {`const jwt = require('jsonwebtoken');

 Generate token
const token = jwt.sign(
  {
    clientId: '${credentials.clientId}',
    userName: '${credentials.userName}'
  },
  '${credentials.clientSecret}',
  { algorithm: 'HS256', expiresIn: '1h' }
);

Make API request
const response = await fetch('https://your-api-endpoint.com', {
  method: 'GET',
  headers: {
    'Authorization': token,
    'Content-Type': 'application/json'
  }
});`}
                            </pre>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}