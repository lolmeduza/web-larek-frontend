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
	protected _category?: HTMLElement;
	constructor(
		protected blockName: string,
		container: HTMLElement,
		actions?: ICardActions
	) {
		super(container);
		this._category = container.querySelector(`.${blockName}__category`);
		this._title = ensureElement<HTMLElement>(`.${blockName}__title`, container);
		this._image = container.querySelector<HTMLImageElement>(
			`.${blockName}__image`
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
				this.setText(this._button, 'Добавлено в корзину');
				this.setDisabled(this._button, true);
			});
		}
	}
	disableButton() {
		if (this._button) {
			this.setText(this._button, 'Добавлено в корзину');
			this.setDisabled(this._button, true);
		}
	}

	addCategoryClass(value: string) {
		this.toggleClass(this._category, `card__category_${value}`, true);
	}

	set category(value: string) {
		this.setText(this._category, value);

		this.removeClass(this._category, 'card__category_soft');
		this.removeClass(this._category, 'card__category_other');

		if (value == 'другое') {
			this.addCategoryClass(`other`);
		}
		if (value == 'софт-скил') {
			this.addCategoryClass('soft');
		}
		if (value == 'дополнительное') {
			this.addCategoryClass('additional');
		}
		if (value == 'хард-скил') {
			this.addCategoryClass('hard');
		}
		if (value == 'кнопка') {
			this.addCategoryClass('button');
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
			this.setText(this._price, 'бесценно');
		} else {
			this.setText(this._price, value + ' синапсов');
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

export class ItemInBasket<T> extends Card<T> {
	protected _button?: HTMLButtonElement;
	protected _price?: HTMLElement;
	constructor(container: HTMLElement, actions?: ICardActions) {
		super('card', container, actions);
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

	set price(value: number | string) {
		if (value == null) {
			this.setText(this._price, 'бесценно');
		} else {
			this.setText(this._price, value);
		}
	}
}
