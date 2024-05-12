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
MVP паттерн

Описать функционал и флоу пользователя в общих чертах:
Представлен сайт-магазин. На главной странице имеется каталог товаров, у каждого имеется цена, при нажатии на товар открывается модалка с описанием товара и возможностью добавления товара в корзину. Так же имеется "корзинка". Когда пользователь выбрал подходящие товары, он может нажать на корзину и откроется первое модальное окно со списком товаров, ценником товаров(выбранных) и итоговой ценой. пользователь может закрыть эту вкладку и вернуться на главную страницу, либо нажать кнопку оформить. При нажатии на кнопку оформить открывается следующее окно на котором есть способы оплаты и адрес доставки. Если пользователь все заполнил кнопка далее разблокируется, если нет - высветится ошибка. При нажатии на кнопку далее будет переход - на следующем окне будет email, телефон -валидация - кнопка оплатить разблокируется - переход на следующее окно - заказ оформлен.

класс API - отправляет данные на сервер, получает данные с сервера.( presenter)
конструктор принимает: baseUrl: string - это ссылка на сервер.
options: RequestInit = {} - это структура запроса
методы:order, getProductList, getProductInfo

Класс EventEmitter
Реализует паттерн «Наблюдатель» и позволяет подписываться на события и уведомлять подписчиков
о наступлении события.
Класс имеет методы on , off , emit — для подписки на событие, отписки от события и уведомления
подписчиков о наступлении события соответственно.
методы onAll и offAll — для подписки на все события и сброса всех
подписчиков.
метод trigger, генерирующий заданное событие с заданными
аргументами. Это позволяет передавать его в качестве обработчика события в другие классы.

abstract class Component Базовый компонент
класс для работы с DOM в дочерних компонентах
методы:
toggleClass setText setDisabled setHidden setVisible setImage render

abstract class Model Базовая модель

класс Basket extends Component (view)
имя товара, цена, массив карточек
конструктор принимает: container: HTMLElement - это родительский html элемент
protected events: EventEmitter - брокер событий
методы:
set items - товары в корзине
set totalPrice - цена товаров в корзине
set valid - валидация

class Form extends Component(view)
конструктор принимает:HTMLFormElement, protected events: IEvents
методы:set errors, render - ошибки валидации

class Modal extends Component(view)
конструктор принимает:container: HTMLElement, protected events: IEvents
методы: set content - заполнение модального окна

class Success extends Component(view)
конструктор принимает:container: HTMLElement, actions: ISuccessActions
методы: set totalPrice -конечная цена оформленных товаров

class CardItem extends Model(model)
класс описывает данные о товаре

class AppState extends Model
класс описывающий модель данных (model)
методы:addToOrder, removeInOrder, getTotal, setCatalog, setPreview, setContactsField, setPrice, setItemsIds,validateContacts, setOrderField, validateOrder

class Card extends Component(view)
класс для работы с html элементами(карточкой)
методы: set id, get id, set title, get title, set image, set price, set description

class CatalogItem extends Card каталог карточек на странице

class ModalItem extends Card(view)
класс для отрисовки модального окна
методы:set status

ItemInBasket extends Component(view)
класс для отображения карточки в корзине
конструктор принимает:container: HTMLElement, actions?: ICardActions
методы:set id, get id, set title, set price, set description

class LarekAPI extends Api(presenter)
получение\отправка данных на сервер
getProductList, getProductItem, orderLots

class Order extends Form(view)
класс для отображения модального окна с данными пользователя
конструктор принимает: container: HTMLFormElement, events: IEvents
методы:set card, set cash, set address, set valid

class Contacts extends Form(view)
класс для отображения модального окна с данными пользователя
конструктор принимает:container: HTMLFormElement, events: IEvents
методы: set valid, set phone,set email,set address

class Page extends Component(view)
класс для отображение главной страницы
конструктор принимает: container: HTMLElement, protected events: IEvents
методы:set counter, set catalog, set locked
