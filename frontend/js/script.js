window.addEventListener("DOMContentLoaded", function () {
    const url = 'http://localhost:3000'
    const main = document.querySelector('.main'),
        admin_li = document.querySelector('#admin'),
        all_users_li = document.querySelector('#users'),
        loans_li = document.querySelector('#loans'),
        f_book_li = document.querySelector('#f_book'),
        c_book_li = document.querySelector('#c_book'),
        all_books_li = document.querySelector('#all_books'),
        add_book_li = document.querySelector('#add_book'),
        tableAdmin = document.querySelector('.cantrollAdmin'),
        alluserinfo = document.querySelector('.alluserinfo'),
        addbook = document.querySelector('.addBook'),
        addBookButton = document.querySelector('#addBookButton');


    admin_li.addEventListener('click', pageAdminCantroll);
    all_books_li.addEventListener('click', openBook);
    all_users_li.addEventListener('click', allUserInfo);
    add_book_li.addEventListener('click', openBook);
    addBookButton.addEventListener('click', addBook);

    async function pageAdminCantroll(e) {
        console.log('e.target: ', e.target);
        addbook.style.display = 'none';
        alluserinfo.style.display = 'none';
        tableAdmin.style.display = 'block';
        admin_li.classList.add('liTags');


        table = document.querySelector('.tableadmin');
        table.innerHTML = null;
        table.innerHTML = `<tr>
                                <th  class="thControllRole">Name</th>
                                <th class="thControllRole">First Name</th>
                                <th class="thControllRole">Email</th>
                                <th class="thControllRole">Role</th>
                                <th  class="thControllRole">Admin Controll</th>
                            </tr>`

        await fetch(`${url}/api/admin/user`, {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
        })
            .then(res => res.json())
            .then((data) => {
                let str = '';
                data.forEach(function (element, index, arrayNode) {
                    if (element.role == 'supperAdmin') {
                        return
                    } else if (element.role == 'user') {
                        str = `<div class="roleuser">
                                    <label for="radio_user">user</label>
                                    <input type="radio" id="radio_user"
                                    onchange="changeRole(this)"
                                    name="role" value="user" checked >
                                </div >
                                <div class="roleuser">
                                    <label for="contactChoice2">admin</label>
                                    <input type="radio" id="role_admin"
                                    onchange="changeRole(this)"
                                    name="role" value="admin"  >
                                </div >
                                `
                    } else if (element.role == 'admin') {
                        str = `<div class="roleuser">
                                    <label for="radio_user">user</label>
                                    <input type="radio" id="radio_user"
                                    onchange="changeRole"
                                    name="role" value="user"  >
                                </div >
                                <div class="roleuser">
                                    <label for="contactChoice2">admin</label>
                                    <input type="radio" id="role_admin"
                                    onchange="changeRole(this)"
                                    name="role" value="admin" checked >
                                </div >
                                `
                    }
                    table.innerHTML += `<tr>
                                            <td>${element.name}</td>
                                            <td>${element.lastName}</td>
                                            <td>${element.email}</td>
                                            <td>${element.role}</td>
                                            <td>
                                                <div class="controllerAdmin">
                                                    <form  class="roleform" >${str}</form>
                                                </div > 
                                            </td>
                                        </tr>`
                })
            })
            .catch(err => console.log(err))

        tableAdmin.appendChild(table);
    }

    async function changeRole(e) {
        e.preventDefault();
        console.log(e);
        // console.log(e.target);
    }

    async function allUserInfo() {
        addbook.style.display = 'none';
        tableAdmin.style.display = 'none';
        alluserinfo.style.display = 'block';
        all_users_li.classList.add('liTags');

        table = document.querySelector('.tableuserinfo');
        table.innerHTML = null;
        table.innerHTML = `<tr>
                            <th class="thUserInfo">Name</th>
                            <th class="thUserInfo">First Name</th>
                            <th class="thUserInfo">Email</th>
                            <th class="thUserInfo">Role</th>
                            <th class="thUserInfo">Status</th>
                            <th class="thUserInfo">Number <br/> Book</th>
                            <th class="thUserInfo">Favorite <br/> Book</th>
                            <th class="thUserInfo">
                            <span>CreatAt</span>
                            </th>
                          </tr>`

        await fetch(`${url}/api/admin/user`, {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
        })
            .then(res => res.json())
            .then((data) => {
                console.log(data);
                data.forEach(function (element, index, arrayNode) {
                    let date = date_to_string(element.date)
                    table.innerHTML += `<tr>
                                            <td>${element.name}</td>
                                            <td>${element.lastName}</td>
                                            <td>${element.email}</td>
                                            <td>${element.role}</td>
                                            <td>status</td>
                                            <td>${element.bookNumber}</td>
                                            <td>${element.favoriteBookNumber}</td>
                                            <td>
                                                <div div class="lastTh" >
                                                    <span>${date}</span>
                                                    <div>
                                                        <span id="view">View</span>
                                                        <span id="edit">Edit</span>
                                                    </div>
                                                </div > 
                                            </td>
                                        </tr>`
                })
            })
            .catch(err => console.log(err))

        // alluserinfo.appendChild(table);
    }

    async function openBook() {
        alluserinfo.style.display = 'none';
        tableAdmin.style.display = 'none';
        addbook.style.display = 'block';
        add_book_li.classList.add('liTags');

        const select = document.querySelector('#category');
        let str = '<option disabled selected value></option>';
        await fetch(`${url}/api/category`, {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
        })
            .then(res => res.json())
            .then((data) => {
                data.forEach(function (element, index, arrayNode) {
                    str += `<option data="${element._id} value="${element.value}">${element.category}</option>`
                })

            })
            .catch(err => console.log(err));

        select.innerHTML = str;

    }

    async function addBook(e) {
        e.preventDefault();
        console.log(e.target);
        const bookname = document.querySelector('#bookname'),
            author = document.querySelector('#author'),
            ISBN = document.querySelector('#ISBN'),
            numberBook = document.querySelector('#numberBook'),
            status = document.querySelector('#status'),
            category = document.querySelector('#category'),
            img = document.querySelector('#img'),
            content = document.querySelector('#content');

        const formData = new FormData();
        formData.append('img', img.files[0], img.files[0].name);
        formData.append('category_id', category.value);
        formData.append('author', author.value);
        formData.append('ISBN', ISBN.value);
        formData.append('describtion', content.value);
        formData.append('bookname', bookname.value);
        formData.append('quantity', numberBook.value);
        formData.append('status', status.value);

        await fetch(`${url}/api/book`, {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            },
            body: formData
        })
            // .then(res => res.json())
            .then(res => {
                console.log(res);
            })
            .catch(err => console.log(err.message));
    }

    async function allBooksInfo() {

    }

    function date_to_string(jsonDate) {
        let backToDate = new Date(jsonDate);
        let arr = backToDate.toString().split(' ');
        return `${arr[1]}/${arr[2]}/${arr[3]}  ${arr[4]}`;
    }
})

