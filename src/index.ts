import { EventEmitter } from './components/base/events';
import './scss/styles.scss';
import './scss/styles.scss';
import { LarekAPI } from './components/LarekAPI';
import { API_URL, CDN_URL } from './utils/constants';
import { AppState, CatalogLoad, CardItem } from './components/AppData';
import { Page } from './components/Page';
import { Auction, ModalItem, CatalogItem } from './components/Card';
import { cloneTemplate, createElement, ensureElement } from './utils/utils';
import { Modal } from './components/common/Modal';
import { Basket } from './components/common/Basket';
// import { IOrderForm } from './types';
import { Order } from './components/Order';
import { Card } from './components/Card';
const events = new EventEmitter();
const api = new LarekAPI(CDN_URL, API_URL);

// Чтобы мониторить все события, для отладки
events.onAll(({ eventName, data }) => {
	console.log(eventName, data);
});

// Все шаблоны
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
// const auctionTemplate = ensureElement<HTMLTemplateElement>('#auction');
// const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#bid'); //jest'
// const bidsTemplate = ensureElement<HTMLTemplateElement>('#bids');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
// const tabsTemplate = ensureElement<HTMLTemplateElement>('#tabs');
// const soldTemplate = ensureElement<HTMLTemplateElement>('#sold');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
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

buttonBasket.addEventListener('click', () => {
	console.log('a');
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

// // Отправлена форма заказа
// events.on('order:submit', () => {
// 	api
// 		.orderLots(appData.order)
// 		.then((result) => {
// 			const success = new Success(cloneTemplate(successTemplate), {
// 				onClick: () => {
// 					modal.close();
// 					appData.clearBasket();
// 					events.emit('auction:changed');
// 				},
// 			});

// 			modal.render({
// 				content: success.render({}),
// 			});
// 		})
// 		.catch((err) => {
// 			console.error(err);
// 		});
// });

// // Изменилось состояние валидации формы
// events.on('formErrors:change', (errors: Partial<IOrderForm>) => {
// 	const { email, phone } = errors;
// 	order.valid = !email && !phone;
// 	order.errors = Object.values({ phone, email })
// 		.filter((i) => !!i)
// 		.join('; ');
// });

// // Изменилось одно из полей
// events.on(
// 	/^order\..*:change/,
// 	(data: { field: keyof IOrderForm; value: string }) => {
// 		appData.setOrderField(data.field, data.value);
// 	}
// );

// Открыть форму заказа
events.on('order:open', () => {
	modal.render({
		content: order.render({
			phone: '',
			email: '',
			valid: false,
			errors: [],
		}),
	});
});

// // Открыть активные лоты
// events.on('bids:open', () => {
// 	modal.render({
// 		content: createElement<HTMLElement>('div', {}, [
// 			tabs.render({
// 				selected: 'active',
// 			}),
// 			bids.render(),
// 		]),
// 	});
// });

events.on('basket:open', () => {
	modal.render({
		content: createElement<HTMLElement>('div', {}, [basket.render({})]),
	});
});

// // Изменения в лоте, но лучше все пересчитать
// events.on('auction:changed', () => {
// 	page.counter = appData.getClosedLots().length;
// 	bids.items = appData.getActiveLots().map((item) => {
// 		const card = new BidItem(cloneTemplate(cardBasketTemplate), {
// 			onClick: () => events.emit('preview:changed', item),
// 		});
// 		return card.render({
// 			title: item.title,
// 			image: item.image,
// 			status: {
// 				amount: item.price,
// 				status: item.isMyBid,
// 			},
// 		});
// 	});
// 	let total = 0;
// 	basket.items = appData.getClosedLots().map((item) => {
// 		const card = new BidItem(cloneTemplate(soldTemplate), {
// 			onClick: (event) => {
// 				const checkbox = event.target as HTMLInputElement;
// 				appData.toggleOrderedLot(item.id, checkbox.checked);
// 				basket.total = appData.getTotal();
// 				basket.selected = appData.order.items;
// 			},
// 		});
// 		return card.render({
// 			title: item.title,
// 			image: item.image,
// 			status: {
// 				amount: item.price,
// 				status: item.isMyBid,
// 			},
// 		});
// 	});
// 	basket.selected = appData.order.items;
// 	basket.total = total;
// });

events.on('card:change', () => {
	console.log('b');
});

events.on('card:select', (item: CardItem) => {
	appData.setPreview(item);
});

events.on('preview:changed', (item: CardItem) => {
	const showItem = (item: CardItem) => {
		// const cardTemplate
		console.log('card');
		const card = new ModalItem(cloneTemplate(cardPreviewTemplate));

		// const buttonToBasket = ensureElement<HTMLTemplateElement>('.card__button');
		// buttonToBasket.addEventListener('click', () => {
		// 	console.log('a');
		// });

		// const auction = new Auction(cloneTemplate(auctionTemplate), {
		// 	onSubmit: (price) => {
		// 		item.placeBid(price);
		// 		auction.render({
		// 			status: item.status,
		// 			time: item.timeStatus,
		// 			label: item.auctionStatus,
		// 			nextBid: item.nextBid,
		// 			history: item.history,
		// 		});
		// 	},
		// });

		console.log(card, 'card');

		modal.render({
			content: card.render({
				title: item.title,
				price: item.price,
				image: item.image,
				description: item.description.split('\n'),
			}),
		});

		// if (item) {
		// 	api
		// 		.getCardItem(item.id)
		// 		.then((result) => {
		// 			item.description = result.description;
		// 			item.history = result.history;
		// 			showItem(item);
		// 		})
		// 		.catch((err) => {
		// 			console.error(err);
		// 		});
		// } else {
		// 	modal.close();
		// }
	};
	showItem(item);
});

// Блокируем прокрутку страницы если открыта модалка
events.on('modal:open', () => {
	page.locked = true;
});

// ... и разблокируем
events.on('modal:close', () => {
	page.locked = false;
});

// // Получаем лоты с сервера
// api
// 	.getLotList()
// 	.then(appData.setCatalog.bind(appData))
// 	.catch((err) => {
// 		console.error(err);
// 	});
