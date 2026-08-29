document.addEventListener('DOMContentLoaded',function(){

    const timeSelect = document.getElementById('appointmentTime');

    timeSelect.innerHTML = '<option value="" selected>Selecciona una hora...</option>';


    horasDisponibles.forEach((hora) => {
        const opcion = document.createElement('option')
        opcion.value = hora;
        opcion.textContent= hora;
        timeSelect.appendChild(opcion)
    })


    const form = document.getElementById('appointmentForm')

    form.addEventListener('submit',function(event){
        event.preventDefault()

        // Se limpia
        document.getElementById('errorPetName').textContent = '';
        document.getElementById('errorOwnerName').textContent = '';
        document.getElementById('errorReason').textContent = '';
        document.getElementById('errorTime').textContent = '';

        let valid = true;

        const petName = document.getElementById('petName').value;
        const ownerName = document.getElementById('ownerName').value;
        const reason = document.getElementById('appointmentReason').value;
        const timeValue = document.getElementById('appointmentTime').value;

        if(petName == ''){
            document.getElementById('errorPetName').textContent = 'Por favor, ingrese un nombre para la mascota.';
            valid = false;
        }

        if(ownerName == ''){
            document.getElementById('errorOwnerName').textContent = 'Por favor , ingrese el nombre del tutor de la mascota.';
            valid = false;
        }

        if(reason == ''){
            document.getElementById('errorReason').textContent = 'Por favor, seleccione el motivo de su consulta.';
            valid = false;
        }
        

        if(timeValue == ''){
            document.getElementById('errorTime').textContent = 'Por favor, seleccione una hora disponible.'
            valid = false;
        }

        if(valid){
            alert('Cita agendada con éxito para ' + petName)
            form.reset();


            const modalElement = document.getElementById('appointmentModal');
            const modalInstance = bootstrap.Modal.getInstance(modalElement);
            modalInstance.hide();
        }

    })

});
