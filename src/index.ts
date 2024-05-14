import { EventEmitter } from './components/base/events';
import './scss/styles.scss';
import './scss/styles.scss';
import { LarekAPI } from './components/LarekAPI';
import { API_URL, CDN_URL } from './utils/constants';
import {
	AppState,
	CatalogLoad,
	// ICard,
	ItemOrder,
} from './components/AppData';
import { Page } from './components/Page';
import { ModalItem, CatalogItem, ItemInBasket } from './components/Card';
import {
	cloneTemplate,
	createElement,
	ensureElement,
	formatNumber,
} from './utils/utils';
import { ModalSuccess, Modal } from './components/common/Modal';
import { Basket } from './components/common/Basket';
import { IOrderForm, ICustomerForm, ICard } from './types';
import { Contacts, Order } from './components/Order';
import { Success } from './components/common/Success';
const events = new EventEmitter();
const api = new LarekAPI(CDN_URL, API_URL);

const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const basketElementTemplate =
	ensureElement<HTMLTemplateElement>('#card-basket');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');

const appData = new AppState({}, events);

const page = new Page(document.body, events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);
const modalSuccess = new ModalSuccess(
	ensureElement<HTMLElement>('#model__container_success'),
	events
);

const buttonBasket = ensureElement<HTMLTemplateElement>('.header__basket');
const basket = new Basket(cloneTemplate(basketTemplate), events);
const order = new Order(cloneTemplate(orderTemplate), events);
const contacts = new Contacts(cloneTemplate(contactsTemplate), events);

buttonBasket.addEventListener('click', () => {
	events.emit('basket:open');
});

events.on<CatalogLoad>('items:changed', () => {
	page.catalog = appData.catalog.map((item) => {
		const card = new CatalogItem(cloneTemplate(cardCatalogTemplate), {
			onClick: () => events.emit('card:select', item),
		});
		return card.render({
			title: item.title,
			price: item.price,
			category: item.category,
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

events.on('contacts:submit', () => {
	const data = {
		payment: appData.order.payment,
		address: appData.order.address,
		email: appData.order.email,
		phone: appData.order.phone,
		total: appData.order.total,
		items: appData.order.itemsIds,
	};
	api
		.orderLots(data)
		.then((result) => {
			modal.close();
			const success = new Success(cloneTemplate(successTemplate), {
				onClick: () => {
					modalSuccess.close();
					events.emit('basket:clear');
				},
			});
			success.totalPrice = appData.getTotal();
			modalSuccess.render({
				content: success.render({}),
			});
		})
		.catch((err) => {
			console.error(err);
		});
});

events.on('basket:clear', () => {
	appData.order = {
		payment: '',
		address: '',
		email: '',
		phone: '',
		total: 0,
		items: [],
		itemsIds: [],
	};
	basket.items = [];
	basket.totalPrice = 0;
	page.counter = 0;
	events.emit('auction:changed');
});

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

events.on(
	/^order\..*:change/,
	(data: { field: keyof ICustomerForm; value: string }) => {
		appData.setOrderField(data.field, data.value);
	}
);

events.on('order:open', () => {
	appData.setPrice(appData.getTotal());
	appData.setItemsIds();
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

events.on('formOrderErrors:change', (errors: Partial<ICustomerForm>) => {
	const { address, payment } = errors;
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
	if (appData.getTotal() <= 0) {
		basket.valid = false;
	} else {
		basket.valid = true;
	}
});

events.on('card:select', (item: ICard) => {
	appData.setPreview(item);
});

events.on('preview:changed', (item: ICard) => {
	const showItem = (item: ICard) => {
		const card = new ModalItem(cloneTemplate(cardPreviewTemplate), {
			onClick: () => events.emit('basket:add', item),
		});

		modal.render({
			content: card.render({
				title: item.title,
				price: item.price,
				image: item.image,
				category: item.category,
				description: item.description.split('\n'),
			}),
		});
	};
	showItem(item);
});

events.on('basket:change', (item) => {
	page.counter = appData.order.items.length;
	basket.totalPrice = appData.getTotal();
	basket.items = appData.order.items.map((item) => {
		const card = new ItemInBasket(cloneTemplate(basketElementTemplate), {
			onClick: (event) => {
				events.emit('basket:remove', item);
			},
		});
		return card.render({
			title: item.title,
			price: item.price,
		});
	});
});

events.on('basket:add', (item) => {
	appData.addToOrder(item as ICard);
	events.emit('basket:change', item);
});

events.on('basket:remove', (item) => {
	appData.removeInOrder(item as ICard);
	events.emit('basket:change', item);

	if (appData.getTotal() <= 0) {
		basket.valid = false;
	} else {
		basket.valid = true;
	}
});

events.on('modal:open', () => {
	page.locked = true;
});

events.on('modal:close', () => {
	page.locked = false;
});
