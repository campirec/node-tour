process.stdout.write('第一行\n第二');
setTimeout(() => {
  process.stdout.write('行\n第三行\n');
}, 20);
