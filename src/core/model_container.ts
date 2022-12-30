export class ModelContainer<T>{
	items:T[];
	currentItemCount?:number;
	itemsPerPage?:number;
	startIndex?:number;
	totalItems?:number;
	pageIndex?:number;
	totalPages?:number;
	kind?:string;
	constructor(items: T[])
	{
		this.items = items;
		this.currentItemCount = items.length;
	}
	public static fromOneItem<T>(item:T) : ModelContainer<T>{
		return new ModelContainer<T>([item]);
	}
} 	