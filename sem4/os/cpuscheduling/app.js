/**
 * CPU Scheduling Simulator - Advanced Version
 * Features: FCFS, SJF, Priority, Round Robin with comparison and exports
 */

let processCounter = 1;
let currentResults = null;

// ============================================
// NAVIGATION & SECTION MANAGEMENT
// ============================================

document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        
        document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
        document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
        
        this.classList.add('active');
        const sectionId = this.getAttribute('data-section');
        const section = document.getElementById(sectionId);
        if (section) {
            section.classList.add('active');
        }
    });
});

// ============================================
// PROCESS MANAGEMENT
// ============================================

function addProcess() {
    processCounter++;
    const tbody = document.getElementById('processTableBody');
    const row = tbody.insertRow();
    
    row.innerHTML = `
        <td><input type="text" class="proc-id" value="P${processCounter}" readonly></td>
        <td><input type="number" class="arrival" value="0" min="0"></td>
        <td><input type="number" class="burst" value="5" min="1"></td>
        <td><input type="number" class="priority" value="1" min="1"></td>
        <td><button class="btn-remove" onclick="removeProcess(this)">X</button></td>
    `;
}

function removeProcess(btn) {
    btn.closest('tr').remove();
}

function clearAll() {
    const tbody = document.getElementById('processTableBody');
    tbody.querySelectorAll('tr').forEach((row, idx) => {
        if (idx > 0) row.remove();
    });
}

function getProcesses() {
    const tbody = document.getElementById('processTableBody');
    const processes = [];
    
    tbody.querySelectorAll('tr').forEach(row => {
        const id = row.querySelector('.proc-id').value;
        const arrival = parseInt(row.querySelector('.arrival').value) || 0;
        const burst = parseInt(row.querySelector('.burst').value) || 0;
        const priority = parseInt(row.querySelector('.priority').value) || 1;
        
        if (burst > 0) {
            processes.push({
                id, arrival, burst, priority,
                completionTime: 0,
                turnaroundTime: 0,
                waitingTime: 0,
                remainingTime: burst
            });
        }
    });
    
    return processes.sort((a, b) => a.arrival - b.arrival);
}

// ============================================
// PRESET DATA
// ============================================

function loadPreset(preset) {
    const presets = {
        preset1: [
            { id: 'P1', arrival: 0, burst: 5, priority: 1 },
            { id: 'P2', arrival: 1, burst: 3, priority: 2 },
            { id: 'P3', arrival: 2, burst: 8, priority: 3 }
        ],
        preset2: [
            { id: 'P1', arrival: 0, burst: 8, priority: 2 },
            { id: 'P2', arrival: 1, burst: 4, priority: 1 },
            { id: 'P3', arrival: 2, burst: 2, priority: 3 },
            { id: 'P4', arrival: 3, burst: 1, priority: 4 }
        ],
        preset3: [
            { id: 'P1', arrival: 0, burst: 10, priority: 1 },
            { id: 'P2', arrival: 0, burst: 5, priority: 2 },
            { id: 'P3', arrival: 0, burst: 8, priority: 3 }
        ]
    };
    
    const data = presets[preset] || presets.preset1;
    const tbody = document.getElementById('processTableBody');
    tbody.innerHTML = '';
    
    data.forEach(p => {
        const row = tbody.insertRow();
        row.innerHTML = `
            <td><input type="text" class="proc-id" value="${p.id}" readonly></td>
            <td><input type="number" class="arrival" value="${p.arrival}" min="0"></td>
            <td><input type="number" class="burst" value="${p.burst}" min="1"></td>
            <td><input type="number" class="priority" value="${p.priority}" min="1"></td>
            <td><button class="btn-remove" onclick="removeProcess(this)">X</button></td>
        `;
    });
    
    processCounter = data.length;
}

// ============================================
// ALGORITHM UI UPDATES
// ============================================

function updateAlgorithmUI() {
    const algo = document.getElementById('algorithmSelect').value;
    const quantumGroup = document.getElementById('quantumGroup');
    
    if (algo === 'rr') {
        quantumGroup.style.display = 'block';
    } else {
        quantumGroup.style.display = 'none';
    }
}

// ============================================
// SCHEDULING ALGORITHMS
// ============================================

function scheduleFCFS(processes) {
    const sorted = [...processes].sort((a, b) => a.arrival - b.arrival);
    let currentTime = 0;
    const schedule = [];
    
    sorted.forEach(p => {
        if (currentTime < p.arrival) currentTime = p.arrival;
        const start = currentTime;
        const end = start + p.burst;
        
        p.completionTime = end;
        p.turnaroundTime = end - p.arrival;
        p.waitingTime = p.turnaroundTime - p.burst;
        
        schedule.push({ process: p.id, start, end });
        currentTime = end;
    });
    
    return { processes: sorted, schedule };
}

