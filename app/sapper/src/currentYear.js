let currentYear = new Date().getFullYear();
let currentMonth = new Date().getMonth()+1;

if(currentMonth < 9) {
    currentYear = currentYear - 1; 
} else {
    currentYear = currentYear;
}

export default currentYear;