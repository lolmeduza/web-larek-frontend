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
	payment: string;
}

export interface IOrder extends ICustomerForm {
	items: ICard[];
	total: number;
	itemsIds: string[];
	// item: number;
}

export interface IOrderForm {
	email: string;
	phone: string;
}
export interface IOrderResult {
	id: string;
}

export interface IPageView {
	counter: number;
	catalog: HTMLElement[];
}

export interface IModalData {
	content: HTMLElement;
}

export type ICard = {
	about: string;
	category: string;
	description: string;
	id: string;
	image: string;
	title: string;
	price: number;
};

export type FormErrors = Partial<Record<keyof ICustomerForm, string>>;

export interface IAppState {
	catalog: ICard[];
	basket: string[];
	payment: string;
	order: IOrder | null;
}
