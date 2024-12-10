'use rechunk';

export default async function (msg: string, nextMsg: string) {
  console.log(`\n\n${msg} ${nextMsg}\n\n`);

  return msg;
}
