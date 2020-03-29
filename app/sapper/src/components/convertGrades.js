

let alphatonum = {
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

let numtoalpha = {
    22:"A1",
    21:"A2",
    20:"A3",
    19:"A4",
    18:"A5",
    17:"B1",
    16:"B2",
    15:"B3",
    14:"C1",
    13:"C2",
    12:"C3",
    11:"D1",
    10:"D2",
    9: "D3",
    8:"E1",
    7:"E2",
    6:"E3",
    5:"F1",
    4:"F2",
    3:"F3",
    2:"G1",
    1:"G2",
    0:"H"
}

let classification = {
    "A1":'1',
    "A2":'1',
    "A3":'1',
    "A4":'1',
    "A5":'1',
    "B1":'2:1',
    "B2":'2:1',
    "B3":'2:1',
    "C1":'2:2',
    "C2":'2:2',
    "C3":'2:2',
    "D1":'3rd',
    "D2":'3rd',
    "D3":'3rd',
    "E1":'Pass',
    "E2":'Pass',
    "E3":'Pass',
    "F1":'Fail',
    "F2":'Fail',
    "F3":'Fail',
    "G1":'Fail',
    "G2":'Fail',
    "H":'Fail'
}

let exportClass = {

    '1' : "01",
    '2:1' : "0U",
    '2:2' : "0L",
    '3rd' : "33",
    'Pass' : "GC"



}




export function convert( grade ) {

    if(!(grade in alphatonum)) {

        let roundedgrade = 0
        roundedgrade = Math.round(grade)

        return numtoalpha[roundedgrade]

    }else{
        return alphatonum[grade]
    }

}

export function degreeClassification( grade ){

    return classification[grade]

}

export function exportClassification( grade ) {
    return exportClass[grade]
}