let years =  [];
	
let currentYear = new Date().getFullYear()-1;
let pastYears = new Date().getFullYear()-6;
let yearObj = {}
let yearObj_2 = {}

for(let i = 0; i < 5; i++) {
	yearObj_2 = {
		id: pastYears,
		text: pastYears
	 } 
	 years.push(yearObj_2)
	 pastYears++;
}

for(let i = 0; i < 7; i++) {
	 yearObj = {
		id: currentYear ,
		text: currentYear
	 } 
	 years.push(yearObj)
	 currentYear++;
	}


export default years;