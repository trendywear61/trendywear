export const getBaseUrl = () => {
    const apiUrl = import.meta.env.VITE_API_URL;
    if (apiUrl) {
        // Return base URL without the /api suffix
        return apiUrl.replace(/\/api\/?$/, '');
    }
    return ''; // Or window.location.origin for a safer default in production if needed
};

export const getImageUrl = (imagePath) => {
    if (!imagePath) return 'https://via.placeholder.com/400x300?text=No+Image';
    if (imagePath.startsWith('http')) return imagePath;

    // Ensure imagePath starts with /
    const normalizedPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
    return `${getBaseUrl()}${normalizedPath}`;
};
