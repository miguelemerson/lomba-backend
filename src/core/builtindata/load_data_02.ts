import { FlowDataSource } from '../../data/datasources/flow_data_source';
import { PostDataSource } from '../../data/datasources/post_data_source';
import { StageDataSource } from '../../data/datasources/stage_data_source';
import { FlowModel } from '../../data/models/flows/flow_model';
import { PostModel } from '../../data/models/flows/post_model';
import { StageModel } from '../../data/models/flows/stage_model';
import { Flow } from '../../domain/entities/flows/flow';
import { Post } from '../../domain/entities/flows/post';
import { PostItem } from '../../domain/entities/flows/postitem';
import { PostVotes } from '../../domain/entities/flows/postvotes';
import { Stage } from '../../domain/entities/flows/stage';
import { TextContent } from '../../domain/entities/flows/textcontent';
import { Total } from '../../domain/entities/flows/total';
import { Vote } from '../../domain/entities/flows/vote';
import { MongoWrapper } from '../wrappers/mongo_wrapper';
import { data_insert01 } from './load_data_01';

const flowId = '00000111-0111-0111-0111-000000000111';
const stageId01Load = '00000AAA-0111-0111-0111-000000000111';
const stageId02Approval = '00000BBB-0111-0111-0111-000000000111';
const stageId03Voting = '00000CCC-0111-0111-0111-000000000111';

const post01Id = '00001AAA-0119-0111-0111-000000000000';
const post02Id = '00002AAA-0119-0111-0111-000000000000';
const post03Id = '00003AAA-0119-0111-0111-000000000000';
const post04Id = '00004AAA-0119-0111-0111-000000000000';

export const checkData02 = async (stageSource: StageDataSource, flowSource: FlowDataSource, postSource: PostDataSource, postMongo: MongoWrapper<PostModel>) => {

	data_insert02.flows[0].stages = data_insert02.stages;

	data_insert02.posts[0].postitems.push(data_insert02.postitems[0]);
	data_insert02.posts[1].postitems.push(data_insert02.postitems[1]);
	data_insert02.posts[2].postitems.push(data_insert02.postitems[2]);
	data_insert02.posts[3].postitems.push(data_insert02.postitems[3]);

	data_insert02.posts[0].stages.push(data_insert02.stages[0]);
	data_insert02.posts[1].stages.push(data_insert02.stages[0]);
	data_insert02.posts[2].stages.push(data_insert02.stages[0]);
	data_insert02.posts[3].stages.push(data_insert02.stages[0]);
	data_insert02.posts[3].stages.push(data_insert02.stages[1]);

	data_insert02.posts[3].totals.push(data_insert02.totals[0]);
	data_insert02.posts[3].votes.push(data_insert02.votes[0]);
	
	//const listCollections = (await postMongo.db.listCollections().toArray());
	
	///buscar si existe stage cada uno
	//stages
	data_insert02.stages.forEach(async stage => {
		const result = await stageSource.getOne({_id:stage.id});
		if(result.currentItemCount < 1)
		{
			await stageSource.add(new StageModel(stage.id, stage.name, stage.order, stage.queryOut, stage.enabled, stage.builtIn));
		}
	});

	///buscar si existe flow cada uno	
	//flows
	data_insert02.flows.forEach(async flow => {
		const result = await flowSource.getOne({_id:flow.id});
		if(result.currentItemCount < 1)
		{
			const resultAdd = await flowSource.add(new FlowModel(flow.id, flow.name, [], flow.enabled, flow.builtIn));

			flow.stages.forEach(async stage => {
				await flowSource.updateDirect(resultAdd.items[0].id, {$push : {stages: stage}});
			});
		}
	});


	///insertar posts
	data_insert02.posts.forEach(async post => {
		const result = await postSource.getOne({_id:post.id}); 
		if(result.currentItemCount < 1)
		{
			const resultAdd = await postSource.add(new PostModel(post.id, [], post.title, post.orgaId, post.userId, post.flowId, post.stageId, post.enabled, post.builtIn));

			post.postitems.forEach(async postitem => {
				await postSource.updateDirect(resultAdd.items[0].id, {$push : {postitems: postitem}});
			});
			
			post.stages.forEach(async stage => {
				await postSource.updateDirect(resultAdd.items[0].id, {$push : {stages: stage}});
			});		
			
			post.totals.forEach(async total => {
				await postSource.updateDirect(resultAdd.items[0].id, {$push : {totals: total}});
			});	

			post.votes.forEach(async vote => {
				await postSource.updateDirect(resultAdd.items[0].id, {$push : {votes: vote}});
			});		
				
		}
	});

	try{
		postMongo.db.collection(postMongo.collectionName).dropIndex('title_text_postitems.content.text_text');
	}catch(e){
		console.log('no index');
	}
	
	try
	{
		postMongo.db.collection(postMongo.collectionName).createIndex(
			{
				'title': 'text',
				'postitems.content.text': 'text'
			},{
				name: 'title_text_postitems.content.text_text'
			}
		);
	}catch(e){
		console.log('no created index');
	}

};

