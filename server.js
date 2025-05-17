// Add this helper function near the top of your server.js file
// Helper function to create properly formatted API URLs
function getApiUrl(endpoint) {
    // Start with the base API host from env
    let apiUrl = process.env.NEXT_API_HOST || 'http://localhost:3000';
    
    // Remove trailing slash if present
    if (apiUrl.endsWith('/')) {
        apiUrl = apiUrl.slice(0, -1);
    }
    
    // Add /api prefix if not already present
    if (!apiUrl.includes('/api')) {
        apiUrl = `${apiUrl}/api`;
    }
    
    // Ensure endpoint starts with slash
    if (!endpoint.startsWith('/')) {
        endpoint = '/' + endpoint;
    }
    
    return `${apiUrl}${endpoint}`;
}

// Then replace all instances of API URL construction with this function
// For example:
// const finalApiUrl = `${apiUrl}/recording/${userId}/processing`;
// becomes:
// const finalApiUrl = getApiUrl(`/recording/${userId}/processing`); 