import { StyleSheet, Text, View, Image } from "react-native";
import { Account } from "../@types/Account";
import { GridList, Card } from "react-native-ui-lib";
import { Spacings } from "react-native-ui-lib/src/style";
import { getBankLogo } from "../utils/formats";
import { EventPressCoords } from "../@types/EventPress";

type QRsContainerProps = {
	accounts: Account[];
	activeAccount: Account | null;
	setActiveAccount: (account: Account | null) => void;
	setSelectedAccount: (account: Account | null) => void;
	showQrMenu: () => void;
	setQrMenuLocation: (location: EventPressCoords) => void;
};

type QRDisplayContainerProps = {
	account: Account;
	activeAccount: Account | null;
	setActiveAccount: (account: Account | null) => void;
	setSelectedAccount: (account: Account | null) => void;
	showQrMenu: () => void;
	setQrMenuLocation: (location: EventPressCoords) => void;
};

const QRDisplayContainer = ({
	account,
	activeAccount,
	setActiveAccount,
	setSelectedAccount,
	showQrMenu,
	setQrMenuLocation,
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
			onLongPress={(e: any) => {
				console.log(e.event.nativeEvent);
				setQrMenuLocation({
					x: e.event.nativeEvent.pageX,
					y: e.event.nativeEvent.pageY,
				});
				setSelectedAccount(account);
				showQrMenu();
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
	setSelectedAccount,
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
						activeAccount={activeAccount}
						setActiveAccount={setActiveAccount}
						account={item}
						setSelectedAccount={setSelectedAccount}
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
