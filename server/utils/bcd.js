function decode (hexStr) {
  const bcdArr = [];
  for (let i = 0, l = hexStr.length; i < l; i ++) {
    let hex = Number(hexStr.charCodeAt(i)).toString(16);
    bcdArr.push(hex);
  }

  return bcdArr.join('');
}

function encode (hexStr) {
  let bcdArr = [];
  let str = hexStr.toString();
  if (str.length % 2 !== 0) str = '0' + str;

  for (let i = 0; i < str.length; i += 2) {
    bcdArr.push(parseInt(str.substr(i, 2), 16))
  }

  return new Buffer(bcdArr);
}

module.exports = {
  encode,
  decode
}
