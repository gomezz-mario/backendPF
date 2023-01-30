const forms = document.querySelector(".forms"),
	btnsShowHide = document.querySelectorAll(".eye-icon"),
	links = document.querySelectorAll(".form-link");

btnsShowHide.forEach(btnShowHide => {
	btnShowHide.addEventListener("click", () => {
		const inputsPass = btnShowHide.parentElement.parentElement.querySelectorAll(".password");
		const btnsShowHideInthisForm = btnShowHide.parentElement.parentElement.querySelectorAll(".eye-icon");
		let showHide = '';
		inputsPass.forEach(inputPassword => {
			if(inputPassword.type === "password"){
				inputPassword.type = "text";
				showHide = 'show';
			} else{
				inputPassword.type = "password";
				showHide = 'hide';
			}
		});
		if(showHide === 'show'){
			btnsShowHideInthisForm.forEach(btn => {
				btn.classList.replace("bi-eye-slash", "bi-eye");
			});
		}
		if(showHide === 'hide'){
			btnsShowHideInthisForm.forEach(btn => {
				btn.classList.replace("bi-eye", "bi-eye-slash");
			});
		}
	});
});

links.forEach(link => {
	link.addEventListener("click", (e) => {
		e.preventDefault();
		forms.classList.toggle("show-signup");
	});
});

document.getElementById("btn-login").addEventListener("click", async (e) => {
	e.preventDefault();
	const formLogin = document.getElementById("form-login");
	const email = formLogin['email'].value;
	const password = formLogin['password'].value;
	await fetch('/api/sesion/login-local', {
		method: 'POST',
		headers: {'Content-Type': 'application/json'},
		body: JSON.stringify({email, password}),
	});
});
document.getElementById("btn-signup").addEventListener("click", async (e) => {
	e.preventDefault();
	const formLogin = document.getElementById("form-signup");
	const email = formLogin['email'].value;
	const password = formLogin['password'].value;
	const password2 = formLogin['password2'].value;
	let passwordValidated = password === password2;
	if(passwordValidated){
		const response = await fetch('/api/sesion/signup-local', {
			method: 'POST',
			headers: {'Content-Type': 'application/json'},
			body: JSON.stringify({email, password}),
			
		});
		if(response.status === 200){
			console.log('response: ', response);
			return fetch('/views/products');
		}
	}
});



//VALIDAR DATOS
//PETICIONES DE LOGIN Y SIGNUP A LAS REDES

