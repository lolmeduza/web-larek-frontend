import { Component } from '../base/Component';
import {
	cloneTemplate,
	createElement,
	ensureElement,
	formatNumber,
} from '../../utils/utils';
import { EventEmitter } from '../base/Events';

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
	protected _button: HTMLButtonElement;

	constructor(container: HTMLElement, protected events: EventEmitter) {
		super(container);

		this._list = ensureElement<HTMLElement>('.basket__list', this.container);
		this._price = this.container.querySelector('.basket__price');
		this._button = this.container.querySelector('.basket__button');
		if (this._button) {
			this._button.addEventListener('click', () => {
				events.emit('order:open');
			});
		}

		this.items = [];
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

	toggleButton(state: boolean) {
		this.setDisabled(this._button, state);
	}

	set selected(items: string[]) {
		this.toggleButton(!items.length);
	}

	set totalPrice(price: number) {
		this.setText(this._price, formatNumber(price) + ' синапсов');
	}

	set valid(value: boolean) {
		this.toggleButton(!value);
	}
}
