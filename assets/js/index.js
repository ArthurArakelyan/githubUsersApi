const container = document.querySelector('#container');

function userDelete() {
    const userDeleteBtn = document.querySelectorAll('.userDelete');
    userDeleteBtn.forEach(remove => {
        remove.addEventListener('click', (e) => {
            e.target.parentElement.parentElement.remove();
        });
    });
}

function usersRequest() {
    const url = 'https://api.github.com/users';
    const loaderHTML = '<div class="lds-dual-ring"></div>';
    const loader = container.appendChild(document.createElement('div'));
    loader.innerHTML = loaderHTML;
    loader.classList.add('loader');

    return fetch(url)
        .then(res => {
            return res.json();
        })
        .then(data => {
            data.forEach(item => {
                loader.remove();
                const user = container.appendChild(document.createElement('div'));
                user.classList.add('user');

                user.innerHTML = `
                    <div class="userInfo">
                        <a href="https://github.com/${item.login}" target="_blank" class="userName">Name: ${item.login}</a>
                        <p class="userType">Type: ${item.type}</p>
                    </div>
                    <div class="userImage">
                        <a href="https://github.com/${item.login}" target="_blank"><img src="${item.avatar_url}" alt="User"></a>
                    </div>
                    <div class="userActions">
                        <button class="userDelete">Delete</button>
                    </div>
                `;
            });

            userDelete();
        })
        .catch(e => console.error(e));
}

usersRequest();

const addUser = document.querySelector('.addUser');

function createUser(userName = prompt('User', '')) {
    const loaderHTML = '<div class="lds-dual-ring"></div>';
    const loaderDiv = document.createElement('div');
    const loader = container.insertAdjacentElement('afterbegin', loaderDiv);
    loader.innerHTML = loaderHTML;
    loader.classList.add('newUserLoader');
    
    return fetch(`https://api.github.com/users/${userName}`)
        .then(res => res.json())
        .then(data => {
            loader.remove();
            const userDiv = document.createElement('div');
            const user = container.insertAdjacentElement('afterbegin', userDiv);
            user.classList.add('user');

            user.innerHTML = `
                <div class="userInfo">
                <a href="https://github.com/${data.login}" target="_blank" class="userName">Name: ${data.login}</a>
                    <p class="userType">Type: ${data.type}</p>
                </div>
                <div class="userImage">
                    <a href="https://github.com/${data.login}" target="_blank"><img src="${data.avatar_url}" alt="User"></a>
                </div>
                <div class="userActions">
                    <button class="userDelete">Delete</button>
                </div>
            `;

            userDelete();
            if(!data.login || !userName) {
                user.remove();
                throw new Error('Пользователь не существует');
            }
        })
        .catch(e => console.error(e));
};

addUser.addEventListener('click', () => createUser());
