let degreetoacademic = {
    "CHEM-4H":"F100-2208",
    "CMC-4H":"F103-2208",
    "CHEM-5M (WP)":"F101-2207",
    "CHEM-5M (EP)":"F102-2207",
    "CMC-5M (WP)":"F104-2207",
    "CMC-5M (EP)":"F105-2207",
    "CHEM-MSc":"F100-5200",
    "CMC-MSc":"F103-5200",
}


export function degreeToAcademic( code ){

    return degreetoacademic[code]

}