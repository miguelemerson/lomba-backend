export class ContainsMany<T>{
	items:T[];
	currentItemCount?:number;
	itemsPerPage?:number;
	startIndex?:number;
	totalItems?:number;
	pageIndex?:number;
	totalPages?:number;    
	constructor(items: T[])
	{
		this.items = items;
		this.currentItemCount = items.length;
	}
} 	