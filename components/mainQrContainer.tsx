import { StyleSheet, Text, View, Image } from "react-native";
import { getBankLogo, getFormattedQrString } from "../utils/formats";
import QRCode from "react-native-qrcode-svg";
import { Account } from "../@types/account";

type MainQrContainerProps = {
	account: Account | null;
};

export const MainQrContainer = ({ account }: MainQrContainerProps) => {
	return (
		<View style={styles.mainQrContainer}>
			{account ? (
				<>
					<Image
						source={getBankLogo(account)}
						style={styles.bankLogo}
					/>
					<QRCode value={getFormattedQrString(account)} size={270} />
					<Text style={styles.qrDescription}>{account.name}</Text>
				</>
			) : (
				<Text>No account selected</Text>
			)}
		</View>
	);
};

const styles = StyleSheet.create({
	mainQrContainer: {
		flex: 1,
		width: "100%",
		alignItems: "center",
		// backgroundColor: "#c3c5c6",
		justifyContent: "center",
		rowGap: 5,
	},
	bankLogo: {
		width: 270,
		height: 100,
		objectFit: "contain",
	},
	qrDescription: {
		fontSize: 20,
		fontWeight: "600",
	},
});
