const API_URL = '/api/users';
const API_COUNTRY_URL = '/api/countries';
const form = document.getElementById('user-form');
const userTableBody = document.getElementById('user-table-body');
const emptyState = document.getElementById('empty-state');
const submitBtn = document.getElementById('submit-btn');
const cancelBtn = document.getElementById('cancel-btn');
const formTitle = document.getElementById('form-title');
const passwordGroup = document.getElementById('password-group');
const countrySelect = document.getElementById('country');
const departmentSelect = document.getElementById('departmentId');
const citySelect = document.getElementById('cityId');

let isEditing = false;
let countriesCache = [];

const validators = {
    firstName: (val) => val.trim().length >= 2,
    lastName: (val) => val.trim().length >= 2,
    email: (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val),
    phone: (val) => /^\d{10}$/.test(val),
    birthDate: (val) => val.trim().length > 0,
    country: (val) => val.trim().length > 0,
    cityId: (val) => val.trim().length > 0,
    password: (val) => isEditing ? true : val.length >= 8
};

const validateField = (field) => {
    const input = document.getElementById(field);
    const errorMsg = document.getElementById(`error-${field}`);
    const isValid = validators[field](input.value);

    if (!isValid) {
        input.classList.add('input-error');
        errorMsg.style.display = 'block';
    } else {
        input.classList.remove('input-error');
        errorMsg.style.display = 'none';
    }
    return isValid;
};

['firstName', 'lastName', 'email', 'phone', 'birthDate', 'country', 'cityId', 'password'].forEach(field => {
    const el = document.getElementById(field);
    if (!el) return;
    el.addEventListener('input', () => validateField(field));
    el.addEventListener('change', () => validateField(field));
});



async function loadCountries() {
    try {
        const res = await fetch(API_COUNTRY_URL);
        if (!res.ok) throw new Error('No se pudo cargar países');
        countriesCache = await res.json();
        countrySelect.innerHTML = '<option value="">Seleccione un país</option>';
        countriesCache.forEach(c => {
            const opt = document.createElement('option');
            opt.value = c.name;
            opt.dataset.id = c.id;
            opt.textContent = c.name;
            countrySelect.appendChild(opt);
        });
    } catch (e) {
        console.error(e);
    }
}

async function loadDepartments(countryId) {
    try {
        const res = await fetch(`/api/departments/${countryId}`);
        if (!res.ok) throw new Error('No se pudieron cargar departamentos');
        return await res.json();
    } catch (e) {
        console.error(e);
        return [];
    }
}

async function loadCities(departmentId) {
    try {
        const res = await fetch(`/api/cities/${departmentId}`);
        if (!res.ok) throw new Error('No se pudieron cargar ciudades');
        return await res.json();
    } catch (e) {
        console.error(e);
        return [];
    }
}

countrySelect.addEventListener('change', async () => {
    const selectedOption = countrySelect.options[countrySelect.selectedIndex];
    const countryId = Number(selectedOption?.dataset.id);
    departmentSelect.innerHTML = '<option value="">Seleccione un departamento</option>';
    citySelect.innerHTML = '<option value="">Seleccione una ciudad</option>';
    if (!countryId) return;

    const country = countriesCache.find(c => c.id === countryId);
    if (!country) return;

    const departments = await loadDepartments(countryId);
    if (departments.length === 0) {
        const opt = document.createElement('option');
        opt.value = '';
        opt.textContent = 'No hay departamentos';
        departmentSelect.appendChild(opt);
        return;
    }
    departments.forEach(d => {
        const opt = document.createElement('option');
        opt.value = d.id;
        opt.textContent = d.name;
        departmentSelect.appendChild(opt);
    });
});

