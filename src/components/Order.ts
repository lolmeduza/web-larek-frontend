import { Form } from './common/Form';
import { ICustomerForm } from '../types';
import { EventEmitter, IEvents } from './base/events';
import { ensureElement } from '../utils/utils';

export class Order extends Form<ICustomerForm> {
	protected _nextButton: HTMLButtonElement;
	constructor(container: HTMLFormElement, events: IEvents) {
		super(container, events);
		this._nextButton = ensureElement<HTMLButtonElement>(
			'.order__button',
			this.container
		);
	}

	set card(value: string) {
		(this.container.elements.namedItem('card') as HTMLInputElement).value =
			value;
	}

	set cash(value: string) {
		(this.container.elements.namedItem('cash') as HTMLInputElement).value =
			value;
	}

	set address(value: string) {
		(this.container.elements.namedItem('address') as HTMLInputElement).value =
			value;
	}
	set valid(value: boolean) {
		this._nextButton.disabled = !value;
		console.log(value);
	}
}
// payment: string;
// address: string;

export class Contacts extends Form<ICustomerForm> {
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

	set address(value: string) {
		(this.container.elements.namedItem('address') as HTMLInputElement).value =
			value;
	}
}
