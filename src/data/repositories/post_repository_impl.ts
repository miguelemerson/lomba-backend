import { FindOperators, MongoError } from 'mongodb';
import { PostRepository } from '../../domain/repositories/post_repository';
import { PostDataSource } from '../datasources/post_data_source';
import { PostModel } from '../models/flows/post_model';
import { ModelContainer } from '../../core/model_container';
import { DatabaseFailure, Failure, GenericFailure, NetworkFailure } from '../../core/errors/failures';
import { Either } from '../../core/either';
import { Post } from '../../domain/entities/flows/post';
import { BoxPages } from '../../core/box_page';
import { TextContent } from '../../domain/entities/flows/textcontent';
import { Stage } from '../../domain/entities/flows/stage';
import { StageDataSource } from '../datasources/stage_data_source';
import { Vote } from '../../domain/entities/flows/vote';
import { PostItem } from '../../domain/entities/flows/postitem';
import { FlowDataSource } from '../datasources/flow_data_source';
import { MongoQuery } from '../../core/wrappers/mongo_query';
import { TotalModel } from '../models/flows/total_model';
import { Total } from '../../domain/entities/flows/total';

export class PostRepositoryImpl implements PostRepository {
	dataSource: PostDataSource;
	stageDataSource: StageDataSource;
	flowDataSource: FlowDataSource;
	constructor(dataSource: PostDataSource, stageDataSource: StageDataSource, flowDataSource: FlowDataSource){
		this.dataSource = dataSource;
		this.stageDataSource = stageDataSource;
		this.flowDataSource = flowDataSource;
	}

	async getPosts(orgaId: string, userId: string, flowId: string, stageId: string, boxPage: string, searchText: string, params: {[x: string]: unknown}, sort?: [string, 1 | -1][] | undefined, pageIndex?: number | undefined, itemsPerPage?: number | undefined): Promise<Either<Failure, ModelContainer<Post>>> {
		try
		{
			const query: MongoQuery = new MongoQuery();

			if (boxPage == BoxPages.uploadedPosts) {
				query.orgaId = orgaId;
				query.userId = userId;
				query.flowId = flowId;
				
				if((params['isdraft'] as string).toString() == 'true')
				{
					query.stageId = stageId;
				}
				else
				{
					query.stages = {$elemMatch: {id:stageId}};
				}
				if(!sort)
				{
					sort = [['created', -1]];
				}

			}
			if (boxPage == BoxPages.forApprovePosts) {

				query.orgaId = orgaId;
				query.flowId = flowId;
				query.stages = {$elemMatch: {id:stageId}};
				query.votes = {$elemMatch: {id:{$ne:userId}}};
				if(!sort)
				{
					sort = [['created', -1]];
				}
			}
			if (boxPage == BoxPages.approvedPosts) {

				query.orgaId = orgaId;
				query.flowId = flowId;
				query.stages = {$elemMatch: {id:stageId}};
				query.votes = {$elemMatch: {id:{$ne:userId}, value:1}};
				if(!sort)
				{
					sort = [['created', -1]];
				}
			}
			if (boxPage == BoxPages.rejectedPosts) {
				query.orgaId = orgaId;
				query.flowId = flowId;
				query.stages = {$elemMatch: {id:stageId}};
				query.votes = {$elemMatch: {id:{$ne:userId}, value: -1}};
				if(!sort)
				{
					sort = [['created', -1]];
				}
			}
			if (boxPage == BoxPages.latestPosts) {
				query.orgaId = orgaId;
				query.flowId = flowId;
				query.stageId = stageId;
				sort = [['created',-1]];
			}
			if (boxPage == BoxPages.popularPosts) {
				query.orgaId = orgaId;
				query.flowId = flowId;
				query.stageId = stageId;
				sort = [['totals.totalpositive',-1]];
				
			}
			if (boxPage == BoxPages.votedPosts) {
				query.orgaId = orgaId;
				query.flowId = flowId;
				query.stages = {$elemMatch: {id:stageId}};
				query.votes = {$elemMatch: {id:userId}};
				
				if((params['voteState'] as string).toString() == '1')
				{
					query.votes = {$elemMatch: {id:userId, value:1}};
				}
				else if ((params['voteState'] as string) == '-1')
				{
					query.votes = {$elemMatch: {id:userId, value:-1}};
				}
				else
				{
					query.votes = {$elemMatch: {id:userId}};
				}
				if(!sort)
				{
					sort = [['created', -1]];
				}
			}

			if(searchText != '')
			{
				query.$text = {$search: searchText};
			}

			const options = {id:1, postitems:1, title:1, orgaId:1, userId:1, flowId:1, stageId:1, enabled:1, builtIn:1, created:1, stages:1, totals:1, tracks:1, updated:1, deleted:1, expires:1, votes: { $elemMatch: {'userId':userId, 'stageId':stageId, 'flowId':flowId }}};

			const result = await this.dataSource.getManyWithOptions(query.build(), {projection: options}, sort, pageIndex, itemsPerPage);
			
			return Either.right(result);		
		}
		catch(error)
		{
			if(error instanceof MongoError)
			{
				return Either.left(new DatabaseFailure(error.name, error.message, error.code, error));
			} else if(error instanceof Error)
				return Either.left(new NetworkFailure(error.name, error.message, undefined, error));
			else return Either.left(new GenericFailure('undetermined', error));	
		}
	}

