import { BlobServiceClient, ContainerClient, ContainerCreateOptions, StorageSharedKeyCredential } from '@azure/storage-blob';


export interface BlobStorageSource {
    uploadBlob(dataBytes:Buffer, filename: string, path: string):Promise<boolean>;
    startContainer():void;
	blobService: BlobServiceClient;
	containerName: string;
}

export class BlobStorageSourceImpl implements BlobStorageSource {
	blobService: BlobServiceClient;
	containerName: string;

	constructor(blobService: BlobServiceClient, containerName:string){
		this.blobService = blobService;
		this.containerName = containerName;
	}

	async startContainer(): Promise<void> {
		try
		{
			let existContainer : boolean;
			existContainer = false;
			for await (const container of this.blobService.listContainers()) {
				if(container.name == this.containerName)
				{
					existContainer = true;
				}
			}

			if(!existContainer)
			{
				const options:ContainerCreateOptions = {'access': 'blob'};
				await this.blobService.createContainer(this.containerName, options);
			}
			return;
		}
		catch(e)
		{
			return;
		}
	}

	async uploadBlob(dataBytes:Buffer, filename: string, path: string):Promise<boolean>{
		try
		{
			let existContainer : boolean;
			existContainer = false;
			for await (const container of this.blobService.listContainers()) {
				if(container.name == this.containerName)
				{
					existContainer = true;
				}
			}

			if(!existContainer)
			{
				const options:ContainerCreateOptions = {'access': 'blob'};
				await this.blobService.createContainer(this.containerName, options);
			}
			const containerClient: ContainerClient =
        this.blobService.getContainerClient(this.containerName);

			const blobClient = containerClient.getBlockBlobClient(`${path}/${filename}`);
    
			const resp = await blobClient.uploadData(dataBytes);
        
			if(resp)
			{
				return true;
			}
		}
		catch(e)
		{
			return false;
		}
		return false;
	}

	static newBlobService(accountName:string, accountKey:string): BlobServiceClient
	{
		const sharedKeyCredential = new StorageSharedKeyCredential(accountName, accountKey);

		return new BlobServiceClient(
			`https://${accountName}.blob.core.windows.net`,
			sharedKeyCredential
		);
	}
}