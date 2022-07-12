const fs = require('fs');

const getBody = () => {
  return fs.readFileSync('./src/handlers/output.txt');
};

const parseBodyAsLines = (body, lineSeparator) => {
  const crlf = new Buffer.from(lineSeparator);
  const lines = [];
  let lineEnd = body.indexOf(crlf);

  while (lineEnd != -1) {
    lines.push(body.slice(0, lineEnd));
    body = body.slice(lineEnd + lineSeparator.length);
    lineEnd = body.indexOf(crlf);
  }
  return lines;
}

const separateFields = (lines, boundary) => {
  const fields = [];
  let start = 1;
  for (let i = 1; i < lines.length; i++) {
    if (lines[i].indexOf(boundary) !== -1) {
      fields.push(lines.slice(start, i));
      start = i + 1;
    }
  }

  return fields;
}

const separateHeaderAndValue = (field) => {
  const separator = '';
  const buf = new Buffer.from(separator);
  const separatorPos = field.indexOf(buf);
  const header = field.slice(0, separatorPos - 1);
  const value = field.slice(separatorPos);
  return { header, value };
}

const parseBodyHeader = (rawHeader) => {
  const headers = rawHeader.toString().split(';');
  const parsedHeaders = [];
  headers.forEach(header => {
    const [key, value] = header.split(/[:=]/);
    parsedHeaders[key.trim()] = value.trim().replaceAll('"', '');
  });
  return parsedHeaders;
};

const parseMultiPartBody = (body, boundary) => {
  const boundaryBuff = new Buffer.from(boundary);

  const bodyLines = parseBodyAsLines(body, '\r\n');
  const fields = separateFields(bodyLines, boundaryBuff);

  return fields.map(field => {
    const { header, value } = separateHeaderAndValue(field);
    const parsedHeader = parseBodyHeader(header.join(';'));
    return { header: parsedHeader, value };
  });
};

const isMultipartBody = (headers) => {
  const contentType = headers['content-type'];
  return contentType && contentType.includes('multipart/form-data');
};

const getBoundary = (contentType) => {
  const [type, boundary] = contentType.split(';');
  const [key, value] = boundary.split('=');
  return value;
};

const parseBody = (data, req) => {
  if (isMultipartBody(req.headers)) {
    const boundary = getBoundary(req.headers['content-type']);
    req.body = parseMultiPartBody(data[0], boundary);
    console.log(req.body);
    return;
  }
  req.body = new URLSearchParams(data);
};

module.exports = { parseBody };