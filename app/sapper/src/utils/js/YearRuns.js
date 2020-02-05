 let years =  [];
	
	let currentYear = new Date().getFullYear()-1;
	let nextYear = currentYear + 1;
	let yearObj = {}
	
	for(let i = 0; i < 6; i++) {
		 yearObj = {
			id: "Y" +  (''+currentYear).substr(2,2) + "" + (''+nextYear).substr(2,2), 
			text: currentYear + "-" + nextYear
		 }
		 currentYear=nextYear;
		 nextYear++;
		 
		 years.push(yearObj);
		}


  export default years;

 
