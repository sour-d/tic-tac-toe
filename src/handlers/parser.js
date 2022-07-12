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
  const separatorPos = field[1].length === 0 ? 1 : 2;
  const header = field.slice(0, separatorPos);
  const value = field.slice(separatorPos + 1);
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

  const bodyLines = parseBodyAsLines(body, '\r\n', boundaryBuff);
  const fields = separateFields(bodyLines, boundaryBuff);

  return fields.map((field, i) => {
    const { header, value } = separateHeaderAndValue(field, i);
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

class Body {
  #body;
  constructor(body) {
    this.#body = body;
  }

  #findField(fieldName) {
    return this.#body.find(field => field.header.name === fieldName)
  }

  get(fieldName) {
    return this.#findField(fieldName)?.value;
  }
  getHeader(fieldName) {
    return this.#findField(fieldName)?.header;
  }
}

const wrapBody = (body) => {
  const wrappedBody = new Body(body);
  return wrappedBody;
}

const parseBody = (data, req) => {
  if (isMultipartBody(req.headers)) {
    const boundary = getBoundary(req.headers['content-type']);
    const parsedData = parseMultiPartBody(data, boundary);
    req.body = wrapBody(parsedData);
    return;
  }
  req.body = new URLSearchParams(data);
};

module.exports = { parseBody };