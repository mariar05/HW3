const form = document.getElementById('project-form');
const formStatus = document.getElementById('form-status');
const tableBody = document.getElementById('projects-table-body');
let isProgrammaticReset = false;
const formFields = [
    document.getElementById('project-name'),
    document.getElementById('project-category'),
    document.getElementById('completion-date'),
    document.getElementById('project-url'),
    document.getElementById('project-summary'),
    document.getElementById('technologies'),
    document.getElementById('thumbnail-url')
];

function getErrorElement(field) {
    return document.getElementById(field.dataset.errorTarget);
}

function setFieldError(field, message) {
    const errorElement = getErrorElement(field);
    field.setAttribute('aria-invalid', message ? 'true' : 'false');
    errorElement.textContent = message;
}

function clearFieldErrors() {
    formFields.forEach((field) => setFieldError(field, ''));
}

function isSafeHttpUrl(value) {
    try {
        const parsed = new URL(value.trim());
        return parsed.protocol === 'http:' || parsed.protocol === 'https:';
    } catch {
        return false;
    }
}

function validateField(field) {
    if (field.type === 'checkbox') {
        return true;
    }

    const value = field.value.trim();

    switch (field.id) {
        case 'project-name':
            if (value.length < 3) {
                setFieldError(field, 'Project name must be at least 3 characters long.');
                return false;
            }
            break;
        case 'project-category':
            if (!value) {
                setFieldError(field, 'Choose a project category.');
                return false;
            }
            break;
        case 'completion-date':
            if (!value) {
                setFieldError(field, 'Choose a completion date.');
                return false;
            }

            if (new Date(value) > new Date()) {
                setFieldError(field, 'Completion date cannot be in the future.');
                return false;
            }
            break;
        case 'project-url':
            if (!value) {
                setFieldError(field, 'Enter a project URL.');
                return false;
            }

            if (!isSafeHttpUrl(value)) {
                setFieldError(field, 'Project URL must be a valid http or https address.');
                return false;
            }
            break;
        case 'project-summary':
            if (value.length < 20) {
                setFieldError(field, 'Project summary must be at least 20 characters long.');
                return false;
            }
            break;
        case 'technologies':
            if (!value) {
                setFieldError(field, 'List at least one technology.');
                return false;
            }
            break;
        case 'thumbnail-url':
            if (!value) {
                setFieldError(field, 'Enter a thumbnail image URL.');
                return false;
            }

            if (!isSafeHttpUrl(value)) {
                setFieldError(field, 'Thumbnail URL must be a valid http or https address.');
                return false;
            }
            break;
        default:
            break;
    }

    setFieldError(field, '');
    return true;
}

function normalizeTechnologies(value) {
    return value
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean)
        .join(', ');
}

function createFallbackThumbnail(label) {
    const safeLabel = label.trim().slice(0, 18) || 'Project';
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 80" role="img" aria-label="${safeLabel} thumbnail"><rect width="120" height="80" rx="14" fill="#eef5ff"/><text x="60" y="44" text-anchor="middle" fill="#0b6cff" font-family="Arial, sans-serif" font-size="14" font-weight="700">${safeLabel}</text></svg>`;
    return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

function createThumbnailImage(source, label) {
    const image = document.createElement('img');
    const fallbackSource = createFallbackThumbnail(label);

    image.className = 'portfolio-thumbnail';
    image.width = 120;
    image.height = 80;
    image.loading = 'lazy';
    image.decoding = 'async';
    image.alt = `${label} thumbnail`;
    image.src = source;
    image.addEventListener('error', () => {
        if (image.src !== fallbackSource) {
            image.src = fallbackSource;
        }
    });

    return image;
}

function buildProjectRow(project) {
    const row = document.createElement('tr');

    const nameCell = document.createElement('th');
    nameCell.scope = 'row';
    nameCell.textContent = project.name;
    row.appendChild(nameCell);

    const summaryCell = document.createElement('td');
    summaryCell.textContent = project.summary;
    row.appendChild(summaryCell);

    const urlCell = document.createElement('td');
    const urlLink = document.createElement('a');
    urlLink.href = project.url;
    urlLink.target = '_blank';
    urlLink.rel = 'noopener noreferrer';
    urlLink.textContent = 'Open project';
    urlCell.appendChild(urlLink);
    row.appendChild(urlCell);

    const technologiesCell = document.createElement('td');
    technologiesCell.textContent = normalizeTechnologies(project.technologies);
    row.appendChild(technologiesCell);

    const thumbnailCell = document.createElement('td');
    thumbnailCell.appendChild(createThumbnailImage(project.thumbnailUrl, project.name));
    row.appendChild(thumbnailCell);

    const dateCell = document.createElement('td');
    dateCell.textContent = project.completionDate;
    row.appendChild(dateCell);

    if (project.featured) {
        row.setAttribute('data-featured', 'true');
    }

    return row;
}

function collectProjectData() {
    return {
        name: document.getElementById('project-name').value.trim(),
        category: document.getElementById('project-category').value.trim(),
        completionDate: new Date(document.getElementById('completion-date').value).toLocaleDateString('en-GB', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }),
        url: document.getElementById('project-url').value.trim(),
        summary: document.getElementById('project-summary').value.trim(),
        technologies: document.getElementById('technologies').value.trim(),
        thumbnailUrl: document.getElementById('thumbnail-url').value.trim(),
        featured: document.getElementById('featured-project').checked
    };
}

function focusFirstInvalidField() {
    const firstInvalid = form.querySelector('[aria-invalid="true"]');
    if (firstInvalid) {
        firstInvalid.focus();
    }
}

function clearStatus() {
    formStatus.textContent = '';
}

form.addEventListener('input', (event) => {
    if (event.target.matches('input:not([type="checkbox"]), select, textarea')) {
        validateField(event.target);
    }
});

form.addEventListener('blur', (event) => {
    if (event.target.matches('input:not([type="checkbox"]), select, textarea')) {
        validateField(event.target);
    }
}, true);

form.addEventListener('submit', (event) => {
    event.preventDefault();

    const isFormValid = formFields.every((field) => validateField(field));

    if (!isFormValid) {
        formStatus.textContent = 'Fix the highlighted fields and try again.';
        focusFirstInvalidField();
        return;
    }

    const project = collectProjectData();
    const newRow = buildProjectRow(project);
    tableBody.prepend(newRow);

    isProgrammaticReset = true;
    form.reset();
    clearFieldErrors();
    formStatus.textContent = `${project.name} was added to the projects table.`;
    document.getElementById('project-name').focus();
});

form.addEventListener('reset', () => {
    if (isProgrammaticReset) {
        window.setTimeout(() => {
            clearFieldErrors();
            isProgrammaticReset = false;
        }, 0);
        return;
    }

    window.setTimeout(() => {
        clearFieldErrors();
        clearStatus();
        document.getElementById('project-name').focus();
    }, 0);
});

clearFieldErrors();
