document.addEventListener("DOMContentLoaded", function () {

    const btnInstructorLogin = document.querySelector("#btnInstructorLogin");
  
    if (btnInstructorLogin) {
      btnInstructorLogin.addEventListener("click", () => {
        const email = document.querySelector("#txtInstructorLoginEmail").value.trim();
        const password = document.querySelector("#txtInstructorLoginPassword").value.trim();
  
        const regEduEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.edu$/;
  
        let blnError = false;
        let message = "";
  
        if (!regEduEmail.test(email)) {
          blnError = true;
          message += "<p>Invalid email format. Must be a .edu email.</p>";
        }
  
        if (password.length < 8) {
          blnError = true;
          message += "<p>Password must be at least 8 characters long.</p>";
        }
  
        if (blnError) {
          Swal.fire({
            title: "Login Error",
            html: message,
            icon: "error"
          });
        } else {
          Swal.fire({
            title: "Login Successful!",
            text: "Welcome back, instructor!",
            icon: "success"
          }).then(() => {
            window.location.href = "instructor-dashboard.html"
          });
        }
      });
    }

    const btnInstructorRegister = document.querySelector("#btnInstructorRegister");
  
    if (btnInstructorRegister) {
      btnInstructorRegister.addEventListener("click", () => {
        const firstName = document.querySelector("#txtInstructorFirstName").value.trim();
        const lastName = document.querySelector("#txtInstructorLastName").value.trim();
        const email = document.querySelector("#txtInstructorRegisterEmail").value.trim();
        const password = document.querySelector("#txtInstructorRegisterPassword").value.trim();
  
        const regEduEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.edu$/;
        const regPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  
        let blnError = false;
        let message = "";
  
        if (firstName.length < 2) {
          blnError = true;
          message += "<p>First Name must be at least 2 characters long.</p>"
        }
  
        if (lastName.length < 2) {
          blnError = true;
          message += "<p>Last Name must be at least 2 characters long.</p>"
        }
  
        if (!regEduEmail.test(email)) {
          blnError = true;
          message += "<p>Invalid email. Must use a .edu domain.</p>"
        }
  
        if (!regPassword.test(password)) {
          blnError = true
          message += "<p>Password must have 8 characters with upper, lower, number, and special character.</p>"
        }
  
        if (blnError) {
          Swal.fire({
            title: "Registration Error",
            html: message,
            icon: "error"
          });
        } else {
          Swal.fire({
            title: "Registration Successful!",
            text: "Instructor registered successfully!",
            icon: "success"
          }).then(() => {
            window.location.href = "instructor-login.html"
          });
        }
      });
    }
  });
  