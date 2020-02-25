let years =  [];
	
let currentYear = new Date().getFullYear()-1;
let yearObj = {}

for(let i = 0; i < 15; i++) {
	 yearObj = {
		id: currentYear ,
		text: currentYear
	 } 
	 years.push(yearObj);
	 currentYear++;
	}


export default years;
 
