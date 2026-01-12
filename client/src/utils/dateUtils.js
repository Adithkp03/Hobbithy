import { format, startOfMonth, endOfMonth, eachDayOfInterval, startOfWeek, endOfWeek, addWeeks, min } from 'date-fns';

export const getDaysInMonth = (date) => {
    return eachDayOfInterval({
        start: startOfMonth(date),
        end: endOfMonth(date),
    });
};

export const getWeeksInMonth = (date) => {
    const start = startOfMonth(date);
    const end = endOfMonth(date);
    const weeks = [];
    let current = start;

    while (current <= end) {
        weeks.push({
            start: current,
            end: min([endOfWeek(current, { weekStartsOn: 1 }), end]), // Week starts on Monday
            id: format(current, 'yyyy-Iw'), // ISO Week ID
        });
        current = addWeeks(current, 1);
        current = startOfWeek(current, { weekStartsOn: 1 }); // Reset to start of next week
        // Fix infinite loop/overlap at end of month:
        if (current <= weeks[weeks.length - 1].start) {
            current = addWeeks(weeks[weeks.length - 1].start, 1);
        }
    }
    return weeks;
};

export const formatDateKey = (date) => format(date, 'yyyy-MM-dd');
