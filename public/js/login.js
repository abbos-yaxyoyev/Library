document.addEventListener("DOMContentLoaded", function () {

    const email = document.querySelector('#email'),
        password = document.querySelector('#password'),
        submit = document.querySelector('.el-button'),
        error_output = document.querySelector('.output-error');

    const url = 'http://localhost:3000';
    submit.addEventListener('click', login);

    async function login(e) {
        e.preventDefault();
        await fetch(url + '/api/login', {
            method: 'POST',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email: email.value,
                password: password.value
            })
        })
            .then(res => {
                if (res.status == 500)
                    return 500;
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
                    error_output.textContent = 'server invalid';
                } else
                    if (body == 404) {
                        email.textContent = res.data.email;
                        password.textContent = res.data.password;
                        error_output.textContent = 'Login or Password is invalid';
                    } else
                        if (body == 400) {
                            email.textContent = res.data.email;
                            password.textContent = res.data.password;
                            error_output.textContent = 'Login or Password is incorrect';
                        } else
                            if (body) {
                                localStorage.setItem('token', body);
                                window.location.href = url + "/index";
                            }
            })
            .catch(err => console.log(err.message));
    }

})