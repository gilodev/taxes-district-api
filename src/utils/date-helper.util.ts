export function calculateEndPeriod(startDate: Date): Date {
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + 3);
    return endDate;
  }
  
  export function getCurrentPeriod(): { startPeriod: Date; endPeriod: Date } {
    const now = new Date();
    const currentMonth = now.getMonth();
    
    // Déterminer le trimestre
    const quarterStart = Math.floor(currentMonth / 3) * 3;
    
    const startPeriod = new Date(now.getFullYear(), quarterStart, 1);
    const endPeriod = new Date(now.getFullYear(), quarterStart + 3, 0);
    
    return { startPeriod, endPeriod };
  }