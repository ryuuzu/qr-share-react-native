import { useState, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { MainQrContainer } from "./components/mainQrContainer";
import { QRsContainer } from "./components/qrsContainer";
import {
	FAB,
	Dialog,
	Portal,
	Snackbar,
	Menu,
	Button,
} from "react-native-paper";
import { Account, BankAccountData, eSewaAccountData } from "./@types/Account";
import { readData, saveData } from "./utils/filemanager";
import { PaperProvider } from "react-native-paper";
import { AccountForm } from "./components/accountForm";
import { BarCodeScanner } from "expo-barcode-scanner";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Platform } from "react-native";
import { EventPressCoords } from "./@types/EventPress";

export default function App() {
	const [accounts, setAccounts] = useState<Account[]>([]);
	const [activeAccount, setActiveAccount] = useState<Account | null>(null);

	// Menu for selected account
	const [selectedAccount, setSelectedAccount] = useState<Account | null>(
		null
	);
	const [qrMenuLocation, setQrMenuLocation] = useState<EventPressCoords>({
		x: 0,
		y: 0,
	});
	const [isQrMenuVisible, setIsQrMenuVisible] = useState<boolean>(false);
	const showQrMenu = () => setIsQrMenuVisible(true);
	const hideQrMenu = () => {
		setIsQrMenuVisible(false);
	};

	// Dialog for deleting account
	const [isDeleteAccountDialogVisible, setIsDeleteAccountDialogVisible] =
		useState<boolean>(false);
	const showDeleteAccountDialog = () => setIsDeleteAccountDialogVisible(true);
	const hideDeleteAccountDialog = () =>
		setIsDeleteAccountDialogVisible(false);

	// Dialog for adding new account
	const [isAddAccountDialogVisible, setIsAddAccountDialogVisible] =
		useState<boolean>(false);
	const showAddAccountDialog = () => setIsAddAccountDialogVisible(true);
	const hideAddAccountDialog = () => setIsAddAccountDialogVisible(false);

	// Dialog for editing account
	const [isEditAccountDialogVisible, setIsEditAccountDialogVisible] =
		useState<boolean>(false);
	const showEditAccountDialog = () => setIsEditAccountDialogVisible(true);
	const hideEditAccountDialog = () => setIsEditAccountDialogVisible(false);

	// FABGroup for adding new account
	const [isAddFABGroupVisible, setIsAddFABGroupVisible] =
		useState<boolean>(false);
	const onAddFABGroupStateChange = ({ open }: { open: boolean }) =>
		setIsAddFABGroupVisible(open);

	// Account Handling
	const addAccount = (newAccount: Account) => {
		if (
			accounts.filter((account) => account.id === newAccount.id).length >
			0
		) {
			showSnackbar("Account already exists");
			return false;
		} else {
			setAccounts([...accounts, newAccount]);
			showSnackbar("Account added successfully");
			return true;
		}
	};

	const deleteAccount = (account: Account) => {
		setAccounts(accounts.filter((acc) => acc.id !== account.id));
		showSnackbar("Account deleted successfully");
	};

	// Snackbar for showing errors
	const [isSnackbarVisible, setIsSnackbarVisible] = useState<boolean>(false);
	const [snackbarMessage, setSnackbarMessage] = useState<string>("");
	const showSnackbar = (message: string) => {
		setSnackbarMessage(message);
		setIsSnackbarVisible(true);
	};
	const hideSnackbar = () => setIsSnackbarVisible(false);

	// Barcode scanner settings
	const [
		hasPermissionsForBarCodeScanner,
		setHasPermissionsForBarCodeScanner,
	] = useState<boolean>(false);
	const [displayScanner, setDisplayScanner] = useState<boolean>(false);

	// Requesting permissions for barcode scanner
	useEffect(() => {
		(async () => {
			const { status } = await BarCodeScanner.requestPermissionsAsync();
			setHasPermissionsForBarCodeScanner(status === "granted");
		})();
	}, []);

	// Handling barcode scanner
	const handleBarCodeScanned = ({
		type,
		data,
	}: {
		type: string;
		data: string;
	}) => {
		setDisplayScanner(false);
		let qrData: BankAccountData | eSewaAccountData;
		try {
			qrData = JSON.parse(data);
		} catch (error) {
			showSnackbar("Invalid QR Code");
			return;
		}

		let newAccount: Account;

		if ("bankCode" in qrData) {
			newAccount = {
				id:
					qrData.accountName.toLowerCase().replaceAll(" ", "") +
					qrData.accountNumber,
				name: `${qrData.accountName}'s ${qrData.bankCode}`,
				accountNumber: qrData.accountNumber,
				accountName: qrData.accountName,
				bankType: qrData.bankCode,
			};
			addAccount(newAccount);
		} else if ("eSewa_id" in qrData) {
			newAccount = {
				id:
					qrData.name.toLowerCase().replaceAll(" ", "") +
					qrData.eSewa_id,
				name: `${qrData.name}'s eSewa`,
				accountNumber: qrData.eSewa_id,
				accountName: qrData.name,
				bankType: "eSewa",
			};
			addAccount(newAccount);
		} else {
			showSnackbar("Invalid QR Code");
		}
	};

	const submitAddAccountForm = (
		name: string,
		accountNumber: string,
		accountName: string,
		bankType: string
	): boolean => {
		let id = name.toLowerCase().replace(" ", "") + accountNumber;
		const newAccount: Account = {
			id,
			name,
			accountNumber,
			accountName,
			bankType,
		};
		let accountCreated = addAccount(newAccount);
		if (!accountCreated) {
			return false;
		}
		hideAddAccountDialog();
		return true;
	};

	const submitEditAccountForm = (
		name: string,
		accountNumber: string,
		accountName: string,
		bankType: string
	): boolean => {
		let editAccountIndex = accounts.findIndex(
			(account) => account.id === selectedAccount?.id
		);
		setAccounts([
			...accounts.slice(0, editAccountIndex),
			{
				id: selectedAccount?.id!,
				name,
				accountNumber,
				accountName,
				bankType,
			},
			...accounts.slice(editAccountIndex + 1),
		]);
		hideEditAccountDialog();
		return true;
	};

	const initializeAndSaveAccounts = () => {
		const initialAccountsData = [
			{
				id: "es1",
				name: "Ryuuzu's eSewa Account",
				accountNumber: "9862957119",
				accountName: "Utsav Gurmachhan Magar",
				bankType: "eSewa",
			},
		];
		setAccounts(initialAccountsData);
	};

	useEffect(() => {
		readData().then((savedAccounts) => {
			setAccounts(savedAccounts);
			if (savedAccounts.length === 0) {
				console.log(
					`${Platform.OS}: No accounts found. Initializing with default accounts`
				);
				initializeAndSaveAccounts();
			}
		});
	}, []);

	useEffect(() => {
		if (accounts.length > 0) {
			saveData(accounts).then(() => {
				console.log(`${Platform.OS}: Data saved into the file`);
				console.log(`${Platform.OS}:`, accounts);
			});
		}
	}, [accounts]);

	return (
		<SafeAreaProvider>
			<PaperProvider>
				<View style={styles.container}>
					{accounts.length > 0 ? (
						<>
							<MainQrContainer account={activeAccount} />
							<QRsContainer
								activeAccount={activeAccount}
								setActiveAccount={setActiveAccount}
								accounts={accounts}
								setSelectedAccount={setSelectedAccount}
								showQrMenu={showQrMenu}
								setQrMenuLocation={setQrMenuLocation}
							/>
						</>
					) : (
						<Text>No Accounts Found</Text>
					)}
					<FAB.Group
						open={isAddFABGroupVisible}
						visible
						onStateChange={onAddFABGroupStateChange}
						icon={isAddFABGroupVisible ? "close" : "plus"}
						actions={[
							{
								icon: "plus",
								label: "Add new account",
								onPress: () => showAddAccountDialog(),
							},
							{
								icon: "camera",
								label: "Scan new account",
								onPress: () => setDisplayScanner(true),
							},
						]}
					/>
					{displayScanner && (
						<Portal>
							<BarCodeScanner
								onBarCodeScanned={handleBarCodeScanned}
								style={StyleSheet.absoluteFillObject}
							/>
							<FAB
								icon="close"
								style={styles.scannerFab}
								onPress={() => setDisplayScanner(false)}
							/>
						</Portal>
					)}
					<Portal>
						<Menu
							visible={isQrMenuVisible}
							onDismiss={hideQrMenu}
							anchor={{
								x: qrMenuLocation.x,
								y: qrMenuLocation.y,
							}}
						>
							<Menu.Item
								leadingIcon={"pencil"}
								onPress={() => {
									showEditAccountDialog();
									hideQrMenu();
								}}
								title="Edit"
							/>
							<Menu.Item
								leadingIcon={"delete"}
								onPress={() => {
									showDeleteAccountDialog();
									hideQrMenu();
								}}
								title="Delete"
							/>
						</Menu>
					</Portal>
					{/* Account Handling Modals/Dialogs */}
					<Portal>
						<Dialog
							visible={isAddAccountDialogVisible}
							onDismiss={hideAddAccountDialog}
							style={styles.addAccountContainerStyle}
						>
							<AccountForm
								hideForm={hideAddAccountDialog}
								submitForm={submitAddAccountForm}
								account={null}
							/>
						</Dialog>
						<Dialog
							visible={isEditAccountDialogVisible}
							onDismiss={hideEditAccountDialog}
							style={styles.addAccountContainerStyle}
						>
							<AccountForm
								hideForm={hideEditAccountDialog}
								submitForm={submitEditAccountForm}
								account={selectedAccount}
							/>
						</Dialog>
						<Dialog
							visible={isDeleteAccountDialogVisible}
							onDismiss={hideDeleteAccountDialog}
							style={styles.deleteAccountContainerStyle}
						>
							<Dialog.Icon
								icon="alert-circle"
								color="red"
								size={48}
							/>
							<Dialog.Title>Confirm Delete</Dialog.Title>
							<Dialog.Content>
								<Text>
									Are you sure you want to delete{" "}
									{selectedAccount?.name} account?
								</Text>
							</Dialog.Content>
							<Dialog.Actions>
								<Button
									labelStyle={{ color: "red" }}
									onPress={() => hideDeleteAccountDialog()}
								>
									Cancel
								</Button>
								<Button
									onPress={() => {
										deleteAccount(selectedAccount!);
										setSelectedAccount(null);
										hideDeleteAccountDialog();
									}}
								>
									Delete
								</Button>
							</Dialog.Actions>
						</Dialog>
					</Portal>
					<Portal>
						<Snackbar
							visible={isSnackbarVisible}
							onDismiss={hideSnackbar}
							duration={3000}
						>
							{snackbarMessage}
						</Snackbar>
					</Portal>
					<StatusBar style="auto" />
				</View>
			</PaperProvider>
		</SafeAreaProvider>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#fff",
		alignItems: "center",
		justifyContent: "center",
	},
	addAccountContainerStyle: {
		backgroundColor: "white",
		borderRadius: 18,
		padding: 20,
		margin: 16,
	},
	deleteAccountContainerStyle: {
		backgroundColor: "white",
		borderRadius: 18,
	},
	scannerFab: {
		position: "absolute",
		top: 50,
		right: 30,
		borderRadius: 28,
	},
});
