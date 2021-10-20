const changeAccount = document.querySelector('.createdAccount'),
    forgotPassword = document.querySelector('.forgotPassword');

const url = `http://localhost:3000/${changeAccount.id}`;
changeAccount.addEventListener('click', loginAccount);
function loginAccount(e) {
    window.location.href = url
}

