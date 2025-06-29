import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext.js';
import {TwoFactorSettings} from "../../components/setting/TwoFactorSettings";

export function Settings() {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('profile');

    const tabs = [
        { id: 'profile', name: 'Profile', icon: '👤' },
        { id: 'security', name: 'Security', icon: '🔒' },
        { id: 'preferences', name: 'Preferences', icon: '⚙️' },
        { id: 'notifications', name: 'Notifications', icon: '🔔' },
    ];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
            </div>

            <div className="bg-white shadow rounded-lg">
                <div className="border-b border-gray-200">
                    <nav className="flex space-x-8 px-6">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                                    activeTab === tab.id
                                        ? 'border-blue-500 text-blue-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                            >
                                <span className="mr-2">{tab.icon}</span>
                                {tab.name}
                            </button>
                        ))}
                    </nav>
                </div>

                <div className="p-6">
                    {activeTab === 'profile' && (
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-lg font-medium text-gray-900 mb-4">Account Information</h3>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Email</label>
                                        <p className="mt-1 text-gray-900">{user?.email}</p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Name</label>
                                        <p className="mt-1 text-gray-900">{user?.user_metadata?.name || 'Not updated'}</p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Member since</label>
                                        <p className="mt-1 text-gray-900">
                                            {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'Unknown'}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="border-t pt-6">
                                <h4 className="text-lg font-medium text-gray-900 mb-4">Update Profile</h4>
                                <div className="max-w-md space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Full Name</label>
                                        <input
                                            type="text"
                                            defaultValue={user?.user_metadata?.name || ''}
                                            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                                        <input
                                            type="tel"
                                            defaultValue={user?.user_metadata?.phone || ''}
                                            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    </div>
                                    <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                                        Save Changes
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'security' && (
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-lg font-medium text-gray-900 mb-4">Security Settings</h3>
                            </div>

                            <TwoFactorSettings />

                            <div className="border-t pt-6">
                                <h4 className="text-lg font-medium text-gray-900 mb-4">Change Password</h4>
                                <div className="max-w-md space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Current Password</label>
                                        <input
                                            type="password"
                                            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">New Password</label>
                                        <input
                                            type="password"
                                            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Confirm New Password</label>
                                        <input
                                            type="password"
                                            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    </div>
                                    <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                                        Update Password
                                    </button>
                                </div>
                            </div>

                            <div className="border-t pt-6">
                                <h4 className="text-lg font-medium text-gray-900 mb-4">Account Actions</h4>
                                <div className="space-y-3">
                                    <button className="bg-yellow-600 text-white px-4 py-2 rounded-md hover:bg-yellow-700">
                                        Export Account Data
                                    </button>
                                    <br />
                                    <button className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700">
                                        Delete Account
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'preferences' && (
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-lg font-medium text-gray-900 mb-4">Preferences</h3>
                            </div>

                            <div className="max-w-md space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Currency</label>
                                    <select className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                                        <option value="VND">Vietnamese Dong (VND)</option>
                                        <option value="USD">US Dollar (USD)</option>
                                        <option value="EUR">Euro (EUR)</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Language</label>
                                    <select className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                                        <option value="vi">Tiếng Việt</option>
                                        <option value="en">English</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Timezone</label>
                                    <select className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                                        <option value="Asia/Ho_Chi_Minh">Ho Chi Minh City (GMT+7)</option>
                                        <option value="Asia/Bangkok">Bangkok (GMT+7)</option>
                                        <option value="Asia/Singapore">Singapore (GMT+8)</option>
                                    </select>
                                </div>
                                <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                                    Save Preferences
                                </button>
                            </div>
                        </div>
                    )}

                    {activeTab === 'notifications' && (
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-lg font-medium text-gray-900 mb-4">Notification Settings</h3>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h4 className="text-sm font-medium text-gray-900">Email Notifications</h4>
                                        <p className="text-sm text-gray-500">Receive email updates about your account</p>
                                    </div>
                                    <input
                                        type="checkbox"
                                        defaultChecked
                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                    />
                                </div>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h4 className="text-sm font-medium text-gray-900">Budget Alerts</h4>
                                        <p className="text-sm text-gray-500">Get notified when you exceed budget limits</p>
                                    </div>
                                    <input
                                        type="checkbox"
                                        defaultChecked
                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                    />
                                </div>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h4 className="text-sm font-medium text-gray-900">Transaction Reminders</h4>
                                        <p className="text-sm text-gray-500">Reminders for scheduled transactions</p>
                                    </div>
                                    <input
                                        type="checkbox"
                                        defaultChecked
                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                    />
                                </div>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h4 className="text-sm font-medium text-gray-900">Security Alerts</h4>
                                        <p className="text-sm text-gray-500">Notifications about account security</p>
                                    </div>
                                    <input
                                        type="checkbox"
                                        defaultChecked
                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                    />
                                </div>
                                <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                                    Save Notification Settings
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}