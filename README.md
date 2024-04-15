# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:

- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:

- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/styles/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск

Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```

## Сборка

```
npm run build
```

или

```
yarn build
```

Базовый код

класс API - отправляет данные на сервер, получает данные с сервера.
конструктор принимает: baseUrl: string - это ссылка на сервер.
options: RequestInit = {} - это структура запроса
методы:order, getProductList, getProductInfo

класс windowUI - отрисовка элементов страницы
методы: render - добавление элемента на страницу

Класс EventEmitter
Реализует паттерн «Наблюдатель» и позволяет подписываться на события и уведомлять подписчиков
о наступлении события.
Класс имеет методы on , off , emit — для подписки на событие, отписки от события и уведомления
подписчиков о наступлении события соответственно.
методы onAll и offAll — для подписки на все события и сброса всех
подписчиков.
метод trigger, генерирующий заданное событие с заданными
аргументами. Это позволяет передавать его в качестве обработчика события в другие классы.

класс Basket
имя товара, цена, массив карточек
конструктор принимает: container: HTMLElement - это родительский html элемент
protected events: EventEmitter - брокер событий

класс customer - покупатель
payment,adress,mail,phone
container: HTMLFormElement - это родительский html элемент
events: IEvents - события

<!-- класс page
card[ ] -->

класс Card
имя товара, категория, цена, картинка, описание товара

конструктор принимает: protected blockName: string - имя элемента
container: HTMLElement - это родительский html элемент
actions?: ICardActions - действие по клику

модальные окна?