function scheduleSJF(processes) {
    const procs = [...processes];
    let currentTime = 0;
    const schedule = [];
    const completed = [];
    
    while (completed.length < procs.length) {
        const available = procs.filter(p => p.arrival <= currentTime && !completed.includes(p.id));
        
        if (available.length === 0) {
            const next = procs.find(p => p.arrival > currentTime);
            if (next) currentTime = next.arrival;
            continue;
        }
        
        const p = available.reduce((min, curr) => curr.burst < min.burst ? curr : min);
        const start = currentTime;
        const end = start + p.burst;
        
        p.completionTime = end;
        p.turnaroundTime = end - p.arrival;
        p.waitingTime = p.turnaroundTime - p.burst;
        
        schedule.push({ process: p.id, start, end });
        completed.push(p.id);
        currentTime = end;
    }
    
    return { processes: procs, schedule };
}

function schedulePriority(processes) {
    const procs = [...processes];
    let currentTime = 0;
    const schedule = [];
    const completed = [];
    
    while (completed.length < procs.length) {
        const available = procs.filter(p => p.arrival <= currentTime && !completed.includes(p.id));
        
        if (available.length === 0) {
            const next = procs.find(p => p.arrival > currentTime);
            if (next) currentTime = next.arrival;
            continue;
        }
        
        const p = available.reduce((min, curr) => curr.priority < min.priority ? curr : min);
        const start = currentTime;
        const end = start + p.burst;
        
        p.completionTime = end;
        p.turnaroundTime = end - p.arrival;
        p.waitingTime = p.turnaroundTime - p.burst;
        
        schedule.push({ process: p.id, start, end });
        completed.push(p.id);
        currentTime = end;
    }
    
    return { processes: procs, schedule };
}

function scheduleRR(processes, quantum) {
    const procs = processes.map(p => ({ ...p, remainingTime: p.burst }));
    let currentTime = 0;
    const schedule = [];
    const queue = [];
    const sorted = [...procs].sort((a, b) => a.arrival - b.arrival);
    
    let procIndex = 0;
    
    while (true) {
        while (procIndex < sorted.length && sorted[procIndex].arrival <= currentTime) {
            queue.push(sorted[procIndex].id);
            procIndex++;
        }
        
        if (queue.length === 0) {
            if (procIndex < sorted.length) {
                currentTime = sorted[procIndex].arrival;
                continue;
            }
            break;
        }
        
        const procId = queue.shift();
        const p = procs.find(x => x.id === procId);
        const timeSlice = Math.min(quantum, p.remainingTime);
        const start = currentTime;
        const end = start + timeSlice;
        
        schedule.push({ process: procId, start, end });
        p.remainingTime -= timeSlice;
        currentTime = end;
        
        while (procIndex < sorted.length && sorted[procIndex].arrival <= currentTime) {
            queue.push(sorted[procIndex].id);
            procIndex++;
        }
        
        if (p.remainingTime > 0) {
            queue.push(procId);
        } else {
            p.completionTime = currentTime;
            p.turnaroundTime = currentTime - p.arrival;
            p.waitingTime = p.turnaroundTime - p.burst;
        }
    }
    
    return { processes: procs, schedule };
}

// ============================================
// DISPLAY RESULTS
// ============================================

function displayResults(result) {
    const { processes, schedule } = result;
    
    // Gantt Chart
    const ganttDiv = document.getElementById('ganttChart');
    ganttDiv.innerHTML = '';
    
    const uniqueProcs = [...new Set(schedule.map(s => s.process))].sort();
    const maxTime = Math.max(...schedule.map(s => s.end));
    
    uniqueProcs.forEach(procId => {
        const blocks = schedule.filter(s => s.process === procId);
        const row = document.createElement('div');
        row.className = 'gantt-row';
        
        const label = document.createElement('div');
        label.className = 'gantt-process-label';
        label.textContent = procId;
        row.appendChild(label);
        
        const barsDiv = document.createElement('div');
        barsDiv.className = 'gantt-bars';
        
        blocks.forEach(block => {
            const bar = document.createElement('div');
            bar.className = 'gantt-bar';
            bar.style.width = ((block.end - block.start) / maxTime * 400) + 'px';
            bar.textContent = `${block.start}-${block.end}`;
            barsDiv.appendChild(bar);
        });
        
        row.appendChild(barsDiv);
        ganttDiv.appendChild(row);
    });
    
    // Timeline
    const timeline = document.createElement('div');
    timeline.className = 'gantt-timeline';
    for (let i = 0; i <= maxTime; i += Math.ceil(maxTime / 10)) {
        const label = document.createElement('div');
        label.textContent = i;
        timeline.appendChild(label);
    }
    ganttDiv.appendChild(timeline);
    
    // Results Table
    const tbody = document.getElementById('resultsTableBody');
    tbody.innerHTML = '';
    
    processes.forEach(p => {
        const row = tbody.insertRow();
        row.innerHTML = `
            <td>${p.id}</td>
            <td>${p.arrival}</td>
            <td>${p.burst}</td>
            <td>${p.completionTime}</td>
            <td>${p.turnaroundTime}</td>
            <td>${p.waitingTime}</td>
        `;
    });
    
    // Metrics
    const avgWT = (processes.reduce((sum, p) => sum + p.waitingTime, 0) / processes.length).toFixed(2);
    const avgTAT = (processes.reduce((sum, p) => sum + p.turnaroundTime, 0) / processes.length).toFixed(2);
    const cpuUtil = ((maxTime - 0) / maxTime * 100).toFixed(2);
    
    document.getElementById('avgWT').textContent = avgWT;
    document.getElementById('avgTAT').textContent = avgTAT;
    document.getElementById('cpuUtil').textContent = cpuUtil + '%';
    
    document.getElementById('resultsPanel').style.display = 'block';
    
    return { avgWT, avgTAT, cpuUtil };
}

