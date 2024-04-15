//типы

//корзинка
export interface IBasketView {
	items: HTMLElement[];
	total: number;
	selected: string[];
}

// modal
// регулярка?

export interface IModalData {
	content: HTMLElement;
}

//customer

export interface ICustomerForm {
	payment: string;
	address: string;
	email: string;
	phone: string;
}

export interface IOrder extends ICustomerForm {
	items: string[];
}

export interface IPage {
	counter: number;
	catalog: HTMLElement[];
	locked: boolean;
}

export interface IModalData {
	content: HTMLElement;
}

export interface ICard {
	about: string;
	description: string;
	id: string;
	image: string;
	title: string;
	price: number;
}

export type FormErrors = Partial<Record<keyof IOrder, string>>;

export interface IAppState {
	catalog: ICard[];
	basket: string[];
	preview: string | null;
	order: IOrder | null;
}

export interface IOrderResult {
	id: string;
}
