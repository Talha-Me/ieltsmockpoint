async function test() {
  try {
    const res = await fetch('http://localhost:5001/cambridge-writing.html');
    console.log('HTTP Status:', res.status);
    const text = await res.text();
    console.log('HTML Length:', text.length);
    console.log('Contains id="tabs":', text.includes('id="tabs"'));
    console.log('Contains id="grid":', text.includes('id="grid"'));
    console.log('Contains Take Test:', text.includes('Take Test'));
    console.log('Contains part-popover:', text.includes('part-popover'));
    console.log('Contains Part 1:', text.includes('task=1'));
    console.log('Contains Part 2:', text.includes('task=2'));
  } catch (err) {
    console.error('Test error:', err);
  }
}
test();
