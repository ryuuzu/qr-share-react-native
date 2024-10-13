import { StyleSheet, Text, View } from "react-native";
import { Image } from "expo-image";
import { getBankLogo, getFormattedQrString } from "../utils/formats";
import QRCode from "react-native-qrcode-svg";
import { Account } from "../@types/account";
import React from "react";

type MainQrContainerProps = {
	account: Account | null;
};

export const MainQrContainer = ({ account }: MainQrContainerProps) => {
	return (
		<View style={styles.mainQrContainer}>
			{account ? (
				<>
					<Image
						source={`https://raw.githubusercontent.com/ryuuzu/bank-logos/refs/heads/main/${account.bankType}.png`}
						placeholder={require("../assets/main-logo.png")}
						style={styles.bankLogo}
						placeholderContentFit="contain"
						allowDownscaling
						contentFit="contain"
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
