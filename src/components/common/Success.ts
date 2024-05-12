import { Component } from '../base/Component';
import { ensureElement } from '../../utils/utils';
import { formatNumber } from '../../utils/utils';
interface ISuccess {
	total: number;
}

interface ISuccessActions {
	onClick: () => void;
}

export class Success extends Component<ISuccess> {
	protected _close: HTMLElement;
	protected _price: HTMLElement;

	constructor(container: HTMLElement, actions: ISuccessActions) {
		super(container);
		this._price = this.container.querySelector('.order-success__description');
		this._close = ensureElement<HTMLElement>(
			'.order-success__close',
			this.container
		);

		if (actions?.onClick) {
			this._close.addEventListener('click', actions.onClick);
		}
	}
	set totalPrice(price: number) {
		this.setText(this._price, formatNumber(price));
	}
}
