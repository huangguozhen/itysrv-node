/*
 * 从Uint8Array中读取整型数值
 *
 * @param {Uint8Array} buffer
 * @param {number} offset
 * @param {number} bytes 标识读取方式是变长还是固定位数读取。bytes为0则为变长读取。
 *
 */
export function readUint (buffer, offset, bytes = 0) {
  if (bytes === 0) {
    if (buffer[offset] >> 7 === 0) return buffer[offset]

    return ((buffer[offset] & 0x7F) << 8) + buffer[offset + 1]
  }
  if (bytes > 4) return 0

  let uint = 0
  for (let i = 0; i < bytes; i++) {
    uint += buffer[offset + i] << ((bytes - 1 - i) * 8)
  }

  return uint
}

export function parseUTF8 (input, offset = 0, length = -1) {
  if (length === -1) length = input.length

  let output = ''
  let utf16
  let pos = offset

  while (pos < offset + length) {
    const byte1 = input[pos++]
    if (byte1 < 128) {
      utf16 = byte1
    } else {
      const byte2 = input[pos++] - 128
      if (byte2 < 0) {
        throw new Error(`Malformed UTF data: ${byte1.toString(16)} ${byte2.toString(16)}`)
      }

      // 2 byte character
      if (byte1 < 0xE0) {
        utf16 = 64 * (byte1 - 0xC0) + byte2
      } else {
        const byte3 = input[pos++] - 128
        if (byte3 < 0) {
          throw new Error(`Malformed UTF data: ${byte1.toString(16)} ${byte2.toString(16)} ${byte3.toString(16)}`)
        }
        // 3 byte character
        if (byte1 < 0xF0) {
          utf16 = 4096 * (byte1 - 0xE0) + 64 * byte2 + byte3
        } else {
          const byte4 = input[pos++] - 128
          if (byte4 < 0) {
            throw new Error(`Malformed UTF data: ${byte1.toString(16)} ${byte2.toString(16)}
            ${byte3.toString(16)} ${byte4.toString(16)}`)
          }
          // 4 byte character
          if (byte1 < 0xF8) {
            utf16 = 262144 * (byte1 - 0xF0) + 4096 * byte2 + 64 * byte3 + byte4
          } else {
            // longer encodings are not supported
            throw new Error(`Malformed UTF data: ${byte1.toString(16)} ${byte2.toString(16)}
            ${byte3.toString(16)} ${byte4.toString(16)}`)
          }
        }
      }
    }

    // 4 byte character - express as a surrogate pair
    if (utf16 > 0xFFFF) {
      utf16 -= 0x10000
      output += String.fromCharCode(0xD800 + (utf16 >> 10)) // lead character
      utf16 = 0xDC00 + (utf16 & 0x3FF)  // trail character
    }

    output += String.fromCharCode(utf16)
  }

  return output
}

export function UTF8ToHex (buffer, offset, length) {
  let output, hex
  let pos = offset

  if (!buffer) return ''

  output = ''
  while (pos < offset + length) {
    hex = (buffer[pos++] & 0xff).toString(16)
    hex = (hex.length === 1) ? '0' + hex : hex
    output += hex
  }

  return output.toUpperCase()
}

export function HexToUTF8 (input, output, start) {
  if (!input) return

  let pos = start
  for (let i = 0, len = input.length; i < len; i += 2) {
    output[pos++] = parseInt(input.substr(i, 2), 16)
  }

  return output
}

export function stringToHex (input) {
  let hex
  let output = ''
  for (var i = 0; i < input.length; i++) {
    let charCode = input.charCodeAt(i)

    hex = (charCode & 0xff).toString(16)
    hex = (hex.length === 1) ? '0' + hex : hex
    output += ` ${hex}`
  }

  return output
}

export function decode (uint8) {
  let dpId, type, value, len, offset
  const payload = {}

  offset = 1
  if (uint8[0] === 48) {
    const length = uint8.length - offset
    return JSON.parse(parseUTF8(uint8, offset, length))
  }

  while (uint8.length > offset) {
    // 判断dpId是一个字节还是两个字节
    dpId = readUint(uint8, offset)
    offset += (uint8[offset] & 0x80) ? 2 : 1

    // 获取数据点数据类型，boolean(0x00) integer(0x01) enmu(0x02) string(0x03) penetrate(0x04)
    type = uint8[offset]
    offset += 1

    // 获取数据长度是一个字节还是两个字节
    len = readUint(uint8, offset)
    offset += (uint8[offset] & 0x80) ? 2 : 1

    // 获取数据点内容，并根据类型判断是否转换为字符串
    value = type === 0 ? !!readUint(uint8, offset, len)
      : type === 3 ? parseUTF8(uint8, offset, len)
      : type === 4 ? UTF8ToHex(uint8, offset, len)
      : readUint(uint8, offset, len)
    offset += len

    payload[dpId] = value
  }

  return payload
}

export function padLeft (str, len, holder = ' ') {
  let newStr = '' + str
  return newStr.length > len ? newStr : new Array(len - newStr.length + 1).join(holder) + newStr
}

export function padRight (str, len, holder = ' ') {
  let newStr = '' + str
  return newStr.length > len ? newStr : newStr + new Array(len - newStr.length + 1).join(holder)
}
