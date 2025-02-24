const API_URL = "http://localhost:5000/api";

// Переключение между входом и регистрацией
function toggleRegister() {
  const registerFields = document.getElementById("register-fields");
  const isRegistering = registerFields.style.display === "none";
  const registerBtn = document.getElementById("register-btn");

  registerFields.style.display = isRegistering ? "block" : "none";
  document.getElementById("auth-title").textContent = isRegistering ? "Регистрация" : "Вход";
  document.getElementById("login-btn").style.display = isRegistering ? "none" : "inline-block";

  registerBtn.textContent = isRegistering ? "Зарегистрироваться" : "Регистрация";
  registerBtn.setAttribute("onclick", isRegistering ? "register()" : "toggleRegister()");
}

// Регистрация
async function register() {
  const username = document.getElementById("username")?.value.trim();
  const password = document.getElementById("password")?.value.trim();
  const confirmPassword = document.getElementById("confirm-password")?.value.trim();

  if (!username || !password || !confirmPassword) {
    alert("❌ Заполните все поля!");
    return;
  }

  if (password !== confirmPassword) {
    alert("❌ Пароли не совпадают!");
    return;
  }

  console.log("📤 Отправка запроса на регистрацию:", { username, password });

  try {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    console.log("📥 Ответ сервера:", response.status);
    const data = await response.json();
    console.log("📥 Ответ сервера (данные):", data);

    if (response.ok) {
      alert("✅ Регистрация успешна! Теперь войдите.");
      toggleRegister();
    } else {
      alert("❌ Ошибка: " + (data.message || "Неизвестная ошибка"));
    }
  } catch (error) {
    console.error("❌ Ошибка запроса:", error);
    alert("❌ Ошибка при отправке запроса!");
  }
}

// Вход
async function login() {
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!username || !password) {
    alert("❌ Заполните все поля!");
    return;
  }

  console.log("📤 Отправка запроса на вход:", { username, password });

  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();
    
    if (response.ok) {
      localStorage.setItem("token", data.token);
      showDashboard();
    } else {
      alert(data.message || "Ошибка входа");
    }
  } catch (error) {
    console.error("❌ Ошибка при входе:", error);
    alert("❌ Ошибка при входе");
  }
}

// Обновление логина (смена username)
async function updateUserName() {
  const newUsername = document.getElementById("new-username").value.trim();
  if (!newUsername) {
    alert("❌ Введите новый логин");
    return;
  }

  const token = localStorage.getItem("token");
  if (!token) {
    alert("❌ Вы не авторизованы");
    return;
  }

  try {
    const response = await fetch(`${API_URL}/auth/update-username`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({ newUsername }),
    });

    const data = await response.json();
    if (response.ok) {
      alert("✅ Логин успешно изменён: " + data.username);
      // Обновляем отображение логина в кабинете
      document.getElementById("profile-username").textContent = data.username;
      document.getElementById("new-username").value = "";
    } else {
      alert("❌ Ошибка: " + data.message);
    }
  } catch (error) {
    console.error("❌ Ошибка обновления логина:", error);
    alert("❌ Ошибка при обновлении логина");
  }
}

// Функция для переключения видимости формы смены логина
function toggleUpdateUsername() {
    const form = document.getElementById("update-username-form");
    if (form.style.display === "none" || form.style.display === "") {
      form.style.display = "block";
    } else {
      form.style.display = "none";
    }
  }
  
  // Функция для отправки запроса на обновление логина
  async function updateUserName() {
    const newUsername = document.getElementById("new-username").value.trim();
    if (!newUsername) {
      alert("❌ Введите новый логин");
      return;
    }
  
    const token = localStorage.getItem("token");
    if (!token) {
      alert("❌ Вы не авторизованы");
      return;
    }
  
    try {
      const response = await fetch(`${API_URL}/auth/update-username`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ newUsername })
      });
  
      const data = await response.json();
      if (response.ok) {
        alert("✅ Логин успешно изменён: " + data.username);
        // Обновляем отображаемый логин
        document.getElementById("profile-username").textContent = data.username;
        // Скрываем форму смены логина и очищаем поле
        document.getElementById("update-username-form").style.display = "none";
        document.getElementById("new-username").value = "";
      } else {
        alert("❌ Ошибка: " + data.message);
      }
    } catch (error) {
      console.error("❌ Ошибка обновления логина:", error);
      alert("❌ Ошибка при обновлении логина");
    }
  }
  

