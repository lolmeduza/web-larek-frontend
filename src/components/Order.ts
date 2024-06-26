import { Form } from './common/Form';
import { ICustomerForm } from '../types';
import { EventEmitter, IEvents } from './base/Events';
import { ensureElement, ensureAllElements } from '../utils/utils';

export class Order extends Form<ICustomerForm> {
	protected _cashButton: HTMLButtonElement;
	protected _cardButton: HTMLButtonElement;
	protected _buttons: HTMLButtonElement[];
	constructor(container: HTMLFormElement, events: IEvents) {
		super(container, events);
		this._buttons = ensureAllElements<HTMLButtonElement>('.button', container);

		this._cashButton = this.container.elements.namedItem(
			'cash'
		) as HTMLButtonElement;
		this._cashButton.addEventListener('click', () => {
			this.toggleClass(this._cashButton, 'button_alt-active', true);
			this.toggleClass(this._cardButton, 'button_alt-active', false);
			this.events.emit(`${this.container.name}.payment:change`, {
				field: 'payment',
				value: 'cash',
			});
		});

		this._cardButton = this.container.elements.namedItem(
			'card'
		) as HTMLButtonElement;
		this._cardButton.addEventListener('click', () => {
			this.toggleClass(this._cardButton, 'button_alt-active', true);
			this.toggleClass(this._cashButton, 'button_alt-active', false);
			this.events.emit(`${this.container.name}.payment:change`, {
				field: 'payment',
				value: 'online',
			});
		});
	}

	set address(value: string) {
		(this.container.elements.namedItem('address') as HTMLInputElement).value =
			value;
	}
}

export class Contacts extends Form<ICustomerForm> {
	protected _submit: HTMLButtonElement;
	constructor(container: HTMLFormElement, events: IEvents) {
		super(container, events);
	}

	set phone(value: string) {
		(this.container.elements.namedItem('phone') as HTMLInputElement).value =
			value;
	}

	set email(value: string) {
		(this.container.elements.namedItem('email') as HTMLInputElement).value =
			value;
	}
}
