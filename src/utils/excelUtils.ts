//TODO: ask Oren to change the format of the excel file to make the logic easier
//NOTE:Some values are hardcoded because of the format of the excel file
const isClassroom = (potentialClassroom: Array<any>) => {
  if (potentialClassroom.length !== 5 && potentialClassroom.length !== 6) {
    return false;
  }

  if (potentialClassroom[0] / 100 < 10) {
    return true;
  }

  if (
    potentialClassroom[0] === "604+605" ||
    potentialClassroom[0] === "414-416"
  ) {
    return true;
  }

  return false;
};

const isTask = (potentialTask: Array<any>) => {
  return potentialTask.length === 3 && potentialTask[0] < 10;
};

const parseToFloors = (data: Array<any>) => {
  let floorNum = 0;
  let parsedData: any = {
    tasks: [],
  };
  data.forEach((el: Array<any>) => {
    if (!el[0]) {
      return;
    }

    if (isClassroom(el)) {
      //NOTE:The destructuring is according to the format of the excel file
      const [classNum, courseSet, camera, courseName, comments] = el;

      if (
        typeof classNum !== "string" &&
        Math.floor(classNum / 100) !== floorNum
      ) {
        floorNum = Math.floor(classNum / 100);
        parsedData[`floor${floorNum}`] = [];
      }

      parsedData[`floor${floorNum}`].push({
        classNum,
        courseSet,
        camera,
        courseName,
        comments,
      });
    }

    if (isTask(el)) {
      //NOTE:The destructuring is according to the format of the excel file
      const [taskNum, set, description] = el;

      parsedData.tasks.push({
        taskNum,
        set,
        description,
      });
    }
  });

  return parsedData;
};

const stringify = (parsed: object) => {
  return JSON.stringify(parsed);
};

const parseForRedis = (data: Array<any>) => {
  const parsedData = parseToFloors(data);
  const readyForRedis = stringify(parsedData);

  return readyForRedis;
};

const excelUtils = { parseForRedis };

export = excelUtils;
