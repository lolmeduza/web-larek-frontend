//типы

//корзинка
export interface IBasketView {
	items: HTMLElement[];
	total: number;
}

//customer

export interface ICustomerForm {
	address: string;
	email: string;
	phone: string;
}

export interface IOrder extends ICustomerForm {
	items: string[];
}

export interface IPageView {
	counter: number;
	catalog: HTMLElement[];
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

export type FormErrors = Partial<Record<keyof ICustomerForm, string>>;

export interface IAppState {
	catalog: ICard[];
	basket: string[];

	payment: string;

	order: IOrder | null;
}