export const data_insert02 = {

	stages:[{name: 'Carga', order:1, queryOut: {'votes.value': 1},
		_id:stageId01Load, id:stageId01Load, enabled:true, builtIn:true, created: new Date()} as Stage,
        {name: 'Aprobación', order:2, queryOut: {'totals.totalpositive': 2, 'totals.totalcount' : 2},_id:stageId02Approval, id:stageId02Approval, enabled:true, builtIn:true, created: new Date()} as Stage,{name: 'Votación', order:3, queryOut: undefined,_id:stageId03Voting, id:stageId03Voting, enabled:true, builtIn:true, created: new Date()} as Stage],

	flows:[{name: 'Flujo de Votación', stages:[], _id:flowId, id:flowId, enabled:true, builtIn:true, created: new Date()} as Flow],

	postitems:[{order:1, content: {text:'texto de un post!'} as TextContent, type:'text', format:'', builtIn:true, created: new Date()} as PostItem, {order:1, content: {text:'esto es otro post'} as TextContent, type:'text', format:'', builtIn:true, created: new Date()} as PostItem, {order:1, content: {text:'se trata del tercer post'} as TextContent, type:'text', format:'', builtIn:true, created: new Date()} as PostItem, {order:1, content: {text:'un cuarto post'} as TextContent, type:'text', format:'', builtIn:true, created: new Date()} as PostItem],
    
	posts:[{postitems:[], title:'primer post del sistema', orgaId: data_insert01.orgas[1].id, userId: data_insert01.users[4].id, flowId:flowId, stageId: stageId01Load, stages:[], totals:[], tracks:[], votes:[], _id:post01Id, id:post01Id, enabled:true, builtIn:true, created: new Date()} as Post, {postitems:[], title:'este es el segundo post', orgaId: data_insert01.orgas[1].id, userId: data_insert01.users[4].id, flowId:flowId, stageId: stageId01Load, stages:[], totals:[], tracks:[], votes:[], _id:post02Id, id:post02Id, enabled:true, builtIn:true, created: new Date()} as Post, {postitems:[], title:'tercer post en fila', orgaId: data_insert01.orgas[1].id, userId: data_insert01.users[5].id, flowId:flowId, stageId: stageId01Load, stages:[], totals:[], tracks:[], votes:[], _id:post03Id, id:post03Id, enabled:true, builtIn:true, created: new Date()} as Post, {postitems:[], title:'cuarto post nacido en etapa 2', orgaId: data_insert01.orgas[1].id, userId: data_insert01.users[5].id, flowId:flowId, stageId: stageId02Approval, stages:[], totals:[], tracks:[], votes:[], _id:post04Id, id:post04Id, enabled:true, builtIn:true, created: new Date()} as Post],

	votes:[{  
		flowId:flowId,
		stageId:stageId01Load,
		userId:data_insert01.users[5].id,
		value:1, created: new Date()} as Vote],

	postvotes:[{id: post04Id, _id:post04Id, votes:[]} as PostVotes],

	totals:[{totalpositive: 1,
		totalnegative: 0,
		totalcount: 1,  
		flowId:flowId,
		stageId:stageId01Load} as Total]

};