// document.getElementById("my-body").addEventListener(
//   "click",
//   function (event) {
//     event.preventDefault();
//     if (event.target.matches("#login-btn")) {
//       var emailInput = document.getElementById("email-input");
//       var pwdInput = document.getElementById("pwd-input");
//       var data = {
//         email: emailInput.value,
//         password: pwdInput.value,
//       };
//       Http.Get("/api/auth/login", data).then(() => {
//         window.location.href = "/users";
//       });
//     }
//   },
//   false
// );
