let gradesdict = {
    "A1":22,
    "A2":21,
    "A3":20,
    "A4":19,
    "A5":18,
    "B1":17,
    "B2":16,
    "B3":15,
    "C1":14,
    "C2":13,
    "C3":12,
    "D1":11,
    "D2":10,
    "D3":9,
    "E1":8,
    "E2":7,
    "E3":6,
    "F1":5,
    "F2":4,
    "F3":3,
    "G1":2,
    "G2":1,
    "H":0
}
var invert = function (obj) {

    var new_obj = {};
  
    for (var prop in obj) {
      if(obj.hasOwnProperty(prop)) {
        new_obj[obj[prop]] = prop;
      }
    }
  
    return new_obj;
  };

function convert( grade ) {
    if(!(grade in gradesdict)) {
        //check if it is a float
        roundedgrade = Math.round(grade)
         return invert(gradesdict)[roundedgrade]

    }else{
        return gradesdict[grade]
    }

}

module.exports ={
    convert
}
