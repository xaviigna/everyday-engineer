const WORKER = 'https://everyday-engineer.xavierbenavidesm.workers.dev';

(async () => {
    const logs = new Set((await (await fetch(`${WORKER}/logs`)).json()).map(r => r.log_date));
    let html = '', totalEx = 0, remaining = 0;
    const now = new Date(); // Current time for comparison
    
    for (let y = 2026; y <= 2030; y++) {
        html += `<div class="year-section"><div class="year-header">${y} Contributions</div><div class="graph-wrapper"><div class="main-graph-area"><div class="contribution-grid">`;
        
        for (let d = new Date(y, 0, 1); d.getFullYear() === y; d.setDate(d.getDate() + 1)) {
            const wd = d.getDay();
            if (wd === 0 || wd === 6) continue;

            const m = d.getMonth(), day = d.getDate();
            const val = m * 100 + day;
            
            if (!((val >= 12 && val <= 507) || (val >= 613 && val <= 1107))) continue;

            totalEx++;
            if (d > now) remaining++; // Count only future school days

            const iso = d.toISOString().split('T')[0];
            html += `<div class="day-cell level-${logs.has(iso) ? 4 : 0}" data-title="${d.toDateString()}"></div>`;
        }
        html += `</div></div></div></div>`;
    }

    document.getElementById('grid-container').innerHTML = html;
    document.getElementById('stat-total').textContent = logs.size;
    document.getElementById('stat-progress').textContent = ((logs.size / (totalEx||1)) * 100).toFixed(1) + '%';
    
    document.getElementById('time-display').textContent = `${now.toDateString()} — 🎓 ${remaining.toLocaleString()} School Days Left`;

    const tip = document.createElement('div');
    tip.className = 'tooltip';
    document.body.appendChild(tip);
    
    document.addEventListener('mouseover', e => {
        if(e.target.classList.contains('day-cell')) {
            tip.textContent = e.target.getAttribute('data-title');
            tip.style.display = 'block';
        }
    });
    document.addEventListener('mouseout', e => {
        if(e.target.classList.contains('day-cell')) tip.style.display = 'none';
    });
    document.addEventListener('mousemove', e => {
        tip.style.top = (e.clientY - 35) + 'px';
        tip.style.left = (e.clientX - (tip.offsetWidth/2)) + 'px';
    });
})();
