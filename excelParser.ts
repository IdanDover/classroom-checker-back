import xlsx from "node-xlsx";
// Or var xlsx = require('node-xlsx').default;

// Parse a buffer
// const workSheetsFromBuffer = xlsx.parse(
//   fs.readFileSync(`${__dirname}/myFile.xlsx`)
// );
// Parse a file

const workSheetsFromFile = xlsx.parse(`${__dirname}/excel-files/evening.xlsx`);

console.log(workSheetsFromFile[1].data);
const excelParser = {
  excel: workSheetsFromFile,
  number: 5,
};

module.exports.number = 5;

export = excelParser;
