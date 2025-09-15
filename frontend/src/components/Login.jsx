import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const result = await login(email, password);

    if (!result.success) {
      setLoading(false);
    }
  };

  const testAccounts = [
    { email: "admin@acme.test", label: "Acme Admin", company: "Acme Corp" },
    { email: "user@acme.test", label: "Acme Member", company: "Acme Corp" },
    {
      email: "admin@globex.test",
      label: "Globex Admin",
      company: "Globex Corp",
    },
    {
      email: "user@globex.test",
      label: "Globex Member",
      company: "Globex Corp",
    },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Multi-Tenant SaaS Notes
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Sign in to your account
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                "Sign in"
              )}
            </button>
          </div>
        </form>

        <div className="mt-8">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Test Accounts
          </h3>
          <div className="grid grid-cols-1 gap-3">
            {testAccounts.map((account) => (
              <button
                key={account.email}
                onClick={() => {
                  setEmail(account.email);
                  setPassword("password");
                }}
                className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="font-medium text-gray-900">{account.label}</div>
                <div className="text-sm text-gray-500">{account.email}</div>
                <div className="text-xs text-blue-600">{account.company}</div>
              </button>
            ))}
          </div>
          <p className="mt-3 text-xs text-gray-500 text-center">
            All test accounts use password: <strong>password</strong>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
