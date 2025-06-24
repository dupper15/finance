import React from 'react';

export function LoadingSpinner({ size = 'md', className = '' }) {
    const sizeClasses = {
        sm: 'h-4 w-4',
        md: 'h-8 w-8',
        lg: 'h-12 w-12',
        xl: 'h-16 w-16'
    };

    return (
        <div className={`flex items-center justify-center ${className}`}>
            <div className={`animate-spin rounded-full border-b-2 border-blue-600 ${sizeClasses[size]}`}></div>
        </div>
    );
}

export function LoadingOverlay({ message = 'Đang tải...' }) {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 flex flex-col items-center">
                <LoadingSpinner size="lg" />
                <p className="mt-4 text-gray-600">{message}</p>
            </div>
        </div>
    );
}

export function LoadingCard() {
    return (
        <div className="bg-white shadow rounded-lg p-6 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        </div>
    );
}

export function LoadingTable({ rows = 5, columns = 4 }) {
    return (
        <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="animate-pulse">
                <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
                    <div className="grid grid-cols-4 gap-4">
                        {Array.from({ length: columns }).map((_, i) => (
                            <div key={i} className="h-4 bg-gray-200 rounded"></div>
                        ))}
                    </div>
                </div>
                {Array.from({ length: rows }).map((_, i) => (
                    <div key={i} className="px-6 py-4 border-b border-gray-200">
                        <div className="grid grid-cols-4 gap-4">
                            {Array.from({ length: columns }).map((_, j) => (
                                <div key={j} className="h-4 bg-gray-200 rounded"></div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}