departmentSelect.addEventListener('change', async () => {
    const departmentId = Number(departmentSelect.value);
    citySelect.innerHTML = '<option value="">Seleccione una ciudad</option>';
    if (!departmentId) return;

    const cities = await loadCities(departmentId);
    if (cities.length === 0) {
        const opt = document.createElement('option');
        opt.value = '';
        opt.textContent = 'No hay ciudades disponibles';
        citySelect.appendChild(opt);
        return;
    }
    cities.forEach(c => {
        const opt = document.createElement('option');
        opt.value = c.id;
        opt.textContent = c.name;
        citySelect.appendChild(opt);
    });
});

function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    const content = document.getElementById('toast-content');
    const icon = document.getElementById('toast-icon');
    const msg = document.getElementById('toast-message');

    content.className = `px-6 py-3 rounded-lg shadow-xl text-white font-medium flex items-center gap-2 ${type === 'success' ? 'bg-green-500' : 'bg-red-500'}`;
    icon.innerHTML = type === 'success' ? '<i class="fas fa-check-circle"></i>' : '<i class="fas fa-exclamation-triangle"></i>';
    msg.textContent = message;

    toast.classList.remove('translate-y-20');
    setTimeout(() => toast.classList.add('translate-y-20'), 3000);
}

async function fetchUsers() {
    try {
        const response = await fetch(API_URL);
        const users = await response.json();
        renderUsers(users);
    } catch (error) {
        showToast('Error al cargar usuarios. Verifique conexión.', 'error');
    }
}


