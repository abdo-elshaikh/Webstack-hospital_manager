// Get today's date
const getToday = () => {
    const today = new Date();
    return {
        start: new Date(today.setHours(0, 0, 0, 0)).toLocaleString(),
        end: new Date(today.setHours(23, 59, 59, 999)).toLocaleString()
    };
};

// Get yesterday's date
const getYesterday = () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return {
        start: new Date(yesterday.setHours(0, 0, 0, 0)).toLocaleString(),
        end: new Date(yesterday.setHours(23, 59, 59, 999)).toLocaleString()
    };
};

//  Get the start and end of before yasterday
const getBeforeYesterday = () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 2);
    return {
        start: new Date(yesterday.setHours(0, 0, 0, 0)).toLocaleString(),
        end: new Date(yesterday.setHours(23, 59, 59, 999)).toLocaleString()
    };
};

// Get the start and end of this week
const getThisWeek = () => {
    const today = new Date();
    const start = new Date(today.setDate(today.getDate() - today.getDay())).toLocaleString();
    const end = new Date(today.setDate(today.getDate() - today.getDay() + 6)).toLocaleString();
    return { start, end };
};

// Get the start and end of last week
const getLastWeek = () => {
    const today = new Date();
    const start = new Date(today.setDate(today.getDate() - today.getDay() - 6)).toLocaleString();
    const end = new Date(today.setDate(today.getDate() - today.getDay())).toLocaleString();
    return { start, end };
};

// Get the start and end of this month
const getThisMonth = () => {
    const today = new Date();
    const start = new Date(today.getFullYear(), today.getMonth(), 1).toLocaleString();
    const end = new Date(today.getFullYear(), today.getMonth() + 1, 0, 23, 59, 59, 999).toLocaleString();
    return { start, end };
};

// Get the start and end of last month
const getLastMonth = () => {
    const today = new Date();
    const start = new Date(today.getFullYear(), today.getMonth() - 1, 1).toLocaleString();
    const end = new Date(today.getFullYear(), today.getMonth(), 0, 23, 59, 59, 999).toLocaleString();
    return { start, end };
};

// Get the start and end of this year
const getThisYear = () => {
    const today = new Date();
    const start = new Date(today.getFullYear(), 0, 1).toLocaleString();
    const end = new Date(today.getFullYear(), 11, 31, 23, 59, 59, 999).toLocaleString();
    return { start, end };
};

// Get the start and end of last year
const getLastYear = () => {
    const today = new Date();
    const start = new Date(today.getFullYear() - 1, 0, 1).toLocaleString();
    const end = new Date(today.getFullYear() - 1, 11, 31, 23, 59, 59, 999).toLocaleString();
    return { start, end };
};

export { getToday, getYesterday, getThisMonth, getLastMonth, getThisYear, getLastYear, getThisWeek, getLastWeek, getBeforeYesterday };