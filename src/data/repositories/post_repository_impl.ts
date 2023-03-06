import { MongoError } from 'mongodb';
import { BoxPages } from '../../core/box_page';
import { Either } from '../../core/either';
import { DatabaseFailure, Failure, GenericFailure, NetworkFailure } from '../../core/errors/failures';
import { ModelContainer } from '../../core/model_container';
import { Post } from '../../domain/entities/flows/post';
import { PostItem } from '../../domain/entities/flows/postitem';
import { Stage } from '../../domain/entities/flows/stage';
import { TextContent } from '../../domain/entities/flows/textcontent';
import { Vote } from '../../domain/entities/flows/vote';
import { PostRepository } from '../../domain/repositories/post_repository';
import { FlowDataSource } from '../datasources/flow_data_source';
import { PostDataSource } from '../datasources/post_data_source';
import { StageDataSource } from '../datasources/stage_data_source';
import { PostModel } from '../models/flows/post_model';
import { TotalModel } from '../models/flows/total_model';

export class PostRepositoryImpl implements PostRepository {
	dataSource: PostDataSource;
	stageDataSource: StageDataSource;
	flowDataSource: FlowDataSource;
	constructor(dataSource: PostDataSource, stageDataSource: StageDataSource, flowDataSource: FlowDataSource){
		this.dataSource = dataSource;
		this.stageDataSource = stageDataSource;
		this.flowDataSource = flowDataSource;
	}
	async enablePost(postId: string, enableOrDisable: boolean): Promise<Either<Failure, boolean>> {
		try{
			const result = await this.dataSource.enable(postId, enableOrDisable);
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
	async changeStage(postId: string, flowId: string, stageId: string): Promise<Either<Failure, ModelContainer<Post>>> {
		try{

			const result = await this.dataSource.update(postId, {stageId:stageId});

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

	async getPosts(orgaId: string, userId: string, flowId: string, stageId: string, boxPage: string, searchText: string, params: {[x: string]: unknown}, sort?: [string, 1 | -1][] | undefined, pageIndex?: number | undefined, itemsPerPage?: number | undefined): Promise<Either<Failure, ModelContainer<Post>>> {
		try
		{
			if (boxPage == BoxPages.uploadedPosts) {

				if(!sort)
				{
					sort = [['created', -1]];
				}

				const result = await this.dataSource.getUploadedPosts(orgaId, userId, flowId, stageId, searchText, (params['isdraft'] as string).toString() == 'true', sort, pageIndex, itemsPerPage);
				return Either.right(result);
			}
			if (boxPage == BoxPages.forApprovePosts) {

				if(!sort)
				{
					sort = [['created', -1]];
				}				

				const result = await this.dataSource.getForApprovePosts(orgaId, userId, flowId, stageId, searchText, sort, pageIndex, itemsPerPage);
				return Either.right(result);
			}
			if (boxPage == BoxPages.approvedPosts) {
				if(!sort)
				{
					sort = [['created', -1]];
				}
				
				const result = await this.dataSource.getApprovedPosts(orgaId, userId, flowId, stageId, searchText, sort, pageIndex, itemsPerPage);
				return Either.right(result);
			}
			if (boxPage == BoxPages.rejectedPosts) {
				if(!sort)
				{
					sort = [['created', -1]];
				}

				const result = await this.dataSource.getRejectedPosts(orgaId, userId, flowId, stageId, searchText, sort, pageIndex, itemsPerPage);
				return Either.right(result);
			}
			if (boxPage == BoxPages.latestPosts) {
				sort = [['created',-1]];

				const result = await this.dataSource.getLatestPosts(orgaId, userId, flowId, stageId, searchText, sort, pageIndex, itemsPerPage);
				return Either.right(result);
			}
			if (boxPage == BoxPages.popularPosts) {
				sort = [['totals.totalpositive',-1]];

				const result = await this.dataSource.getPopularPosts(orgaId, userId, flowId, stageId, searchText, sort, pageIndex, itemsPerPage);			
				return Either.right(result);	
			}
			if (boxPage == BoxPages.votedPosts) {
				if(!sort)
				{
					sort = [['created', -1]];
				}
				const onlyWithVote = (params['voteState'] as string).toString() == '1' || (params['voteState'] as string).toString() == '-1' ? parseInt((params['voteState'] as string).toString()) : 0;

				const result = await this.dataSource.getVotedPosts(orgaId, userId, flowId, stageId, searchText, onlyWithVote, sort, pageIndex, itemsPerPage);
				return Either.right(result);
			}
		
			return Either.left(new GenericFailure('no boxpage found'));		
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
			const resultFlow = await this.flowDataSource.getById(flowId);
			
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
					const changes:object = {postitems:postItems, stageId:postStageId, stages:listStages, votes:listVotes};

					const resultUpdatePost = await this.dataSource.update(resultAddPost.items[0].id, changes);

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

	async sendVote(orgaId:string, userId: string, flowId: string, stageId: string, postId: string, voteValue: number): Promise<Either<Failure, ModelContainer<Post>>> {
		try
		{
			//busca si el usuario ya ha votado antes por el post en el stage
			const resultPost = await this.dataSource.getIfHasVote(userId, flowId, stageId, postId);
		
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
				const result = await this.dataSource.pushToArrayField(postId, { votes: newVote});

				//se debe ir por el post nuevamente, sin el filtro de voto
				const resultPostComplete = await this.dataSource.getById(postId);

				//actualiza los totales del post.
				if(resultPostComplete.items[0].totals.length < 1)
				{
					const newTotal:TotalModel = new TotalModel(voteValue == 1 ? voteValue : 0, voteValue == -1 ? voteValue : 0, 1, flowId, stageId);

					const resultTotal = await this.dataSource.pushToArrayField(postId, { totals: newTotal});
				}
				else
				{
					const resultTotal = await this.dataSource.updateTotals(postId, flowId, stageId, voteValue);
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

				const result = await this.dataSource.updateVote(postId, userId, flowId, stageId, voteValue);

				//actualiza totales:
				//se invierten los valores, solo si el voto tiene otro valor
				const resultTotal = await this.dataSource.updateTotals(postId, flowId, stageId, voteValue);

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

	async updatePost(postId: string, userId: string, title: string, textContent: TextContent): Promise<Either<Failure, ModelContainer<Post>>> {
		try
		{
			const resultPost = await this.dataSource.getById(postId);

			if(resultPost.currentItemCount > 0) {
				const listPostItem = resultPost.items[0].postitems;

				listPostItem[0].content = textContent;

				const resultUpdate = await this.dataSource.update(resultPost.items[0].id, {title: title, postitems: listPostItem});

				if(resultUpdate.currentItemCount > 0) {
					return Either.right(resultUpdate);
				} else {
					return Either.left(new GenericFailure('no se realizó actualización'));
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

	async deletePost(postId: string, userId: string): Promise<Either<Failure, ModelContainer<Post>>> {
		try
		{
			const resultPost = await this.dataSource.getById(postId);

			if(resultPost.currentItemCount > 0) {

				const resultDelete = await this.dataSource.delete(resultPost.items[0].id);

				if(resultDelete) {
					return Either.right(resultPost);
				} else {
					return Either.left(new GenericFailure('no se realizó la eliminación'));
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


	private async checkNextStage(stageId: string, postId: string, flowId: string, resultPost: ModelContainer<PostModel>) {

		const resultStage = await this.stageDataSource.getById(stageId);

		//si la etapa actual tiene Query de salida entonces
		if (resultStage.items[0].queryOut != undefined) {
			//agrego el parámetro id del post
			//para aplicar la query junto con el postId
			//si el resultado devuelve el post entonces coincide
			//con la query para pasar al siguiente etapa.
			//aquí busca y revisa si la query de salida coincide con el post.
			const resultProcess = await this.dataSource.getByQueryOut(postId, flowId, stageId, (resultStage.items[0].queryOut as { [x: string]: unknown; }));

			//si lo consigue y por supuesto el postId coincide entonces
			if (resultProcess.currentItemCount > 0 &&
				resultProcess.items[0].id == postId) {
				//cambiar de etapa a la siguiente, ir por el flow.
				//busca el flow para tener todas las etapas.
				const resultFlow = await this.flowDataSource.getById(flowId);

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