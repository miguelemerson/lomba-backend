///Listado de páginas o boxes de Posts. Estos mismos nombres se manejan en Backend
export class BoxPages {
	static  uploadedPosts = 'uploaded';
	static  forApprovePosts = 'forapprove';
	static  approvedPosts = 'approved';
	static  rejectedPosts = 'rejected';
	static  latestPosts = 'latest';
	static  popularPosts = 'popular';
	static  votedPosts = 'voted';
	
	static List: string[] = [
		BoxPages.uploadedPosts,
		BoxPages.forApprovePosts,
		BoxPages.approvedPosts,
		BoxPages.rejectedPosts,
		BoxPages.latestPosts,
		BoxPages.popularPosts,
		BoxPages.votedPosts
	];
}