import { Form } from './common/Form';
import { ICustomerForm } from '../types';
import { EventEmitter, IEvents } from './base/events';
import { ensureElement, ensureAllElements } from '../utils/utils';

// export type TabActions = {
// 	onClick: (tab: string) => void;
// };

export class Order extends Form<ICustomerForm> {
	protected _nextButton: HTMLButtonElement;
	protected _cashButton: HTMLButtonElement;
	protected _cardButton: HTMLButtonElement;
	protected _buttons: HTMLButtonElement[];
	constructor(
		container: HTMLFormElement,
		events: IEvents
		// actions?: TabActions
	) {
		super(container, events);
		this._buttons = ensureAllElements<HTMLButtonElement>('.button', container);

		this._nextButton = ensureElement<HTMLButtonElement>(
			'.order__button',
			this.container
		);
		this._nextButton.addEventListener('click', () => {
			console.log('nextButton');
			//contacts:open
			this.events.emit(`contacts:open`);
			// console.log(`${this.container.name}.payment:change`);
			// this.events.emit(`${this.container.name}.payment:change`, {
			// 	field: 'payment',
			// 	value: 'online',
			// });
		});

		this._cashButton = this.container.elements.namedItem(
			'cash'
		) as HTMLButtonElement;
		this._cashButton.addEventListener('click', () => {
			console.log('cash');
			this.cash = 'cash';
			console.log(`${this.container.name}.payment:change`);
			this.events.emit(`${this.container.name}.payment:change`, {
				field: 'payment',
				value: 'cash',
			});
			// this.valid = true;
		});
		this._cardButton = this.container.elements.namedItem(
			'card'
		) as HTMLButtonElement;
		this._cardButton.addEventListener('click', () => {
			console.log('card');
			console.log(`${this.container.name}.payment:change`);
			this.events.emit(`${this.container.name}.payment:change`, {
				field: 'payment',
				value: 'online',
			});
		});
	}
	set card(value: string) {
		(this.container.elements.namedItem('card') as HTMLButtonElement).value =
			value;
	}

	set cash(value: string) {
		(this.container.elements.namedItem('cash') as HTMLButtonElement).value =
			value;
	}

	set address(value: string) {
		(this.container.elements.namedItem('address') as HTMLInputElement).value =
			value;
		console.log('address' + value);
	}
	set valid(value: boolean) {
		this._nextButton.disabled = !value;
		console.log(value);
	}
}

export class Contacts extends Form<ICustomerForm> {
	protected _submit: HTMLButtonElement;
	constructor(container: HTMLFormElement, events: IEvents) {
		super(container, events);

		this._submit = ensureElement<HTMLButtonElement>(
			'button[type=submit]',
			this.container
		);

		this.container.addEventListener('submit', (e: Event) => {
			e.preventDefault();
			this.events.emit(`${this.container.name}:submit`);
		});
	}

	set valid(value: boolean) {
		this._submit.disabled = !value;
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
	// set total(value: number) {
	// 	this.total = value;
	// }
}
