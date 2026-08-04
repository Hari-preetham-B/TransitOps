import api from "./api";

export const getReport = (type, params = {}) =>
  api.get("/reports", { params: { type, ...params } });

export const exportReportCsv = (type, params = {}) =>
  api.get("/reports", {
    params: { type, export: "csv", ...params },
    responseType: "blob",
  });
