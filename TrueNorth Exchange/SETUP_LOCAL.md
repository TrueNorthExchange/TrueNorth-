# Локальная установка TrueNorth Exchange

## Способ 1: Скачивание через Bolt

1. В интерфейсе Bolt нажмите кнопку "Download" или "Export"
2. Выберите "Download as ZIP"
3. Распакуйте архив в нужную папку на вашем ПК

## Способ 2: Клонирование через Git

### Предварительные требования
- Node.js 18+ ([скачать здесь](https://nodejs.org/))
- Git ([скачать здесь](https://git-scm.com/))

### Шаги установки

1. **Откройте терминал/командную строку** в папке, где хотите сохранить проект

2. **Создайте новую папку для проекта:**
```bash
mkdir truenorth-exchange
cd truenorth-exchange
```

3. **Инициализируйте Git репозиторий:**
```bash
git init
```

4. **Создайте файлы проекта** (скопируйте все файлы из Bolt)

5. **Установите зависимости:**
```bash
npm install
```

6. **Настройте переменные окружения:**
```bash
cp .env.example .env
```

7. **Отредактируйте файл .env** и добавьте ваши Supabase credentials:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

8. **Запустите проект:**
```bash
npm run dev
```

## Способ 3: Ручное создание файлов

Если у вас нет Git, создайте папку проекта и скопируйте файлы вручную:

### Структура папок:
```
truenorth-exchange/
├── public/
│   └── 0001.png
├── src/
│   ├── components/
│   │   └── OrderDetailsPage.tsx
│   ├── lib/
│   │   └── supabase.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── package.json
├── vite.config.ts
├── tailwind.config.js
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
├── postcss.config.js
├── eslint.config.js
├── .env.example
├── .gitignore
├── README.md
└── LICENSE
```

### После создания файлов:

1. **Откройте терминал в папке проекта**
2. **Установите зависимости:**
```bash
npm install
```
3. **Настройте .env файл**
4. **Запустите проект:**
```bash
npm run dev
```

## Проверка установки

После успешной установки:
- Проект должен открыться в браузере по адресу `http://localhost:5173`
- Вы должны увидеть главную страницу TrueNorth Exchange
- Все функции должны работать корректно

## Возможные проблемы

### Ошибка "command not found"
- Убедитесь, что Node.js установлен: `node --version`
- Убедитесь, что npm установлен: `npm --version`

### Ошибки с зависимостями
```bash
# Очистите кэш и переустановите
rm -rf node_modules package-lock.json
npm install
```

### Проблемы с Supabase
- Проверьте правильность URL и ключей в .env файле
- Убедитесь, что Supabase проект активен

## Полезные команды

```bash
# Запуск в режиме разработки
npm run dev

# Сборка для продакшена
npm run build

# Предварительный просмотр сборки
npm run preview

# Проверка кода
npm run lint
```