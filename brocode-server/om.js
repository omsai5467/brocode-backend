const logger = require("./loggerconfig/logger.js");

var length = 1000000;
var s1 = 1000004;
var s2 = 1000003;
sq1 = length;
sq2 = length;

var time = 0;

for (let i = 0; i < s1; i++) {
  var a = 0;
  temp = s1 * i;
  temp2 = s2 * i;

  var b = temp - temp2;

  var c = Math.sqrt(a * a + b * b);
  var sq1c = [i, temp];
  var sq2c = [i, temp2];
  var intersectpoint = [i, temp + length];
  t1 = sq2c[0] - intersectpoint[0];
  t2 = sq2c[1] - intersectpoint[1];

  c = Math.sqrt(t1 * t1 + t2 * t2);

  //   logger.info(
  //     `sq1===> ${s1 * i} pioints are (${i},${temp}):: sq2===> ${
  //       s2 * i
  //     } points are (${i},${temp2}) distence betwwen points is  ::> ${c}  `
  //   );

  logger.info(`area of overlapped sqare is ${c * c} at time t = ${i}`);
}
