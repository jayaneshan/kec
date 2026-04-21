class BankersAlgorithm {
    constructor(processes, resources, allocation, maximum, available) {
        this.processes = processes;
        this.resources = resources;
        this.allocation = allocation;
        this.maximum = maximum;
        this.available = available;
        this.need = this.calculateNeed();
        this.trace = [];
    }

    calculateNeed() {
        const need = [];
        for (let i = 0; i < this.processes; i++) {
            need[i] = [];
            for (let j = 0; j < this.resources; j++) {
                need[i][j] = this.maximum[i][j] - this.allocation[i][j];
            }
        }
        return need;
    }

    isSafeState() {
        const available = this.available.map(val => val);
        const finish = new Array(this.processes).fill(false);
        const safeSequence = [];

        this.trace = [];
        this.trace.push(`Starting safety check with Available: [${available.join(', ')}]`);

        for (let count = 0; count < this.processes; count++) {
            let found = false;

            for (let i = 0; i < this.processes; i++) {
                if (!finish[i]) {
                    let canAllocate = true;

                    for (let j = 0; j < this.resources; j++) {
                        if (this.need[i][j] > available[j]) {
                            canAllocate = false;
                            break;
                        }
                    }

                    if (canAllocate) {
                        this.trace.push(`<strong>Process P${i} allocated.</strong> Need: [${this.need[i].join(', ')}]`);

                        for (let j = 0; j < this.resources; j++) {
                            available[j] += this.allocation[i][j];
                        }

                        this.trace.push(`Available after P${i}: [${available.join(', ')}]`);
                        safeSequence.push(`P${i}`);
                        finish[i] = true;
                        found = true;
                        break;
                    }
                }
            }

            if (!found) {
                this.trace.push(`No process found that can be allocated. System is UNSAFE.`);
                return {
                    safe: false,
                    sequence: []
                };
            }
        }

        this.trace.push(`All processes completed successfully. System is SAFE.`);
        return {
            safe: true,
            sequence: safeSequence
        };
    }

    getTrace() {
        return this.trace;
    }
}

// Sample Data
const SAMPLE_DATA = {
    processes: 5,
    resources: 3,
    allocation: [[0, 1, 0], [2, 0, 0], [3, 0, 2], [2, 1, 1], [0, 0, 2]],
    maximum: [[7, 5, 3], [3, 2, 2], [9, 0, 2], [2, 2, 2], [4, 3, 3]],
    available: [3, 3, 2]
};

// Utility Functions
function showError(message) {
    const errorDiv = document.getElementById('errorMessage');
    errorDiv.textContent = message;
    errorDiv.classList.add('show');
    errorDiv.style.display = 'block';
}

function hideError() {
    const errorDiv = document.getElementById('errorMessage');
    errorDiv.classList.remove('show');
    errorDiv.style.display = 'none';
}

function validateInput(num, max = 10, min = 1) {
    const value = parseInt(num);
    return !isNaN(value) && value >= min && value <= max;
}

function validateMatrices(allocation, maximum, available, processes, resources) {
    for (let i = 0; i < processes; i++) {
        for (let j = 0; j < resources; j++) {
            const a = parseInt(allocation[i][j]);
            const m = parseInt(maximum[i][j]);
            const av = parseInt(available[j]);

            if (isNaN(a) || isNaN(m) || isNaN(av)) {
                return { valid: false, message: 'All cells must contain numbers' };
            }

            if (a < 0 || m < 0 || av < 0) {
                return { valid: false, message: 'No negative values allowed' };
            }

            if (a > m) {
                return { valid: false, message: `Allocation cannot exceed Maximum for P${i}, R${j}` };
            }

            if (a > av) {
                return { valid: false, message: `Allocation cannot exceed Available for P${i}, R${j}` };
            }
        }
    }

    return { valid: true };
}

function createMatrixInputs(containerId, rows, cols, name) {
    const container = document.getElementById(containerId);
    container.innerHTML = '';

    for (let i = 0; i < rows; i++) {
        const rowDiv = document.createElement('div');
        rowDiv.className = 'matrix-row';
        rowDiv.dataset.row = i;

        for (let j = 0; j < cols; j++) {
            const input = document.createElement('input');
            input.type = 'number';
            input.min = '0';
            input.placeholder = '0';
            input.dataset.col = j;
            input.className = `${name}-${i}-${j}`;
            rowDiv.appendChild(input);
        }

        container.appendChild(rowDiv);
    }
}

function createAvailableInput(containerId, cols, name) {
    const container = document.getElementById(containerId);
    container.innerHTML = '';

    const rowDiv = document.createElement('div');
    rowDiv.className = 'matrix-row';

    for (let j = 0; j < cols; j++) {
        const input = document.createElement('input');
        input.type = 'number';
        input.min = '0';
        input.placeholder = '0';
        input.dataset.col = j;
        input.className = `${name}-${j}`;
        rowDiv.appendChild(input);
    }

    container.appendChild(rowDiv);
}

function getMatrixData(name, rows, cols) {
    const matrix = [];
    for (let i = 0; i < rows; i++) {
        const row = [];
        for (let j = 0; j < cols; j++) {
            const input = document.querySelector(`.${name}-${i}-${j}`);
            row.push(input.value || 0);
        }
        matrix.push(row);
    }
    return matrix;
}

