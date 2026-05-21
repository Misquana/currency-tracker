function delay(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

async function fetchUser(id) {
    const response = await fetch(`https://jsonplaceholder.typicode.com/users/${id}`);
    const user = await response.json();
    return user;
}

async function main() {
    console.log("Старт");
    
    await delay(1000);
    console.log("Прошла секунда");
    
    await delay(2000);
    console.log("Готово");
}

   try {
        const user = await fetchUser(1);
        console.log(`Имя: ${user.name}`);
        console.log(`Email: ${user.email}`);
    } catch (error) {
        console.log(`Не удалось получить пользователя: ${error.message}`);
    }

main()