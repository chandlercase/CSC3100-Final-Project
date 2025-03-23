document.addEventListener('DOMContentLoaded', function() {
    document.querySelector('#btnSwapInstructorRegister').addEventListener('click', function() {
        document.querySelector('#frmInstructorLogin').classList.add('d-none');
        document.querySelector('#frmInstructorRegister').classList.remove('d-none');
    });
    document.querySelector('#btnSwapInstructorLogin').addEventListener('click', function() {
        document.querySelector('#frmInstructorLogin').classList.remove('d-none');
        document.querySelector('#frmInstructorRegister').classList.add('d-none');
    });
    document.querySelector('#btnSwapStudentLogin').addEventListener('click', function() {
        document.querySelector('#frmInstructorLogin').classList.add('d-none');
        document.querySelector('#frmStudentLogin').classList.remove('d-none');
    });
    document.querySelector('#btnSwapStudentRegisterFromInstructor').addEventListener('click', function() {
        document.querySelector('#frmInstructorRegister').classList.add('d-none');
        document.querySelector('#frmStudentRegister').classList.remove('d-none');
    });
    document.querySelector('#btnSwapStudentRegisterFromLogin').addEventListener('click', function() {
        document.querySelector('#frmStudentLogin').classList.add('d-none');
        document.querySelector('#frmStudentRegister').classList.remove('d-none');
    });
    document.querySelector('#btnSwapStudentLoginFromRegister').addEventListener('click', function() {
        document.querySelector('#frmStudentRegister').classList.add('d-none');
        document.querySelector('#frmStudentLogin').classList.remove('d-none');
    });
    document.querySelector('#btnSwapInstructorRegisterFromStudent').addEventListener('click', function() {
        document.querySelector('#frmStudentRegister').classList.add('d-none');
        document.querySelector('#frmInstructorRegister').classList.remove('d-none');
    });
    document.querySelector('#btnSwapInstructorLoginFromStudentLogin').addEventListener('click', function() {
        document.querySelector('#frmStudentLogin').classList.add('d-none');
        document.querySelector('#frmInstructorLogin').classList.remove('d-none');
    });

    document.querySelector("#btnInstructorRegister").addEventListener("click", () => {
        let strFirstName = document.querySelector("#txtInstructorFirstName").value.trim();
        let strLastName = document.querySelector("#txtInstructorLastName").value.trim();
        let strEmail = document.querySelector("#txtInstructorRegisterEmail").value.trim();
        let strPassword = document.querySelector("#txtInstructorRegisterPassword").value.trim();
        
        const regEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        const regPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        
        let blnError = false;
        let strMessage = "";

        if (!strFirstName || !strLastName) {
            blnError = true;
            strMessage += "<p class='mb-0 mt-0'>First and Last Name are required.</p>";
        }

        if (!regEmail.test(strEmail) || !strEmail.endsWith(".edu")) {
            blnError = true;
            strMessage += "<p class='mb-0 mt-0'>Invalid email. Instructors must use a .edu email.</p>";
        }

        if (!regPassword.test(strPassword)) {
            blnError = true;
            strMessage += "<p class='mb-0 mt-0'>Password must be at least 8 characters, include uppercase, lowercase, a number, and a special character.</p>";
        }

        if (blnError) {
            Swal.fire({
                title: "Oh no, you have an error!",
                html: strMessage,
                icon: "error"
            });
            return;
        }

        Swal.fire({
            title: "Success!",
            text: "Instructor registered successfully!",
            icon: "success"
        });
    });


 
    document.querySelector("#btnStudentRegister").addEventListener("click", () => {
        let strFirstName = document.querySelector("#txtStudentFirstName").value.trim();
        let strLastName = document.querySelector("#txtStudentLastName").value.trim();
        let strEmail = document.querySelector("#txtStudentRegisterEmail").value.trim();
        let strMobile = document.querySelector("#txtStudentRegisterMobile").value.trim();
        let strDiscord = document.querySelector("#txtStudentRegisterDiscord").value.trim();
        let strPassword = document.querySelector("#txtStudentRegisterPassword").value.trim();

        const regEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        const regPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        const regMobile = /^\+?[1-9]\d{1,14}$/;
        const regDiscord = /^.{3,32}#\d{4}$/;

        let blnError = false;
        let strMessage = "";

        if (!strFirstName || !strLastName) {
            blnError = true;
            strMessage += "<p class='mb-0 mt-0'>First and Last Name are required.</p>";
        }

        if (!regEmail.test(strEmail)) {
            blnError = true;
            strMessage += "<p class='mb-0 mt-0'>Invalid email format.</p>";
        }

        if (!regMobile.test(strMobile)) {
            blnError = true;
            strMessage += "<p class='mb-0 mt-0'>Invalid mobile number format.</p>";
        }

        if (strDiscord && !regDiscord.test(strDiscord)) {
            blnError = true;
            strMessage += "<p class='mb-0 mt-0'>Invalid Discord ID. Format: username#1234</p>";
        }

        if (!regPassword.test(strPassword)) {
            blnError = true;
            strMessage += "<p class='mb-0 mt-0'>Password must be at least 8 characters, include uppercase, lowercase, a number, and a special character.</p>";
        }

        if (blnError) {
            Swal.fire({
                title: "Oh no, you have an error!",
                html: strMessage,
                icon: "error"
            });
            return;
        }

        Swal.fire({
            title: "Success!",
            text: "Student registered successfully!",
            icon: "success"
        });
    });

    document.querySelector("#btnInstructorLogin").addEventListener("click", () => {
        let strEmail = document.querySelector("#txtInstructorLoginEmail").value.trim();
        let strPassword = document.querySelector("#txtInstructorLoginPassword").value.trim();

        const regEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

        let blnError = false;
        let strMessage = "";

        if (!regEmail.test(strEmail) || !strEmail.endsWith(".edu")) {
            blnError = true;
            strMessage += "<p class='mb-0 mt-0'>Invalid email. Instructors must use a .edu email.</p>";
        }

        if (strPassword.length < 1) {
            blnError = true;
            strMessage += "<p class='mb-0 mt-0'>Password cannot be blank.</p>";
        }

        if (blnError) {
            Swal.fire({
                title: "You have an Error!",
                html: strMessage,
                icon: "error"
            });
            return;
        }

        Swal.fire({
            title: "Success!",
            text: "Instructor logged in successfully!",
            icon: "success"
        });
    });

    document.querySelector("#btnStudentLogin").addEventListener("click", () => {
        let strEmail = document.querySelector("#txtStudentLoginEmail").value.trim();
        let strPassword = document.querySelector("#txtStudentLoginPassword").value.trim();

        const regEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

        let blnError = false;
        let strMessage = "";

        if (!regEmail.test(strEmail)) {
            blnError = true;
            strMessage += "<p class='mb-0 mt-0'>Invalid email format.</p>";
        }

        if (strPassword.length < 1) {
            blnError = true;
            strMessage += "<p class='mb-0 mt-0'>Password cannot be blank.</p>";
        }

        if (blnError) {
            Swal.fire({
                title: "You have an Error!",
                html: strMessage,
                icon: "error"
            });
            return;
        }

        Swal.fire({
            title: "Success!",
            text: "Student logged in successfully!",
            icon: "success"
        });
    });
});
