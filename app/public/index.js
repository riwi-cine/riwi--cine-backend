const API_URL = '/api/users';
const form = document.getElementById('user-form');
const userTableBody = document.getElementById('user-table-body');
const emptyState = document.getElementById('empty-state');
const submitBtn = document.getElementById('submit-btn');
const cancelBtn = document.getElementById('cancel-btn');
const formTitle = document.getElementById('form-title');
const passwordGroup = document.getElementById('password-group');

let isEditing = false;

const validators = {
    name: (val) => val.trim().length >= 3,
    email: (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val),
    phoneNumber: (val) => /^\d{10}$/.test(val),
    country: (val) => val.trim().length > 0,
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

['name', 'email', 'phoneNumber', 'country', 'password'].forEach(field => {
    document.getElementById(field).addEventListener('input', () => validateField(field));
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
        tr.innerHTML = `
                    <td class="py-4 px-2 font-medium text-gray-800">#${user.id}</td>
                    <td class="py-4 px-2 font-medium text-gray-800">${escapeHtml(user.name)}</td>
                    <td class="py-4 px-2 text-gray-600">${escapeHtml(user.email)}</td>
                    <td class="py-4 px-2 text-gray-600">${escapeHtml(user.phoneNumber || 'N/A')}</td>
                    <td class="py-4 px-2 text-gray-600">${escapeHtml(user.country || 'N/A')}</td>
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

    const fieldsToValidate = ['name', 'email', 'phoneNumber', 'country'];
    if (!isEditing) fieldsToValidate.push('password');

    const allValid = fieldsToValidate.every(validateField);
    if (!allValid) {
        showToast('Por favor corrige los errores del formulario', 'error');
        return;
    }

    const formData = new FormData(form);
    const userData = Object.fromEntries(formData.entries());
    const id = document.getElementById('user-id').value;

    submitBtn.classList.add('loading');
    submitBtn.textContent = 'Procesando...';

    try {
        let response;
        if (isEditing) {
            if (!userData.password) delete userData.password;
            response = await fetch(`${API_URL}/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userData)
            });
        } else {
            response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userData)
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

window.editUser = (user) => {
    isEditing = true;
    document.getElementById('user-id').value = user.id;
    document.getElementById('name').value = user.name;
    document.getElementById('email').value = user.email;
    document.getElementById('phoneNumber').value = user.phoneNumber || '';
    document.getElementById('country').value = user.country || '';

    formTitle.innerHTML = '<i class="fas fa-user-edit text-indigo-500"></i> Editar Usuario';
    submitBtn.textContent = 'Actualizar Usuario';
    cancelBtn.classList.remove('hidden');
    passwordGroup.classList.add('hidden');

    document.querySelectorAll('.input-error').forEach(el => el.classList.remove('input-error'));
    document.querySelectorAll('.error-message').forEach(el => el.style.display = 'none');

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

    document.querySelectorAll('.input-error').forEach(el => el.classList.remove('input-error'));
    document.querySelectorAll('.error-message').forEach(el => el.style.display = 'none');
}

cancelBtn.onclick = resetForm;
document.getElementById('refresh-btn').onclick = fetchUsers;

fetchUsers();