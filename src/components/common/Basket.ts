import { Component } from '../base/Component';
import {
	cloneTemplate,
	createElement,
	ensureElement,
	formatNumber,
} from '../../utils/utils';
import { EventEmitter } from '../base/events';

interface IBasketView {
	items: HTMLElement[];
	price: number;
	selected: string[];
}

export type TabActions = {
	onClick: (tab: string) => void;
};

export class Basket extends Component<IBasketView> {
	protected _list: HTMLElement;
	protected _price: HTMLElement;
	protected _button: HTMLElement;

	constructor(container: HTMLElement, protected events: EventEmitter) {
		super(container);

		this._list = ensureElement<HTMLElement>('.basket__list', this.container);
		this._price = this.container.querySelector('.basket__price');
		// this._price = ensureElement<HTMLElement>('.basket__price', this.container);
		this._button = this.container.querySelector('.basket__button');
		if (this._button) {
			this._button.addEventListener('click', () => {
				console.log('a');
				events.emit('order:open');
			});
		}

		this.items = [];
		console.log((this.items = []));
	}

	set items(items: HTMLElement[]) {
		if (items.length) {
			this._list.replaceChildren(...items);
		} else {
			this._list.replaceChildren(
				createElement<HTMLParagraphElement>('p', {
					textContent: 'Корзина пуста',
				})
			);
		}
	}

	set selected(items: string[]) {
		if (items.length) {
			this.setDisabled(this._button, false);
		} else {
			this.setDisabled(this._button, true);
		}
	}

	set totalPrice(price: number) {
		this.setText(this._price, formatNumber(price));
	}
}
