import fs from "fs";

let token = "";

export const initToken = async () => {
  const url = `${process.env.S3_URL}/auth/tokens`;
  const json = {
    auth: {
      identity: {
        methods: ["password"],
        password: {
          user: {
            name: process.env.S3_ACCESS,
            domain: { name: "Default" },
            password: process.env.S3_SECRET,
          },
        },
        // TODO : find tenant id
        tenantId: "this.config.tenantId",
      },
    },
  };

  // TODO : replace axios with fetch
  const res = await axios({
    method: "POST",
    url,
    headers: { Accept: "application/json" },
    data: json,
  });

  token = res.headers["x-subject-token"];
};

export const getFileList = async (folderPath: string) => {
  if (!token) {
    await initToken();
  }
  const url = `${process.env.S3_URL}${folderPath}`;
  const res = await axios({
    method: "GET",
    url,
    headers: {
      "X-Auth-Token": token,
      Accept: "application/json",
    },
  });
  return res.data;
};

export const getFile = async (path: string) => {
  if (!token) {
    await initToken();
  }
  const url = `${process.env.S3_URL}${path}`;
  const res = await axios({
    method: "GET",
    url,
    responseType: "arraybuffer",
    headers: {
      "X-Auth-Token": token,
      Accept: "application/octet-stream",
    },
  });
  return res.data;
};

// PUT /path : upload file
export const putFile = async (file: string, path: string, headers = {}) => {
  if (!token) {
    await initToken();
  }
  const stream = fs.createReadStream(file);
  return putStream(stream, path, headers);
};

// PUT /path : upload file
export const putStream = async (stream, path: string, headers = {}) => {
  if (!token) {
    await initToken();
  }
  const url = `${process.env.S3_URL}${path}`;
  headers = {
    ...headers,
    "X-Auth-Token": token,
    Accept: "application/json",
    "content-type": "application/octet-stream",
  };

  const res = await axios({
    method: "PUT",
    url,
    headers,
    data: stream,
    maxContentLength: Infinity,
    maxBodyLength: Infinity,
  });
  return res.data;
};

// DELETE /path : delete file
export const deleteFile = async (path: string, headers = {}) => {
  if (!token) {
    await initToken();
  }
  const url = `${process.env.S3_URL}${path}`;
  headers = {
    ...headers,
    "X-Auth-Token": token,
    Accept: "application/json",
  };

  const res = await axios({
    method: "DELETE",
    url,
    headers,
  });
  return res.data;
};

// CREATE /container : create container
export const createContainer = async (container: string) => {
  if (!token) {
    await initToken();
  }
  const url = `${process.env.S3_URL}/${container}`;
  const res = await axios({
    method: "PUT",
    url,
    headers: {
      "X-Auth-Token": token,
      Accept: "application/json",
    },
  });
  return res.data;
};