function renderUsers(users) {
    userTableBody.innerHTML = '';
    if (users.length === 0) {
        emptyState.classList.remove('hidden');
        return;
    }
    emptyState.classList.add('hidden');

    users.forEach(user => {
        const tr = document.createElement('tr');
        tr.className = 'border-b border-gray-50 hover:bg-gray-50 transition-colors';
        const fullName = `${user.firstName || ''} ${user.lastName || ''}`.trim();
        const countryName = user.country?.name || 'N/A';
        const cityName = user.city?.name || 'N/A';
        const birth = user.birthDate || 'N/A';
        const marketing = user.marketingOptIn ? 'Sí' : 'No';
        tr.innerHTML = `
                    <td class="py-4 px-2 font-medium text-gray-800">#${user.id}</td>
                    <td class="py-4 px-2 font-medium text-gray-800">${escapeHtml(fullName)}</td>
                    <td class="py-4 px-2 text-gray-600">${escapeHtml(user.email)}</td>
                    <td class="py-4 px-2 text-gray-600">${escapeHtml(user.phone || 'N/A')}</td>
                    <td class="py-4 px-2 text-gray-600">${escapeHtml(countryName)}</td>
                    <td class="py-4 px-2 text-gray-600">${escapeHtml(cityName)}</td>
                    <td class="py-4 px-2 text-gray-600">${escapeHtml(birth)}</td>
                    <td class="py-4 px-2 text-gray-600">${escapeHtml(marketing)}</td>
                    <td class="py-4 px-2">
                        <div class="flex gap-2">
                            <button onclick='editUser(${JSON.stringify(user)})' 
                                class="text-indigo-600 hover:bg-indigo-50 p-2 rounded-lg transition-colors" title="Editar">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button onclick="deleteUser(${user.id})" 
                                class="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors" title="Eliminar">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </td>
                `;
        userTableBody.appendChild(tr);
    });
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

form.onsubmit = async (e) => {
    e.preventDefault();

    const fieldsToValidate = ['firstName', 'lastName', 'email', 'phone', 'birthDate', 'country', 'cityId'];
    if (!isEditing) fieldsToValidate.push('password');

    const allValid = fieldsToValidate.every(validateField);
    if (!allValid) {
        showToast('Por favor corrige los errores del formulario', 'error');
        return;
    }

    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    data.marketingOptIn = document.getElementById('marketingOptIn').checked;
    data.passwordHash = data.password;
    delete data.password;
    if (data.cityId) {
        data.cityId = Number(data.cityId);
    }

    const id = document.getElementById('user-id').value;

    submitBtn.classList.add('loading');
    submitBtn.textContent = 'Procesando...';

    try {
        let response;
        if (isEditing) {
            response = await fetch(`${API_URL}/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
        } else {
            response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
        }

        if (response.ok) {
            showToast(`Usuario ${isEditing ? 'actualizado' : 'creado'} con éxito`);
            resetForm();
            fetchUsers();
        } else {
            let errMsg = 'Error en la operación';
            try {
                const err = await response.json();
                errMsg = err.error || errMsg;
            } catch (e) { }
            showToast(errMsg, 'error');
        }
    } catch (error) {
        showToast('Error de conexión con el servidor', 'error');
    } finally {
        submitBtn.classList.remove('loading');
        submitBtn.textContent = isEditing ? 'Actualizar Usuario' : 'Guardar Usuario';
    }
};

window.editUser = async (user) => {
    isEditing = true;
    document.getElementById('user-id').value = user.id;
    document.getElementById('firstName').value = user.firstName || '';
    document.getElementById('lastName').value = user.lastName || '';
    document.getElementById('email').value = user.email;
    document.getElementById('phone').value = user.phone || '';
    document.getElementById('birthDate').value = user.birthDate || '';
    document.getElementById('marketingOptIn').checked = !!user.marketingOptIn;

    formTitle.innerHTML = '<i class="fas fa-user-edit text-indigo-500"></i> Editar Usuario';
    submitBtn.textContent = 'Actualizar Usuario';
    cancelBtn.classList.remove('hidden');
    passwordGroup.classList.add('hidden');

    document.querySelectorAll('.input-error').forEach(el => el.classList.remove('input-error'));
    document.querySelectorAll('.error-message').forEach(el => el.style.display = 'none');

    const countryName = user.country?.name || user.country;
    if (countryName) {
        countrySelect.value = countryName;
        const country = countriesCache.find(c => c.name === countryName);
        if (country) {
            const departments = await loadDepartments(country.id);
            departmentSelect.innerHTML = '<option value="">Seleccione un departamento</option>';
            departments.forEach(d => {
                const opt = document.createElement('option');
                opt.value = d.id;
                opt.textContent = d.name;
                departmentSelect.appendChild(opt);
            });

            const userDepartmentId = user.departmentId || user.city?.departmentId;
            if (userDepartmentId) {
                departmentSelect.value = userDepartmentId;
                const cities = await loadCities(userDepartmentId);
                citySelect.innerHTML = '<option value="">Seleccione una ciudad</option>';
                cities.forEach(c => {
                    const opt = document.createElement('option');
                    opt.value = c.id;
                    opt.textContent = c.name;
                    citySelect.appendChild(opt);
                });
                if (user.cityId) {
                    citySelect.value = user.cityId;
                }
            }
        }
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
};

window.deleteUser = async (id) => {
    if (!confirm(`¿Estás seguro de eliminar el usuario #${id}? Esta acción puede deshacerse restaurándolo.`)) return;

    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id })
        });

        if (response.ok) {
            showToast('Usuario eliminado correctamente');
            fetchUsers();
        } else {
            showToast('Error al intentar eliminar el usuario', 'error');
        }
    } catch (error) {
        showToast('Error de conexión', 'error');
    }
};

function resetForm() {
    isEditing = false;
    form.reset();
    document.getElementById('user-id').value = '';
    formTitle.innerHTML = '<i class="fas fa-user-plus text-indigo-500"></i> Crear Nuevo Usuario';
    submitBtn.textContent = 'Guardar Usuario';
    cancelBtn.classList.add('hidden');
    passwordGroup.classList.remove('hidden');
    departmentSelect.innerHTML = '<option value="">Seleccione un departamento</option>';
    citySelect.innerHTML = '<option value="">Seleccione una ciudad</option>';

    document.querySelectorAll('.input-error').forEach(el => el.classList.remove('input-error'));
    document.querySelectorAll('.error-message').forEach(el => el.style.display = 'none');
}

cancelBtn.onclick = resetForm;
document.getElementById('refresh-btn').onclick = fetchUsers;

loadCountries();
fetchUsers();
