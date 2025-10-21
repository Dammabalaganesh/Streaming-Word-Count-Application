const lineInput = document.getElementById('lineInput');
const bulk = document.getElementById('bulk');
const ingestBulkBtn = document.getElementById('ingestBulk');
const clearBtn = document.getElementById('clearBtn');
const tbody = document.getElementById('tbody');
const uniqueCountEl = document.getElementById('uniqueCount');
const totalCountEl = document.getElementById('totalCount');
const topNEl = document.getElementById('topN');
const topNHeader = document.getElementById('topNHeader');
const minLenEl = document.getElementById('minLen');
const useStopwordsEl = document.getElementById('useStopwords');

const STOP = new Set(['a','an','the','and','or','but','if','then','else','of','on','in','to','for','with','as','by','is','are','was','were','be','been','being','at','from','it','that','this','these','those','i','you','he','she','we','they','them','his','her','their','our','your']);
const counts = new Map();
let totalTokens = 0;

function tokenize(line, minLen, useStop) {
  const lower = line.toLowerCase();
  const matches = lower.match(/[a-z0-9']+/g) || [];
  return matches.filter(w => w.length >= minLen && (!useStop || !STOP.has(w)));
}

function ingestLine(line) {
  const minLen = parseInt(minLenEl.value) || 1;
  const useStop = useStopwordsEl.checked;
  for (const word of tokenize(line, minLen, useStop)) {
    totalTokens++;
    counts.set(word, (counts.get(word) || 0) + 1);
  }
  render();
}

lineInput.addEventListener('keydown', e => {
  if (e.key === 'Enter') {
    e.preventDefault();
    ingestLine(lineInput.value);
    lineInput.value = '';
  }
});

ingestBulkBtn.addEventListener('click', () => {
  const lines = bulk.value.split(/\r?\n/);
  lines.forEach(ingestLine);
});

clearBtn.addEventListener('click', () => {
  counts.clear(); totalTokens = 0; render();
});

function render() {
  const N = parseInt(topNEl.value);
  if (topNHeader) topNHeader.textContent = `Top ${N} Words`;
  const arr = Array.from(counts.entries()).sort((a,b) => b[1]-a[1] || a[0].localeCompare(b[0]));
  const top = arr.slice(0, N);
  tbody.innerHTML = top.map(([w,c],i) => `
    <tr>
      <td>${i+1}</td>
      <td>${w}</td>
      <td>${c}</td>
    </tr>`).join('');
  uniqueCountEl.textContent = counts.size;
  totalCountEl.textContent = totalTokens;
}
