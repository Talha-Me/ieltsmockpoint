// Lightweight, zero-dependency inline SVG & HTML visuals for IELTS Writing Task 1 samples

function getTask1VisualHtml(slug) {
  switch (slug) {
    case 'ielts-task-1-line-graph-renewable-energy-vs-fossil-fuels':
      return `
        <figure class="t1-visual">
          <figcaption>Electricity Generation by Source in a European Country (2000–2025)</figcaption>
          <svg viewBox="0 0 680 330" role="img" aria-label="Line graph showing fossil fuels falling from 78% to 31% and renewables rising from 14% to 62% between 2000 and 2025">
            <rect width="680" height="330" rx="12" fill="#ffffff"/>
            <!-- Grid lines -->
            <g stroke="#e2e8f0" stroke-width="1">
              <line x1="70" y1="45" x2="630" y2="45"/><line x1="70" y1="90" x2="630" y2="90"/>
              <line x1="70" y1="135" x2="630" y2="135"/><line x1="70" y1="180" x2="630" y2="180"/>
              <line x1="70" y1="225" x2="630" y2="225"/><line x1="70" y1="270" x2="630" y2="270"/>
            </g>
            <!-- Y-axis labels (0% to 100%, 2.25px per %) -->
            <g font-family="Inter,sans-serif" font-size="11" fill="#64748b" text-anchor="end">
              <text x="60" y="49">100%</text><text x="60" y="94">80%</text>
              <text x="60" y="139">60%</text><text x="60" y="184">40%</text>
              <text x="60" y="229">20%</text><text x="60" y="274">0%</text>
            </g>
            <!-- X-axis labels (2000, 2005, 2010, 2015, 2020, 2025) -->
            <g font-family="Inter,sans-serif" font-size="11" fill="#475569" text-anchor="middle" font-weight="600">
              <text x="90" y="292">2000</text><text x="198" y="292">2005</text>
              <text x="306" y="292">2010</text><text x="414" y="292">2015</text>
              <text x="522" y="292">2020</text><text x="615" y="292">2025</text>
            </g>
            <!-- Fossil Fuels line: 2000(78%=94.5), 2005(71%=110), 2010(64%=126), 2015(58%=139.5), 2020(50%=157.5), 2021(48%=162), 2025(31%=200) -->
            <polyline fill="none" stroke="#e0202d" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"
              points="90,94.5 198,110 306,126 414,139.5 522,157.5 541,162 615,200"/>
            <!-- Renewables line: 2000(14%=238.5), 2005(19%=227), 2010(26%=211.5), 2015(34%=193.5), 2020(46%=166.5), 2021(48%=162), 2025(62%=130.5) -->
            <polyline fill="none" stroke="#1565c9" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"
              points="90,238.5 198,227 306,211.5 414,193.5 522,166.5 541,162 615,130.5"/>
            <!-- Data dots & labels -->
            <g font-family="Sora,sans-serif" font-size="11" font-weight="700">
              <circle cx="90" cy="94.5" r="4.5" fill="#e0202d"/><text x="95" y="85" fill="#e0202d">78%</text>
              <circle cx="306" cy="126" r="4" fill="#e0202d"/><text x="306" y="116" fill="#e0202d" text-anchor="middle">64%</text>
              <circle cx="615" cy="200" r="4.5" fill="#e0202d"/><text x="615" y="217" fill="#e0202d" text-anchor="middle">31%</text>
              <circle cx="90" cy="238.5" r="4.5" fill="#1565c9"/><text x="95" y="255" fill="#1565c9">14%</text>
              <circle cx="306" cy="211.5" r="4" fill="#1565c9"/><text x="306" y="230" fill="#1565c9" text-anchor="middle">26%</text>
              <circle cx="615" cy="130.5" r="4.5" fill="#1565c9"/><text x="615" y="120" fill="#1565c9" text-anchor="middle">62%</text>
              <circle cx="541" cy="162" r="5.5" fill="#0b2b52" stroke="#fff" stroke-width="2"/>
              <text x="541" y="148" fill="#0b2b52" text-anchor="middle" font-size="10">2021 (48%)</text>
            </g>
            <!-- Legend -->
            <g font-family="Inter,sans-serif" font-size="12" font-weight="700">
              <rect x="200" y="12" width="14" height="4" rx="2" fill="#e0202d"/><text x="220" y="18" fill="#0b2b52">Fossil Fuels</text>
              <rect x="340" y="12" width="14" height="4" rx="2" fill="#1565c9"/><text x="360" y="18" fill="#0b2b52">Renewable Sources</text>
            </g>
          </svg>
        </figure>`;

    case 'ielts-task-1-bar-chart-household-expenditure':
      return `
        <figure class="t1-visual">
          <figcaption>Average Annual Household Expenditure by Category (%)</figcaption>
          <svg viewBox="0 0 680 330" role="img" aria-label="Grouped bar chart comparing household spending on Housing, Food, Transport, and Technology across Japan, Germany, Australia, and Brazil">
            <rect width="680" height="330" rx="12" fill="#ffffff"/>
            <g stroke="#e2e8f0" stroke-width="1">
              <line x1="65" y1="60" x2="640" y2="60"/><line x1="65" y1="112" x2="640" y2="112"/>
              <line x1="65" y1="164" x2="640" y2="164"/><line x1="65" y1="216" x2="640" y2="216"/>
              <line x1="65" y1="268" x2="640" y2="268"/>
            </g>
            <g font-family="Inter,sans-serif" font-size="11" fill="#64748b" text-anchor="end">
              <text x="56" y="64">40%</text><text x="56" y="116">30%</text>
              <text x="56" y="168">20%</text><text x="56" y="220">10%</text><text x="56" y="272">0%</text>
            </g>
            <!-- Legend -->
            <g font-family="Inter,sans-serif" font-size="11.5" font-weight="700">
              <rect x="130" y="16" width="12" height="12" rx="3" fill="#0b2b52"/><text x="148" y="26" fill="#0b2b52">Housing</text>
              <rect x="230" y="16" width="12" height="12" rx="3" fill="#1565c9"/><text x="248" y="26" fill="#0b2b52">Food</text>
              <rect x="315" y="16" width="12" height="12" rx="3" fill="#38bdf8"/><text x="333" y="26" fill="#0b2b52">Transport</text>
              <rect x="425" y="16" width="12" height="12" rx="3" fill="#e0202d"/><text x="443" y="26" fill="#0b2b52">Technology</text>
            </g>
            <!-- 1% = 5.2px from y=268 -->
            <!-- Japan: 28, 22, 15, 11 -->
            <g transform="translate(95,0)" font-family="Inter,sans-serif" font-size="10" font-weight="700" text-anchor="middle">
              <rect x="0" y="122.4" width="22" height="145.6" rx="3" fill="#0b2b52"/><text x="11" y="117" fill="#0b2b52">28%</text>
              <rect x="25" y="153.6" width="22" height="114.4" rx="3" fill="#1565c9"/><text x="36" y="148" fill="#1565c9">22%</text>
              <rect x="50" y="190" width="22" height="78" rx="3" fill="#38bdf8"/><text x="61" y="185" fill="#0284c7">15%</text>
              <rect x="75" y="210.8" width="22" height="57.2" rx="3" fill="#e0202d"/><text x="86" y="205" fill="#e0202d">11%</text>
              <text x="48" y="292" font-size="12" fill="#0b2b52">Japan</text>
            </g>
            <!-- Germany: 31, 18, 19, 9 -->
            <g transform="translate(230,0)" font-family="Inter,sans-serif" font-size="10" font-weight="700" text-anchor="middle">
              <rect x="0" y="106.8" width="22" height="161.2" rx="3" fill="#0b2b52"/><text x="11" y="101" fill="#0b2b52">31%</text>
              <rect x="25" y="174.4" width="22" height="93.6" rx="3" fill="#1565c9"/><text x="36" y="169" fill="#1565c9">18%</text>
              <rect x="50" y="169.2" width="22" height="98.8" rx="3" fill="#38bdf8"/><text x="61" y="164" fill="#0284c7">19%</text>
              <rect x="75" y="221.2" width="22" height="46.8" rx="3" fill="#e0202d"/><text x="86" y="216" fill="#e0202d">9%</text>
              <text x="48" y="292" font-size="12" fill="#0b2b52">Germany</text>
            </g>
            <!-- Australia: 34, 16, 18, 10 -->
            <g transform="translate(365,0)" font-family="Inter,sans-serif" font-size="10" font-weight="700" text-anchor="middle">
              <rect x="0" y="91.2" width="22" height="176.8" rx="3" fill="#0b2b52"/><text x="11" y="86" fill="#0b2b52">34%</text>
              <rect x="25" y="184.8" width="22" height="83.2" rx="3" fill="#1565c9"/><text x="36" y="179" fill="#1565c9">16%</text>
              <rect x="50" y="174.4" width="22" height="93.6" rx="3" fill="#38bdf8"/><text x="61" y="169" fill="#0284c7">18%</text>
              <rect x="75" y="216" width="22" height="52" rx="3" fill="#e0202d"/><text x="86" y="210" fill="#e0202d">10%</text>
              <text x="48" y="292" font-size="12" fill="#0b2b52">Australia</text>
            </g>
            <!-- Brazil: 19, 29, 21, 6 -->
            <g transform="translate(500,0)" font-family="Inter,sans-serif" font-size="10" font-weight="700" text-anchor="middle">
              <rect x="0" y="169.2" width="22" height="98.8" rx="3" fill="#0b2b52"/><text x="11" y="164" fill="#0b2b52">19%</text>
              <rect x="25" y="117.2" width="22" height="150.8" rx="3" fill="#1565c9"/><text x="36" y="112" fill="#1565c9">29%</text>
              <rect x="50" y="158.8" width="22" height="109.2" rx="3" fill="#38bdf8"/><text x="61" y="153" fill="#0284c7">21%</text>
              <rect x="75" y="236.8" width="22" height="31.2" rx="3" fill="#e0202d"/><text x="86" y="231" fill="#e0202d">6%</text>
              <text x="48" y="292" font-size="12" fill="#0b2b52">Brazil</text>
            </g>
          </svg>
        </figure>`;

    case 'ielts-task-1-pie-charts-graduate-employment': {
      const slices2010 = [
        { label: 'Finance', pct: 28, color: '#0b2b52' },
        { label: 'Retail', pct: 22, color: '#e0202d' },
        { label: 'Manufacturing', pct: 16, color: '#f59e0b' },
        { label: 'Healthcare', pct: 14, color: '#10b981' },
        { label: 'Technology', pct: 11, color: '#1565c9' },
        { label: 'Education', pct: 9, color: '#8b5cf6' }
      ];
      const slices2024 = [
        { label: 'Finance', pct: 23, color: '#0b2b52' },
        { label: 'Retail', pct: 9, color: '#e0202d' },
        { label: 'Manufacturing', pct: 7, color: '#f59e0b' },
        { label: 'Healthcare', pct: 21, color: '#10b981' },
        { label: 'Technology', pct: 31, color: '#1565c9' },
        { label: 'Education', pct: 9, color: '#8b5cf6' }
      ];
      function piePaths(cx, cy, r, items) {
        let acc = 0;
        return items.map(it => {
          const a1 = (acc / 100) * Math.PI * 2 - Math.PI / 2;
          acc += it.pct;
          const a2 = (acc / 100) * Math.PI * 2 - Math.PI / 2;
          const x1 = cx + r * Math.cos(a1), y1 = cy + r * Math.sin(a1);
          const x2 = cx + r * Math.cos(a2), y2 = cy + r * Math.sin(a2);
          const large = it.pct > 50 ? 1 : 0;
          const mid = (a1 + a2) / 2;
          const lx = cx + (r * 0.65) * Math.cos(mid), ly = cy + (r * 0.65) * Math.sin(mid);
          return `<path d="M${cx},${cy} L${x1.toFixed(1)},${y1.toFixed(1)} A${r},${r} 0 ${large},1 ${x2.toFixed(1)},${y2.toFixed(1)} Z" fill="${it.color}" stroke="#fff" stroke-width="2"/>` +
            `<text x="${lx.toFixed(1)}" y="${(ly + 4).toFixed(1)}" fill="#fff" font-family="Sora,sans-serif" font-size="11" font-weight="700" text-anchor="middle">${it.pct}%</text>`;
        }).join('');
      }
      return `
        <figure class="t1-visual">
          <figcaption>UK University Graduate Employment Sectors (2010 vs 2024)</figcaption>
          <svg viewBox="0 0 680 315" role="img" aria-label="Two pie charts comparing UK graduate employment sectors in 2010 and 2024">
            <rect width="680" height="315" rx="12" fill="#ffffff"/>
            <text x="190" y="28" font-family="Sora,sans-serif" font-size="14" font-weight="800" fill="#0b2b52" text-anchor="middle">2010 Graduates</text>
            <text x="490" y="28" font-family="Sora,sans-serif" font-size="14" font-weight="800" fill="#0b2b52" text-anchor="middle">2024 Graduates</text>
            ${piePaths(190, 145, 95, slices2010)}
            ${piePaths(490, 145, 95, slices2024)}
            <g font-family="Inter,sans-serif" font-size="11.5" font-weight="700">
              <rect x="60" y="275" width="11" height="11" rx="3" fill="#0b2b52"/><text x="76" y="284" fill="#0b2b52">Finance</text>
              <rect x="148" y="275" width="11" height="11" rx="3" fill="#1565c9"/><text x="164" y="284" fill="#0b2b52">Technology</text>
              <rect x="255" y="275" width="11" height="11" rx="3" fill="#10b981"/><text x="271" y="284" fill="#0b2b52">Healthcare</text>
              <rect x="358" y="275" width="11" height="11" rx="3" fill="#e0202d"/><text x="374" y="284" fill="#0b2b52">Retail</text>
              <rect x="430" y="275" width="11" height="11" rx="3" fill="#f59e0b"/><text x="446" y="284" fill="#0b2b52">Manufacturing</text>
              <rect x="550" y="275" width="11" height="11" rx="3" fill="#8b5cf6"/><text x="566" y="284" fill="#0b2b52">Education</text>
            </g>
          </svg>
        </figure>`;
    }

    case 'ielts-task-1-table-underground-railway-systems':
      return `
        <figure class="t1-visual">
          <figcaption>Underground Railway Systems in Six Major Cities</figcaption>
          <div class="t1-table-wrap">
            <table class="t1-table">
              <thead>
                <tr><th>City</th><th>Date Opened</th><th>Kilometres of Route</th><th>Passengers per Year (Millions)</th></tr>
              </thead>
              <tbody>
                <tr><td><strong>London</strong></td><td>1863</td><td>394</td><td>775</td></tr>
                <tr><td><strong>Paris</strong></td><td>1900</td><td>199</td><td>1,191</td></tr>
                <tr><td><strong>Tokyo</strong></td><td>1927</td><td>155</td><td>1,927</td></tr>
                <tr><td><strong>Washington DC</strong></td><td>1976</td><td>126</td><td>144</td></tr>
                <tr><td><strong>Kyoto</strong></td><td>1981</td><td>11</td><td>45</td></tr>
                <tr><td><strong>Los Angeles</strong></td><td>2001</td><td>28</td><td>50</td></tr>
              </tbody>
            </table>
          </div>
        </figure>`;

    case 'ielts-task-1-process-diagram-plastic-bottle-recycling':
      return `
        <figure class="t1-visual">
          <figcaption>8-Stage Process: Recycling Plastic Bottles into Polyester Textile</figcaption>
          <svg viewBox="0 0 680 280" role="img" aria-label="8-stage flow diagram showing plastic bottle collection, sorting, washing, shredding, melting, extrusion, stretching, and weaving into fabric">
            <rect width="680" height="280" rx="12" fill="#ffffff"/>
            <defs>
              <marker id="arr" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 1 L 10 5 L 0 9 z" fill="#1565c9"/>
              </marker>
            </defs>
            <!-- Row 1: Stages 1 to 4 -->
            <g font-family="Inter,sans-serif" text-anchor="middle">
              <rect x="24" y="28" width="136" height="84" rx="12" fill="#eaf2fd" stroke="#93c5fd" stroke-width="1.5"/>
              <text x="92" y="52" font-size="11" font-weight="800" fill="#1565c9">STAGE 1</text>
              <text x="92" y="72" font-size="12" font-weight="700" fill="#0b2b52">Collection &amp;</text>
              <text x="92" y="88" font-size="11" fill="#475569">Transport to Plant</text>

              <line x1="162" y1="70" x2="186" y2="70" stroke="#1565c9" stroke-width="2" marker-end="url(#arr)"/>

              <rect x="190" y="28" width="136" height="84" rx="12" fill="#eaf2fd" stroke="#93c5fd" stroke-width="1.5"/>
              <text x="258" y="52" font-size="11" font-weight="800" fill="#1565c9">STAGE 2</text>
              <text x="258" y="72" font-size="12" font-weight="700" fill="#0b2b52">Sorting</text>
              <text x="258" y="88" font-size="11" fill="#475569">Remove caps &amp; labels</text>

              <line x1="328" y1="70" x2="352" y2="70" stroke="#1565c9" stroke-width="2" marker-end="url(#arr)"/>

              <rect x="356" y="28" width="136" height="84" rx="12" fill="#eaf2fd" stroke="#93c5fd" stroke-width="1.5"/>
              <text x="424" y="52" font-size="11" font-weight="800" fill="#1565c9">STAGE 3</text>
              <text x="424" y="72" font-size="12" font-weight="700" fill="#0b2b52">Wash &amp; Compress</text>
              <text x="424" y="88" font-size="11" fill="#475569">Dense plastic blocks</text>

              <line x1="494" y1="70" x2="518" y2="70" stroke="#1565c9" stroke-width="2" marker-end="url(#arr)"/>

              <rect x="522" y="28" width="136" height="84" rx="12" fill="#eaf2fd" stroke="#93c5fd" stroke-width="1.5"/>
              <text x="590" y="52" font-size="11" font-weight="800" fill="#1565c9">STAGE 4</text>
              <text x="590" y="72" font-size="12" font-weight="700" fill="#0b2b52">Shredding</text>
              <text x="590" y="88" font-size="11" fill="#475569">Cut into clean flakes</text>

              <!-- Down arrow from Stage 4 to Stage 5 -->
              <line x1="590" y1="114" x2="590" y2="158" stroke="#1565c9" stroke-width="2" marker-end="url(#arr)"/>

              <!-- Row 2 (Right to Left: Stages 5 to 8) -->
              <rect x="522" y="164" width="136" height="84" rx="12" fill="#fef2f2" stroke="#fca5a5" stroke-width="1.5"/>
              <text x="590" y="188" font-size="11" font-weight="800" fill="#e0202d">STAGE 5</text>
              <text x="590" y="208" font-size="12" font-weight="700" fill="#0b2b52">Heating &amp; Melting</text>
              <text x="590" y="224" font-size="11" fill="#475569">Molten plastic</text>

              <line x1="520" y1="206" x2="496" y2="206" stroke="#1565c9" stroke-width="2" marker-end="url(#arr)"/>

              <rect x="356" y="164" width="136" height="84" rx="12" fill="#fef2f2" stroke="#fca5a5" stroke-width="1.5"/>
              <text x="424" y="188" font-size="11" font-weight="800" fill="#e0202d">STAGE 6</text>
              <text x="424" y="208" font-size="12" font-weight="700" fill="#0b2b52">Nozzle Extrusion</text>
              <text x="424" y="224" font-size="11" fill="#475569">Polyester filaments</text>

              <line x1="354" y1="206" x2="330" y2="206" stroke="#1565c9" stroke-width="2" marker-end="url(#arr)"/>

              <rect x="190" y="164" width="136" height="84" rx="12" fill="#f0fdf4" stroke="#86efac" stroke-width="1.5"/>
              <text x="258" y="188" font-size="11" font-weight="800" fill="#16a34a">STAGE 7</text>
              <text x="258" y="208" font-size="12" font-weight="700" fill="#0b2b52">Cool &amp; Stretch</text>
              <text x="258" y="224" font-size="11" fill="#475569">Wind onto spools</text>

              <line x1="188" y1="206" x2="164" y2="206" stroke="#1565c9" stroke-width="2" marker-end="url(#arr)"/>

              <rect x="24" y="164" width="136" height="84" rx="12" fill="#f0fdf4" stroke="#86efac" stroke-width="1.5"/>
              <text x="92" y="188" font-size="11" font-weight="800" fill="#16a34a">STAGE 8</text>
              <text x="92" y="208" font-size="12" font-weight="700" fill="#0b2b52">Weaving Fabric</text>
              <text x="92" y="224" font-size="11" fill="#475569">Clothing textiles</text>
            </g>
          </svg>
        </figure>`;

    case 'ielts-task-1-map-changes-oakwood-town-centre':
      return `
        <figure class="t1-visual">
          <figcaption>Oakwood Town Centre: 1995 vs Present Day</figcaption>
          <svg viewBox="0 0 680 320" role="img" aria-label="Two maps comparing Oakwood town centre in 1995 and today, showing pedestrianisation, new shopping mall, cinema with underground parking, and riverside park">
            <rect width="680" height="320" rx="12" fill="#ffffff"/>
            <!-- 1995 MAP (Left) -->
            <g transform="translate(18,14)">
              <text x="150" y="18" font-family="Sora,sans-serif" font-size="13" font-weight="800" fill="#0b2b52" text-anchor="middle">Oakwood (1995)</text>
              <rect x="0" y="28" width="300" height="258" rx="10" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1.5"/>
              <!-- River on East -->
              <path d="M258,28 C250,110 272,190 256,286 L300,286 L300,28 Z" fill="#bae6fd"/>
              <text x="280" y="160" font-family="Inter,sans-serif" font-size="10" font-weight="700" fill="#0369a1" transform="rotate(-90 280 160)" text-anchor="middle">RIVER</text>
              <!-- Main Road West-East -->
              <rect x="0" y="142" width="258" height="26" fill="#64748b"/>
              <line x1="4" y1="155" x2="254" y2="155" stroke="#fff" stroke-width="1.5" stroke-dasharray="8 6"/>
              <text x="128" y="159" font-family="Inter,sans-serif" font-size="9.5" font-weight="700" fill="#fff" text-anchor="middle">MAIN ROAD (WEST–EAST)</text>
              <!-- NW: Historic Library -->
              <rect x="14" y="44" width="84" height="54" rx="6" fill="#e2e8f0" stroke="#64748b"/>
              <text x="56" y="69" font-family="Inter,sans-serif" font-size="10" font-weight="700" fill="#0b2b52" text-anchor="middle">Historic</text>
              <text x="56" y="82" font-family="Inter,sans-serif" font-size="10" font-weight="700" fill="#0b2b52" text-anchor="middle">Library</text>
              <!-- N: Small Shops -->
              <rect x="112" y="54" width="128" height="44" rx="6" fill="#fde68a" stroke="#d97706"/>
              <text x="176" y="79" font-family="Inter,sans-serif" font-size="10" font-weight="700" fill="#92400e" text-anchor="middle">Small Independent Shops</text>
              <!-- E: Warehouses -->
              <rect x="170" y="182" width="76" height="46" rx="6" fill="#cbd5e1" stroke="#475569"/>
              <text x="208" y="209" font-family="Inter,sans-serif" font-size="9.5" font-weight="700" fill="#1e293b" text-anchor="middle">Warehouses</text>
              <!-- SE: Open-Air Car Park -->
              <rect x="145" y="236" width="100" height="36" rx="6" fill="#e2e8f0" stroke="#64748b"/>
              <text x="195" y="258" font-family="Inter,sans-serif" font-size="9.5" font-weight="700" fill="#334155" text-anchor="middle">Open-Air Car Park</text>
            </g>

            <!-- TODAY MAP (Right) -->
            <g transform="translate(362,14)">
              <text x="150" y="18" font-family="Sora,sans-serif" font-size="13" font-weight="800" fill="#1565c9" text-anchor="middle">Oakwood (Today)</text>
              <rect x="0" y="28" width="300" height="258" rx="10" fill="#f8fafc" stroke="#93c5fd" stroke-width="1.5"/>
              <!-- River -->
              <path d="M258,28 C250,110 272,190 256,286 L300,286 L300,28 Z" fill="#bae6fd"/>
              <text x="280" y="160" font-family="Inter,sans-serif" font-size="10" font-weight="700" fill="#0369a1" transform="rotate(-90 280 160)" text-anchor="middle">RIVER</text>
              <!-- Pedestrianised Road -->
              <rect x="0" y="142" width="258" height="26" fill="#dbeafe"/>
              <text x="128" y="159" font-family="Inter,sans-serif" font-size="9.5" font-weight="800" fill="#1565c9" text-anchor="middle">PEDESTRIANISED ZONE</text>
              <!-- NW: Historic Library (Intact) -->
              <rect x="14" y="44" width="84" height="54" rx="6" fill="#e2e8f0" stroke="#64748b"/>
              <text x="56" y="69" font-family="Inter,sans-serif" font-size="10" font-weight="700" fill="#0b2b52" text-anchor="middle">Historic</text>
              <text x="56" y="82" font-family="Inter,sans-serif" font-size="10" font-weight="700" fill="#0b2b52" text-anchor="middle">Library</text>
              <!-- N: Covered Shopping Mall -->
              <rect x="112" y="44" width="132" height="56" rx="6" fill="#dbeafe" stroke="#1565c9" stroke-width="1.5"/>
              <text x="178" y="69" font-family="Inter,sans-serif" font-size="10" font-weight="800" fill="#0b2b52" text-anchor="middle">Covered</text>
              <text x="178" y="83" font-family="Inter,sans-serif" font-size="10" font-weight="800" fill="#0b2b52" text-anchor="middle">Shopping Mall</text>
              <!-- E: Riverside Park & Cafe Promenade -->
              <rect x="166" y="178" width="82" height="48" rx="6" fill="#bbf7d0" stroke="#16a34a" stroke-width="1.5"/>
              <text x="207" y="199" font-family="Inter,sans-serif" font-size="9.5" font-weight="800" fill="#14532d" text-anchor="middle">Riverside Park</text>
              <text x="207" y="213" font-family="Inter,sans-serif" font-size="9" font-weight="700" fill="#15803d" text-anchor="middle">&amp; Café Walk</text>
              <!-- SE: Cinema + Underground Car Park -->
              <rect x="145" y="234" width="102" height="40" rx="6" fill="#fee2e2" stroke="#e0202d" stroke-width="1.5"/>
              <text x="196" y="251" font-family="Inter,sans-serif" font-size="9.5" font-weight="800" fill="#991b1b" text-anchor="middle">Cinema</text>
              <text x="196" y="264" font-family="Inter,sans-serif" font-size="8.5" font-weight="700" fill="#b91c1c" text-anchor="middle">(Underground Car Park)</text>
            </g>
            <!-- Compass N -->
            <circle cx="340" cy="48" r="14" fill="#f1f5f9" stroke="#cbd5e1"/>
            <text x="340" y="52" font-family="Sora,sans-serif" font-size="11" font-weight="800" fill="#0b2b52" text-anchor="middle">N ↑</text>
          </svg>
        </figure>`;

    default:
      return '';
  }
}

module.exports = { getTask1VisualHtml };
