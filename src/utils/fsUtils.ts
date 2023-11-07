import fs from "fs";

const deleteFileFromUploads = (fileName: string) => {
  fs.unlink(`${__dirname}/../../uploads/${fileName}`, (err) => {
    if (err) {
      console.log("error deleting file: ", err);
    }
  });
};

export = { deleteFileFromUploads };
