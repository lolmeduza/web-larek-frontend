import { Model } from './base/Model';
import { FormErrors, IAppState, ICard, IOrder, ICustomerForm } from '../types';

export type CatalogLoad = {
	catalog: ICard[];
};

export class AppState extends Model<IAppState> {
	basket: string[];
	catalog: ICard[];
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

	addToOrder(item: ICard) {
		this.order.items.push(item);
		this.setItemsIds();
	}

	removeInOrder(item: ICard) {
		const index = this.order.items.indexOf(item);
		this.order.items.splice(index, 1);
	}

	getTotal() {
		return this.order.items.reduce((a, c) => a + c.price, 0);
	}

	setCatalog(items: ICard[]) {
		this.catalog = items;
		this.emitChanges('items:changed', { catalog: this.catalog });
	}

	setPreview(item: ICard) {
		this.preview = item.id;
		this.emitChanges('preview:changed', item);
	}

	setPrice(value: number) {
		this.order.total = value;
	}

	setItemsIds() {
		this.order.itemsIds = [];
		let i = 0;
		for (i = 0; i < this.order.items.length; i++) {
			if (this.order.items[i].price == null) {
				continue;
			}
			this.order.itemsIds.push(this.order.items[i].id);
		}
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

	setContactsField(field: keyof ICustomerForm, value: string) {
		this.order[field] = value;

		if (this.validateContacts()) {
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

	setOrderField(field: keyof ICustomerForm, value: string) {
		this.order[field] = value;

		if (this.validateOrder()) {
			this.events.emit('order:ready', this.order);
		}
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