	async addTextPost(orgaId: string, userId: string, flowId: string, title: string, textContent: TextContent, draft: boolean): Promise<Either<Failure, ModelContainer<Post>>> {
		try
		{
			const resultFlow = await this.flowDataSource.getOne({id:flowId});
			
			if(resultFlow.currentItemCount > 0)
			{
				const firstStage = resultFlow.items[0].stages.filter(e=> e.order == 1)[0];

				const postItem = {order:1, content: textContent, type:'text', format:'', builtIn:false, created: new Date()} as PostItem;

				const postItems:PostItem[] = [postItem];
				let postStageId = firstStage.id;

				const post = new PostModel('', postItems, title, orgaId, userId, flowId, postStageId, true, false);

				const listStages:Stage[] = [];
				const listVotes:Vote[] = [];


				listStages.push(firstStage);

				if(!draft)
				{
					const vote = {  
						flowId:flowId,
						stageId:postStageId,
						userId:userId,
						value:1, created: new Date()} as Vote;
					listVotes.push(vote);

					const secondStage = resultFlow.items[0].stages.filter(e=> e.order == firstStage.order + 1)[0];

					postStageId = secondStage.id;
					listStages.push(secondStage);
				}

				const resultAddPost = await this.dataSource.add(post);
				if(resultAddPost.currentItemCount > 0)
				{
					const resultUpdatePost = await this.dataSource.update(resultAddPost.items[0].id, {postitems:postItems, stageId:postStageId, stages:listStages, votes:listVotes});

					return Either.right(resultUpdatePost);	
				}
			}

			return Either.left(new GenericFailure('undetermined'));
		}
		catch(error)
		{
			if(error instanceof MongoError)
			{
				return Either.left(new DatabaseFailure(error.name, error.message, error.code, error));
			} else if(error instanceof Error)
				return Either.left(new NetworkFailure(error.name, error.message, undefined, error));
			else return Either.left(new GenericFailure('undetermined', error));	
		}
	}

