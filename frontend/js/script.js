window.addEventListener("DOMContentLoaded", function () {
    const url = 'http://localhost:3000';
    const main = document.querySelector('.main'),
        ul = document.querySelector('#ul'),
        admin_li = document.querySelector('#admin'),
        all_users_li = document.querySelector('#users'),
        home_li = document.querySelector('#home'),
        f_book_li = document.querySelector('#f_book'),
        c_book_li = document.querySelector('#c_book'),
        all_books_li = document.querySelector('#all_books'),
        add_book_li = document.querySelector('#add_book'),
        generalPage = document.querySelector('.homePage'),
        tableAdmin = document.querySelector('.cantrollAdmin'),
        alluserinfo = document.querySelector('.alluserinfo'),
        favorite = document.querySelector('.favoriteBooks'),
        sectionCategory = document.querySelector('.category'),
        userBooksInfo = document.querySelector('.allbooksinfo'),
        editdata = document.querySelector('.editdata'),
        addbook = document.querySelector('.addBook');

    const pageSize = 12;
    let countData = 0;
    let current = 0;

    ul.addEventListener('click', ultarget);
    home_li.addEventListener('click', () => { generalBooks(1, 1) });
    admin_li.addEventListener('click', () => { pageAdminCantroll(1, 1) });
    all_books_li.addEventListener('click', () => { allBooksInfo(1, 1) });
    f_book_li.addEventListener('click', () => { favoriteBooks(1, 1) });
    c_book_li.addEventListener('click', () => { category(1, 1) });
    all_users_li.addEventListener('click', () => { allUserInfo(1, 1) });
    add_book_li.addEventListener('click', () => { openBook(1, 1) });

    function ultarget(e) {
        console.log(e.target.nodeName);
        let li = e.target
        if (e.target.matches("SPAN") || e.target.matches("I")) {
            li = e.target.parentElement
        };

        li.classList.add('liTags');

        ul.childNodes.forEach((element, index, array) => {
            if (element.nodeName == "#text") return;
            if (element.id == li.id) return;
            if (element.classList.contains("liTags")) element.classList.remove("liTags");
        })
    }

    async function pageAdminCantroll(currentPage, target) {
        display('cantrollAdmin')

        valueNull()

        let tableadmin = document.createElement("table");
        tableadmin.classList.add('table', "tableuserinfo");

        let div_pagination = document.createElement("div");
        div_pagination.classList.add('pagenation');

        tableAdmin.appendChild(tableadmin);
        tableAdmin.appendChild(div_pagination);
        tableadmin.addEventListener('click', changeRole);

        tableadmin.innerHTML = `<tr>
                                <th  class="thControllRole">Name</th>
                                <th class="thControllRole">First Name</th>
                                <th class="thControllRole">Email</th>
                                <th class="thControllRole">Role</th>
                                <th  class="thControllRole">Admin Controll</th>
                            </tr>`

        div_pagination.innerHTML = `<ul class="pagenation-ul">
                                        <li class="pagenation-li"><p class="first">first</p></li>
                                        <li class="pagenation-li"><p class="prev">prev</p></li>
                                        <li class="pagenation-li"><p class="pagenation-number">1</p></li>
                                        <li class="pagenation-li"><p class="pagenation-number">2</p></li>
                                        <li class="pagenation-li"><p class="pagenation-number">3</p></li>
                                        <li class="pagenation-li"><p class="next">next</p></li>
                                        <li class="pagenation-li"><p class="last">last</p></li>
                                    </ul>`

        let ul = document.querySelector('.pagenation-ul');
        ul.addEventListener('click', pagenationRoleUser);

        await fetch(`${url}/api/role/${pageSize}/${currentPage}`, {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
        })
            .then(res => res.json())
            .then((data) => {
                let { allUser, count, currentpage } = data;
                countData = count;
                current = currentpage;
                let str = '';
                allUser.forEach(function (element, index, arrayNode) {
                    if (element.role == 'supperAdmin') {
                        return
                    } else if (element.role == 'user') {
                        str = `<div class="roleuser">
                                    <label for="radio_user">user</label>
                                    <input type="radio" id="radio_user"
                                    data="${element._id}"
                                    name="role" value="user" checked >
                                </div >
                                <div class="roleuser">
                                    <label for="contactChoice2">admin</label>
                                    <input type="radio" id="role_admin"
                                    data="${element._id}"
                                    name="role" value="admin"  >
                                </div >
                                `
                    } else if (element.role == 'admin') {
                        str = `<div class="roleuser">
                                    <label for="radio_user">user</label>
                                    <input type="radio" id="radio_user"
                                    data="${element._id}"
                                    name="role" value="user"  >
                                </div >
                                <div class="roleuser">
                                    <label for="contactChoice2">admin</label>
                                    <input type="radio" id="role_admin"
                                    data="${element._id}"
                                    name="role" value="admin" checked >
                                </div >
                                `
                    }
                    tableadmin.innerHTML += `<tr>
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

        pagenationNumber(currentPage, target)
    }

    async function changeRole(e) {
        let id = e.target.getAttribute("data")
        if (e.target.name == !'role' || e.target.name == undefined) return;
        if (e.target.hasAttribute('checked')) return;

        await fetch(`${url}/api/role/` + id, {
            method: 'PATCH',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token'),
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ role: e.target.value })
        })
            .then(res => res.json())
            .then(res => {
                console.log(res)
            })
            .catch(err => console.log(err.message))
    }

    async function allUserInfo(currentPage, target) {
        display('alluserinfo')
        valueNull()

        let table = document.createElement("table");
        table.classList.add('table', "tableuserinfo");

        let div_pagination = document.createElement("div");
        div_pagination.classList.add('pagenation');

        alluserinfo.appendChild(table);
        alluserinfo.appendChild(div_pagination);

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

        div_pagination.innerHTML = `<ul class="pagenation-ul">
                                        <li class="pagenation-li"><p class="first">first</p></li>
                                        <li class="pagenation-li"><p class="prev">prev</p></li>
                                        <li class="pagenation-li"><p class="pagenation-number">1</p></li>
                                        <li class="pagenation-li"><p class="pagenation-number">2</p></li>
                                        <li class="pagenation-li"><p class="pagenation-number">3</p></li>
                                        <li class="pagenation-li"><p class="next">next</p></li>
                                        <li class="pagenation-li"><p class="last">last</p></li>
                                    </ul>`

        await fetch(`${url}/api/admin/user/${pageSize}/${currentPage}`, {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
        })
            .then(res => res.json())
            .then((data) => {
                const { allUser, count, currentpage, role } = data;
                countData = count;
                current = currentpage
                allUser.forEach(function (element, index, arrayNode) {
                    let date = date_to_string(element.date)
                    if (element.role == 'supperAdmin' && role != 'supperAdmin') return;
                    else {
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
                    }
                })
            })
            .catch(err => console.log(err));

        // alluserinfo.appendChild(div);
        // alluserinfo.appendChild(div_pagination);
        let ul = document.querySelector('.pagenation-ul');
        // table.addEventListener('click', bookButton);
        ul.addEventListener('click', pagenationUsersInfo);
        pagenationNumber(currentPage, target)
    }

    async function category(currentPage, target) {
        display('category')
        valueNull()

        let form = document.createElement("form");
        form.classList.add("categoryForm");

        let table = document.createElement("table");
        table.classList.add("tableCategory");

        let div_pagination = document.createElement("div");
        div_pagination.classList.add('pagenation');

        sectionCategory.appendChild(form);
        sectionCategory.appendChild(table);
        sectionCategory.appendChild(div_pagination);

        form.innerHTML = `<form class="categoryForm">
                            <div>
                                <input id="categoryInput" type="text" placeholder="Add category name"><button  class="categoryButton fas fa-2x fa-plus"></button>
                            </div>
                            <div>
                                <input id="categorySearch" type="text" placeholder="Choose a category name"><button id="categorySearchButton" class="fas fa-2x fa-search"></button>
                            </div>
                        </form>`

        table.innerHTML = `<tr>
                            <th class="thUserInfo">Category name</th>
                            <th class="thUserInfo">
                            <span>CreatAt</span>
                            </th>
                          </tr>`

        div_pagination.innerHTML = `<ul class="pagenation-ul">
                                        <li class="pagenation-li"><p class="first">first</p></li>
                                        <li class="pagenation-li"><p class="prev">prev</p></li>
                                        <li class="pagenation-li"><p class="pagenation-number">1</p></li>
                                        <li class="pagenation-li"><p class="pagenation-number">2</p></li>
                                        <li class="pagenation-li"><p class="pagenation-number">3</p></li>
                                        <li class="pagenation-li"><p class="next">next</p></li>
                                        <li class="pagenation-li"><p class="last">last</p></li>
                                    </ul>`

        await fetch(`${url}/api/category/${pageSize}/${currentPage}`, {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
        })
            .then(res => res.json())
            .then((data) => {
                const { categories, count, currentpage, role } = data;
                countData = count;
                current = currentpage
                categories.forEach(function (element, index, arrayNode) {
                    let date = date_to_string(element.createdAt)
                    table.innerHTML += `<tr id="${element._id}">
                                            <td>${element.category}</td>
                                            <td>
                                                <div div class="lastTh" >
                                                    <span>${date}</span>
                                                    <div>
                                                        <span id="deleteCategory" data="${element._id}" >Delete</span>
                                                        <span id="editCategory" data="${element._id}" >Edit</span>
                                                    </div>
                                                </div >
                                            </td>
                                        </tr>`
                })
            })
            .catch(err => console.log(err));

        let addcategoryButton = document.querySelector('.categoryButton');
        addcategoryButton.addEventListener('click', addCategory);

        let searchcategoryButton = document.querySelector("#categorySearchButton");
        searchcategoryButton.addEventListener('click', search_name_category);

        let ul = document.querySelector('.pagenation-ul');
        ul.addEventListener('click', pagenationCategory);
        table.addEventListener('click', bookButton);
        pagenationNumber(currentPage, target)
    }

    async function addCategory(e) {
        e.preventDefault();
        if (e.target.id) {
            return edit_category(e.target.id)
        }

        let addcategory = document.querySelector("#categoryInput");
        let table = document.querySelector('.tableCategory');

        await fetch(`${url}/api/admin/category`, {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token'),
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ category: addcategory.value })

        })
            .then(res => res.json())
            .then((data) => {
                if (table.childElementCount < pageSize + 1) category(1, 1);
            })
            .catch(err => console.log(err));
        addcategory.value = null
    }

    async function edit_category(id) {
        let addcategory = document.querySelector("#categoryInput");
        let addcategoryButton = document.querySelector('.categoryButton');
        let table = document.querySelector('.tableCategory');

        await fetch(`${url}/api/admin/category/${id}`, {
            method: 'PUT',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token'),
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ category: addcategory.value })

        })
            .then(res => res.json())
            .then((data) => {
                console.log(data);
                [...table.children].forEach((element, index, array) => {
                    if (element.childNodes[0].id == id) {
                        console.log(element.childNodes[0].firstElementChild);
                        element.childNodes[0].firstElementChild.textContent = addcategory.value;
                    }
                })
            })
            .catch(err => console.log(err));
        addcategory.value = null
        addcategoryButton.removeAttribute('id');
    }


    async function delete_category(id) {

        await fetch(`${url}/api/admin/category/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token'),
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            }
        })
            .then(res => res.json())
            .then((data) => {
                let { book, count, index } = data;
                countData = count;
                if (Math.ceil(countData / pageSize) > Math.ceil(index / pageSize) && Math.ceil(index / pageSize) > 1) {
                    return category(Math.ceil(index / pageSize), Math.ceil(index / pageSize) - 1)
                } else if (Math.ceil(countData / pageSize) == Math.ceil(index / pageSize) > 2) {
                    return category(Math.ceil(countData / pageSize), Math.ceil(countData / pageSize) - 2)
                } else if (Math.ceil(index / pageSize) == 1) {
                    return category(Math.ceil(index / pageSize), Math.ceil(index / pageSize))
                }
            })
            .catch(err => console.log(err));
    }

    async function search_name_category(e) {
        e.preventDefault();
        let searchcategory = document.querySelector("#categorySearch");
        let table = document.querySelector('.tableCategory');

        await fetch(`${url}/api/admin/category/${name}`, {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token'),
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            }
        })
            .then(res => res.json())
            .then((data) => {
                console.log(data);

            })
            .catch(err => console.log(err));
        searchcategory.value = null
    }


    async function openBook(currentPage, target) {
        display('addBook')
        editdata.innerHTML = null;

        addbook.innerHTML = `<form class="addBookForm">
                                <div class="addBookForm_div1">
                                    <div class="addBookForm_div2">
                                        <label for="bookname">Book name</label>
                                        <input  id="bookname" type="text" placeholder="Book name" required>
                                    </div>
                                    <div class="addBookForm_div2">
                                        <label for="author">Author</label>
                                        <input  id="author" type="text" placeholder="Author" required>
                                    </div>
                                    <div class="addBookForm_div2">
                                        <label for="ISBN">ISBN</label>
                                        <input id="ISBN" type="text" placeholder="ISBN" required>
                                    </div>
                                    <div class="addBookForm_div1_2">
                                    <div class="addBookForm_div2">
                                            <label for="numberBook">Book number</label>
                                            <input id="numberBook" type="number" min="0">
                                    </div>
                                        <div class="addBookForm_div2">
                                            <label for="status">Choose a status:</label>
                                            <select id="status" name="status">
                                                <option value="Available">Available</option>
                                                <option value="Unavailable">Unavailable</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div class="addBookForm_div2">
                                        <label for="category">Choose a category:</label>
                                        <select id="category" name="category"></select>
                                    </div>
                                </div>
                                <div>
                                    <div class="addBookForm_div2">
                                        <label for="img">Book img</label>
                                        <input id="img" type="file" accept=".png, .jpg, .jpeg" required>
                                    </div>

                                    <div class="addBookForm_div2">
                                        <label for="content">Book Content:</label>
                                        <textarea id="content" name="content" rows="8" cols="60" placeholder="Enter the content about book:"></textarea>
                                    </div>

                                    <div id="addBook" class="button">
                                        <button id="addBookButton" type="button" >Submit</button>
                                    </div>
                                </div>
                            </form>`

        const select = document.querySelector('#category');
        const addBookButton = document.querySelector('#addBookButton');
        let str = '<option disabled selected value></option>';
        await fetch(`${url}/api/category/${pageSize}/${currentPage}`, {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
        })
            .then(res => res.json())
            .then((data) => {
                const { categories, count, currentpage, role } = data;
                categories.forEach(function (element, index, arrayNode) {
                    str += `<option data="${element._id} value="${element.value}">${element.category}</option>`
                })

            })
            .catch(err => console.log(err));

        select.innerHTML = str;
        console.log(select);
        addBookButton.addEventListener('click', addBook);

    }

    async function addBook(e) {
        e.preventDefault();
        const bookname = document.querySelector('#bookname'),
            author = document.querySelector('#author'),
            ISBN = document.querySelector('#ISBN'),
            numberBook = document.querySelector('#numberBook'),
            status = document.querySelector('#status'),
            category = document.querySelector('#category'),
            img = document.querySelector('#img'),
            content = document.querySelector('#content');

        console.log(img.files[0].name);

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

    async function favoriteBooks(currentPage, target) {
        display('favoriteBooks')

        valueNull()

        let div = document.createElement("div");
        div.classList.add('img-column');

        let div_pagination = document.createElement("div");
        div_pagination.classList.add('pagenation');

        div_pagination.innerHTML = `<ul class="pagenation-ul">
                                        <li class="pagenation-li"><p class="first">first</p></li>
                                        <li class="pagenation-li"><p class="prev">prev</p></li>
                                        <li class="pagenation-li"><p class="pagenation-number">1</p></li>
                                        <li class="pagenation-li"><p class="pagenation-number">2</p></li>
                                        <li class="pagenation-li"><p class="pagenation-number">3</p></li>
                                        <li class="pagenation-li"><p class="next">next</p></li>
                                        <li class="pagenation-li"><p class="last">last</p></li>
                                    </ul>`

        await fetch(`${url}/api/favorite/${pageSize}/${currentPage}`, {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token'),
            },
        })
            .then(res => res.json())
            .then((data) => {
                let { allfavorite, count, currentpage } = data;
                countData = count;
                current = currentpage
                allfavorite.forEach(function (element, index, array) {
                    div.innerHTML += `<div class="card">
                                            <button type="button" class="fas fa-2x fa-star-and-crescent" value="stars" data="${element.book._id}"></button>
                                            <div class="img-card">
                                                <img src="./${element.book.urlImg}" alt="Avatar" style="width:100%">
                                            </div>
                                            <div class="img-container">
                                                <div class="auth"><h4>Author: </h4><p>${element.book.author}</p></div>
                                                <div class="auth"><h4>Book name: </h4><p>${element.book.bookname}</p></div>
                                                <div class="auth"><h4>Status: </h4><p>${element.book.status}</p></div>
                                                <div class="auth"><h4>Book number: </h4>${element.book.quantity}</p></div>
                                                <div class="auth"><h4>Category book: </h4><p>${element.book.category_id}</p></div>
                                            </div>
                                            <div class="button-container">
                                                <button  type="button" class="deleteButtonBook" value="delete" data="${element.book._id}">delete</button>
                                                <button  type="button" class="editButtonBook" value="edit" data="${element.book._id}">edit</button>
                                                <button  type="button" class="contentButtonBook" value="content" data="${element.book._id}">content</button>
                                            </div>
                                            <div class="content">
                                                <button type="button" class="fas fa-times" value="close-content" ></button>
                                                <p class="content-p">${element.book.describtion}</p>
                                            </div>
                                        </div> `
                })
            })
            .catch(err => console.log(err));
        favorite.appendChild(div);
        favorite.appendChild(div_pagination);
        let ul = document.querySelector('.pagenation-ul');
        div.addEventListener('click', bookButton);
        ul.addEventListener('click', pagenationFavorite);
        pagenationNumber(currentPage, target)
    }

    async function allBooksInfo(currentPage, target) {
        display('allbooksinfo')

        valueNull()

        let div = document.createElement("div");
        div.classList.add('img-column');

        let div_pagination = document.createElement("div");
        div_pagination.classList.add('pagenation');

        div_pagination.innerHTML = `<ul class="pagenation-ul">
                                        <li class="pagenation-li"><p class="first">first</p></li>
                                        <li class="pagenation-li"><p class="prev">prev</p></li>
                                        <li class="pagenation-li"><p class="pagenation-number">1</p></li>
                                        <li class="pagenation-li"><p class="pagenation-number">2</p></li>
                                        <li class="pagenation-li"><p class="pagenation-number">3</p></li>
                                        <li class="pagenation-li"><p class="next">next</p></li>
                                        <li class="pagenation-li"><p class="last">last</p></li>
                                    </ul>`

        await fetch(`${url}/api/book/userBooks/${pageSize}/${currentPage}`, {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token'),
            },
        })
            .then(res => res.json())
            .then((data) => {
                let { books, count, currentpage } = data;
                countData = count;
                current = currentpage
                books.forEach(function (element, index, array) {
                    div.innerHTML += `<div class="card">
                                            <button type="button" class="fas fa-2x fa-star-and-crescent" value="stars" data="${element._id}"></button>
                                            <div class="img-card">
                                                <img src="./${element.urlImg}" alt="Avatar" style="width:100%">
                                            </div>
                                            <div class="img-container">
                                                <div class="auth"><h4>Author: </h4><p>${element.author}</p></div>
                                                <div class="auth"><h4>Book name: </h4><p>${element.bookname}</p></div>
                                                <div class="auth"><h4>Status: </h4><p>${element.status}</p></div>
                                                <div class="auth"><h4>Book number: </h4>${element.quantity}</p></div>
                                                <div class="auth"><h4>Category book: </h4><p>${element.category_id}</p></div>
                                            </div>
                                            <div class="button-container">
                                                <button  type="button" class="deleteButtonBook" value="delete" data="${element._id}">delete</button>
                                                <button  type="button" class="editButtonBook" value="edit" data="${element._id}">edit</button>
                                                <button  type="button" class="contentButtonBook" value="content" data="${element._id}">content</button>
                                            </div>
                                            <div class="content">
                                                <button type="button" class="fas fa-times" value="close-content" ></button>
                                                <p class="content-p">${element.describtion}</p>
                                            </div>
                                        </div> `
                })
            })
            .catch(err => console.log(err));
        userBooksInfo.appendChild(div);
        userBooksInfo.appendChild(div_pagination);
        let ul = document.querySelector('.pagenation-ul');
        div.addEventListener('click', bookButton);
        ul.addEventListener('click', pagenationUserBooks);
        pagenationNumber(currentPage, target)
    }

    async function generalBooks(currentPage, target) {
        display('homePage')

        valueNull()

        let div = document.createElement("div");
        div.classList.add('img-column');

        let div_pagination = document.createElement("div");
        div_pagination.classList.add('pagenation');

        div_pagination.innerHTML = `<ul class="pagenation-ul">
                                        <li class="pagenation-li"><p class="first">first</p></li>
                                        <li class="pagenation-li"><p class="prev">prev</p></li>
                                        <li class="pagenation-li"><p class="pagenation-number">1</p></li>
                                        <li class="pagenation-li"><p class="pagenation-number">2</p></li>
                                        <li class="pagenation-li"><p class="pagenation-number">3</p></li>
                                        <li class="pagenation-li"><p class="next">next</p></li>
                                        <li class="pagenation-li"><p class="last">last</p></li>
                                    </ul>`

        await fetch(`${url}/api/general/${pageSize}/${currentPage}`, {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token'),
            },
        })
            .then(res => res.json())
            .then((data) => {
                let { books, count, currentpage } = data;
                countData = count;
                current = currentpage
                // console.log(data);
                books.forEach(function (element, index, array) {
                    div.innerHTML += `<div class="card">
                                            <button type="button" class="fas fa-2x fa-star-and-crescent" value="stars" data="${element._id}"></button>
                                            <div class="img-card">
                                                <img src="./${element.urlImg}" alt="Avatar" style="width:100%">
                                            </div>
                                            <div class="img-container">
                                                <div class="auth"><h4>Author: </h4><p>${element.author}</p></div>
                                                <div class="auth"><h4>Book name: </h4><p>${element.bookname}</p></div>
                                                <div class="auth"><h4>Status: </h4><p>${element.status}</p></div>
                                                <div class="auth"><h4>Book number: </h4>${element.quantity}</p></div>
                                                <div class="auth"><h4>Category book: </h4><p>${element.category_id}</p></div>
                                            </div>
                                            <div class="button-container">
                                                <button  type="button" class="contentButtonBook" value="content" data="${element._id}">content</button>
                                            </div>
                                            <div class="content">
                                                <button type="button" class="fas fa-times" value="close-content" ></button>
                                                <p class="content-p">${element.describtion}</p>
                                            </div>
                                        </div> `
                })
            })
            .catch(err => console.log(err));
        generalPage.appendChild(div);
        generalPage.appendChild(div_pagination);
        let ul = document.querySelector('.pagenation-ul');
        div.addEventListener('click', bookButton);
        ul.addEventListener('click', pagenationGeneral);
        pagenationNumber(currentPage, target)
    }

    function bookButton(e) {
        console.log(e.target.nodeName);
        if (!(e.target.matches("button") || e.target.matches("SPAN"))) return;

        if (e.target.value === 'edit') {
            openEditData(e)
        } else if (e.target.value === 'delete') {
            deleteOneBook(e)
        } else if (e.target.value === 'content') {
            contentOneBook(e)
        } else if (e.target.value === 'close-content') {
            closecontentBook(e)
        } else if (e.target.id == 'deleteCategory') {
            let id = e.target.getAttribute("data")
            delete_category(id)
        } else if (e.target.id == 'editCategory') {
            let id = e.target.getAttribute("data");
            let addcategoryButton = document.querySelector('.categoryButton');
            let addcategory = document.querySelector("#categoryInput");
            addcategoryButton.id = id
            addcategory.value = e.target.parentElement.parentElement.parentElement.parentElement.firstElementChild.textContent
        }

    }

    async function deleteOneBook(e) {
        let id = e.target.getAttribute("data")

        await fetch(`${url}/api/book/` + id, {
            method: 'DELETE',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token'),
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            }
        })
            .then(res => res.json())
            .then(res => {
                console.log(res)
            })
            .catch(err => console.log(err.message))

        allBooksInfo(e)
    }

    async function openEditData(e) {
        let id = e.target.getAttribute("data");
        userBooksInfo.style.display = 'none';
        alluserinfo.style.display = 'none';
        tableAdmin.style.display = 'none';
        addbook.style.display = 'none';
        editdata.style.display = 'block';

        addbook.innerHTML = null;

        editdata.innerHTML = ` <form class="addBookForm">
                                    <div class="addBookForm_div1">
                                        <div class="addBookForm_div2">
                                            <label for="bookname">Book name</label>
                                            <input  id="bookname" type="text" placeholder="Book name" required>
                                        </div>
                                        <div class="addBookForm_div2">
                                            <label for="author">Author</label>
                                            <input  id="author" type="text" placeholder="Author" required>
                                        </div>
                                        <div class="addBookForm_div2">
                                            <label for="ISBN">ISBN</label>
                                            <input id="ISBN" type="text" placeholder="ISBN" required>
                                        </div>
                                        <div class="addBookForm_div1_2">
                                        <div class="addBookForm_div2">
                                                <label for="numberBook">Book number</label>
                                                <input id="numberBook" type="number" min="0">
                                        </div>
                                            <div class="addBookForm_div2">
                                                <label for="status">Choose a status:</label>
                                                <select id="status" name="status">
                                                    <option value="Available">Available</option>
                                                    <option value="Unavailable">Unavailable</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div class="addBookForm_div2">
                                            <label for="category">Choose a category:</label>
                                            <select id="category" name="category"></select>
                                        </div>
                                    </div>
                                    <div>
                                        <div class="addBookForm_div2">
                                            <label for="img">Book img</label>
                                            <input id="img" type="file" accept=".png, .jpg, .jpeg" required>
                                        </div>

                                        <div class="addBookForm_div2">
                                            <label for="content">Book Content:</label>
                                            <textarea id="content" name="content" rows="8" cols="60" placeholder="Enter the content about book:"></textarea>
                                        </div>

                                        <div id="addBook" class="button">
                                            <button id="editButton" data="${id}" type="button" >Submit</button>
                                        </div>
                                    </div>
                                </form>`

        const select = document.querySelector('#category');
        const addBookButton = document.querySelector('#editButton');
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

        console.log(addBookButton);
        addBookButton.addEventListener('click', editOneBook);
        select.innerHTML = str;
    }

    async function editOneBook(e) {
        e.preventDefault();
        let id = e.target.getAttribute("data");
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

        await fetch(`${url}/api/book/` + id, {
            method: 'PUT',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            },
            body: formData
        })
            .then(res => res.json())
            .then(res => {
                allBooksInfo()
            })
            .catch(err => console.log(err.message));
    }

    function contentOneBook(e) {
        let content = e.target.parentElement.parentElement;
        content.lastElementChild.style.display = 'block';
    }

    function closecontentBook(e) {
        let content = e.target.parentElement;
        content.style.display = 'none';
    }

    function pagenationUserBooks(e) {
        let div = document.querySelector('.img-column');
        pagenation(e, allBooksInfo, div)
    }

    function pagenationRoleUser(e) {
        let table = document.querySelector('.tableuserinfo');
        pagenation(e, pageAdminCantroll, table)
    }

    function pagenationUsersInfo(e) {
        let table = document.querySelector('.tableuserinfo');
        pagenation(e, allUserInfo, table)
    }


    function pagenationFavorite(e) {
        let div = document.querySelector('.img-column');
        pagenation(e, favoriteBooks, div)
    }

    function pagenationCategory(e) {
        let table = document.querySelector('.tableCategory');
        pagenation(e, category, table)
    }

    function pagenationGeneral(e) {
        let div = document.querySelector('.img-column');
        pagenation(e, generalBooks, div)
    }

    function pagenation(e, cb, tags) {
        let currentPage = e.target.textContent;
        if (!e.target.matches("P")) return;
        let pagenation_number = document.querySelectorAll('.pagenation-number');

        if (currentPage == 'first') {
            if (current == 1) return;
            cb(1, 1)
        } else if (currentPage == 'prev') {
            let firstElemet = pagenation_number[1].textContent;
            firstElemet = parseInt(firstElemet);
            if (current == 1) return;
            else if (current == Math.ceil(countData / pageSize)) {
                return cb(current - 1, firstElemet - 1);
            } else if (current == 2) {
                return cb(current - 1, current - 1);
            } else {
                firstElemet--;
                cb(firstElemet, firstElemet - 1)
            }
        } else if (currentPage == 'next') {
            let firstElemet = pagenation_number[1].textContent;
            firstElemet = parseInt(firstElemet)
            if (tags.childElementCount < pageSize) return;
            else if (1 < countData / pageSize && countData / pageSize < 2) { return cb(current + 1, current); }
            else if (current == 1) { return cb(current + 1, current); }
            else if (current + 1 == Math.ceil(countData / pageSize)) { return cb(current + 1, current - 1); }
            else { cb(firstElemet + 1, firstElemet) }
        } else if (currentPage == 'last') {
            if (current == Math.ceil(countData / pageSize)) return;
            else if (1 < countData / pageSize && countData / pageSize < 2) {
                return cb(Math.ceil(countData / pageSize), Math.ceil(countData / pageSize) - 1);
            } else { return cb(Math.ceil(countData / pageSize), Math.ceil(countData / pageSize) - 2); }
        } else if (e.target.classList.contains('pagenation-number')) {
            let target = e.target.textContent;
            target = parseInt(target);
            let medium = pagenation_number[1].textContent;
            medium = parseInt(medium);
            if (target === medium) return;
            else if (current == Math.ceil(countData / pageSize) && target === Math.ceil(countData / pageSize)) return;
            else if (current == 1 && 1 == target) return;
            else if (target === current || medium < target && current == Math.ceil(countData / pageSize)) return;
            else if (current < medium && medium < target && medium == Math.ceil(countData / pageSize)) {
                return cb(current + 1, current)
            }
            else if (medium < target && current + 1 == Math.ceil(countData / pageSize)) {
                return cb(current + 1, current - 1);
            } else if (1 == target && current == 2) {
                return cb(target, target);
            } else {
                return cb(target, target - 1);
            }
        }
    }

    function pagenationNumber(currentPage, target) {
        let pagenation_number = document.querySelectorAll('.pagenation-number');
        if (currentPage < Math.ceil(countData / pageSize) && currentPage > 1 || 2 == currentPage && countData / pageSize < 2) {
            pagenation_number[0].style.opacity = "1";
            pagenation_number[1].style.opacity = "0.3";
            pagenation_number[2].style.opacity = "1";
        } else if (2 < current || current === Math.ceil(countData / pageSize) && countData / pageSize > 1) {
            pagenation_number[0].style.opacity = "1";
            pagenation_number[1].style.opacity = "1";
            pagenation_number[2].style.opacity = "0.3";
        } else if (currentPage === 1) {
            pagenation_number[0].style.opacity = "0.3";
            pagenation_number[1].style.opacity = "1";
            pagenation_number[2].style.opacity = "1";
        };
        pagenation_number[0].textContent = target;
        pagenation_number[1].textContent = target + 1;
        pagenation_number[2].textContent = target + 2;
    }

    function valueNull() {
        alluserinfo.innerHTML = null;
        tableAdmin.innerHTML = null;
        favorite.innerHTML = null;
        userBooksInfo.innerHTML = null;
        generalPage.innerHTML = null;
        sectionCategory.innerHTML = null;
    }

    function display(str) {
        [...main.children].forEach((element, index, array) => {
            if (element.classList.contains(str))
                element.style.display = 'block';
            else
                element.style.display = 'none';
        })
    }

    function date_to_string(jsonDate) {
        let backToDate = new Date(jsonDate);
        let arr = backToDate.toString().split(' ');
        return `${arr[1]}/${arr[2]}/${arr[3]}  ${arr[4]}`;
    }
})

