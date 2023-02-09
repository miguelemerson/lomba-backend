// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

/**
 * @summary list containers in an account, showing options for paging, resuming paging, etc.
 */

import { BlobServiceClient, ContainerClient, StorageSharedKeyCredential } from '@azure/storage-blob';

// Load the .env file if it exists
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import { configEnv } from './config_env';
dotenv.config();

async function main() {
	// Enter your storage account name and shared key
	const account = configEnv().AZSTORAGEACCOUNT_NAME;
	const accountKey = configEnv().AZSTORAGEACCOUNT_KEY;

	// Use StorageSharedKeyCredential with storage account and account key
	// StorageSharedKeyCredential is only available in Node.js runtime, not in browsers
	const sharedKeyCredential = new StorageSharedKeyCredential(account, accountKey);

	// List containers
	const blobServiceClient = new BlobServiceClient(
		`https://${account}.blob.core.windows.net`,
		sharedKeyCredential
	);

	// Iterate over all containers in the account
	console.log('Containers:');
	for await (const container of blobServiceClient.listContainers()) {
		console.log(`- ${container.name}`);
	}

	// The iterator also supports iteration by page with a configurable (and optional) `maxPageSize` setting.
	console.log('Containers (by page):');
	for await (const response of blobServiceClient.listContainers().byPage({
		maxPageSize: 20
	})) {
		console.log('- Page:');
		if (response.containerItems) {
			for (const container of response.containerItems) {
				console.log(`  - ${container.name}`);
			}
		}
	}

	//cargar archivo
	// get Container - full public read access
	const conainerName = 'testsubidos3';
	const containerClient: ContainerClient =
    blobServiceClient.getContainerClient(conainerName);
	//await blobServiceClient.createContainer(conainerName);

	let exist = false;
	for await (const blob of containerClient.listBlobsFlat()) {
		console.log(`${blob.name}`);
    
		if(blob.name == conainerName)
		{
			console.log('existe');
			exist = true;
		}
	}

	blobServiceClient.createContainer(conainerName).then(async () => {
		const data = fs.readFileSync('./gokusunglasses.jpg');

		const blobClient = containerClient.getBlockBlobClient('gokusunglasses.jpg');
    
		// set mimetype as determined from browser with file upload control
		//const options = { blobHTTPHeaders: { blobContentType: file.type } };
      
		// upload file
		await blobClient.uploadData(data);
	});





}

main().catch((error) => {
	console.error(error);
	process.exit(1);
});