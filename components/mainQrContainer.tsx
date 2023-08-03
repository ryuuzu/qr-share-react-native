import { StyleSheet, Text, View, Image } from "react-native";
import { getBankLogo, getFormattedQrString } from "../utils/formats";
import QRCode from "react-native-qrcode-svg";

type MainQrContainerProps = {
	account: {
		accountNumber: string;
		name: string;
		bankType: string;
	};
};

export const MainQrContainer = ({ account }: MainQrContainerProps) => {
	return (
		<View style={styles.mainQrContainer}>
			<Image source={getBankLogo(account)} style={styles.bankLogo} />
			<QRCode value={getFormattedQrString(account)} size={270} />
		</View>
	);
};

const styles = StyleSheet.create({
	mainQrContainer: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
	},
	bankLogo: {
		width: 270,
		height: 100,
	},
});
