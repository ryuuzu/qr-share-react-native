import { StyleSheet, Text, View, Image } from "react-native";
import { Account } from "../@types/account";
import { GridList, Card } from "react-native-ui-lib";
import { Spacings } from "react-native-ui-lib/src/style";
import { getBankLogo } from "../utils/formats";

type QRsContainerProps = {
	accounts: Account[];
	activeAccount: Account | null;
	setActiveAccount: (account: Account | null) => void;
};

type QRDisplayContainerProps = {
	account: Account;
	activeAccount: Account | null;
	setActiveAccount: (account: Account | null) => void;
};

const QRDisplayContainer = ({
	account,
	activeAccount,
	setActiveAccount,
}: QRDisplayContainerProps) => {
	return (
		<Card
			flex
			center
			enableShadow
			height={150}
			selected={!!activeAccount && account.id === activeAccount.id}
			borderRadius={18}
			containerStyle={styles.qrContainer}
			onPress={() => {
				activeAccount && account.id === activeAccount.id
					? setActiveAccount(null)
					: setActiveAccount(account);
			}}
		>
			<Image source={getBankLogo(account)} style={styles.bankLogos} />
			<Text>{account.name}</Text>
		</Card>
	);
};

export const QRsContainer = ({
	activeAccount,
	accounts,
	setActiveAccount,
}: QRsContainerProps) => {
	return (
		<View style={styles.qrsContainer}>
			<GridList
				data={accounts}
				numColumns={2}
				style={styles.qrGridList}
				itemSpacing={Spacings.s2}
				listPadding={Spacings.s3}
				renderItem={({ item }) => (
					<QRDisplayContainer
						activeAccount={activeAccount}
						setActiveAccount={setActiveAccount}
						account={item}
					/>
				)}
			/>
		</View>
	);
};

const styles = StyleSheet.create({
	qrsContainer: {
		height: "30%",
		backgroundColor: "lightgray",
	},
	qrGridList: {
		paddingVertical: 10,
	},
	qrContainer: { backgroundColor: "#fff" },
	bankLogos: {
		width: 150,
		height: 80,
		objectFit: "contain",
	},
	qrName: {
		fontSize: 20,
		fontWeight: "600",
	},
});
