document.addEventListener('DOMContentLoaded', () => {

    const registerForm = document.getElementById('registerForm');

    if (registerForm) {
        registerForm.addEventListener('submit', (a) => {
            a.preventDefault();


            // Ingreso de las contraseñas, numero y correo
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            const email = document.getElementById('email').value.trim().toLowerCase();
            const phone = document.getElementById('phone').value.trim();
        
            // Inicializamos el modal de Bootstrap
            const modalElement = document.getElementById('customAlertModal');
            const alertModal = new bootstrap.Modal(modalElement);

            const modalBadge = document.getElementById('modalBadge');
            const modalIcon = document.getElementById('modalIcon');
            const modalTitle = document.getElementById('modalTitle');
            const modalMessage = document.getElementById('modalMessage');
            const modalConfirmBtn = document.getElementById('modalConfirmBtn');


            //Validacion del dominio del correo
            const esEmailValido = dominiosPermitidos.some(dominio => email.endsWith(dominio)); //some devuelve true si termina(endsWith) con algun (dominio) del mock 

            if (!esEmailValido) {
                modalBadge.style.backgroundColor = '#dc3545';
                modalIcon.className = 'fa-solid fa-triangle-exclamation fs-2 text-white';
                modalTitle.textContent = 'Correo no permitido';
                modalMessage.textContent = 'Dominio de correo no valido o inexistente.';
                modalConfirmBtn.onclick = null;
                alertModal.show();
                return;
            }

            // Validacion de numero (Minimo 11 numeros)
            const digitosTelefono = phone.replace(/\D/g, ''); // Extrae únicamente los números eliminando el +, espacios o guiones

            if (digitosTelefono.length < 11) {
                modalBadge.style.backgroundColor = '#dc3545';
                modalIcon.className = 'fa-solid fa-triangle-exclamation fs-2 text-white';
                modalTitle.textContent = 'Teléfono no válido';
                modalMessage.textContent = 'El numero no esta completo o no es valido (ejemplo: +56 9 1234 5678).';
                modalConfirmBtn.onclick = null;
                alertModal.show();
                return;
            }

            // Si las contraseñas no coinciden
            if (password !== confirmPassword) {
                modalBadge.style.backgroundColor = '#dc3545';
                modalIcon.className = 'fa-solid fa-triangle-exclamation fs-2 text-white';
                modalTitle.textContent = 'Las contraseñas no coinciden';
                modalMessage.textContent = 'Por favor, verifica que ambas contraseñas sean idénticas antes de continuar.';
                
                modalConfirmBtn.onclick = null; //no redirige al login
                alertModal.show();
                return;
            }

            // Si el registro es exitoso
            modalBadge.style.backgroundColor = '#26a69a';
            modalIcon.className = 'fa-solid fa-circle-check fs-2 text-white';
            modalTitle.textContent = '¡Registro Exitoso!';
            modalMessage.textContent = 'Tu cuenta ha sido creada en VitalPet Connect. Haz clic en el botón para iniciar sesión.';

            //Redirecciona al apretar el boton de confirmar
            modalConfirmBtn.onclick = () => {
                window.location.href = 'login.html';
            };

            alertModal.show();
        });
    }

    // Login
    const loginForm = document.getElementById('loginForm');

    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();

        // Captura de valores
        const email = document.getElementById('email').value.trim().toLowerCase();
        const password = document.getElementById('password').value;

        const esEmailValido = dominiosPermitidos.some(dominio => email.endsWith(dominio));

        if (!esEmailValido) {
            const modalElement = document.getElementById('customAlertModal');
            
            if (modalElement) {
                const alertModal = new bootstrap.Modal(modalElement);
                document.getElementById('modalBadge').style.backgroundColor = '#dc3545';
                document.getElementById('modalIcon').className = 'fa-solid fa-triangle-exclamation fs-2 text-white';
                document.getElementById('modalTitle').textContent = 'Correo no permitido';
                document.getElementById('modalMessage').textContent = 'Dominio de correo no valido o inexistente.';
                document.getElementById('modalConfirmBtn').onclick = null;
                alertModal.show();
            } else {
                alert('Correo no permitido. Utiliza un dominio válido.');
            }
            
            return;
        }
        window.location.href = 'views/dashboard-home.html';
    });
}

});