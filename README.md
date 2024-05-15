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
- src/scss/styles.scss — корневой файл стилей
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
MVP паттерн

Описать функционал и флоу пользователя в общих чертах:
Представлен сайт-магазин. На главной странице имеется каталог товаров, у каждого имеется цена, при нажатии на товар открывается модалка с описанием товара и возможностью добавления товара в корзину. Так же имеется "корзинка". Когда пользователь выбрал подходящие товары, он может нажать на корзину и откроется первое модальное окно со списком товаров, ценником товаров(выбранных) и итоговой ценой. пользователь может закрыть эту вкладку и вернуться на главную страницу, либо нажать кнопку оформить. При нажатии на кнопку оформить открывается следующее окно на котором есть способы оплаты и адрес доставки. Если пользователь все заполнил кнопка далее разблокируется, если нет - высветится ошибка. При нажатии на кнопку далее будет переход - на следующем окне будет email, телефон -валидация - кнопка оплатить разблокируется - переход на следующее окно - заказ оформлен.

класс API - Базовый класс для работы с API, реализует методы для выполнения HTTP-запросов к переданному базовуму URL.
constructor(baseUrl: string, options: RequestInit = {}) - принимает базовый URL и глобальные опции для всех запросов(опционально).
options: RequestInit = {} - это структура запроса
Методы:

- `handleResponse` - отрабатывает ответы от сервера, преобразуя их в json и управляя ошибками.
- `get` - выполняет GET запросы к предоставленному URL.
- `post` - выполняет запрос к API с использованием предоставленного метода(POST|PUT|DELETE) и предоставленными данными.

class LarekAPI extends Api implements ILarekAPI получение\отправка данных на сервер
constructor(cdn: string, baseUrl: string, options?: RequestInit) принимает базовый URL и глобальные опции для всех запросов(опционально).
методы:
`getProductList` -получение списка товаров с сервера
`getProductItem` - получение каждого конкретного товара с сервера
`orderLots` отправка товаров в корзине на сервер

Класс EventEmitter
Реализует паттерн «Наблюдатель» и позволяет подписываться на события и уведомлять подписчиков
о наступлении события.
Класс имеет методы on , off , emit — для подписки на событие, отписки от события и уведомления
подписчиков о наступлении события соответственно.
методы onAll и offAll — для подписки на все события и сброса всех
подписчиков.
метод trigger, генерирующий заданное событие с заданными
аргументами. Это позволяет передавать его в качестве обработчика события в другие классы.

abstract class Component<T> Базовый компонент (html элемент)
protected constructor(protected readonly container: HTMLElement) - принимает html элемент
класс для работы с DOM в дочерних компонентах
методы:
`toggleClass` - убрать/добавить класс
`setText` установить текст
`setDisabled` дизейбл
`setHidden` убрать видимость элемента
`setVisible` сделать элемент видимым
`setImage` установить изображение и описание
`render` отрисовка

abstract class Model<T> Базовый класс модели данных
constructor(data: Partial<T>, protected events: IEvents) - получает данные, брокер событий
методы:
`emitChanges` - метод сообщающий об изменениях

класс Basket extends Component (view)
имя товара, цена, массив карточек
constructor(container: HTMLElement, protected events: EventEmitter)
container: HTMLElement - это родительский html элемент
protected events: EventEmitter - брокер событий
сеттеры:
`set items` - товары в корзине
`set totalPrice` - цена товаров в корзине
`set valid` - валидация

class Form<T> extends Component<IFormState>(view)
constructor(protected container: HTMLFormElement, protected events: IEvents) - принимает html форму, брокер событий

методы:
`set errors` ошибки валидации
`render` -отрисовка

class Modal extends Component<IModalData>(view)
constructor(container: HTMLElement, protected events: IEvents) - принимает html элемент, брокер событий
методы:
`open` -открытие модалки
`close` - закрытие модалки
`render` отрисовка
`set content` - заполнение модального окна

class ModalSuccess extends Component<IModalData>
constructor(container: HTMLElement, protected events: IEvents) принимает html элемент, брокер событий
методы:
`open` -открытие модалки с отправкой данных
`close` - закрытие модалки
`render` отрисовка
`set content` - заполнение модального окна

class Success extends Component(view)
constructor(container: HTMLElement, actions: ISuccessActions) принимает html элемент, обработчик события
сеттер: `set totalPrice` -конечная цена оформленных товаров

class AppState extends Model<IAppState>
класс описывающий модель данных (model)
методы:
`addToOrder` - добавление в корзину
`removeInOrder`- удаление из корзины
`getTotal`-итоговая цена
`setCatalog`-товары в корзине
`setPreview`- показать превью карточки товара
`setContactsField`- номер телефона
`setPrice`- цена товара
`setItemsIds`- id товара
`validateContacts`- валидация телефона\почты
`setOrderField`- сеттер поля заказа
`validateOrder`- валидация способа оплаты и адреса пользователя

class Card<T> extends Component<ICard<T>>(view) класс для работы с html элементами(карточкой)
constructor(protected blockName: string, container: HTMLElement,actions?: ICardActions) конструктор принимает: имя блока, html элемент, обработчик события

методы:
`set category` - категория товара
`set id` - id товара
`get id` - id товара
`set title` - название товара
` get title` - название товара
`set image` - изображение
`set price` цена товара
`set description` описание товара

class ModalItem extends Card(view) класс для отрисовки модального окна
constructor(container: HTMLElement, actions?: ICardActions) принимает html элемент, обработчик события

class ItemInBasket<T> extends Component<ICard<T>> (view)
класс для отображения карточки в корзине
constructor(container: HTMLElement, actions?: ICardActions) принимает html элемент, обработчик события
сеттеры:
`set id` установка id карточки в корзине
`get id` получение id карточки в корзине
`set title` название товара в корзине
`set price` цена товара в корзине
`set description` описание товара в корзине

class Order extends Form<ICustomerForm> (view) класс для отображения модального окна с данными пользователя
constructor(container: HTMLFormElement, events: IEvents) принимает html элемент, брокер событий

сеттеры:
`set card` - способ оплаты картой
`set cash` - способ оплаты наличными
`set address` - адрес пользователя
`set valid` - валидация

class Contacts extends Form<ICustomerForm> (view)
класс для отображения модального окна с данными пользователя
конструктор принимает:container: HTMLFormElement, events: IEvents
конструктор принимает html элемент, брокер событий
сеттеры:
`set valid` - валидация
`set phone` - номер телефона
`set email` почта
`set address` адрес пользователя

class Page extends Component<IPage> (view)
класс для отображение главной страницы
constructor(container: HTMLElement, protected events: IEvents)
конструктор принимает html элемент, брокер событий
сеттеры :
`set counter` счетчик товаров в корзине
`set catalog` каталог товаров
`set locked` прокрутка страницы

//корзинка
export interface IBasketView {
items: HTMLElement[];
total: number;
}

//customer

export interface ICustomerForm {
address: string;
email: string;
phone: string;
payment: string;
}

export interface IOrder extends ICustomerForm {
items: ICard[];
total: number;
itemsIds: string[];
// item: number;
}

export interface IOrderForm {
email: string;
phone: string;
}
export interface IOrderResult {
id: string;
}

export interface IPageView {
counter: number;
catalog: HTMLElement[];
}

export interface IModalData {
content: HTMLElement;
}

export type ICard = {
about: string;
category: string;
description: string;
id: string;
image: string;
title: string;
price: number;
};

export type FormErrors = Partial<Record<keyof ICustomerForm, string>>;

export interface IAppState {
catalog: ICard[];
basket: string[];
payment: string;
order: IOrder | null;
}
