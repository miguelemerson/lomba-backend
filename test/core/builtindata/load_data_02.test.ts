import { Collection, Db } from 'mongodb';
import { checkData02, data_insert02 } from '../../../src/core/builtindata/load_data_02';
import { ModelContainer } from '../../../src/core/model_container';
import { MongoWrapper, NoSQLDatabaseWrapper } from '../../../src/core/wrappers/mongo_wrapper';
import { FlowDataSource } from '../../../src/data/datasources/flow_data_source';
import { PostDataSource } from '../../../src/data/datasources/post_data_source';
import { StageDataSource } from '../../../src/data/datasources/stage_data_source';
import { FlowModel } from '../../../src/data/models/workflow/flow_model';
import { PostModel } from '../../../src/data/models/workflow/post_model';
import { StageModel } from '../../../src/data/models/workflow/stage_model';

class MockStageDataSource implements StageDataSource {
	getMany(): Promise<ModelContainer<StageModel>> {
		throw new Error('Method not implemented.');
	}
	getOne(): Promise<ModelContainer<StageModel>> {
		throw new Error('Method not implemented.');
	}
	add(): Promise<ModelContainer<StageModel>> {
		throw new Error('Method not implemented.');
	}
	update(): Promise<ModelContainer<StageModel>> {
		throw new Error('Method not implemented.');
	}
	enable(): Promise<boolean> {
		throw new Error('Method not implemented.');
	}
	delete(): Promise<boolean> {
		throw new Error('Method not implemented.');
	}
	setId(): StageModel {
		throw new Error('Method not implemented.');
	}
	getAll(): Promise<ModelContainer<StageModel>> {
		throw new Error('Method not implemented.');
	}
	getById(): Promise<ModelContainer<StageModel>> {
		throw new Error('Method not implemented.');
	}
}
class MockFlowDataSource implements FlowDataSource {
	getMany(): Promise<ModelContainer<FlowModel>> {
		throw new Error('Method not implemented.');
	}
	getOne(): Promise<ModelContainer<FlowModel>> {
		throw new Error('Method not implemented.');
	}
	add(): Promise<ModelContainer<FlowModel>> {
		throw new Error('Method not implemented.');
	}
	update(): Promise<ModelContainer<FlowModel>> {
		throw new Error('Method not implemented.');
	}
	enable(): Promise<boolean> {
		throw new Error('Method not implemented.');
	}
	delete(): Promise<boolean> {
		throw new Error('Method not implemented.');
	}
	setId(): FlowModel {
		throw new Error('Method not implemented.');
	}
	updateDirect(): Promise<ModelContainer<FlowModel>> {
		throw new Error('Method not implemented.');
	}
	getAll(): Promise<ModelContainer<FlowModel>> {
		throw new Error('Method not implemented.');
	}
	getById(): Promise<ModelContainer<FlowModel>> {
		throw new Error('Method not implemented.');
	}
}
class MockPostDataSource implements PostDataSource {
	addTrack(): Promise<boolean> {
		throw new Error('Method not implemented.');
	}
	getMany(): Promise<ModelContainer<PostModel>> {
		throw new Error('Method not implemented.');
	}
	getManyWithOptions(): Promise<ModelContainer<PostModel>> {
		throw new Error('Method not implemented.');
	}
	getOne(): Promise<ModelContainer<PostModel>> {
		throw new Error('Method not implemented.');
	}
	getOneWithOptions(): Promise<ModelContainer<PostModel>> {
		throw new Error('Method not implemented.');
	}
	add(): Promise<ModelContainer<PostModel>> {
		throw new Error('Method not implemented.');
	}
	update(): Promise<ModelContainer<PostModel>> {
		throw new Error('Method not implemented.');
	}
	enable(): Promise<boolean> {
		throw new Error('Method not implemented.');
	}
	delete(): Promise<boolean> {
		throw new Error('Method not implemented.');
	}
	setId(): PostModel {
		throw new Error('Method not implemented.');
	}
	updateDirect(): Promise<ModelContainer<PostModel>> {
		throw new Error('Method not implemented.');
	}
	updateArray(): Promise<ModelContainer<PostModel>> {
		throw new Error('Method not implemented.');
	}
	get dbcollection(): MongoWrapper<PostModel> {
		throw new Error('Method not implemented.');
	}
	getUploadedPosts(): Promise<ModelContainer<PostModel>> {
		throw new Error('Method not implemented.');
	}
	getForApprovePosts(): Promise<ModelContainer<PostModel>> {
		throw new Error('Method not implemented.');
	}
	getApprovedPosts(): Promise<ModelContainer<PostModel>> {
		throw new Error('Method not implemented.');
	}
	getRejectedPosts(): Promise<ModelContainer<PostModel>> {
		throw new Error('Method not implemented.');
	}
	getLatestPosts(): Promise<ModelContainer<PostModel>> {
		throw new Error('Method not implemented.');
	}
	getPopularPosts(): Promise<ModelContainer<PostModel>> {
		throw new Error('Method not implemented.');
	}
	getVotedPosts(): Promise<ModelContainer<PostModel>> {
		throw new Error('Method not implemented.');
	}
	getAdminViewPosts(): Promise<ModelContainer<PostModel>> {
		throw new Error('Method not implemented.');
	}
	getIfHasVote(): Promise<ModelContainer<PostModel>> {
		throw new Error('Method not implemented.');
	}
	getById(): Promise<ModelContainer<PostModel>> {
		throw new Error('Method not implemented.');
	}
	getByQueryOut(): Promise<ModelContainer<PostModel>> {
		throw new Error('Method not implemented.');
	}
	pushToArrayField(): Promise<ModelContainer<PostModel>> {
		throw new Error('Method not implemented.');
	}
	updateTotals(): Promise<ModelContainer<PostModel>> {
		throw new Error('Method not implemented.');
	}
	updateVote(): Promise<ModelContainer<PostModel>> {
		throw new Error('Method not implemented.');
	}
}
class MockWrapper implements NoSQLDatabaseWrapper<PostModel> {
	getMany(): Promise<ModelContainer<PostModel>> {
		throw new Error('Method not implemented.');
	}
	getManyWithOptions(): Promise<ModelContainer<PostModel>> {
		throw new Error('Method not implemented.');
	}
	getOne(): Promise<ModelContainer<PostModel>> {
		throw new Error('Method not implemented.');
	}
	getOneWithOptions(): Promise<ModelContainer<PostModel>> {
		throw new Error('Method not implemented.');
	}
	add(): Promise<boolean> {
		throw new Error('Method not implemented.');
	}
	update(): Promise<boolean> {
		throw new Error('Method not implemented.');
	}
	enable(): Promise<boolean> {
		throw new Error('Method not implemented.');
	}
	delete(): Promise<boolean> {
		throw new Error('Method not implemented.');
	}
	updateDirect(): Promise<boolean> {
		throw new Error('Method not implemented.');
	}
	updateArray(): Promise<boolean> {
		throw new Error('Method not implemented.');
	}
	updateDirectByQuery(): Promise<boolean> {
		throw new Error('Method not implemented.');
	}
	collectionName:string;
	db:Db;
	constructor(collectionName: string, dbMongo: Db){
		this.collectionName = collectionName;
		this.db = dbMongo;
	}
}


