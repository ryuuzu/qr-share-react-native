import { StyleSheet, Text, View } from "react-native";
import { Image } from "expo-image";
import { Account } from "../@types/account";
import { GridList, Card } from "react-native-ui-lib";
import { Spacings } from "react-native-ui-lib/src/style";
import { EventPressCoords } from "../@types/EventPress";
import { useGlobalStore } from "./store";

type QRsContainerProps = {
	accounts: Account[];
	showQrMenu: () => void;
	setQrMenuLocation: (location: EventPressCoords) => void;
};

type QRDisplayContainerProps = {
	account: Account;
	showQrMenu: () => void;
	setQrMenuLocation: (location: EventPressCoords) => void;
};

const QRDisplayContainer = ({
	account,
	showQrMenu,
	setQrMenuLocation,
}: QRDisplayContainerProps) => {
	const { activeAccount, setActiveAccount, setSelectedAccount } =
		useGlobalStore();

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
			onLongPress={(e: any) => {
				console.log(`Settings ${account.id} as active account`);
				setSelectedAccount(account);
				setQrMenuLocation({
					x: e.event.nativeEvent.pageX,
					y: e.event.nativeEvent.pageY,
				});
				showQrMenu();
			}}
		>
			<Image
				source={`https://raw.githubusercontent.com/ryuuzu/bank-logos/refs/heads/main/${account.bankType}.png`}
				placeholder={require("../assets/main-logo.png")}
				style={styles.bankLogos}
				placeholderContentFit="contain"
				allowDownscaling
				contentFit="contain"
			/>
			<Text>{account.name}</Text>
		</Card>
	);
};

export const QRsContainer = ({
	accounts,
	showQrMenu,
	setQrMenuLocation,
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
						account={item}
						showQrMenu={showQrMenu}
						setQrMenuLocation={setQrMenuLocation}
					/>
				)}
			/>
		</View>
	);
};

const styles = StyleSheet.create({
	qrsContainer: {
		height: "30%",
		width: "100%",
		backgroundColor: "lightgray",
	},
	qrGridList: {
		paddingVertical: 10,
	},
	qrContainer: { backgroundColor: "#fff" },
	bankLogos: {
		width: 150,
		height: 80,
	},
	qrName: {
		fontSize: 20,
		fontWeight: "600",
	},
});
