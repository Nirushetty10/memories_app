const formElement = document.querySelector("form");
const inputElements = document.querySelectorAll("input");
const emailError = document.getElementById("emailError");
const passwordError = document.getElementById("passwordError");

formElement.addEventListener("submit", (e) => {
  e.preventDefault();
  const newFormData = new FormData(formElement);
  const email = newFormData.get("email-input");
  const password = newFormData.get("password-input");
  try {
    if(email.length ==0) {
      throw new TypeError("Email is required");
    }
  }catch(err) {
      emailError.textContent = err.message;
      return;
  }

  try {
    if(password.length ==0) {
      throw new TypeError("Password is required");
    }
  }catch(err) {
      passwordError.textContent = err.message;
      return;
  }

  postData({email,password})
});

function reDirectSignupPage(){
  window.location.href = "http://localhost:3001/signup";
}

async function postData(data) {
    try {
      let response = await fetch("http://localhost:3001/auth/login", {
        method: "POST",
        body: JSON.stringify({
          email: data.email,
          password: data.password,
        }),
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      });
      if (response.ok) {
        window.location.href = "http://localhost:3001/memories";
      } else {
        const errorResponse = await response.text();
          emailError.textContent = errorResponse;
      }
    } catch (err) {
      console.log(err);
    }
  }
  
  function reDirectMainPage(){
    window.location.href = "http://localhost:3001";
  }

  inputElements.forEach((input) => {
    input.addEventListener("focus", (e) => {
      if(e.target.id === "email-input"){
        emailError.textContent = "";
      }
      if(e.target.id === "password-input"){
        passwordError.textContent = "";
      }
    });
  });