function getAvailableData(name, cols) {
    const row = [];
    for (let j = 0; j < cols; j++) {
        const input = document.querySelector(`.${name}-${j}`);
        row.push(input.value || 0);
    }
    return [row];
}

function displayMatrix(containerId, matrix) {
    const container = document.getElementById(containerId);
    container.innerHTML = '';

    for (let i = 0; i < matrix.length; i++) {
        const rowDiv = document.createElement('div');
        rowDiv.className = 'matrix-row-display';

        for (let j = 0; j < matrix[i].length; j++) {
            const cell = document.createElement('div');
            cell.className = 'matrix-cell';
            cell.textContent = matrix[i][j];
            rowDiv.appendChild(cell);
        }

        container.appendChild(rowDiv);
    }
}

function displaySafetyStatus(safe, sequence) {
    const container = document.getElementById('safetyStatus');
    container.innerHTML = '';

    const badge = document.createElement('div');
    badge.className = `status-badge ${safe ? 'status-safe' : 'status-unsafe'}`;
    badge.textContent = safe ? '✓ SAFE STATE' : '✗ UNSAFE STATE';

    const detail = document.createElement('div');
    detail.className = 'status-detail';
    detail.textContent = safe
        ? 'The system can safely allocate resources without deadlock.'
        : 'The system cannot safely allocate resources. Deadlock may occur.';

    container.appendChild(badge);
    container.appendChild(detail);
}

function displaySafeSequence(sequence) {
    const container = document.getElementById('safeSequence');
    container.innerHTML = '';

    if (sequence.length === 0) {
        container.textContent = 'No safe sequence';
        container.classList.add('no-sequence');
    } else {
        const sequenceText = sequence.join(' → ');
        container.textContent = sequenceText;
    }
}

function displayExecutionTrace(trace) {
    const container = document.getElementById('executionTrace');
    container.innerHTML = '';

    trace.forEach((step, index) => {
        const stepDiv = document.createElement('div');
        stepDiv.className = 'trace-step';

        if (step.includes('allocated')) {
            stepDiv.classList.add('allocated');
        } else if (step.includes('completed')) {
            stepDiv.classList.add('completed');
        }

        stepDiv.innerHTML = `<strong>Step ${index + 1}:</strong> ${step}`;
        container.appendChild(stepDiv);
    });
}

// Event Listeners
document.getElementById('generateBtn').addEventListener('click', () => {
    hideError();

    const processes = parseInt(document.getElementById('processes').value);
    const resources = parseInt(document.getElementById('resources').value);

    if (!validateInput(processes) || !validateInput(resources)) {
        showError('Processes and Resources must be between 1 and 10.');
        return;
    }

    createMatrixInputs('allocationMatrix', processes, resources, 'allocation');
    createMatrixInputs('maximumMatrix', processes, resources, 'maximum');
    createAvailableInput('availableMatrix', resources, 'available');

    document.getElementById('matrixSection').style.display = 'grid';
});

document.getElementById('sampleBtn').addEventListener('click', () => {
    hideError();

    document.getElementById('processes').value = SAMPLE_DATA.processes;
    document.getElementById('resources').value = SAMPLE_DATA.resources;

    createMatrixInputs('allocationMatrix', SAMPLE_DATA.processes, SAMPLE_DATA.resources, 'allocation');
    createMatrixInputs('maximumMatrix', SAMPLE_DATA.processes, SAMPLE_DATA.resources, 'maximum');
    createAvailableInput('availableMatrix', SAMPLE_DATA.resources, 'available');

    // Fill in the sample data
    for (let i = 0; i < SAMPLE_DATA.processes; i++) {
        for (let j = 0; j < SAMPLE_DATA.resources; j++) {
            document.querySelector(`.allocation-${i}-${j}`).value = SAMPLE_DATA.allocation[i][j];
            document.querySelector(`.maximum-${i}-${j}`).value = SAMPLE_DATA.maximum[i][j];
        }
    }

    for (let j = 0; j < SAMPLE_DATA.resources; j++) {
        document.querySelector(`.available-${j}`).value = SAMPLE_DATA.available[j];
    }

    document.getElementById('matrixSection').style.display = 'grid';
});

document.getElementById('simulateBtn').addEventListener('click', () => {
    hideError();

    const processes = parseInt(document.getElementById('processes').value);
    const resources = parseInt(document.getElementById('resources').value);

    const allocation = getMatrixData('allocation', processes, resources);
    const maximum = getMatrixData('maximum', processes, resources);
    const available = getAvailableData('available', resources)[0];

    const validation = validateMatrices(allocation, maximum, available, processes, resources);
    if (!validation.valid) {
        showError(validation.message);
        return;
    }

    const banker = new BankersAlgorithm(processes, resources, allocation, maximum, available);
    const result = banker.isSafeState();

    displayMatrix('needMatrix', banker.need);
    displaySafetyStatus(result.safe, result.sequence);
    displaySafeSequence(result.sequence);
    displayExecutionTrace(banker.getTrace());

    document.getElementById('resultsSection').style.display = 'block';
    document.getElementById('resultsSection').scrollIntoView({ behavior: 'smooth' });
});

document.getElementById('resetBtn').addEventListener('click', () => {
    hideError();
    document.getElementById('matrixSection').style.display = 'none';
    document.getElementById('resultsSection').style.display = 'none';
    document.getElementById('processes').value = 3;
    document.getElementById('resources').value = 3;
    window.scrollTo({ top: 0, behavior: 'smooth' });
});
