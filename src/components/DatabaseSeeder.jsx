import React, { useState } from 'react';
import { databaseSeeder } from '../services/databaseSeederService.js';

export function DatabaseSeeder() {
    const [isSeeding, setIsSeeding] = useState(false);
    const [seedingStatus, setSeedingStatus] = useState('');
    const [isComplete, setIsComplete] = useState(false);

    const handleSeedDatabase = async () => {
        try {
            setIsSeeding(true);
            setSeedingStatus('Starting database seeding...');

            await databaseSeeder.seedDatabase();

            setSeedingStatus('Database seeding completed successfully!');
            setIsComplete(true);

            // Refresh the page after a short delay to load the new data
            setTimeout(() => {
                window.location.reload();
            }, 2000);

        } catch (error) {
            console.error('Error seeding database:', error);
            setSeedingStatus(`Error: ${error.message}`);
        } finally {
            setIsSeeding(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div className="text-center">
                    <div className="mx-auto h-16 w-16 bg-blue-600 rounded-full flex items-center justify-center mb-6">
                        <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 1.79 4 4 4h8c2.21 0 4-1.79 4-4V7c0-2.21-1.79-4-4-4H8c-2.21 0-4 1.79-4 4z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 11l3 3 3-3" />
                        </svg>
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900">
                        Database Setup Required
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Your database is empty. Let's populate it with sample data to get started.
                    </p>
                </div>

                <div className="bg-white p-8 rounded-xl shadow-lg">
                    <div className="space-y-6">
                        <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div className="ml-3">
                                    <h3 className="text-sm font-medium text-blue-800">
                                        What will be created:
                                    </h3>
                                    <div className="mt-2 text-sm text-blue-700">
                                        <ul className="list-disc pl-5 space-y-1">
                                            <li>5 sample accounts (Checking, Savings, Credit Card, Cash, Investment)</li>
                                            <li>Default categories for expenses and income</li>
                                            <li>15+ sample transactions with realistic data</li>
                                            <li>5 useful tags for organizing transactions</li>
                                            <li>4 sample budgets to track spending</li>
                                            <li>4 scheduled transactions for recurring payments</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {seedingStatus && (
                            <div className={`p-4 rounded-lg ${
                                isComplete
                                    ? 'bg-green-50 border border-green-200'
                                    : seedingStatus.includes('Error')
                                        ? 'bg-red-50 border border-red-200'
                                        : 'bg-blue-50 border border-blue-200'
                            }`}>
                                <div className="flex items-center">
                                    {isSeeding ? (
                                        <svg className="animate-spin h-5 w-5 text-blue-600 mr-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                    ) : isComplete ? (
                                        <svg className="h-5 w-5 text-green-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"></path>
                                        </svg>
                                    ) : seedingStatus.includes('Error') ? (
                                        <svg className="h-5 w-5 text-red-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"></path>
                                        </svg>
                                    ) : null}
                                    <p className={`text-sm ${
                                        isComplete
                                            ? 'text-green-800'
                                            : seedingStatus.includes('Error')
                                                ? 'text-red-800'
                                                : 'text-blue-800'
                                    }`}>
                                        {seedingStatus}
                                    </p>
                                </div>
                            </div>
                        )}

                        <div className="space-y-4">
                            <button
                                onClick={handleSeedDatabase}
                                disabled={isSeeding || isComplete}
                                className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200 ${
                                    isSeeding || isComplete
                                        ? 'bg-gray-400 cursor-not-allowed'
                                        : 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500 shadow-md hover:shadow-lg'
                                }`}
                            >
                                {isSeeding ? (
                                    <div className="flex items-center">
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Setting up database...
                                    </div>
                                ) : isComplete ? (
                                    <div className="flex items-center">
                                        <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"></path>
                                        </svg>
                                        Setup Complete
                                    </div>
                                ) : (
                                    'Setup Sample Data'
                                )}
                            </button>

                            <div className="text-center">
                                <p className="text-xs text-gray-500">
                                    This will create sample data to help you explore the application.
                                    You can delete or modify this data later.
                                </p>
                            </div>
                        </div>

                        {isComplete && (
                            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                                <div className="flex">
                                    <div className="flex-shrink-0">
                                        <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <div className="ml-3">
                                        <h3 className="text-sm font-medium text-green-800">
                                            Success!
                                        </h3>
                                        <div className="mt-2 text-sm text-green-700">
                                            <p>
                                                Your database has been populated with sample data.
                                                The page will refresh automatically to load your new data.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}