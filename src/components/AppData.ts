// import _ from "lodash";
// import {dayjs, formatNumber} from "../utils/utils";

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
	// addToCard() {
	// 	this.emitChanges('card:change', { id: this.id, price: this.price });
	// }

	// placeBid(price: number): void {
	//     this.price = price;
	//     this.history = [...this.history.slice(1), price];
	//     this.myLastBid = price;

	//     if (price > (this.minPrice * 10)) {
	//         this.status = 'closed';
	//     }
	//     this.emitChanges('auction:changed', { id: this.id, price });
	// }
}

export class AppState extends Model<IAppState> {
	basket: string[];
	catalog: CardItem[];
	order: IOrder = {
		address: '',
		email: '',
		phone: '',
		items: [],
	};
	preview: string | null;
	formErrors: FormErrors = {};

	// toggleOrderedLot(id: string, isIncluded: boolean) {
	// 	if (isIncluded) {
	// 		this.order.items = _.uniq([...this.order.items, id]);
	// 	} else {
	// 		this.order.items = _.without(this.order.items, id);
	// 	}
	// }

	// clearBasket() {
	// 	this.order.items.forEach((id) => {
	// 		// this.toggleOrderedLot(id, false);
	// 		this.catalog.find((it) => it.id === id).clearBid();
	// 	});
	// }

	addToOrder(item: CardItem) {
		this.order.items.push(item);
	}

	removeInOrder(item: CardItem) {
		// let good = this.order.items.find(it => it.id===item.id);
		let index = this.order.items.indexOf(item);
		this.order.items.splice(index, 1);

		console.log(this.order.items);
	}
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

	setOrderField(field: keyof ICustomerForm, value: string) {
		this.order[field] = value;

		if (this.validateOrder()) {
			this.events.emit('order:ready', this.order);
		}
	}

	validateOrder() {
		const errors: typeof this.formErrors = {};
		if (!this.order.email) {
			errors.email = 'Необходимо указать email';
		}
		if (!this.order.phone) {
			errors.phone = 'Необходимо указать телефон';
		}
		this.formErrors = errors;
		this.events.emit('formErrors:change', this.formErrors);
		return Object.keys(errors).length === 0;
	}
}