// Отобразить личный кабинет
async function showDashboard() {
  document.getElementById("auth").style.display = "none";
  document.getElementById("dashboard").style.display = "block";

  const token = localStorage.getItem("token");
  if (!token) {
    document.getElementById("auth").style.display = "block";
    document.getElementById("dashboard").style.display = "none";
    return;
  }

  try {
    const response = await fetch(`${API_URL}/users/profile`, {
      method: "GET",
      headers: { "Authorization": `Bearer ${token}` },
    });
    const data = await response.json();
    if (response.ok) {
      document.getElementById("profile-username").textContent = data.username;
      loadTransactions();
    } else {
      logout();
    }
  } catch (error) {
    console.error("❌ Ошибка при загрузке профиля:", error);
    logout();
  }
}

// Добавление транзакции
async function addTransaction() {
  const token = localStorage.getItem("token");
  const amount = document.getElementById("amount").value;
  const type = document.getElementById("type").value;
  const category = document.getElementById("category").value;

  if (!amount || !category) {
    alert("❌ Заполните все поля!");
    return;
  }

  try {
    const response = await fetch(`${API_URL}/transactions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({ amount, type, category }),
    });

    if (response.ok) {
      loadTransactions();
    } else {
      alert("❌ Ошибка при добавлении транзакции");
    }
  } catch (error) {
    console.error("❌ Ошибка при добавлении транзакции:", error);
    alert("❌ Ошибка при добавлении транзакции");
  }
}

async function deleteTransaction(transactionId) {
  const token = localStorage.getItem("token");
  if (!token) {
    alert("❌ Вы не авторизованы");
    return;
  }
  try {
    const response = await fetch(`${API_URL}/transactions/${transactionId}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    });
    const data = await response.json();
    if (response.ok) {
      alert("✅ Транзакция удалена");
      loadTransactions(); // Обновляем список транзакций
    } else {
      alert("❌ Ошибка: " + data.message);
    }
  } catch (error) {
    console.error("❌ Ошибка при удалении транзакции:", error);
    alert("❌ Ошибка при удалении транзакции");
  }
}


// Загрузка транзакций
async function loadTransactions() {
  const token = localStorage.getItem("token");
  try {
    const response = await fetch(`${API_URL}/transactions`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    });
    const data = await response.json();
    if (response.ok) {
      const transactionsList = document.getElementById("transactions");
      transactionsList.innerHTML = "";
      
      let totalIncome = 0;
      let totalExpense = 0;
      
      data.forEach(tx => {
        const li = document.createElement("li");
        li.textContent = `${tx.type === "income" ? "➕" : "➖"} ${tx.amount} руб. - ${tx.category}`;
        
        // Добавляем кнопку для удаления
        const delBtn = document.createElement("button");
        delBtn.textContent = "Удалить";
        delBtn.style.marginLeft = "10px";
        delBtn.onclick = () => deleteTransaction(tx._id);
        li.appendChild(delBtn);
        transactionsList.appendChild(li);
        
        // Считаем доходы и расходы
        if (tx.type === "income") {
          totalIncome += tx.amount;
        } else {
          totalExpense += tx.amount;
        }
      });
      
      const balance = totalIncome - totalExpense;
      
      document.getElementById("total-income").textContent = `Доход: ${totalIncome} руб.`;
      document.getElementById("total-expense").textContent = `Расход: ${totalExpense} руб.`;
      document.getElementById("balance").textContent = `Баланс: ${balance} руб.`;
      
    } else {
      alert("Ошибка загрузки транзакций: " + data.message);
    }
  } catch (error) {
    console.error("❌ Ошибка при загрузке транзакций:", error);
    alert("❌ Ошибка при загрузке транзакций");
  }
}


// Выход
function logout() {
  localStorage.removeItem("token");
  document.getElementById("auth").style.display = "block";
  document.getElementById("dashboard").style.display = "none";
}

window.onload = showDashboard;
