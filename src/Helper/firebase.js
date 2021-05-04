import firebase from "FirebaseApp";
import { v4 as uuidv4 } from "uuid";
import mime from "mime-types";

const db = firebase.database();

export const updateDB = (updates) => {
  return new Promise((resolve, reject) => {
    db.ref()
      .update(updates)
      .then(() => {
        resolve(true);
      })
      .catch(() => {
        resolve(false);
      });
  });
};

export const getDbRef = (path) => {
  return db.ref(path);
};

export const getFromDatabase = (path) => {
  return new Promise((resolve, reject) => {
    return db
      .ref(path)
      .once("value")
      .then((snap) => {
        resolve(snap ? snap.val() : null);
      });
  });
};

export const uploadImage = (file) => {
  return new Promise((resolve, reject) => {
    const storage = firebase.storage();

    const metadata = {
      contentType: file.type,
    };

    const fileName = uuidv4() + "." + mime.extension(file.type);
    let ref = storage.ref(fileName);
    const uploadTask = ref.put(file, metadata);
    uploadTask.on(
      "state_changed",
      (snapshot) => {},
      (error) => {
        resolve({ error });
      },
      () => {
        uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
          resolve(downloadURL);
        });
      }
    );
  });
};
