function parseMessage(buffer) {
  const firstByte = buffer.readUInt8(0);
  const opCode = firstByte & 0xf;

  if (opCode === 8) {
    return null;
  }
  if (opCode !== 1) {
    return;
  }

  const secondByte = buffer.readUInt8(1);
  const isMasked = secondByte >>> 7 === 1;

  if (!isMasked) {
    throw new Error("we only care about masked frames from the browser");
  }

  const maskingKey = buffer.readUInt32BE(2);
  let currentOffset = 6;

  const messageLength = secondByte & 0x7f;
  if (messageLength > 125) {
    throw new Error("lol we're not doing big frames");
  }

  const response = Buffer.alloc(messageLength);
  for (let i = 0; i < messageLength; i++) {
    const maskPosition = i % 4;

    let shift;
    if (maskPosition === 3) {
      shift = 0;
    } else {
      shift = (3 - maskPosition) << 3;
    }

    let mask;
    if (shift === 0) {
      mask = maskingKey & 0xff;
    } else {
      mask = (maskingKey >>> shift) & 0xff;
    }

    const source = buffer.readUInt8(currentOffset);
    currentOffset++;
    response.writeUInt8(mask ^ source, i);
  }

  return JSON.parse(response.toString("utf8"));
}

export default parseMessage;
