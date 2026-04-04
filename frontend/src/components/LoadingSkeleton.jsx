export const LoadingSkeleton = ({ type = 'product' }) => {
    if (type === 'product') {
        return (
            <div className="card p-4">
                <div className="skeleton h-48 w-full rounded-lg mb-4"></div>
                <div className="skeleton h-6 w-3/4 rounded mb-2"></div>
                <div className="skeleton h-4 w-1/2 rounded mb-4"></div>
                <div className="skeleton h-10 w-full rounded"></div>
            </div>
        );
    }

    if (type === 'list') {
        return (
            <div className="space-y-4">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="skeleton h-24 w-full rounded-lg"></div>
                ))}
            </div>
        );
    }

    return <div className="skeleton h-64 w-full rounded-lg"></div>;
};
