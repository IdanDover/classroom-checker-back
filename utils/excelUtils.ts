const removeUnwantedData = (file: Array<any>) => {
  //NOTE:The values are hard coded according to the length of the excel file
  const data = file.slice(4, -13);
  return data;
};

const parseToFloors = (data: Array<any>) => {
  //NOTE:The values are hard coded according to the length of the excel file
  //TODO: check for the hard coded values if you can throw them somewhere
  let floorNum = 0;
  let parsedData: any = {
    tasks: data.pop(),
  };
  data.forEach((el: Array<any>) => {
    if (isNaN(el[0])) {
      return;
    }

    if (Math.floor(el[0] / 100) !== floorNum) {
      floorNum = Math.floor(el[0] / 100);
      parsedData[`floor${floorNum}`] = [];
    }

    //NOTE: I destructure the values as such because this is how the excel file I parse is organized
    const [className, courseSet, camera, courseName, comments] = el;

    parsedData[`floor${floorNum}`].push({
      className,
      courseSet,
      camera,
      courseName,
      comments,
    });
  });

  return parsedData;
};

const stringify = (parsed: object) => {
  return JSON.stringify(parsed);
};

const parseForRedis = (file: Array<any>) => {
  const data = removeUnwantedData(file);
  const parsedData = parseToFloors(data);
  const readyForRedis = stringify(parsedData);

  return readyForRedis;
};

const excelUtils = { parseForRedis };

export = excelUtils;
