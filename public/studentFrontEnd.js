document.addEventListener("DOMContentLoaded", function () {
  const btnStudentLogin = document.querySelector("#btnStudentLogin");

  if (btnStudentLogin) {
    btnStudentLogin.addEventListener("click", () => {
      const email = document
        .querySelector("#txtStudentLoginEmail")
        .value.trim();
      const password = document
        .querySelector("#txtStudentLoginPassword")
        .value.trim();

      const regEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

      let blnError = false;
      let message = "";

      if (!regEmail.test(email)) {
        blnError = true;
        message +=
          "<p>Invalid email format. Please enter a valid email address.</p>";
      }

      if (password.length < 8) {
        blnError = true;
        message += "<p>Password must be at least 8 characters long.</p>";
      }

      if (blnError) {
        Swal.fire({
          title: "Login Error",
          html: message,
          icon: "error",
        });
      } else {
        fetch("http://localhost:5000/api/student/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password, role: "student" }),
        })
          .then((res) => res.json())
          .then((data) => {
            if (data.userId) {
              Swal.fire({
                title: "Login Successful!",
                text: `Welcome back, ${data.name}!`,
                icon: "success",
              }).then(() => {
                window.location.href = "student-dashboard.html";
              });
            } else {
              Swal.fire(
                "Login Failed",
                data.error || "Invalid email or password",
                "error"
              );
            }
          })
          .catch((err) => {
            console.error(err);
            Swal.fire("Error", "Unable to connect to server", "error");
          });
      }
    });
  }

  const btnStudentRegister = document.querySelector("#btnStudentRegister");

  if (btnStudentRegister) {
    btnStudentRegister.addEventListener("click", () => {
      const firstName = document
        .querySelector("#txtStudentFirstName")
        .value.trim();
      const lastName = document
        .querySelector("#txtStudentLastName")
        .value.trim();
      const email = document
        .querySelector("#txtStudentRegisterEmail")
        .value.trim();
      const mobile = document
        .querySelector("#txtStudentMobileNumber")
        .value.trim();
      const teamsId = document.querySelector("#txtStudentTeams").value.trim();
      const discord = ""; // If you add a Discord field, update this line
      const password = document
          .querySelector("#txtStudentRegisterPassword")
          .value.trim();

      const regEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      const regPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
      const regMobile = /^\d{10}$/;

      let blnError = false;
      let message = "";

      if (firstName.length < 2) {
        blnError = true;
        message += "<p>First Name must be at least 2 characters long.</p>";
      }

      if (lastName.length < 2) {
        blnError = true;
        message += "<p>Last Name must be at least 2 characters long.</p>";
      }

      if (!regEmail.test(email)) {
        blnError = true;
        message += "<p>Invalid email format.</p>";
      }

      if (!regMobile.test(mobile)) {
        blnError = true;
        message += "<p>Mobile Number must be exactly 10 digits.</p>";
      }

      if (teamsId.length < 3) {
        blnError = true;
        message += "<p>Teams ID must be at least 3 characters long.</p>";
      }

      if (!regPassword.test(password)) {
        blnError = true;
        message += "<p>Password must have 8 characters with upper, lower, number, and special character(@$!%*?&).</p>";
      }

      if (blnError) {
        Swal.fire({
          title: "Registration Error",
          html: message,
          icon: "error",
        });
      } else {

        fetch("http://localhost:5000/api/student/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            firstName,
            lastName,
            email,
            password,
            mobile,
            discord,
            teamsId,
          }),
        })
          .then((response) => response.json())
          .then((data) => {
            if (data.userId) {
              Swal.fire({
                title: "Registration Successful!",
                text: "Welcome to the Peer Review Portal!",
                icon: "success",
              }).then(() => {
                window.location.href = "student-login.html";
              });
            } else {
              Swal.fire({
                title: "Registration Error",
                text: data.error || "Something went wrong during registration.",
                icon: "error",
              });
            }
          })
          .catch((err) => {
            console.error(err);
            Swal.fire({
              title: "Server Error",
              text: "Could not connect to server. Try again later.",
              icon: "error",
            });
          });
      }
    });
  }
});