describe('Test del load data 01', () => {

	let mockStageDataSource: MockStageDataSource;
	let mockFlowDataSource: MockFlowDataSource;
	let mockPostDataSource: MockPostDataSource;
	let mockWrapper: MockWrapper;

	beforeEach(() => {
		jest.clearAllMocks();
		mockStageDataSource = new MockStageDataSource();
		mockFlowDataSource = new MockFlowDataSource();
		mockPostDataSource = new MockPostDataSource();
		mockWrapper = new MockWrapper('posts', (jest.fn() as unknown) as Db);
	});

	const testRoleName = 'admin';
	const testStages = data_insert02.stages;
	const testFlows = data_insert02.flows;
	const testPostItems = data_insert02.postitems;
	const testPosts = data_insert02.posts;
	const testVotes = data_insert02.votes;
	const testTotals = data_insert02.totals;

	test('Revisión de etapas', () => {
		//arrange
		const stages = data_insert02.stages;
		//act

		//assert
		expect(stages.length).toEqual(3);
	});

	test('Revisión de flujos', () => {
		//arrange
		const flows = data_insert02.flows;
		//act
		const len = flows.length;
		//assert
		expect(len).toEqual(1);
		
	});

	test('Revisión de postitems', () => {
		//arrange
		const postitems = data_insert02.postitems;
		//act
		const len = postitems.length;

		//assert
		expect(len).toEqual(4);
		
	});

	test('Revisión de post', () => {
		//arrange
		const posts = data_insert02.posts;
		
		//act
		const len = posts.length;
		
        
		//assert
		expect(len).toEqual(4);
		
	});

	test('Revisión de votos', () => {
		//arrange
		const votes = data_insert02.votes;
		
		//act
		const len = votes.length;
		
        
		//assert
		expect(len).toEqual(1);
		
	});

	test('Revisión de totales', () => {
		//arrange
		const totals = data_insert02.totals;
		
		//act
		const len = totals.length;
		
        
		//assert
		expect(len).toEqual(1);
		
	});    

	test('debe agregar flujos, etapas y posts', async () => {
		//arrange

		const model_con_stage = ModelContainer.fromOneItem(new StageModel(testStages[0].id, testStages[0].name, testStages[0].order, testStages[0].queryOut, testStages[0].enabled, testStages[0].builtIn));
		const model_void_stage = new ModelContainer<StageModel>([]);

		const model_con_flow = ModelContainer.fromOneItem(new FlowModel(testFlows[0].id, testFlows[0].name, [], testFlows[0].enabled, testFlows[0].builtIn));

		const model_void_flow = new ModelContainer<FlowModel>([]);

		const model_con_post = ModelContainer.fromOneItem(new PostModel(testPosts[0].id, [], testPosts[0].title, testPosts[0].orgaId, testPosts[0].userId, testPosts[0].flowId, testPosts[0].stageId, testPosts[0].enabled, testPosts[0].builtIn));

		const model_void_post = new ModelContainer<PostModel>([]);



		jest.spyOn(mockStageDataSource, 'getOne').mockImplementation(() => Promise.resolve(model_void_stage));

		jest.spyOn(mockStageDataSource, 'add').mockImplementation(() => Promise.resolve(model_con_stage));

		jest.spyOn(mockFlowDataSource, 'getOne').mockImplementation(() => Promise.resolve(model_void_flow));

		jest.spyOn(mockFlowDataSource, 'add').mockImplementation(() => Promise.
			resolve(model_con_flow));

		jest.spyOn(mockFlowDataSource, 'updateDirect').mockImplementation(() => Promise.resolve(model_con_flow));        

		jest.spyOn(mockPostDataSource, 'getById').mockImplementation(() => Promise.resolve(model_void_post));			

		jest.spyOn(mockPostDataSource, 'add').mockImplementation(() => Promise.resolve(model_con_post));

		jest.spyOn(mockPostDataSource, 'pushToArrayField').mockImplementation(() => Promise.resolve(model_con_post));
		
		//jest.spyOn(mockWrapper.db.collection, 'createIndex');

		await checkData02(mockStageDataSource, mockFlowDataSource, mockPostDataSource, mockWrapper);

		expect(mockStageDataSource.getOne).toBeCalledTimes(3);
		expect(mockStageDataSource.add).toBeCalledTimes(3);


		expect(mockFlowDataSource.getOne).toBeCalledTimes(1);
		expect(mockFlowDataSource.add).toBeCalledTimes(1);
		expect(mockFlowDataSource.updateDirect).toBeCalledTimes(3);

		expect(mockPostDataSource.getById).toBeCalledTimes(4);
		expect(mockPostDataSource.add).toBeCalledTimes(4);
		expect(mockPostDataSource.pushToArrayField).toBeCalledTimes(11);

	});
 

});