export class MongoQuery {
	orgaId:string | undefined;
	userId:string | undefined;
	stageId:string | undefined;
	flowId:string | undefined;
	stages: object | undefined;
	$text: object | undefined;
	votes: object | undefined;
    
	public build() : object
	{
		return JSON.parse(JSON.stringify(this));
	}
} 
