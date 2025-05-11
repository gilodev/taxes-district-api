"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateEndPeriod = calculateEndPeriod;
exports.getCurrentPeriod = getCurrentPeriod;
function calculateEndPeriod(startDate) {
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + 3);
    return endDate;
}
function getCurrentPeriod() {
    const now = new Date();
    const currentMonth = now.getMonth();
    const quarterStart = Math.floor(currentMonth / 3) * 3;
    const startPeriod = new Date(now.getFullYear(), quarterStart, 1);
    const endPeriod = new Date(now.getFullYear(), quarterStart + 3, 0);
    return { startPeriod, endPeriod };
}
//# sourceMappingURL=date-helper.util.js.map