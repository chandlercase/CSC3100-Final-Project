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
});
