process.stdin.setEncoding('utf8');
let input = '';
for await (const chunk of process.stdin) {
  input += chunk;
}
process.stdout.write(input.toUpperCase());