// ============================================
// MAIN SIMULATION
// ============================================

function runSimulation() {
    const processes = getProcesses();
    if (processes.length === 0) {
        alert('Please add at least one process');
        return;
    }
    
    const algo = document.getElementById('algorithmSelect').value;
    const quantum = parseInt(document.getElementById('timeQuantum').value) || 2;
    
    let result;
    switch(algo) {
        case 'fcfs': result = scheduleFCFS(processes); break;
        case 'sjf': result = scheduleSJF(processes); break;
        case 'priority': result = schedulePriority(processes); break;
        case 'rr': result = scheduleRR(processes, quantum); break;
        default: result = scheduleFCFS(processes);
    }
    
    currentResults = result;
    displayResults(result);
}

// ============================================
// COMPARISON
// ============================================

function runComparison() {
    const processes = getProcesses();
    if (processes.length === 0) {
        alert('Please add at least one process');
        return;
    }
    
    const results = {
        fcfs: scheduleFCFS([...processes]),
        sjf: scheduleSJF([...processes]),
        priority: schedulePriority([...processes]),
        rr: scheduleRR([...processes], 2)
    };
    
    // Calculate metrics
    const metrics = {};
    Object.keys(results).forEach(algo => {
        const procs = results[algo].processes;
        metrics[algo] = {
            avgWT: (procs.reduce((sum, p) => sum + p.waitingTime, 0) / procs.length).toFixed(2),
            avgTAT: (procs.reduce((sum, p) => sum + p.turnaroundTime, 0) / procs.length).toFixed(2),
            cpuUtil: '100.00'
        };
    });
    
    // Display comparison table
    const tbody = document.getElementById('comparisonTableBody');
    tbody.innerHTML = '';
    
    Object.keys(metrics).forEach(algo => {
        const row = tbody.insertRow();
        const m = metrics[algo];
        row.innerHTML = `
            <td>${algo.toUpperCase()}</td>
            <td>${m.avgWT}</td>
            <td>${m.avgTAT}</td>
            <td>${m.cpuUtil}%</td>
        `;
    });
    
    // Display charts
    displayComparisonCharts(metrics);
    
    document.getElementById('comparisonResults').style.display = 'block';
}

function displayComparisonCharts(metrics) {
    // WT Chart
    const wtChart = document.getElementById('wtComparisonChart');
    wtChart.innerHTML = '';
    
    Object.keys(metrics).forEach(algo => {
        const bar = document.createElement('div');
        bar.className = 'chart-bar';
        const value = parseFloat(metrics[algo].avgWT);
        bar.style.height = (value * 10) + 'px';
        bar.innerHTML = `<span>${algo.toUpperCase()}<br>${value}</span>`;
        wtChart.appendChild(bar);
    });
    
    // TAT Chart
    const tatChart = document.getElementById('tatComparisonChart');
    tatChart.innerHTML = '';
    
    Object.keys(metrics).forEach(algo => {
        const bar = document.createElement('div');
        bar.className = 'chart-bar';
        const value = parseFloat(metrics[algo].avgTAT);
        bar.style.height = (value * 10) + 'px';
        bar.innerHTML = `<span>${algo.toUpperCase()}<br>${value}</span>`;
        tatChart.appendChild(bar);
    });
}

// ============================================
// EXPORT
// ============================================

function exportCSV() {
    if (!currentResults) {
        alert('Run simulation first');
        return;
    }
    
    const { processes } = currentResults;
    let csv = 'Process,Arrival,Burst,Completion,Turnaround,Waiting\n';
    
    processes.forEach(p => {
        csv += `${p.id},${p.arrival},${p.burst},${p.completionTime},${p.turnaroundTime},${p.waitingTime}\n`;
    });
    
    const link = document.createElement('a');
    link.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv);
    link.download = 'cpu-scheduling.csv';
    link.click();
}

function exportComparison() {
    const tbody = document.getElementById('comparisonTableBody');
    let csv = 'Algorithm,Avg WT,Avg TAT,CPU Util\n';
    
    tbody.querySelectorAll('tr').forEach(row => {
        const cells = row.querySelectorAll('td');
        csv += `${cells[0].textContent},${cells[1].textContent},${cells[2].textContent},${cells[3].textContent}\n`;
    });
    
    const link = document.createElement('a');
    link.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv);
    link.download = 'cpu-scheduling-comparison.csv';
    link.click();
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    updateAlgorithmUI();
});
