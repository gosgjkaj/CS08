/**
 * @param {object[]} headers
 * @param {object[]} data
 * @param {string} fileName
 */

 /**
 * @param {object[]} obj
 * @return {string}
 */
function csvFormatString(obj) {
    let parsedObj = typeof obj != "object" ? JSON.parse(obj) : obj
    let str = ""
    for (let i = 0; i < parsedObj.length; i++) {
      let line = ""
      for (let key in parsedObj[i]) {
        if (line != "") {
          line += ","
        }
        line += parsedObj[i][key]
      }
      str += line + "\r\n"
    }
    return str
  }
  
  export const downloadCSV = (headers, data, fileName) => {
    if (headers) {
      data.unshift(headers)
    }
  
    // Convert Object to JSON
    let jsonObject = JSON.stringify(data)
  
    let formattedCSV = csvFormatString(jsonObject)
    let downloadFileName = fileName + ".csv" || "export.csv"
  
    let blob = new Blob([formattedCSV], { type: "text/csv;charset=utf-8;" })
    if (navigator.msSaveBlob) {
      // IE 10+
      navigator.msSaveBlob(blob, downloadFileName)
    } else {
      let link = document.createElement("a")
      if (link.download !== undefined) {
        // Browsers that support HTML5 download attribute
        let url = URL.createObjectURL(blob)
        link.setAttribute("href", url)
        link.setAttribute("download", downloadFileName)
        link.style.visibility = "hidden"
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      }
    }
  }
  
