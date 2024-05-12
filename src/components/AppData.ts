import { Model } from './base/Model';
import { FormErrors, IAppState, ICard, IOrder, ICustomerForm } from '../types';

export type CatalogLoad = {
	catalog: CardItem[];
};

export class CardItem extends Model<ICard> {
	about: string;
	description: string;
	id: string;
	image: string;
	title: string;
	price: number;
}

export class AppState extends Model<IAppState> {
	basket: string[];
	catalog: CardItem[];
	order: IOrder = {
		payment: '',
		address: '',
		email: '',
		phone: '',
		total: 0,
		items: [],
		itemsIds: [],
	};
	preview: string | null;
	formErrors: FormErrors = {};

	addToOrder(item: CardItem) {
		this.order.items.push(item);
	}

	removeInOrder(item: CardItem) {
		let index = this.order.items.indexOf(item);
		this.order.items.splice(index, 1);
	}

	// removeALL(item: CardItem) {
	// 	this.removeALL
	// }
	// clearBasket() {
	//     this.order.items.forEach(id => {
	//         this.order.find(it => it.id === id);
	//     });
	// }

	getTotal() {
		return this.order.items.reduce((a, c) => a + c.price, 0);
	}

	setCatalog(items: CardItem[]) {
		this.catalog = items.map((item) => new CardItem(item, this.events));
		this.emitChanges('items:changed', { catalog: this.catalog });
	}

	setPreview(item: CardItem) {
		this.preview = item.id;
		this.emitChanges('preview:changed', item);
	}

	setContactsField(field: keyof ICustomerForm, value: string) {
		this.order[field] = value;

		if (this.validateContacts()) {
			this.events.emit('order:ready', this.order);
		}
	}

	setPrice(value: number) {
		this.order.total = value;
	}

	setItemsIds() {
		this.order.items;
		let i = 0;
		for (i = 0; i < this.order.items.length; i++) {
			if (this.order.items[i].price == null) {
				continue;
			}
			this.order.itemsIds.push(this.order.items[i].id);
		}
		// console.log(this.order, 'order');
	}

	validateContacts() {
		const errors: typeof this.formErrors = {};
		if (!this.order.email) {
			errors.email = 'Необходимо указать email';
		}
		if (!this.order.phone) {
			errors.phone = 'Необходимо указать телефон';
		}
		this.formErrors = errors;
		this.events.emit('formContactsErrors:change', this.formErrors);
		return Object.keys(errors).length === 0;
	}
	setOrderField(field: keyof ICustomerForm, value: string) {
		this.order[field] = value;

		if (this.validateOrder()) {
			this.events.emit('order:ready', this.order);
		}
	}

	validateOrder() {
		const errors: typeof this.formErrors = {};
		if (!this.order.address) {
			errors.address = 'Необходимо указать адрес';
		}
		if (!this.order.payment) {
			errors.payment = 'Необходимо указать способ оплаты';
		}
		this.formErrors = errors;
		this.events.emit('formOrderErrors:change', this.formErrors);
		return Object.keys(errors).length === 0;
	}
}
export interface ItemOrder {
	payment: string;
	address: string;
	email: string;
	phone: string;
	total: number;
	items: string[];
}
