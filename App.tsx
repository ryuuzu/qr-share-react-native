import { useState, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { MainQrContainer } from "./components/mainQrContainer";
import { QRsContainer } from "./components/qrsContainer";
import { Linking } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import {
	FAB,
	Dialog,
	Portal,
	Snackbar,
	Menu,
	Button,
} from "react-native-paper";
import { Account, BankAccountData, eSewaAccountData } from "./@types/account";
import { PaperProvider } from "react-native-paper";
import { AccountForm } from "./components/accountForm";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Platform } from "react-native";
import { EventPressCoords } from "./@types/EventPress";
import React from "react";
import { useGlobalStore } from "./components/store";

export default function App() {
	const {
		accounts,
		addAccount: addAccountToStore,
		deleteAccount: deleteAccountFromStore,
		saveAccounts,
		loadAccounts,
		selectedAccount,
	} = useGlobalStore();

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
			addAccountToStore(newAccount);
			showSnackbar("Account added successfully");
			return true;
		}
	};

	const deleteAccount = (account: Account) => {
		deleteAccountFromStore(account);
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
	const [permission, requestPermission] = useCameraPermissions();
	const [
		hasPermissionsForBarCodeScanner,
		setHasPermissionsForBarCodeScanner,
	] = useState<boolean>(false);
	const [displayScanner, setDisplayScanner] = useState<boolean>(false);

	// Requesting permissions for barcode scanner
	useEffect(() => {
		(async () => {
			if (permission?.status === "denied") {
				showSnackbar("Camera permission is required to scan QR Codes");
			}
			if (permission?.canAskAgain) {
				await requestPermission();
			}
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
				name: `${qrData.accountName.split(" ", 2)[0]}'s ${
					qrData.bankCode
				}`,
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
				name: `${qrData.name.split(" ", 2)[0]}'s eSewa`,
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

	const initializeAndSaveAccounts = () => {
		addAccount({
			id: "es1",
			name: "Ryuuzu's eSewa Account",
			accountNumber: "9862957119",
			accountName: "Utsav Gurmachhan Magar",
			bankType: "eSewa",
		});
	};

	useEffect(() => {
		loadAccounts().then((savedAccounts) => {
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
			saveAccounts().then(() => {
				console.log(`${Platform.OS}: Data saved into the file`);
			});
		}
	}, [accounts]);

	return (
		<SafeAreaProvider>
			<PaperProvider>
				<View style={styles.container}>
					{accounts.length > 0 ? (
						<>
							<MainQrContainer />
							<QRsContainer
								accounts={accounts}
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
								icon: "star-outline",
								label: "Feedback",
								onPress: () => {
									Linking.canOpenURL(
										"https://api.ryuuzu.xyz/short/qr-share-feedback"
									).then((supported) => {
										if (supported) {
											Linking.openURL(
												"https://api.ryuuzu.xyz/short/qr-share-feedback"
											);
										} else {
											showSnackbar("An error occured ");
										}
									});
								},
							},
							{
								icon: "bug",
								label: "Report a bug",
								onPress: () => {
									Linking.canOpenURL(
										"https://api.ryuuzu.xyz/short/qr-share-bug-report"
									).then((supported) => {
										if (supported) {
											Linking.openURL(
												"https://api.ryuuzu.xyz/short/qr-share-bug-report"
											);
										} else {
											showSnackbar("An error occured");
										}
									});
								},
							},
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
							<CameraView
								facing="back"
								onBarcodeScanned={handleBarCodeScanned}
								barcodeScannerSettings={{
									barcodeTypes: ["qr"],
								}}
								style={StyleSheet.absoluteFillObject}
							>
								<FAB
									icon="close"
									style={styles.scannerFab}
									onPress={() => setDisplayScanner(false)}
								/>
							</CameraView>
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
							{/* <Menu.Item
								leadingIcon={"pencil"}
								onPress={() => {}}
								title="Edit"
							/> */}
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
										if (selectedAccount) {
											deleteAccount(selectedAccount);
										} else {
											showSnackbar("Account not found");
										}
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
