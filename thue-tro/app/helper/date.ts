type DateFormat =
    | 'date'
    | 'datetime'
    | 'time'
    | 'month-year';

export const formatDate = (
    value: string | Date,
    format: DateFormat = 'date',
): string => {
    if (!value) return '';

    const date = new Date(value);

    if (isNaN(date.getTime())) return '';

    return new Intl.DateTimeFormat('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        ...(format === 'datetime' && {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
        }),
    }).format(date);
};

export const formatTimeAgo = (date: string | Date): string => {
    const now = new Date().getTime();
    const createdAt = new Date(date).getTime();

    const diff = Math.floor((now - createdAt) / 1000);

    if (diff < 0) return 'Vừa xong';

    if (diff < 60) return 'Vừa xong';

    const minutes = Math.floor(diff / 60);
    if (minutes < 60) return `${minutes} phút trước`;

    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} giờ trước`;

    const days = Math.floor(hours / 24);
    if (days < 30) return `${days} ngày trước`;

    const months = Math.floor(days / 30);
    if (months < 12) return `${months} tháng trước`;

    const years = Math.floor(days / 365);
    return `${years} năm trước`;
};