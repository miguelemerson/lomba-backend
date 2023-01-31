import { Flow } from '../../domain/entities/flows/flow';
import { Post } from '../../domain/entities/flows/post';
import { PostItem } from '../../domain/entities/flows/postitem';
import { Stage } from '../../domain/entities/flows/stage';
import { TextContent } from '../../domain/entities/flows/textcontent';
import { data_insert01 } from './load_data_01';

const flowId = '00000111-0111-0111-0111-000000000111';
const stageId01Load = '00000AAA-0111-0111-0111-000000000111';
const stageId02Approval = '00000BBB-0111-0111-0111-000000000111';
const stageId03Voting = '00000CCC-0111-0111-0111-000000000111';

const post01Id = '00001AAA-0119-0111-0111-000000000000';
const post02Id = '00002AAA-0119-0111-0111-000000000000';
const post03Id = '00003AAA-0119-0111-0111-000000000000';

export const checkData01 = async () => {
	data_insert02.flows[0].stages = data_insert02.stages;
};

export const data_insert02 = {

	stages:[{name: 'Carga', order:1, queryOut: {},
		_id:stageId01Load, id:stageId01Load, enabled:true, builtIn:true, created: new Date()} as Stage,
        {name: 'Aprobación', order:1, queryOut: {},_id:stageId02Approval, id:stageId02Approval, enabled:true, builtIn:true, created: new Date()} as Stage,{name: 'Votación', order:1, queryOut: {},_id:stageId03Voting, id:stageId03Voting, enabled:true, builtIn:true, created: new Date()} as Stage],

	flows:[{name: 'Flujo de Votación', stages:[], _id:flowId, id:flowId, enabled:true, builtIn:true, created: new Date()} as Flow],

	postitems:[{order:1, content: {text:'texto de un post!'} as TextContent, type:'text', format:'', builtIn:true, created: new Date()} as PostItem, {order:1, content: {text:'esto es otro post'} as TextContent, type:'text', format:'', builtIn:true, created: new Date()} as PostItem, {order:1, content: {text:'se trata del tercer post'} as TextContent, type:'text', format:'', builtIn:true, created: new Date()} as PostItem],
    
	posts:[{postitems:[], title:'primer post del sistema', orgaId: data_insert01.orgas[1].id, userId: data_insert01.users[4].id, flowId:flowId, stageId: stageId01Load, stages:[], totals:[], tracks:[], _id:post01Id, id:post01Id, enabled:true, builtIn:true, created: new Date()} as Post, {postitems:[], title:'este es el segundo post', orgaId: data_insert01.orgas[1].id, userId: data_insert01.users[4].id, flowId:flowId, stageId: stageId01Load, stages:[], totals:[], tracks:[], _id:post02Id, id:post02Id, enabled:true, builtIn:true, created: new Date()} as Post, {postitems:[], title:'tercer post en fila', orgaId: data_insert01.orgas[1].id, userId: data_insert01.users[5].id, flowId:flowId, stageId: stageId01Load, stages:[], totals:[], tracks:[], _id:post03Id, id:post03Id, enabled:true, builtIn:true, created: new Date()} as Post]



};