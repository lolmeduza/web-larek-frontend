import { Component } from './base/Component';
import { bem, createElement, ensureElement } from '../utils/utils';

interface ICardActions {
	onClick: (event: MouseEvent) => void;
}

export interface ICard<T> {
	title: string;
	price: number;
	category: string;
	description?: string | string[];
	image: string;
	status: T;
}

export class Card<T> extends Component<ICard<T>> {
	protected _title: HTMLElement;
	protected _image?: HTMLImageElement;
	protected _description?: HTMLElement;
	protected _button?: HTMLButtonElement;
	protected _price?: HTMLElement;
	protected _category: HTMLElement;
	constructor(
		protected blockName: string,
		container: HTMLElement,
		actions?: ICardActions
	) {
		super(container);
		this._category = ensureElement<HTMLElement>(
			`.${blockName}__category`,
			container
		);
		this._title = ensureElement<HTMLElement>(`.${blockName}__title`, container);
		this._image = ensureElement<HTMLImageElement>(
			`.${blockName}__image`,
			container
		);
		this._button = container.querySelector(`.${blockName}__button`);
		this._description = container.querySelector(`.${blockName}__text`);
		this._price = container.querySelector(`.${blockName}__price`);

		if (actions?.onClick) {
			if (this._button) {
				this._button.addEventListener('click', actions.onClick);
			} else {
				container.addEventListener('click', actions.onClick);
			}
		}
		if (this._button) {
			this._button.addEventListener('click', () => {
				this._button.textContent = 'Добавлено';
			});
		}
	}

	set category(value: string) {
		this.setText(this._category, value);

		this._category.classList.remove('card__category_soft');
		this._category.classList.remove('card__category_other');

		if (value == 'другое') {
			this._category.classList.add('card__category_other');
		}
		if (value == 'софт-скил') {
			this._category.classList.add('card__category_soft');
		}
		if (value == 'дополнительное') {
			this._category.classList.add('card__category_additional');
		}
		if (value == 'хард-скил') {
			this._category.classList.add('card__category_hard');
		}
		if (value == 'кнопка') {
			this._category.classList.add('card__category_button');
		}
	}

	set id(value: string) {
		this.container.dataset.id = value;
	}

	get id(): string {
		return this.container.dataset.id || '';
	}

	set title(value: string) {
		this.setText(this._title, value);
	}

	get title(): string {
		return this._title.textContent || '';
	}

	set image(value: string) {
		this.setImage(this._image, value, this.title);
	}

	set price(value: number | string) {
		if (value == null) {
			this._price.textContent = 'бесценно';
		} else {
			this.setText(this._price, value);
		}
	}

	set description(value: string | string[]) {
		if (Array.isArray(value)) {
			this._description.replaceWith(
				...value.map((str) => {
					const descTemplate = this._description.cloneNode() as HTMLElement;
					this.setText(descTemplate, str);
					return descTemplate;
				})
			);
		} else {
			this.setText(this._description, value);
		}
	}
}

export type CatalogItemStatus = {
	label: string;
};

export class CatalogItem extends Card<CatalogItemStatus> {
	protected _status: HTMLElement;

	constructor(container: HTMLElement, actions?: ICardActions) {
		super('card', container, actions);
	}
}

export type AuctionStatus = {
	status: string;
	time: string;
	label: string;
	nextBid: number;
	history: number[];
};

export class ModalItem extends Card<HTMLElement> {
	protected _status: HTMLElement;
	protected _button: HTMLButtonElement;

	constructor(container: HTMLElement, actions?: ICardActions) {
		super('card', container, actions);
	}

	set status(content: HTMLElement) {
		this._status.replaceWith(content);
	}
}

export class ItemInBasket<T> extends Component<ICard<T>> {
	protected _title: HTMLElement;
	protected _image?: HTMLImageElement;
	protected _description?: HTMLElement;
	protected _button?: HTMLButtonElement;
	protected _price?: HTMLElement;
	constructor(container: HTMLElement, actions?: ICardActions) {
		super(container);
		this._title = ensureElement<HTMLElement>(`.card__title`, container);
		this._button = container.querySelector(`.card__button`);
		this._price = container.querySelector(`.card__price`);
		if (actions?.onClick) {
			if (this._button) {
				this._button.addEventListener('click', actions.onClick);
			} else {
				container.addEventListener('click', actions.onClick);
			}
		}
	}

	set id(value: string) {
		this.container.dataset.id = value;
	}

	get id(): string {
		return this.container.dataset.id || '';
	}

	set title(value: string) {
		this.setText(this._title, value);
	}

	get title(): string {
		return this._title.textContent || '';
	}

	set price(value: number | string) {
		if (value == null) {
			this._price.textContent = 'бесценно';
		} else {
			this.setText(this._price, value);
		}
	}

	set description(value: string | string[]) {
		if (Array.isArray(value)) {
			this._description.replaceWith(
				...value.map((str) => {
					const descTemplate = this._description.cloneNode() as HTMLElement;
					this.setText(descTemplate, str);
					return descTemplate;
				})
			);
		} else {
			this.setText(this._description, value);
		}
	}
}
