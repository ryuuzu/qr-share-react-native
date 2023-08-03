import { useState } from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { MainQrContainer } from "./components/mainQrContainer";

export default function App() {
	const [accounts, setAccounts] = useState([
		{
			accountNumber: "9862957119",
			name: "Utsav Gurmachhan Magar",
			bankType: "eSewa",
		},
	]);

	return (
		<View style={styles.container}>
			{accounts.length > 0 ? (
				<>
					<MainQrContainer account={accounts[0]} />
					<View style={styles.qrsContainer}></View>
				</>
			) : (
				<Text>No Accounts Found</Text>
			)}
			<StatusBar style="auto" />
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#fff",
		alignItems: "center",
		justifyContent: "center",
	},
	mainQrContainer: {},
	qrsContainer: {},
});
