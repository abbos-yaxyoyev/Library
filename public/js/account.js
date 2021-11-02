document.addEventListener("DOMContentLoaded", function () {

    const name = document.querySelector('#name'),
        lastName = document.querySelector('#lastName'),
        email = document.querySelector('#email'),
        password = document.querySelector('#password'),
        submit = document.querySelector('.el-button'),
        error_output = document.querySelector('.output-error');

    const url = 'http://localhost:3000';
    submit.addEventListener('click', authorization);
    async function authorization(e) {
        e.preventDefault();

        await fetch(url + '/api/newUser', {
            method: 'POST',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name: name.value,
                lastName: lastName.value,
                email: email.value,
                password: password.value
            })
        })
            .then(res => {
                if (res.status == 404)
                    return 404;
                if (res.status == 400)
                    return 400;
                if (res.status == 200)
                    return res.json()
            })
            .then(body => {
                if (body == 500) {
                    email.textContent = res.data.email;
                    password.textContent = res.data.password;
                    email.textContent = res.data.email;
                    password.textContent = res.data.password;
                    error_output.textContent = 'server invalid';
                } else
                    if (body == 404) {
                        name.textContent = res.data.name;
                        lastName.textContent = res.data.lastName;
                        email.textContent = res.data.email;
                        password.textContent = res.data.password;
                        error_output.textContent = `Form data is incorrect `;
                    }
                if (body == 400) {
                    name.textContent = res.data.name;
                    lastName.textContent = res.data.lastName;
                    email.textContent = res.data.email;
                    password.textContent = res.data.password;
                    error_output.textContent = `email or password already exists`;
                }
                if (body && body != 404 && body != 400) {
                    localStorage.setItem('token', body);
                    window.location.href = url + "/index";
                }
            })
            .catch(err => console.log(err.message));
    }

})