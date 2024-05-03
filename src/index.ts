import { EventEmitter } from './components/base/events';
import './scss/styles.scss';
import './scss/styles.scss';
import { LarekAPI } from './components/LarekAPI';
import { API_URL, CDN_URL } from './utils/constants';
import { AppState, CatalogLoad, CardItem } from './components/AppData';
import { Page } from './components/Page';
import { ModalItem, CatalogItem, ItemInBasket } from './components/Card';
import { cloneTemplate, createElement, ensureElement } from './utils/utils';
import { Modal } from './components/common/Modal';
import { Basket } from './components/common/Basket';
import { IOrderForm, ICustomerForm } from './types';
import { Contacts, Order } from './components/Order';
import { Card } from './components/Card';
import { Success } from './components/common/Success';
const events = new EventEmitter();
const api = new LarekAPI(CDN_URL, API_URL);

// Чтобы мониторить все события, для отладки
events.onAll(({ eventName, data }) => {
	console.log(eventName, data);
});

// Все шаблоны
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const basketElementTemplate =
	ensureElement<HTMLTemplateElement>('#card-basket');
// const auctionTemplate = ensureElement<HTMLTemplateElement>('#auction');
// const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#bid'); //jest'
// const bidsTemplate = ensureElement<HTMLTemplateElement>('#bids');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
// const tabsTemplate = ensureElement<HTMLTemplateElement>('#tabs');
// const soldTemplate = ensureElement<HTMLTemplateElement>('#sold');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');
// Модель данных приложения
const appData = new AppState({}, events);

// Глобальные контейнеры
const page = new Page(document.body, events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);
const buttonBasket = ensureElement<HTMLTemplateElement>('.header__basket');
// Переиспользуемые части интерфейса
// const bids = new Basket(cloneTemplate(bidsTemplate), events);
const basket = new Basket(cloneTemplate(basketTemplate), events);
const order = new Order(cloneTemplate(orderTemplate), events);
const contacts = new Contacts(cloneTemplate(contactsTemplate), events);
// const tabs = new Tabs(cloneTemplate(tabsTemplate), {
// 	onClick: (name) => {
// 		if (name === 'closed') events.emit('basket:open');
// 		else events.emit('bids:open');
// 	},
// });

buttonBasket.addEventListener('click', () => {
	console.log('basketOpened');
	events.emit('basket:open');
});
// Дальше идет бизнес-логика
// Поймали событие, сделали что нужно

// Изменились элементы каталога
events.on<CatalogLoad>('items:changed', () => {
	page.catalog = appData.catalog.map((item) => {
		const card = new CatalogItem(cloneTemplate(cardCatalogTemplate), {
			onClick: () => events.emit('card:select', item),
		});
		return card.render({
			title: item.title,
			price: item.price,
			image: item.image,
			description: item.about,
		});
	});
});

api
	.getProductList()
	.then(appData.setCatalog.bind(appData))
	.catch((err) => {
		console.error(err);
	});

// Отправлена форма заказа
events.on('contacts:submit', () => {
	console.log(appData.order);

	api
		.orderLots(appData.order)
		.then((result) => {
			const success = new Success(cloneTemplate(successTemplate), {
				onClick: () => {
					modal.close();
					events.emit('auction:changed');
				},
			});

			modal.render({
				content: success.render({}),
			});
		})
		.catch((err) => {
			console.error(err);
		});
});

// // Изменилось одно из полей
events.on(
	/^contacts\..*:change/,
	(data: { field: keyof IOrderForm; value: string }) => {
		appData.setContactsField(data.field, data.value);
	}
);

events.on('formContactsErrors:change', (errors: Partial<ICustomerForm>) => {
	const { email, phone } = errors;
	contacts.valid = !email && !phone;
	contacts.errors = Object.values({ phone, email })
		.filter((i) => !!i)
		.join('; ');
});

// Изменилось одно из полей
events.on(
	/^order\..*:change/,
	(data: { field: keyof ICustomerForm; value: string }) => {
		// console.log('Data', data);
		appData.setOrderField(data.field, data.value);
		console.log(data);
	}
);

events.on(
	/^order\..*:change/,
	(data: { field: keyof ICustomerForm; value: string }) => {
		// console.log('Data', data);
		appData.setPrice(data.field, data.value);
		console.log(data);
	}
);

// Открыть форму заказа
events.on('order:open', () => {
	modal.render({
		content: order.render({
			valid: false,
			address: '',
			errors: [],
		}),
	});
});

events.on('contacts:open', () => {
	modal.render({
		content: contacts.render({
			valid: false,
			phone: '',
			email: '',
			errors: [],
		}),
	});
});

// // Изменилось состояние валидации формы
events.on('formOrderErrors:change', (errors: Partial<ICustomerForm>) => {
	const { address, payment } = errors;
	// console.log('address', address, 'payment', payment);
	if (!address && !payment) {
		order.valid = true;
	} else {
		order.valid = false;
	}
});

events.on('basket:open', () => {
	modal.render({
		content: createElement<HTMLElement>('div', {}, [basket.render({})]),
	});
});

events.on('card:change', () => {
	console.log('b');
});

events.on('card:select', (item: CardItem) => {
	appData.setPreview(item);
});

events.on('preview:changed', (item: CardItem) => {
	const showItem = (item: CardItem) => {
		// const cardTemplate
		const card = new ModalItem(cloneTemplate(cardPreviewTemplate), {
			onClick: () => events.emit('basket:add', item),
		});

		console.log(card, 'card');

		modal.render({
			content: card.render({
				title: item.title,
				price: item.price,
				image: item.image,
				description: item.description.split('\n'),
			}),
		});
	};
	showItem(item);
});

events.on('basket:add', (item) => {
	console.log('auction:change', item);
	appData.addToOrder(item as CardItem);
	page.counter = appData.order.items.length;
	// let total = 0;
	basket.items = appData.order.items.map((item) => {
		basket.totalPrice = appData.getTotal();
		const card = new ItemInBasket(cloneTemplate(basketElementTemplate), {
			onClick: (event) => {
				events.emit('basket:remove', item);
			},
		});
		return card.render({
			title: item.title,
			price: item.price,
			// image: item.image,
		});
	});
	// basket.selected = appData.order.items;
	// basket.totalPrice = total;
});

events.on('basket:remove', (item) => {
	console.log('auction:rem', item);
	appData.removeInOrder(item as CardItem);
	page.counter = appData.order.items.length;
	// let total = 0;
	basket.items = appData.order.items.map((item) => {
		// basket.totalPrice = appData.getTotal();
		const card = new ItemInBasket(cloneTemplate(basketElementTemplate), {
			onClick: (event) => {
				events.emit('basket:remove', item);
			},
		});
		return card.render({
			title: item.title,
			price: item.price,
			// image: item.image,
		});
	});
	basket.totalPrice = appData.getTotal();
	// basket.selected = appData.order.items;
	// basket.totalPrice = total;
});

// Блокируем прокрутку страницы если открыта модалка
events.on('modal:open', () => {
	page.locked = true;
});

// ... и разблокируем
events.on('modal:close', () => {
	page.locked = false;
});
