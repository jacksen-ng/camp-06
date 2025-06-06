import React from 'react';

export default function Background() {
    return (
        <div className="fixed inset-0 -z-10 overflow-hidden">
        {/* Main gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50"></div>
        
        {/* Animated gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-tr from-blue-100/20 via-transparent to-purple-100/20 animate-pulse"></div>
        
        {/* Floating geometric shapes */}
        <div className="absolute top-10 left-10 w-32 h-32 bg-gradient-to-br from-blue-200/30 to-indigo-200/30 rounded-full blur-xl animate-bounce"></div>
        <div className="absolute top-1/3 right-20 w-24 h-24 bg-gradient-to-br from-purple-200/30 to-pink-200/30 rounded-full blur-lg animate-pulse"></div>
        <div className="absolute bottom-20 left-1/4 w-40 h-40 bg-gradient-to-br from-teal-200/20 to-blue-200/20 rounded-full blur-2xl animate-bounce"></div>
        <div className="absolute top-1/2 left-10 w-16 h-16 bg-gradient-to-br from-indigo-300/40 to-purple-300/40 rounded-lg blur-md animate-pulse"></div>
        <div className="absolute bottom-1/3 right-10 w-28 h-28 bg-gradient-to-br from-blue-300/30 to-teal-300/30 rounded-full blur-lg animate-bounce"></div>
        
        {/* Subtle pattern overlay */}
        <div 
            className="absolute inset-0 opacity-5"
            style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, #6366f1 1px, transparent 0)`,
            backgroundSize: '40px 40px'
            }}
        ></div>
        
        {/* Floating particles */}
        <div className="absolute top-1/4 left-1/3 w-2 h-2 bg-blue-400/50 rounded-full animate-ping"></div>
        <div className="absolute top-2/3 right-1/3 w-1 h-1 bg-purple-400/60 rounded-full animate-ping" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-1/4 left-2/3 w-1.5 h-1.5 bg-indigo-400/40 rounded-full animate-ping" style={{ animationDelay: '2s' }}></div>
        </div>
    );
}
