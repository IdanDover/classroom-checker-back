import xlsx from "node-xlsx";
import fsUtils from "./fsUtils";
import { Classroom, Task } from "../models/appTypes";

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

const parseFileToModels = (data: Array<any>, time: "noon" | "evening") => {
  const classrooms: Classroom[] = [];
  const tasks: Task[] = [];

  data.forEach((row) => {
    if (isClassroom(row)) {
      let [classNum, courseSet, camera, courseName, comment] = row;
      if (typeof classNum !== "number") {
        classNum = Number(classNum.slice(0, 3));
      }
      classrooms.push({
        classNum,
        courseSet,
        camera,
        courseName,
        comment,
        time,
        completed: false,
      });
    }

    if (isTask(row)) {
      const [taskNum, courseSet, description] = row;
      tasks.push({ taskNum, courseSet, description, time, completed: false });
    }
  });

  return { classrooms, tasks };
};

const parseFiles = (files: any) => {
  const noonWorksheet = xlsx.parse(
    `${__dirname}/../../uploads/${files.noon[0].filename}`
  );

  const eveningWorksheet = xlsx.parse(
    `${__dirname}/../../uploads/${files.evening[0].filename}`
  );

  const noonData = parseFileToModels(
    noonWorksheet[Number(process.env.SHEET_NUM)].data,
    "noon"
  );

  const eveningData = parseFileToModels(
    eveningWorksheet[Number(process.env.SHEET_NUM)].data,
    "evening"
  );

  fsUtils.deleteFileFromUploads(files.noon[0].filename);
  fsUtils.deleteFileFromUploads(files.evening[0].filename);

  return { noonData, eveningData };
};

export = { isClassroom, isTask, parseFiles };
