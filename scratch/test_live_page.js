async function check() {
  const res = await fetch('http://localhost:5001/cambridge-writing.html');
  const text = await res.text();
  console.log('Status:', res.status);
  console.log('Length:', text.length);
  console.log('Has Book 21:', text.includes('book: 21'));
  console.log('Has 40 count:', text.includes('data-n="40"'));
  console.log('Has Cambridge 12-21:', text.includes('Cambridge 12–21'));
}
check();
