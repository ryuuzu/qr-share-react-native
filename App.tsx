import { useState, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { MainQrContainer } from "./components/mainQrContainer";
import { QRsContainer } from "./components/qrsContainer";
import { FAB, Dialog, Portal, Snackbar, Modal } from "react-native-paper";
import { Account } from "./@types/account";
import { readData, saveData } from "./utils/filemanager";
import { PaperProvider } from "react-native-paper";
import { AccountForm } from "./components/accountForm";
import { BarCodeScanner } from "expo-barcode-scanner";

export default function App() {
	const [accounts, setAccounts] = useState<Account[]>([]);
	const [activeAccount, setActiveAccount] = useState<Account | null>(null);

	// Modal for adding new account
	const [isAddAccountModalVisible, setIsAddAccountModalVisible] =
		useState<boolean>(false);
	const showAddAccountModal = () => setIsAddAccountModalVisible(true);
	const hideAddAccountModal = () => setIsAddAccountModalVisible(false);

	// FABGroup for adding new account
	const [isAddFABGroupVisible, setIsAddFABGroupVisible] =
		useState<boolean>(false);
	const onAddFABGroupStateChange = ({ open }: { open: boolean }) =>
		setIsAddFABGroupVisible(open);

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
		if (type !== "org.iso.QRCode") {
			showSnackbar("Invalid QR Code");
			return;
		}
		let qrData:
			| {
					accountNumber: string;
					accountName: string;
					bankCode: string;
			  }
			| {
					name: string;
					eSewa_id: string;
			  };
		try {
			qrData = JSON.parse(data);
		} catch (error) {
			showSnackbar("Invalid QR Code");
			return;
		}

		let newAccount: Account;

		if (qrData.bankCode) {
			newAccount = {
				id:
					qrData.accountName.toLowerCase().replace(" ", "") +
					qrData.accountNumber,
				name: `${qrData.accountName}'s ${qrData.bankCode}`,
				accountNumber: qrData.accountNumber,
				accountName: qrData.accountName,
				bankType: qrData.bankCode,
			};
		} else if (qrData.eSewa_id) {
			newAccount = {
				id:
					qrData.name.toLowerCase().replace(" ", "") +
					qrData.eSewa_id,
				name: `${qrData.name}'s eSewa`,
				accountNumber: qrData.eSewa_id,
				accountName: qrData.name,
				bankType: "eSewa",
			};
		}

		alert(`Bar code with type ${type} and data ${data} has been scanned!`);
	};

	const submitAddAccountForm = (
		name: string,
		accountNumber: string,
		accountName: string,
		bankType: string
	): boolean => {
		let id = name.toLowerCase().replace(" ", "") + accountNumber;
		if (accounts.filter((account) => account.id === id).length > 0) {
			showSnackbar("Account already exists");
			return false;
		} else {
			const newAccount: Account = {
				id,
				name,
				accountNumber,
				accountName,
				bankType,
			};
			setAccounts([...accounts, newAccount]);
			hideAddAccountModal();
			return true;
		}
	};

	const initializeAndSaveAccounts = () => {
		const initialAccountsData = [
			{
				id: "es1",
				name: "eSewa",
				accountNumber: "9862957119",
				accountName: "Utsav Gurmachhan Magar",
				bankType: "eSewa",
			},
			{
				id: "es2",
				name: "Siddhartha Bank",
				accountNumber: "55502521937",
				accountName: "Utsav Gurmachhan Magar",
				bankType: "SIDDNPKA",
			},
		];
		setAccounts(initialAccountsData);
	};

	useEffect(() => {
		readData().then((savedAccounts) => {
			setAccounts(savedAccounts);
			if (savedAccounts.length === 0) {
				console.log(
					"No accounts found. Initializing with default accounts"
				);
				initializeAndSaveAccounts();
			}
		});
	}, []);

	useEffect(() => {
		if (accounts.length > 0) {
			saveData(accounts).then(() => {
				console.log("Data saved into the file");
				console.log(accounts);
			});
		}
	}, [accounts]);

	return (
		<PaperProvider>
			<View style={styles.container}>
				{accounts.length > 0 ? (
					<>
						<MainQrContainer account={activeAccount} />
						<QRsContainer
							activeAccount={activeAccount}
							setActiveAccount={setActiveAccount}
							accounts={accounts}
						/>
					</>
				) : (
					<Text>No Accounts Found</Text>
				)}
				<Portal>
					<Dialog
						visible={isAddAccountModalVisible}
						onDismiss={hideAddAccountModal}
						style={styles.showAddAccountContainerStyle}
					>
						<AccountForm
							hideForm={hideAddAccountModal}
							submitForm={submitAddAccountForm}
						/>
					</Dialog>
				</Portal>
				<FAB.Group
					open={isAddFABGroupVisible}
					visible
					onStateChange={onAddFABGroupStateChange}
					icon={isAddFABGroupVisible ? "close" : "plus"}
					actions={[
						{
							icon: "plus",
							label: "Add new account",
							onPress: () => showAddAccountModal(),
						},
						{
							icon: "camera",
							label: "Scan new account",
							onPress: () => setDisplayScanner(true),
						},
					]}
				/>
				{displayScanner && (
					<BarCodeScanner
						onBarCodeScanned={handleBarCodeScanned}
						style={StyleSheet.absoluteFillObject}
					/>
				)}
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
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#fff",
		alignItems: "center",
		justifyContent: "center",
	},
	showAddAccountContainerStyle: {
		backgroundColor: "white",
		borderRadius: 18,
		padding: 20,
		margin: 16,
	},
});
