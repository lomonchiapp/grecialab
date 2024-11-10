# Ixiturn - Grecialab

**Ixiturn** es un sistema de gestión de turnos desarrollado por **Ixi**, encabezado por el desarrollador **Elvio Reyes**. Esta es la **primera versión** del sistema. **Ixiturn** funciona como el **dashboard** de un sistema de turnos, encargado de manejar el flujo de usuarios, gestionar turnos, y permitir que los pacientes sean asignados a múltiples servicios sin conflictos.

El sistema tiene la capacidad de asignar **múltiples servicios** a cada ticket, lo que permite que un paciente tome varios servicios a la vez sin interferencias entre ellos.

---

## Características principales

- **Gestión de Turnos**: El sistema permite asignar múltiples servicios a un único ticket. Los pacientes pueden recibir varios servicios simultáneamente, y el sistema gestiona la asignación en las diferentes filas correspondientes a cada servicio.
  
- **Manejo de Usuarios**: El sistema cuenta con una gestión de usuarios, permitiendo tanto usuarios normales como un usuario **administrador**. El administrador principal es el primero creado durante la instalación y tiene acceso total al sistema.

- **Plan de Contingencia**: Ixiturn está diseñado con un plan de contingencia. En caso de pérdida de la base de datos, el sistema se reinicia automáticamente y presenta la instalación para renovar el sistema de turnos y restablecer el funcionamiento.

- **Interfaz de Administración**: A través del dashboard, los usuarios pueden gestionar, actualizar y en ciertos casos, generar turnos para los pacientes. La interfaz es sencilla e intuitiva, pensada para facilitar la gestión diaria.

---

## Tecnologías Utilizadas

- **Frontend**: React.js, con el framework de desarrollo **Vite.js** para una experiencia de desarrollo robusta y optimizada.
- **Backend**: Node.js, utilizando firestore para sincronización en tiempo real.
- **Base de Datos**: MongoDB / Firestore
- **Autenticación y Seguridad**: OAuth / Firestore

---

## Flujo de Turnos

**Ixiturn** gestiona los turnos de los pacientes de manera eficiente permitiendo la asignación de múltiples servicios por ticket. Esto asegura que un paciente pueda recibir diferentes servicios sin interferencias.

### Proceso de Asignación de Turnos:
1. El paciente solicita un turno a través del sistema.
2. El sistema genera un **ticket único** y lo asigna a las filas correspondientes para cada servicio.
3. Los pacientes son llamados a cada servicio según el orden de la fila.
4. Cuando todos los servicios han sido completados, el ticket se marca como finalizado.

---

## Gestión de Usuarios

### Tipos de usuarios:
- **Administrador (Admin)**: Tiene permisos completos sobre el sistema, incluyendo la gestión de turnos, usuarios y servicios. El administrador principal es el primer usuario creado en la instalación del sistema.

- **Usuarios Normales**: Pueden gestionar y actualizar turnos, así como visualizar los servicios asignados a los pacientes.

### Crear un Usuario:
El administrador tiene la capacidad de crear nuevos usuarios, asignándoles uno o más servicios según sea necesario. Para hacerlo, se accede a la sección de administración del dashboard.

---

## Plan de Contingencia

En caso de un fallo crítico en el sistema o la pérdida de la base de datos, **Ixiturn** cuenta con un **plan de contingencia** que reinicia el sistema y presenta la instalación para renovar el sistema de turnos. Esto asegura que el sistema pueda continuar funcionando incluso después de un error grave.

---

## Contribuciones

¡Las contribuciones son bienvenidas!

Si deseas contribuir al desarrollo de **Ixiturn**, por favor sigue estos pasos:

1. **Fork** el repositorio.
2. Crea una nueva **branch** para tus cambios:
   ```bash
   git checkout -b mi-nueva-feature