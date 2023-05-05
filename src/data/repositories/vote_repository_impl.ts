import { MongoError } from 'mongodb';
import { Either } from '../../core/either';
import { DatabaseFailure, Failure, GenericFailure, NetworkFailure } from '../../core/errors/failures';
import { ModelContainer } from '../../core/model_container';
import { VoteRepository } from '../../domain/repositories/vote_repository';
import { VoteDataSource } from '../datasources/vote_data_source';
import { VoteModel } from '../models/workflow/vote_model';
import { PostDataSource } from '../datasources/post_data_source';
import { Vote } from '../../domain/entities/workflow/vote';
import { TotalModel } from '../models/workflow/total_model';
import { PostModel } from '../models/workflow/post_model';
import { StageDataSource } from '../datasources/stage_data_source';
import { FlowDataSource } from '../datasources/flow_data_source';

export class VoteRepositoryImpl implements VoteRepository {
	dataSource: VoteDataSource;
	postDataSource: PostDataSource;
	stageDataSource: StageDataSource;
	flowDataSource: FlowDataSource;
	constructor(dataSource: VoteDataSource, postDataSource: PostDataSource, flowDataSource: FlowDataSource, stageDataSource: StageDataSource){
		this.dataSource = dataSource;
		this.postDataSource = postDataSource;
		this.flowDataSource = flowDataSource;
		this.stageDataSource = stageDataSource;
	}
	async sendVote(orgaId: string, userId: string, flowId: string, stageId: string, postId: string, voteValue: number): Promise<Either<Failure, ModelContainer<VoteModel>>> {
		try
		{

			//busca si el usuario ya ha votado antes por el post en el stage
			const resultVote = await this.dataSource.getVote(userId, flowId, stageId, postId);
			//si no lo encuentra, entonces es primer voto del usuario al post
			if (resultVote.currentItemCount < 1) {

				//crea el voto nuevo para agregarle
				const newVote = new VoteModel('', userId, postId, flowId, stageId, `${userId}-${stageId}-${flowId}`, voteValue, true, false);

				//agrega el voto nuevo a la lista de votos del post
				const result = await this.dataSource.add(newVote);
	
				//se debe ir por el post nuevamente, sin el filtro de voto
				const resultPost = await this.postDataSource.getById(postId);

				//actualiza los totales del post.
				if(resultPost.items[0].totals.filter(t=> t.flowId == flowId && t.stageId == stageId).length < 1)
				{
					const newTotal:TotalModel = new TotalModel(voteValue == 1 ? Math.abs(voteValue) : 0, voteValue == -1 ? Math.abs(voteValue) : 0, 1, flowId, stageId);

					await this.postDataSource.pushToArrayField(postId, { totals: newTotal});
				}
				else
				{
					await this.postDataSource.updateTotals(postId, flowId, stageId, voteValue, true);
				}
				
				//revisión de cambio de etapa!
				//busca la etapa actual
				await this.checkNextStage(stageId, postId, flowId, resultPost);

				return Either.right(result);
			}
			else if(resultVote.items[0].value !=voteValue)
			{

				const beforeVote = resultVote.items[0];
				beforeVote.updated = new Date();
				beforeVote.value = voteValue;

				const result = await this.dataSource.update(beforeVote.id,{value:voteValue});

				//actualiza totales:
				//se invierten los valores, solo si el voto tiene otro valor
				await this.postDataSource.updateTotals(postId, flowId, stageId, voteValue, false);

				//revisión de cambio de etapa!
				//busca la etapa actual
				//se debe ir por el post nuevamente, sin el filtro de voto
				const resultPost = await this.postDataSource.getById(postId);
				await this.checkNextStage(stageId, postId, flowId, resultPost);
				
				return Either.right(result);
			} else
			{
				return Either.right(resultVote);
			}
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
	async getVotes(postId: string, params: { [x: string]: unknown; }, sort?: [string, 1 | -1][] | undefined, pageIndex?: number | undefined, itemsPerPage?: number | undefined): Promise<Either<Failure, ModelContainer<VoteModel>>> {
		try
		{
			const result = await this.dataSource.getByPost(postId, sort, pageIndex, itemsPerPage);
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
	
	private async checkNextStage(stageId: string, postId: string, flowId: string, resultPost: ModelContainer<PostModel>) {

		const resultStage = await this.stageDataSource.getById(stageId);

		//si la etapa actual tiene Query de salida entonces
		if (resultStage.items[0].queryOut != undefined) {
			//agrego el parámetro id del post
			//para aplicar la query junto con el postId
			//si el resultado devuelve el post entonces coincide
			//con la query para pasar al siguiente etapa.
			//aquí busca y revisa si la query de salida coincide con el post.
			const resultProcess = await this.postDataSource.getByQueryOut(postId, flowId, stageId, (resultStage.items[0].queryOut as { [x: string]: unknown; }));

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
					await this.postDataSource.update(postId, { stageId: nextStage.id, stages: listStages });

					await this.postDataSource.addTrack('goforward', `Avanza a ${nextStage.name}`, postId, '', flowId, stageId, nextStage.id,{ stageId: nextStage.id, stages: nextStage });

				}

			}

		}
	}


}