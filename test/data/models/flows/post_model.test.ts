import { PostModel } from '../../../../src/data/models/flows/post_model';
import { Post } from '../../../../src/domain/entities/flows/post';


describe('Test de post model', () => {

	const listPosts: PostModel[] = [
		new PostModel('idpost', [], 'título', 'orgaId', 'userId', 'flowId', 'stageId', true, false)
	];

	beforeEach(() => {
		jest.clearAllMocks();
	});

	test('convertir a entidad', () => {
		//arrange
		const model = listPosts[0];
		const entity = { _id:model.id,id: model.id, postitems: [], title: model.title, orgaId: model.orgaId, userId: model.userId, flowId: model.flowId, stageId: model.stageId, enabled: true, builtIn: false, deleted: undefined, expires: undefined, stages:[], totals:[], tracks:[], updated: undefined, votes:[] } as unknown as Post;

		entity.created = model.created;

		//act
		const result = model.toEntity();

		//assert
		expect(result).toEqual(entity);
	});

});