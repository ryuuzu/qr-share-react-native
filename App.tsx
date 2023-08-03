import { useState, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { MainQrContainer } from "./components/mainQrContainer";
import { QRsContainer } from "./components/qrsContainer";
import { FAB, Modal, Portal } from "react-native-paper";
import { Account } from "./@types/account";
import { readData, saveData } from "./utils/filemanager";
import { PaperProvider } from "react-native-paper";

export default function App() {
	const [accounts, setAccounts] = useState<Account[]>([]);
	const [activeAccount, setActiveAccount] = useState<Account | null>(null);
	const [isAddAccountModalVisible, setIsAddAccountModalVisible] =
		useState<boolean>(false);
	const [isAddFABGroupVisible, setIsAddFABGroupVisible] =
		useState<boolean>(false);

	const showAddAccountModal = () => setIsAddAccountModalVisible(true);
	const hideAddAccountModal = () => setIsAddAccountModalVisible(false);

	const onAddFABGroupStateChange = ({ open }) =>
		setIsAddFABGroupVisible(open);

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
		saveData(initialAccountsData).then(() => {
			console.log("Data saved into the file");
		});
	};

	useEffect(() => {
		readData().then((savedAccounts) => {
			setAccounts(savedAccounts);
			if (savedAccounts.length === 0) {
				initializeAndSaveAccounts();
			}
		});
	}, []);

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
					<Modal
						visible={isAddAccountModalVisible}
						onDismiss={hideAddAccountModal}
						contentContainerStyle={
							styles.showAddAccountContainerStyle
						}
					>
						<Text>
							Example Modal. Click outside this area to dismiss.
						</Text>
					</Modal>
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
							onPress: () => console.log("Pressed scan"),
						},
					]}
				/>
				{/* <FAB
					icon="plus"
					style={styles.fab}
					onPress={() => showAddAccountModal()}
				/> */}
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
	fab: {
		position: "absolute",
		borderRadius: 28,
		margin: 16,
		right: 20,
		bottom: 30,
	},
	showAddAccountContainerStyle: {
		backgroundColor: "white",
		borderRadius: 18,
		padding: 20,
		margin: 16,
	},
});
