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
