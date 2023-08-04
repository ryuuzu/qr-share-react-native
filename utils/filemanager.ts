import * as FileSystem from "expo-file-system";
import { Account } from "../@types/Account";

const dataDir = FileSystem.documentDirectory + "data/";
const dataFileUri = dataDir + "accounts.json";

async function ensureDirExists() {
	const dirInfo = await FileSystem.getInfoAsync(dataDir);
	if (!dirInfo.exists) {
		console.log("Data directory doesn't exist, creating...");
		await FileSystem.makeDirectoryAsync(dataDir, { intermediates: true });
	}
}

async function ensureDataFileExists() {
	await ensureDirExists();
	const fileInfo = await FileSystem.getInfoAsync(dataFileUri);
	if (!fileInfo.exists) {
		console.log("Data file doesn't exist, creating...");
		await FileSystem.writeAsStringAsync(dataFileUri, JSON.stringify([]));
	}
}

export async function saveData(accountsData: Account[]) {
	await ensureDirExists();
	await FileSystem.writeAsStringAsync(
		dataFileUri,
		JSON.stringify(accountsData)
	);
}

export async function readData() {
	await ensureDataFileExists();
	const jsonData = await FileSystem.readAsStringAsync(dataFileUri);
	return JSON.parse(jsonData);
}
