# Finance Tracker

Finance Tracker — это веб-приложение для управления личными финансами. Оно позволяет пользователям регистрироваться, добавлять доходы и расходы, отслеживать баланс и управлять своими финансами через удобный интерфейс.

## 🚀 Деплой

Проект развернут на [Render/Railway/Replit] (добавь ссылку на деплой).

## 🔧 Установка и запуск

### 1. Клонирование репозитория
Сначала необходимо склонировать репозиторий и перейти в его директорию:
```sh
git clone https://github.com/killrtmrn242/financeTracker.git
cd financeTracker
```

### 2. Установка зависимостей
Для установки всех необходимых зависимостей выполните:
```sh
npm install
```

### 3. Настройка переменных окружения
Создайте `.env` файл в корневой директории и добавьте следующие переменные окружения:
```sh
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

### 4. Запуск сервера
Для запуска проекта в режиме разработки используйте команду:
```sh
npm start
```

## 📌 Функционал

🔹 Регистрация и вход пользователей (с использованием JWT)  
🔹 Добавление доходов и расходов  
🔹 Удаление транзакций  
🔹 Просмотр списка транзакций  
🔹 Динамическое обновление интерфейса  
🔹 Поддержка работы с базой данных MongoDB  

## 📂 Структура проекта

```
financeTracker/
│-- backend/               # Серверная часть (Node.js, Express.js)
│   ├── models/            # Модели MongoDB
│   ├── routes/            # Маршруты API
│   ├── server.js          # Основной файл сервера
│-- frontend/              # Клиентская часть (HTML, CSS, JS)
│   ├── index.html         # Главная страница
│   ├── script.js          # Логика клиентской части
│   ├── style.css          # Стили
│-- .env                   # Файл конфигурации (не загружается в Git)
│-- package.json           # Список зависимостей
```

## 🔗 API Эндпоинты

| Метод  | URL | Описание |
|--------|------------------|--------------------------------|
| POST   | `/api/auth/register` | Регистрация пользователя |
| POST   | `/api/auth/login` | Авторизация пользователя |
| GET    | `/api/transactions` | Получение всех транзакций |
| POST   | `/api/transactions` | Добавление новой транзакции |
| DELETE | `/api/transactions/:id` | Удаление транзакции |

## 🛠️ Используемые технологии
- **Backend:** Node.js, Express.js, MongoDB
- **Frontend:** HTML, CSS, JavaScript
- **Аутентификация:** JSON Web Tokens (JWT)
- **Деплой:** Render

## 📜 Лицензия

Проект распространяется под MIT License.

