import React from 'react';
import {useScheduledTransactions} from "../../hooks/useScheduledTransactions";
import {TRANSACTION_TYPE_COLORS} from "../../utils/constants/transactionTypes";
import {formatCurrency} from "../../utils/formatters/currency";
import {formatDate} from "../../utils/formatters/date";

export function ScheduledTransactionsSidebar({className = ''}) {
    const {scheduledTransactions, loading} = useScheduledTransactions();

    const upcomingTransactions = scheduledTransactions
        .filter(transaction => transaction.is_active && new Date(transaction.next_due_date) <= new Date(Date.now() + 7 * 24 * 60 * 60 * 1000))
        .sort((a, b) => new Date(a.next_due_date) - new Date(b.next_due_date))
        .slice(0, 5);

    if (loading) {
        return (<div className={`bg-white shadow rounded-lg p-4 ${className}`}>
            <div className="animate-pulse space-y-3">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="space-y-2">
                    {[...Array(3)].map((_, i) => (<div key={i} className="h-8 bg-gray-200 rounded"></div>))}
                </div>
            </div>
        </div>);
    }

    return (<div className={`bg-white shadow rounded-lg ${className}`}>
        <div className="px-4 py-3 border-b border-gray-200">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">
                    Giao dịch định kỳ
                    <svg className="inline-block w-4 h-4 ml-1 text-gray-400" fill="none" stroke="currentColor"
                         viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                </h3>
                <button className="text-sm text-blue-600 hover:text-blue-800">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                    </svg>
                </button>
            </div>
        </div>

        <div className="p-4">
            {upcomingTransactions.length > 0 ? (<>
                <div className="mb-4">
                    <p className="text-sm text-gray-600">
                        Bạn có {upcomingTransactions.length} giao dịch sắp đến hạn trong 7 ngày tới
                    </p>
                </div>

                <div className="space-y-3">
                    {upcomingTransactions.map((transaction) => {
                        const daysUntilDue = Math.ceil((new Date(transaction.next_due_date) - new Date()) / (1000 * 60 * 60 * 24));

                        return (<div
                            key={transaction.scheduled_id}
                            className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                            <div className="flex-shrink-0 mr-3">
                                <div
                                    className={`w-8 h-8 rounded-full flex items-center justify-center ${transaction.transaction_type === 'income' ? 'bg-green-100' : transaction.transaction_type === 'expense' ? 'bg-red-100' : 'bg-blue-100'}`}>
                                    {transaction.transaction_type === 'income' ? (
                                        <svg className="w-4 h-4 text-green-600" fill="none"
                                             stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round"
                                                  strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18"/>
                                        </svg>) : transaction.transaction_type === 'expense' ? (
                                        <svg className="w-4 h-4 text-red-600" fill="none"
                                             stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round"
                                                  strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H3"/>
                                        </svg>) : (<svg className="w-4 h-4 text-blue-600" fill="none"
                                                        stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round"
                                              strokeWidth={2}
                                              d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"/>
                                    </svg>)}
                                </div>
                            </div>

                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 truncate">
                                    {transaction.description}
                                </p>
                                <div className="flex items-center justify-between mt-1">
                                    <p className="text-xs text-gray-500">
                                        {transaction.accounts?.name}
                                    </p>
                                    <span
                                        className={`text-sm font-medium ${TRANSACTION_TYPE_COLORS[transaction.transaction_type]}`}>
                          {transaction.transaction_type === 'income' ? '+' : transaction.transaction_type === 'expense' ? '-' : ''}
                                        {formatCurrency(transaction.amount)}
                        </span>
                                </div>
                                <div className="flex items-center justify-between mt-1">
                                    <p className="text-xs text-gray-500">
                                        {formatDate(transaction.next_due_date)}
                                    </p>
                                    <span
                                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${daysUntilDue === 0 ? 'bg-red-100 text-red-800' : daysUntilDue <= 2 ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'}`}>
                          {daysUntilDue === 0 ? 'Hôm nay' : daysUntilDue === 1 ? 'Ngày mai' : `${daysUntilDue} ngày`}
                        </span>
                                </div>
                            </div>
                        </div>);
                    })}
                </div>

                <div className="mt-4 pt-3 border-t border-gray-200">
                    <button
                        className="w-full text-center text-sm text-blue-600 hover:text-blue-800 font-medium">
                        Xem tất cả giao dịch định kỳ
                    </button>
                </div>
            </>) : (<div className="text-center py-6">
                <svg className="mx-auto h-8 w-8 text-gray-400" fill="none" stroke="currentColor"
                     viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">
                    Không có giao dịch sắp tới
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                    Bạn không có giao dịch định kỳ nào sắp đến hạn
                </p>
            </div>)}
        </div>
    </div>);
}