	async sendVote(userId: string, flowId: string, stageId: string, postId: string, voteValue: number): Promise<Either<Failure, ModelContainer<Post>>> {
		try
		{
			const query = {id: postId, 'votes.userId':userId, 'votes.stageId':stageId, 'votes.flowId':flowId};

			const options = {votes: { $elemMatch: {'userId':userId, 'stageId':stageId, 'flowId':flowId }}, id:1, postitems:1, title:1, orgaId:1, userId:1, flowId:1, stageId:1, enabled:1, builtIn:1, created:1, stages:1, totals:1, tracks:1, updated:1, deleted:1, expires:1};

			//busca si el usuario ya ha votado antes por el post en el stage
			const resultPost = await this.dataSource.getOneWithOptions(query, {projection: options});
		
			//si no lo encuentra, entonces es primer voto del usuario al post
			if (resultPost.currentItemCount < 1) {

				//crea el voto nuevo
				const newVote:Vote = {  
					flowId:flowId,
					stageId:stageId,
					userId:userId,
					value:voteValue, 
					created: new Date()} as Vote;
	
				//agrega el voto nuevo a la lista de votos del post
				const result = await this.dataSource.updateDirect(postId, { $push: { votes: newVote}});

				//se debe ir por el post nuevamente, sin el filtro de voto
				const resultPostComplete = await this.dataSource.getOne({id: postId});

				//actualiza los totales del post.
				if(resultPostComplete.items[0].totals.length < 1)
				{
					const newTotal:TotalModel = new TotalModel(voteValue == 1 ? voteValue : 0, voteValue == -1 ? voteValue : 0, 1, flowId, stageId);

					const resultTotal = await this.dataSource.updateDirect(postId, { $push: { totals: newTotal}});
				}
				else
				{
					const updateQuery = voteValue == 1 ? { $inc: {'totals.$[elem].totalpositive':1, 'totals.$[elem].totalcount':1}} : { $inc: {'totals.$[elem].totalnegative': 1, 'totals.$[elem].totalcount': 1}};

					const resultTotal = await this.dataSource.updateArray(postId, updateQuery, {arrayFilters: [{'elem.stageId':stageId, 'elem.flowId':flowId}]});
				}
				
				//revisión de cambio de etapa!
				//busca la etapa actual


				await this.checkNextStage(stageId, postId, flowId, resultPostComplete);

				return Either.right(result);
			}
			else if(resultPost.items[0].votes[0].value !=voteValue)
			{

				const beforeVote = resultPost.items[0].votes[0];
				beforeVote.updated = new Date();
				beforeVote.value = voteValue;

			

				const result = await this.dataSource.updateArray(postId, { $set :{'votes.$[elem].updated': new Date(), 'votes.$[elem].value':voteValue}}, {arrayFilters: [{'elem.userId':userId, 'elem.stageId':stageId, 'elem.flowId':flowId}]});

				//actualiza totales:
				//se invierten los valores, solo si el voto tiene otro valor
				const updateQuery = voteValue == 1 ? { $inc: {'totals.$[elem].totalpositive': 1, 'totals.$[elem].totalnegative':-1}} : { $inc: {'totals.$[elem].totalnegative': 1, 'totals.$[elem].totalpositive':-1}};

				const resultTotal = await this.dataSource.updateArray(postId, updateQuery, {arrayFilters: [{'elem.stageId':stageId, 'elem.flowId':flowId}]});


				//revisión de cambio de etapa!
				//busca la etapa actual
				await this.checkNextStage(stageId, postId, flowId, resultPost);
				
				return Either.right(result);
			}


			return Either.left(new GenericFailure('undetermined'));
		}
		catch(error)
		{
			if(error instanceof MongoError)
			{
				return Either.left(new DatabaseFailure(error.name, error.message, error.code, error));
			} else if(error instanceof Error)
				return Either.left(new NetworkFailure(error.name, error.message, undefined, error));
			else return Either.left(new GenericFailure('undetermined', error));	
		}
	}


	private async checkNextStage(stageId: string, postId: string, flowId: string, resultPost: ModelContainer<PostModel>) {

		const resultStage = await this.stageDataSource.getOne({ id: stageId });

		//si la etapa actual tiene Query de salida entonces
		if (resultStage.items[0].queryOut != undefined) {
			//agrego el parámetro id del post
			//para aplicar la query junto con el postId
			//si el resultado devuelve el post entonces coincide
			//con la query para pasar al siguiente etapa.
			const params = (resultStage.items[0].queryOut as { [x: string]: unknown; });
			params['id'] = postId;
			params['stageId'] = stageId;
			params['flowId'] = flowId;

			//aquí busca y revisa si la query de salida coincide con el post.
			const resultProcess = await this.dataSource.getOne(params);

			//si lo consigue y por supuesto el postId coincide entonces
			if (resultProcess.currentItemCount > 0 &&
				resultProcess.items[0].id == postId) {
				//cambiar de etapa a la siguiente, ir por el flow.
				//busca el flow para tener todas las etapas.
				const resultFlow = await this.flowDataSource.getOne({ id: flowId });

				//si existe una siguiente etapa para la etapa actual entonces procede
				if (resultFlow.items[0].stages.filter(e => e.order == resultStage.items[0].order + 1).length > 0) {
					//carga la siguiente etapa en nextStage
					//por eso usa el order + 1
					const nextStage = resultFlow.items[0].stages.filter(e => e.order == resultStage.items[0].order + 1)[0];

					//en listStages se cargan las etapas del post actual
					//para así darle push
					const listStages = resultPost.items[0].stages;

					//se agrega la nueva o siguiente etapa a la lista de etapas del post
					listStages.push(nextStage);

					//aquí se actualizan las etapas y el stageId con la nueva etapa.
					const resultUpdatePost = await this.dataSource.update(postId, { stageId: nextStage.id, stages: listStages });

				}

			}

		}
	}
}