async function verify() {
  const tests = [
    [12, 1], [14, 1], [18, 2], [19, 1], [20, 1], [20, 2], [21, 1], [21, 4]
  ];
  for (const [b, t] of tests) {
    const res = await fetch(`http://localhost:5001/api/cambridge-writing-test-data/${b}/${t}`);
    const data = await res.json();
    const img = data.data?.writing?.questions[0]?.image[0];
    console.log(`C${b}T${t}: img = ${img}`);
  }
}
verify();
