# Славянский круг — гид по славянским мифологиям

Учебное React-приложение в формате энциклопедии: каталог статей, карточки персонажей, поиск, избранное, редактирование, статистика и импорт JSON.

## Запуск
```bash
npm install
npm run dev
```
Production-сборка: `npm run build`.

## Технологии
React, TypeScript, Vite, React Router, Redux Toolkit. Данные демонстрационные; сервер не используется.

## Маршруты (18)
`/`, `/encyclopedia`, `/article/:id`, `/create`, `/edit/:id`, `/statistics`, `/deities`, `/spirits`, `/rituals`, `/regions`, `/favorites`, `/search`, `/about`, `/import`, `/concepts`, `/characters`, `/timeline`, `/guide`.

## Действия пользователя
Поиск, фильтрация по разделам, сортировка, открытие статьи, добавление в избранное, создание, редактирование, удаление, экспорт и импорт JSON (действий больше девяти).
